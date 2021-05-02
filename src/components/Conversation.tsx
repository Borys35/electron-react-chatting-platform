import React, { FC, useEffect, useLayoutEffect, useRef } from "react";
import firebase from "firebase";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { firestore } from "../lib/firebase";
import { useAuth } from "../providers/AuthProvider";
import { useForm } from "react-hook-form";
import Button from "./Button";
import Input from "./Input";
import MessageItem from "./MessageItem";
import styled from "styled-components";

const Container = styled.div`
  overflow-x: hidden;
  overflow-y: auto;
`;

const MessageForm = styled.form`
  display: flex;

  input {
    flex: 1;
    margin-right: 1rem;
  }
`;

interface Props {
  accessId: string;
  type: string;
}

const Conversation: FC<Props> = ({ accessId, type }) => {
  const { register, handleSubmit } = useForm();
  const { user } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const query = firestore
    .collection("conversations")
    .where("type", "==", type)
    .where("accessIds", "array-contains", accessId);
  const [conversations] = useCollectionData(query, { idField: "id" });
  let conversation: any = null;
  if (conversations) {
    if (type === "friends") {
      conversation = conversations.find((c: any) =>
        c.accessIds.includes(user.auth.uid)
      );
    } else {
      conversation = conversations[0];
    }
  }

  function handleSendMessage({ message }: any) {
    if (inputRef.current) inputRef.current.value = "";

    firestore
      .collection("conversations")
      .doc(conversation.id)
      .update({
        messages: firebase.firestore.FieldValue.arrayUnion({
          text: message,
          author: {
            uid: user.auth.uid,
            username: user.auth.displayName,
            photoURL: user.auth.photoURL,
          },
          timestamp: firebase.firestore.Timestamp.now(),
        }),
      });

    scrollRef.current?.scrollIntoView();
  }

  return (
    <Container>
      <div>
        You are currently talking with {accessId}
        {conversation &&
          conversation.messages.map(
            ({ text, author, timestamp }: any, index: string) => (
              <MessageItem
                key={index}
                text={text}
                author={author}
                timestamp={timestamp}
              />
            )
          )}
      </div>
      <div>
        <MessageForm onSubmit={handleSubmit(handleSendMessage)}>
          <Input
            {...register("message")}
            placeholder="Type a message"
            ref={inputRef}
          />
          <Button>Send</Button>
        </MessageForm>
        <div ref={scrollRef}></div>
      </div>
    </Container>
  );
};

export default Conversation;
