import React, {
  FC,
  RefObject,
  MutableRefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import { useCollectionData, useDocument } from "react-firebase-hooks/firestore";
import { FaPhone, FaPhoneVolume, FaPhoneSlash } from "react-icons/fa";
import { useParams } from "react-router";
import styled from "styled-components";
import Button from "../components/Button";
import Conversation from "../components/Conversation";
import FriendsList from "../components/FriendsList";
import ListWrapper from "../components/ListWrapper";
import PageContainer from "../components/PageContainer";
import ProfileTab from "../components/ProfileTab";
import SectionSelectTab from "../components/SectionSelectTab";
import Tab from "../components/Tab";
import { firestore } from "../lib/firebase";
import { useAuth } from "../providers/AuthProvider";
import { useFriendsServers } from "../providers/FriendsServersProvider";
import { useWebRTC } from "../providers/WebRTCProvider";
import { colors, columnSize } from "../styles/theme";

const Container = styled(PageContainer)`
  display: grid;
  grid-template-columns: ${columnSize} 1fr;
  grid-template-rows: 100vh;

  > div {
    padding: 2rem;
  }
`;

const Wrapper = styled.div`
  flex: 1;
  display: flex;
`;

const Video = styled.video`
  width: 260px;
  height: 160px;
  object-fit: cover;
  border-radius: 4px;
`;

export default function Friends() {
  const { uid } = useParams<any>();
  const { user } = useAuth();
  const { friends } = user.database;
  const friend = friends.find((f: any) => f.uid === uid);
  const {
    callId,
    initStreams,
    makeOffer,
    makeAnswer,
    localStream,
    remoteStream,
    hangUp,
  } = useWebRTC();
  const localCam: MutableRefObject<HTMLVideoElement | null> = useRef(null);
  const remoteCam: MutableRefObject<HTMLVideoElement | null> = useRef(null);
  const callRef = firestore.collection("calls").doc(friend.callId);
  const [callDoc] = useDocument(callRef);

  async function handleCall(id: string) {
    if (callId) return;

    await initStreams();

    const callDocExists = (await firestore.collection("calls").doc(id).get())
      .exists;
    !callDocExists ? await makeOffer(id) : await makeAnswer(id);

    console.log(!callDocExists ? "making offer" : "making answer");
  }

  useEffect(() => {
    if (!callId || !localCam.current || !remoteCam.current) return;

    localCam.current.srcObject = localStream.current;
    remoteCam.current.srcObject = remoteStream.current;
  }, [callId, localStream, remoteStream]);

  return (
    <Container>
      <ListWrapper
        withSpacers
        style={{ borderRight: `1px solid ${colors.background200}` }}
      >
        <ProfileTab />
        <SectionSelectTab />
        <FriendsList values={friends} activeUid={uid} />
      </ListWrapper>
      <ListWrapper withSpacers>
        {friend && (
          <>
            <Tab
              avatarProps={{ imageSrc: friend.photoURL, size: "md" }}
              name={friend.username}
              icons={[
                {
                  iconComponent: callDoc?.exists ? FaPhoneVolume : FaPhone,
                  onClick: () => {
                    handleCall(friend.callId);
                  },
                  show: !Boolean(callId),
                },
                {
                  iconComponent: FaPhoneSlash,
                  onClick: () => {
                    hangUp();
                  },
                  show: Boolean(callId),
                },
              ]}
            />
            <Wrapper>
              <Conversation
                accessId={uid}
                type="friends"
                style={{ height: "100%" }}
              />
              {callId && (
                <ListWrapper>
                  <Video ref={localCam} autoPlay={true} muted={true}>
                    No cam
                  </Video>
                  <Video ref={remoteCam} autoPlay={true}>
                    No cam
                  </Video>
                </ListWrapper>
              )}
            </Wrapper>
          </>
        )}
      </ListWrapper>
    </Container>
  );
}
