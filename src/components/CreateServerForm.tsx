import { useForm } from "react-hook-form";
import Form from "./Form";
import Field from "./Field";
import Button from "./Button";
import { firestore } from "../lib/firebase";
import { useAuth } from "../providers/AuthProvider";
import firebase from "firebase";
import { communityCategories } from "../constraints";
import createRoom from "../utils/createRoom";
import { FC } from "react";

interface Props {
  onAfterAdd?: Function;
}

const CreateServerForm: FC<Props> = ({ onAfterAdd = () => {} }) => {
  const { user } = useAuth();
  const { uid } = user.auth;
  const { username, photoURL } = user.database;
  const { register, handleSubmit } = useForm();

  async function handleCreate({ name }: any) {
    const { id } = await firestore.collection("servers").add({
      name,
      category: communityCategories.programming,
      photoURL: "https://picsum.photos/id/101/200",
      isPrivate: false,
      owner: uid,
      members: [{ uid, username, photoURL }],
      // rooms: [],
    });
    firestore
      .collection("users")
      .doc(uid)
      .update({
        servers: firebase.firestore.FieldValue.arrayUnion({
          id,
          name,
          photoURL: "https://picsum.photos/id/101/200",
        }),
      });
    createRoom(id, "Welcome", "text");
    onAfterAdd(id);
  }

  return (
    <Form onSubmit={handleSubmit(handleCreate)}>
      <h6>Create Server</h6>
      <Field label="Name" inputProps={register("name")} />
      <Field label="Community" inputProps={register("community")} />
      <Field label="Private Server" inputProps={register("private")} />
      <Button>Create</Button>
    </Form>
  );
};

export default CreateServerForm;
