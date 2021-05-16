import React, { FC, useEffect, useLayoutEffect, useRef } from "react";
import firebase from "firebase";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { firestore } from "../lib/firebase";
import { useAuth } from "../providers/AuthProvider";
import { useForm } from "react-hook-form";
import Button from "./Button";
import Input from "./Input";
import MessageItem from "./MessageItem";
import InlineForm from "./InlineForm";
import styled from "styled-components";
import ListWrapper from "./ListWrapper";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const MessagesList = styled(ListWrapper)`
  overflow-x: hidden;
  overflow-y: auto;
  flex: 1;
`;

interface Props {
  accessId: string;
  type: string;
}

const Conversation: FC<Props> = ({ accessId, type }) => {
  const { register, handleSubmit, watch } = useForm();
  const watchMessage = watch("message");
  const { user } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const query = firestore
    .collection("conversations")
    .where("type", "==", type)
    .where("accessIds", "array-contains", accessId);
  const [conversations, loading] = useCollectionData(query, { idField: "id" });
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

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation]);

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
  }

  // if (!conversation) return <div>No conversation found</div>;

  return (
    <Container>
      <MessagesList>
        {conversation &&
          conversation.messages.map(
            ({ text, author, timestamp }: any, index: number) => {
              let nextMessage = false;
              const prevMessage = conversation.messages[index - 1];
              const tenMinutes = 10 * 60;
              if (
                prevMessage &&
                prevMessage.author.uid === author.uid &&
                timestamp.seconds - prevMessage.timestamp.seconds < tenMinutes
              )
                nextMessage = true;

              return (
                <MessageItem
                  key={index}
                  text={text}
                  author={author}
                  timestamp={timestamp}
                  nextMessage={nextMessage}
                  style={
                    index !== 0 && !nextMessage
                      ? { marginTop: "1rem" }
                      : undefined
                  }
                />
              );
            }
          )}
        <div ref={scrollRef}></div>
      </MessagesList>
      <InlineForm
        onSubmit={handleSubmit(handleSendMessage)}
        style={{ marginTop: "1rem" }}
      >
        <Input
          {...register("message", { required: true })}
          placeholder="Type a message"
          ref={inputRef}
          autoComplete="off"
          disabled={!loading && !conversation}
        />
        <Button disabled={!conversation || !watchMessage}>Send</Button>
      </InlineForm>
    </Container>
  );
};

export default Conversation;
