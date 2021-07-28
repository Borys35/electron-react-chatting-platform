import firebase from "firebase";
import {
  createContext,
  FC,
  MutableRefObject,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { firestore } from "../lib/firebase";
import { useAuth } from "./AuthProvider";

interface ContextProps {
  pc: MutableRefObject<RTCPeerConnection>;
  localStream: MutableRefObject<MediaStream>;
  remoteStream: MutableRefObject<MediaStream>;
  callId: string;
  initStreams: Function;
  makeOffer: Function;
  makeAnswer: Function;
  hangUp: Function;
}

interface CallDataProps {
  offer: Object | undefined;
  answer: Object | undefined;
  participants: Array<string>;
}

const WebRTCContext = createContext({} as ContextProps);

export const useWebRTC = () => useContext(WebRTCContext);

const WebRTCProvider: FC = ({ children }) => {
  const servers = {
    iceServers: [
      {
        urls: [
          "stun:stun1.l.google.com:19302",
          "stun:stun2.l.google.com:19302",
        ],
      },
    ],
    iceCandidatePoolSize: 10,
  };
  const pc = useRef(new RTCPeerConnection(servers));

  const [callId, setCallId] = useState("");
  const localStream: MutableRefObject<MediaStream> = useRef(new MediaStream());
  const remoteStream: MutableRefObject<MediaStream> = useRef(new MediaStream());
  const { user } = useAuth();

  function createVideo(stream: MediaStream, isLocal: boolean) {
    const video = document.createElement("video");
    video.srcObject = stream;
    video.muted = isLocal;
    video.classList.add("chat-video");
    video.onloadedmetadata = () => {
      video.play();
    };
    document.body.appendChild(video);
  }

  async function initStreams() {
    // pc.current = new RTCPeerConnection(servers);

    localStream.current = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    // remoteStream.current = new MediaStream();

    localStream.current.getTracks().forEach((track: MediaStreamTrack) => {
      pc.current.addTrack(track, localStream.current);
    });

    pc.current.ontrack = (event) => {
      event.streams[0].getTracks().forEach((track) => {
        remoteStream.current.addTrack(track);
      });
    };

    // createVideo(localStream.current, true);
    // createVideo(remoteStream.current, false);
  }

  async function makeOffer(cid: string) {
    const callDoc = firestore.collection("calls").doc(cid);
    const offerCandidates = callDoc.collection("offerCandidates");
    const answerCandidates = callDoc.collection("answerCandidates");

    pc.current.onicecandidate = (event) => {
      event.candidate && offerCandidates.add(event.candidate.toJSON());
    };

    const offerDescription = await pc.current.createOffer();
    await pc.current.setLocalDescription(offerDescription);

    const offer = {
      sdp: offerDescription.sdp,
      type: offerDescription.type,
    };

    await callDoc.set({
      offer,
      participants: [user.auth.uid],
    });

    callDoc.onSnapshot((snapshot) => {
      const data = snapshot.data();
      if (!pc.current.currentRemoteDescription && data?.answer) {
        const answerDescription = new RTCSessionDescription(data.answer);
        pc.current.setRemoteDescription(answerDescription);
      }
    });

    answerCandidates.onSnapshot((snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const candidate = new RTCIceCandidate(change.doc.data());
          pc.current.addIceCandidate(candidate);
        }
      });
    });

    setCallId(cid);
  }

  async function makeAnswer(cid: string) {
    const callDoc = firestore.collection("calls").doc(cid);
    const offerCandidates = callDoc.collection("offerCandidates");
    const answerCandidates = callDoc.collection("answerCandidates");

    pc.current.onicecandidate = (event) => {
      event.candidate && answerCandidates.add(event.candidate.toJSON());
    };

    const callData = (await callDoc.get()).data();

    const offerDescription = callData?.offer;
    await pc.current.setRemoteDescription(
      new RTCSessionDescription(offerDescription)
    );

    const answerDescription = await pc.current.createAnswer();
    await pc.current.setLocalDescription(answerDescription);

    const answer = {
      sdp: answerDescription.sdp,
      type: answerDescription.type,
    };

    await callDoc.update({
      answer,
      participants: firebase.firestore.FieldValue.arrayUnion(user.auth.uid),
    });

    offerCandidates.onSnapshot((snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const candidate = new RTCIceCandidate(change.doc.data());
          pc.current.addIceCandidate(candidate);
        }
      });
    });

    setCallId(cid);
  }

  const hangUp = async () => {
    if (!callId) return;

    localStream.current.getTracks().forEach((track) => track.stop());
    remoteStream.current.getTracks().forEach((track) => track.stop());

    const callDoc = firestore.collection("calls").doc(callId);
    const callData = (await callDoc.get()).data() as CallDataProps;

    const participant = callData.participants.find((p) => p === user.auth.uid);
    console.log(participant);

    if (participant) {
      // callDoc.onSnapshot(async (snapshot) => {
      //   const data = snapshot.data();
      //   if (data?.participants.length <= 0) {
      //     const offerCandidates = await snapshot.ref
      //       .collection("offerCandidates")
      //       .get();
      //     for (const doc of offerCandidates.docs) {
      //       await doc.ref.delete();
      //     }

      //     const answerCandidates = await snapshot.ref
      //       .collection("answerCandidates")
      //       .get();
      //     for (const doc of answerCandidates.docs) {
      //       await doc.ref.delete();
      //     }

      //     await snapshot.ref.delete();
      //   }
      // });

      await callDoc.update({
        participants: firebase.firestore.FieldValue.arrayRemove(participant),
      });

      if (callData.participants.length <= 1) {
        const offerCandidates = await firestore
          .collection("calls")
          .doc(callId)
          .collection("offerCandidates")
          .get();
        for (const doc of offerCandidates.docs) {
          doc.ref.delete();
        }

        const answerCandidates = await firestore
          .collection("calls")
          .doc(callId)
          .collection("answerCandidates")
          .get();
        for (const doc of answerCandidates.docs) {
          doc.ref.delete();
        }

        await firestore.collection("calls").doc(callId).delete();
      }
    }

    pc.current.close();
    localStream.current = new MediaStream();
    remoteStream.current = new MediaStream();
    pc.current = new RTCPeerConnection(servers);
    console.log("restarting");

    setCallId("");
  };

  // ON UNLOAD, HANG UP
  // useEffect(() => {
  //   window.onbeforeunload = async (e: Event) => {
  //     await hangUp();
  //     e.preventDefault();
  //     e.returnValue = false;
  //   };

  //   // return () => {
  //   //   hangUp();
  //   // };
  // }, [hangUp]);

  // async function hangUp() {
  //   if (!callId) return;

  //   localStream.current.getTracks().forEach((track) => track.stop());
  //   remoteStream.current.getTracks().forEach((track) => track.stop());
  //   pc.current.close();

  //   const callDoc = firestore.collection("calls").doc(callId);
  //   const callData = (await callDoc.get()).data() as CallDataProps;

  //   const participant = callData.participants.find((p) => p === user.auth.uid);
  //   console.log(participant);

  //   if (participant) {
  //     await callDoc.update({
  //       participants: firebase.firestore.FieldValue.arrayRemove(participant),
  //     });
  //     const newCallData = (await callDoc.get()).data() as CallDataProps;
  //     if (!newCallData.participants.length) {
  //       await firestore.collection("calls").doc(callId).delete();
  //     }
  //   }

  //   // localStream.current = new MediaStream();
  //   // remoteStream.current = new MediaStream();
  //   pc.current = new RTCPeerConnection(servers);

  //   setCallId("");
  // }

  const value = {
    pc,
    localStream,
    remoteStream,
    callId,
    initStreams,
    makeOffer,
    makeAnswer,
    hangUp,
  };

  return (
    <WebRTCContext.Provider value={value}>{children}</WebRTCContext.Provider>
  );
};

export default WebRTCProvider;
