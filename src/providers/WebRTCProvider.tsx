import {
  createContext,
  FC,
  MutableRefObject,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { firestore } from "../lib/firebase";

interface ContextProps {
  pc: RTCPeerConnection;
  localStream: MutableRefObject<MediaStream>;
  remoteStreams: MutableRefObject<Array<MediaStream>>;
  connected: boolean;
  initStreams: Function;
  makeOffer: Function;
  makeAnswer: Function;
  hangUp: Function;
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
  const pc = new RTCPeerConnection(servers);

  const [connected, setConnected] = useState(false);
  const localStream: MutableRefObject<MediaStream> = useRef(new MediaStream());
  const remoteStreams: MutableRefObject<Array<MediaStream>> = useRef([]);

  useEffect(() => {
    console.log("changed");
  }, [remoteStreams.current]);

  async function initStreams() {
    localStream.current = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false,
    });
    remoteStreams.current[0] = new MediaStream();
    // console.log("second stream: ", remoteStreams.current[1]); // is undefined

    localStream.current.getTracks().forEach((track: MediaStreamTrack) => {
      pc.addTrack(track, localStream.current);
    });

    pc.ontrack = (event) => {
      // event.streams.forEach((stream) => {
      //   stream.getTracks().forEach((track, i) => {
      //     if (!remoteStreams.current[i])
      //       remoteStreams.current[i] = new MediaStream();

      //     remoteStreams.current[i].addTrack(track);
      //   });
      // });

      // --------
      console.log("count of remote streams:", event.streams.length);

      event.streams[0].getTracks().forEach((track) => {
        remoteStreams.current[0].addTrack(track);
      });

      // --------

      // const { streams } = event;
      // console.log("ccount", streams.length);

      // remoteStreams.length = streams.length;

      // for (let i = 0; i <= remoteStreams.length; i++) {
      //   remoteStreams[i] = new MediaStream();
      //   streams[i].getTracks().forEach((track) => {
      //     remoteStreams[i].addTrack(track);
      //   });
      // }
    };
  }

  async function makeOffer(callId: string) {
    const callDoc = firestore.collection("calls").doc(callId);
    const offerCandidates = callDoc.collection("offerCandidates");
    const answerCandidates = callDoc.collection("answerCandidates");

    pc.onicecandidate = (event) => {
      event.candidate && offerCandidates.add(event.candidate.toJSON());
    };

    const offerDescription = await pc.createOffer();
    await pc.setLocalDescription(offerDescription);

    const offer = {
      sdp: offerDescription.sdp,
      type: offerDescription.type,
    };

    await callDoc.set({ offer });

    callDoc.onSnapshot((snapshot) => {
      const data = snapshot.data();
      if (!pc.currentRemoteDescription && data?.answer) {
        const answerDescription = new RTCSessionDescription(data.answer);
        pc.setRemoteDescription(answerDescription);
      }
    });

    answerCandidates.onSnapshot((snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const candidate = new RTCIceCandidate(change.doc.data());
          pc.addIceCandidate(candidate);
        }
      });
    });

    setConnected(true);
  }

  async function makeAnswer(callId: string) {
    const callDoc = firestore.collection("calls").doc(callId);
    const offerCandidates = callDoc.collection("offerCandidates");
    const answerCandidates = callDoc.collection("answerCandidates");

    pc.onicecandidate = (event) => {
      event.candidate && answerCandidates.add(event.candidate.toJSON());
    };

    const callData = (await callDoc.get()).data();

    const offerDescription = callData?.offer;
    await pc.setRemoteDescription(new RTCSessionDescription(offerDescription));

    const answerDescription = await pc.createAnswer();
    await pc.setLocalDescription(answerDescription);

    const answer = {
      sdp: answerDescription.sdp,
      type: answerDescription.type,
    };

    await callDoc.update({ answer });

    offerCandidates.onSnapshot((snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const candidate = new RTCIceCandidate(change.doc.data());
          pc.addIceCandidate(candidate);
        }
      });
    });

    setConnected(true);
  }

  function hangUp() {
    localStream.current.getTracks().forEach((track) => track.stop());
    remoteStreams.current[0].getTracks().forEach((track) => track.stop());
    pc.close();

    setConnected(false);
  }

  const value = {
    pc,
    localStream,
    remoteStreams,
    connected,
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
