import React, { useState } from "react";
import styled from "styled-components";
import { FaCheckSquare, FaMinusSquare } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { useCollectionData } from "react-firebase-hooks/firestore";
import Input from "../components/Input";
import Button from "../components/Button";
import InlineForm from "../components/InlineForm";
import { firestore } from "../lib/firebase";
import ListWrapper from "../components/ListWrapper";
import ItemWithImage from "../components/ItemWithImage";
import { useAuth } from "../providers/AuthProvider";
import firebase from "firebase";
import ProfileTab from "../components/ProfileTab";
import SectionSelectTab from "../components/SectionSelectTab";
import FriendsList from "../components/FriendsList";
import { colors, columnSize } from "../styles/theme";
import PageContainer from "../components/PageContainer";
import { useFriendsServers } from "../providers/FriendsServersProvider";
import ErrorMessage from "../components/ErrorMessage";

interface UserProps {
  uid: string;
  username: string;
  photoURL: string;
}

interface RequestProps {
  id: string;
  from: UserProps;
  to: UserProps;
}

const Container = styled(PageContainer)`
  display: grid;
  grid-template-columns: ${columnSize} 1fr;

  > div {
    padding: 2rem;
  }
`;

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto 1fr;
  gap: 2rem;
`;

export default function AddFriend() {
  const [error, setError] = useState("");
  const { register, handleSubmit } = useForm();
  const { user } = useAuth();
  const { friends } = user.database;
  const { changeCurrentFriend } = useFriendsServers();

  const pendingQuery = firestore
    .collection("friendRequests")
    .where("from.uid", "==", user.auth.uid);
  const [pendingValues] = useCollectionData<RequestProps>(pendingQuery, {
    idField: "id",
  });

  const incomingQuery = firestore
    .collection("friendRequests")
    .where("to.uid", "==", user.auth.uid);
  const [incomingValues] = useCollectionData<RequestProps>(incomingQuery, {
    idField: "id",
  });

  async function handleSendRequest({ username }: UserProps) {
    const querySnapshot = await firestore
      .collection("users")
      .where("username", "==", username)
      .get();
    const foundUser = querySnapshot.docs[0];

    if (!foundUser) return setError("User not found");
    else if (
      pendingValues?.find(({ to }) => to.uid === foundUser.id) ||
      incomingValues?.find(({ from }) => from.uid === foundUser.id)
    )
      return setError("Request already exists");
    else if (friends.find((f: UserProps) => f.uid === foundUser.id))
      return setError("You are already friends");
    else if (user.auth.uid === foundUser.id)
      return setError("You cannot invite yourself you dummy...");
    setError("");

    // SKIP IF WE ARE ALREADY FRIENDS

    firestore.collection("friendRequests").add({
      from: {
        uid: user.auth.uid,
        username: user.database.username,
        photoURL: user.database.photoURL,
      },
      to: {
        uid: foundUser.id,
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
    from: UserProps, // new friend
    to: UserProps // me
  ) {
    firestore.collection("friendRequests").doc(id).delete();
    firestore
      .collection("users")
      .doc(from.uid)
      .update({
        friends: firebase.firestore.FieldValue.arrayUnion({
          ...to,
        }),
      });
    firestore
      .collection("users")
      .doc(to.uid)
      .update({
        friends: firebase.firestore.FieldValue.arrayUnion({
          ...from,
        }),
      });
    firestore.collection("conversations").add({
      type: "friends",
      accessIds: [from.uid, to.uid],
      messages: [],
    });

    changeCurrentFriend(from.uid);
  }

  return (
    <Container>
      <ListWrapper
        withSpacers
        style={{ borderRight: `1px solid ${colors.background200}` }}
      >
        <ProfileTab />
        <SectionSelectTab />
        <FriendsList values={friends} />
      </ListWrapper>
      <Wrapper>
        <div style={{ gridColumn: "1 / 3" }}>
          <InlineForm onSubmit={handleSubmit(handleSendRequest)}>
            <Input
              placeholder="Enter a username"
              {...register("username")}
              autoComplete="off"
            />
            <Button>Send request</Button>
          </InlineForm>
          {error && (
            <ErrorMessage style={{ marginTop: "0.5rem" }}>{error}</ErrorMessage>
          )}
        </div>
        <ListWrapper>
          <h5>Pending</h5>
          {pendingValues?.length ? (
            pendingValues.map(
              ({ id, to: { uid, username, photoURL } }: RequestProps) => (
                <ItemWithImage
                  key={uid}
                  imageSrc={photoURL}
                  text={username}
                  subIcons={[
                    {
                      iconComponent: FaMinusSquare,
                      onClick: () => {
                        rejectRequest(id);
                      },
                    },
                  ]}
                />
              )
            )
          ) : (
            <p>No pending requests</p>
          )}
        </ListWrapper>
        <ListWrapper>
          <h5>Incoming</h5>
          {incomingValues?.length ? (
            incomingValues.map(
              ({
                id,
                from,
                from: { uid, username, photoURL },
                to,
              }: RequestProps) => (
                <ItemWithImage
                  key={uid}
                  imageSrc={photoURL}
                  text={username}
                  subIcons={[
                    {
                      iconComponent: FaCheckSquare,
                      onClick: () => {
                        acceptRequest(id, from, to);
                      },
                    },
                    {
                      iconComponent: FaMinusSquare,
                      onClick: () => {
                        rejectRequest(id);
                      },
                    },
                  ]}
                />
              )
            )
          ) : (
            <p>No incoming requests</p>
          )}
        </ListWrapper>
      </Wrapper>
    </Container>
  );
}
