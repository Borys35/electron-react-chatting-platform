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
import { useWebRTC } from "../providers/WebRTCProvider";

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
  const {
    localStream,
    remoteStreams,
    connected,
    initStreams,
    makeOffer,
    makeAnswer,
  } = useWebRTC();

  useEffect(() => {
    if (!servers.length) return;

    handleChangeServer(servers[0].id);
  }, [servers]);

  useEffect(() => {
    // remove video elements only when we disconnected.
    if (connected) return;
  }, [connected]);

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

  async function handleJoinVoiceRoom(id: string) {
    if (connected) return;

    await initStreams();
    // localStream is set
    // remoteStreams are empty but ready

    const callDocExists = (await firestore.collection("calls").doc(id).get())
      .exists;
    !callDocExists ? await makeOffer(id) : await makeAnswer(id);

    const video = document.createElement("video");
    video.autoplay = true;
    video.playsInline = true;
    video.srcObject = localStream.current;
    document.body.appendChild(video);
    video.play();
    // video.remove();

    const video1 = document.createElement("video");
    video1.srcObject = remoteStreams.current[0];
    video1.onloadedmetadata = () => {
      video1.play();
    };
    document.body.appendChild(video1);
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
              onVoiceRoomClick={handleJoinVoiceRoom}
            />
          </div>
        </>
      )}
    </Container>
  );
}
