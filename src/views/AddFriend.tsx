import React from "react";
import styled from "styled-components";
import { FaCheckSquare, FaMinusSquare } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { useCollectionData } from "react-firebase-hooks/firestore";
import Input from "../components/Input";
import Button from "../components/Button";
import Form from "../components/Form";
import { firestore } from "../lib/firebase";
import ListWrapper from "../components/ListWrapper";
import ItemWithImage from "../components/ItemWithImage";
import { useAuth } from "../providers/AuthProvider";
import firebase from "firebase";
import ProfileTab from "../components/ProfileTab";
import SectionSelectTab from "../components/SectionSelectTab";
import FriendsList from "../components/FriendsList";
import { colors } from "../styles/theme";
import PageContainer from "../components/PageContainer";

const Container = styled(PageContainer)`
  display: grid;
  grid-template-columns: max(240px, 20vw) 1fr;

  > div {
    padding: 2rem;
  }
`;

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto 1fr;
`;

export default function AddFriend() {
  const history = useHistory();
  const { register, handleSubmit } = useForm();
  const { user } = useAuth();
  const { friends } = user.database;

  const pendingQuery = firestore
    .collection("friendRequests")
    .where("fromId", "==", user.auth.uid);
  const [pendingValues] = useCollectionData(pendingQuery, { idField: "id" });

  const incomingQuery = firestore
    .collection("friendRequests")
    .where("toId", "==", user.auth.uid);
  const [incomingValues] = useCollectionData(incomingQuery, { idField: "id" });

  async function handleSendRequest({ username }: any) {
    const querySnapshot = await firestore
      .collection("users")
      .where("username", "==", username)
      .get();
    const foundUser = querySnapshot.docs[0];

    if (!foundUser) return;

    firestore.collection("friendRequests").add({
      fromId: user.auth.uid,
      fromUser: {
        username: user.database.username,
        photoURL: user.database.photoURL,
      },
      toId: foundUser.id,
      toUser: {
        username: foundUser.data().username,
        photoURL: foundUser.data().photoURL,
      },
    });
  }

  function rejectRequest(id: string) {
    firestore.collection("friendRequests").doc(id).delete();
  }

  function acceptRequest(
    id: string,
    fromId: string,
    fromUser: any,
    toId: string,
    toUser: any
  ) {
    firestore.collection("friendRequests").doc(id).delete();
    firestore
      .collection("users")
      .doc(fromId)
      .update({
        friends: firebase.firestore.FieldValue.arrayUnion({
          uid: toId,
          ...toUser,
        }),
      });
    firestore
      .collection("users")
      .doc(toId)
      .update({
        friends: firebase.firestore.FieldValue.arrayUnion({
          uid: fromId,
          ...fromUser,
        }),
      });
    firestore.collection("conversations").add({
      type: "friends",
      accessIds: [fromId, toId],
      messages: [],
    });
  }

  return (
    <Container>
      <div style={{ borderRight: `1px solid ${colors.background200}` }}>
        <ProfileTab />
        <SectionSelectTab />
        <FriendsList
          values={friends}
          onChange={(uid: string) => history.push(`/friends?id=${uid}`)}
        />
      </div>
      <Wrapper>
        <Form
          onSubmit={handleSubmit(handleSendRequest)}
          style={{ gridColumn: "1 / 3" }}
        >
          <Input
            placeholder="Enter a username"
            {...register("username", { required: true })}
          />
          <Button>Send request</Button>
        </Form>
        <ListWrapper>
          <h5>Pending</h5>
          {pendingValues?.length
            ? pendingValues.map(({ id, toUser }: any) => (
                <ItemWithImage
                  key={id}
                  imageSrc={toUser.photoURL}
                  text={toUser.username}
                  buttons={[
                    {
                      icon: FaMinusSquare,
                      onClick: () => {
                        rejectRequest(id);
                      },
                    },
                  ]}
                />
              ))
            : "No pending requests"}
        </ListWrapper>
        <ListWrapper>
          <h5>Incoming</h5>
          {incomingValues?.length
            ? incomingValues.map(
                ({ id, fromId, fromUser, toId, toUser }: any) => (
                  <ItemWithImage
                    key={id}
                    imageSrc={fromUser.photoURL}
                    text={fromUser.username}
                    buttons={[
                      {
                        icon: FaCheckSquare,
                        onClick: () => {
                          acceptRequest(id, fromId, fromUser, toId, toUser);
                        },
                      },
                      {
                        icon: FaMinusSquare,
                        onClick: () => {
                          rejectRequest(id);
                        },
                      },
                    ]}
                  />
                )
              )
            : "No incoming requests"}
        </ListWrapper>
      </Wrapper>
    </Container>
  );
}
