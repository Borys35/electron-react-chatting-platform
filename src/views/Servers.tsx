import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Conversation from "../components/Conversation";
import ServersList from "../components/ServersList";
import ProfileTab from "../components/ProfileTab";
import SectionSelectTab from "../components/SectionSelectTab";
import { colors } from "../styles/theme";
import { useAuth } from "../providers/AuthProvider";
import RoomList from "../components/RoomList";
import { firestore } from "../lib/firebase";
import PageContainer from "../components/PageContainer";

const Container = styled(PageContainer)`
  display: grid;
  grid-template-columns: max(200px, 20vw) 1fr max(200px, 20vw);

  > div {
    padding: 2rem;
  }
`;

export default function Servers() {
  const [activeId, setActiveId] = useState("");
  const [currentServer, setCurrentServer] = useState<any>();
  const [roomId, setRoomId] = useState("");
  const { user } = useAuth();
  const { servers } = user.database;

  useEffect(() => {
    if (!servers.length) return;

    handleChangeServer(servers[0].id);
  }, [servers]);

  async function handleChangeServer(id: string) {
    const server = await firestore.collection("servers").doc(id).get();

    setActiveId(id);
    setCurrentServer(server.data());

    if (server.data()?.rooms.length) setRoomId(server.data()?.rooms[0].id);
    else setRoomId("");
  }

  function handleChangeRoom(id: string) {
    setRoomId(id);
  }

  return (
    <Container>
      <div style={{ borderRight: `1px solid ${colors.background200}` }}>
        <ProfileTab />
        <SectionSelectTab />
        <ServersList
          values={servers}
          onChange={handleChangeServer}
          activeId={activeId}
        />
      </div>
      {currentServer && (
        <>
          <Conversation accessId={roomId} type="textRoom" />
          <div style={{ borderLeft: `1px solid ${colors.background200}` }}>
            <p>SERVER'S ID: {activeId}</p>
            <RoomList
              serverId={activeId}
              roomId={roomId}
              server={currentServer}
              onTextRoomClick={handleChangeRoom}
              onVoiceRoomClick={() => console.log("voice room click")}
            />
          </div>
        </>
      )}
    </Container>
  );
}
