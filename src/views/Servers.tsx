import React, { useEffect, useState } from "react";
import { FaInfo } from "react-icons/fa";
import styled from "styled-components";
import Conversation from "../components/Conversation";
import ServersList from "../components/ServersList";
import ProfileTab from "../components/ProfileTab";
import SectionSelectTab from "../components/SectionSelectTab";
import { colors, columnSize } from "../styles/theme";
import { useAuth } from "../providers/AuthProvider";
import RoomList from "../components/RoomList";
import { firestore } from "../lib/firebase";
import PageContainer from "../components/PageContainer";
import { useWebRTC } from "../providers/WebRTCProvider";
import {
  useCollectionData,
  useDocumentData,
} from "react-firebase-hooks/firestore";
import { useParams } from "react-router";
import ListWrapper from "../components/ListWrapper";
import Tab from "../components/Tab";

const Container = styled(PageContainer)`
  display: grid;
  grid-template-columns: ${columnSize} 1fr ${columnSize};

  > div {
    padding: 2rem;
  }
`;

interface ServerProps {
  name: string;
  owner: string;
  photoURL: string;
  category: string;
  isPrivate: boolean;
  members: Array<any>;
}

interface RoomProps {
  id: string;
  name: string;
  type: string;
}

export default function Servers() {
  const { id } = useParams<any>();
  const [roomId, setRoomId] = useState("");
  const { user } = useAuth();
  const { servers } = user.database;
  const serverQuery = firestore.collection("servers").doc(id);
  const roomsQuery = serverQuery.collection("rooms");
  const [server, serverLoading] = useDocumentData<ServerProps>(serverQuery);
  const [rooms, roomsLoading] = useCollectionData<RoomProps>(roomsQuery, {
    idField: "id",
  });
  const {
    localStream,
    remoteStream,
    callId,
    initStreams,
    makeOffer,
    makeAnswer,
  } = useWebRTC();

  useEffect(() => {
    if (serverLoading || roomsLoading) return;
    if (!server || !rooms) return;
    if (!rooms.length) return setRoomId("");

    setRoomId(rooms[0].id);
  }, [server, serverLoading, rooms, roomsLoading]);

  function handleChangeRoom(id: string) {
    setRoomId(id);
  }

  async function handleJoinVoiceRoom(id: string) {
    if (!callId) return;

    await initStreams();

    const callDocExists = (await firestore.collection("calls").doc(id).get())
      .exists;
    !callDocExists ? await makeOffer(id) : await makeAnswer(id);
  }

  return (
    <Container>
      <ListWrapper
        withSpacers
        style={{
          borderRight: `1px solid ${colors.background200}`,
          height: "100vh",
        }}
      >
        <ProfileTab />
        <SectionSelectTab />
        <ServersList values={servers} activeId={id} />
      </ListWrapper>
      <ListWrapper withSpacers>
        {server && (
          <>
            <Tab
              avatarProps={{ imageSrc: server.photoURL, size: "md" }}
              name={server.name}
              icons={[{ iconComponent: FaInfo, onClick: () => {} }]}
            />
            <Conversation accessId={roomId} type="textRoom" />
          </>
        )}
      </ListWrapper>
      <div style={{ borderLeft: `1px solid ${colors.background200}` }}>
        <RoomList
          serverId={id}
          roomId={roomId}
          isOwner={user.auth.uid === server?.owner}
          values={rooms ? rooms : []}
          onTextRoomClick={handleChangeRoom}
          onVoiceRoomClick={handleJoinVoiceRoom}
        />
      </div>
    </Container>
  );
}
