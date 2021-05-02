import React, { useEffect, useState } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import styled from "styled-components";
import Button from "../components/Button";
import Conversation from "../components/Conversation";
import FriendsList from "../components/FriendsList";
import PageContainer from "../components/PageContainer";
import ProfileTab from "../components/ProfileTab";
import SectionSelectTab from "../components/SectionSelectTab";
import { auth, firestore } from "../lib/firebase";
import { useAuth } from "../providers/AuthProvider";
import { colors } from "../styles/theme";

const Container = styled(PageContainer)`
  display: grid;
  grid-template-columns: max(240px, 20vw) 1fr;
  grid-template-rows: 100vh;

  > div {
    padding: 2rem;
  }
`;

export default function Friends() {
  const [activeUid, setActiveUid] = useState("");
  const { user } = useAuth();
  const { friends } = user.database;

  useEffect(() => {
    if (!friends.length) return;

    handleChangeFriend(friends[0].uid);
  }, [friends]);

  function handleChangeFriend(uid: string) {
    setActiveUid(uid);
  }

  return (
    <Container>
      <div style={{ borderRight: `1px solid ${colors.background200}` }}>
        <ProfileTab />
        <SectionSelectTab />
        <FriendsList
          values={friends}
          onChange={handleChangeFriend}
          activeUid={activeUid}
        />
        <Button onClick={() => auth.signOut()}>Sign out</Button>
      </div>
      <Conversation accessId={activeUid} type="friends" />
    </Container>
  );
}
