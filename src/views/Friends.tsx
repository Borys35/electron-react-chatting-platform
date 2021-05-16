import React, { FC, useEffect, useState } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { useParams } from "react-router";
import styled from "styled-components";
import Button from "../components/Button";
import Conversation from "../components/Conversation";
import FriendsList from "../components/FriendsList";
import ListWrapper from "../components/ListWrapper";
import PageContainer from "../components/PageContainer";
import ProfileTab from "../components/ProfileTab";
import SectionSelectTab from "../components/SectionSelectTab";
import { useAuth } from "../providers/AuthProvider";
import { useFriendsServers } from "../providers/FriendsServersProvider";
import { colors, columnSize } from "../styles/theme";

const Container = styled(PageContainer)`
  display: grid;
  grid-template-columns: ${columnSize} 1fr;
  grid-template-rows: 100vh;

  > div {
    padding: 2rem;
  }
`;

export default function Friends() {
  const { uid } = useParams<any>();
  // const [activeUid, setActiveUid] = useState("");
  const { user } = useAuth();
  const { friends } = user.database;

  // useEffect(() => {
  //   if (!friends.length) return;

  //   handleChangeFriend(friends[0].uid);
  // }, [friends]);

  // function handleChangeFriend(uid: string) {
  //   setActiveUid(uid);
  // }

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
      <Conversation accessId={uid} type="friends" />
    </Container>
  );
}
