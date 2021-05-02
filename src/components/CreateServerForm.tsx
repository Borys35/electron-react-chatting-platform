import { useForm } from "react-hook-form";
import Form from "./Form";
import Field from "./Field";
import Button from "./Button";
import { firestore } from "../lib/firebase";
import { useAuth } from "../providers/AuthProvider";
import firebase from "firebase";

const CreateServerForm = () => {
  const { user } = useAuth();
  const { uid } = user.auth;
  const { username, photoURL } = user.database;
  const { register, handleSubmit } = useForm();

  async function handleCreate({ name }: any) {
    const doc = await firestore.collection("servers").add({
      name,
      photoURL: "https://picsum.photos/id/101/200",
      isPrivate: false,
      owner: uid,
      members: [{ uid, username, photoURL }],
      rooms: [],
    });
    firestore
      .collection("users")
      .doc(uid)
      .update({
        servers: firebase.firestore.FieldValue.arrayUnion({
          id: doc.id,
          name,
          photoURL: "https://picsum.photos/id/101/200",
        }),
      });
  }

  return (
    <Form onSubmit={handleSubmit(handleCreate)}>
      <Field label="Name of server" inputProps={register("name")} />
      <Button>Create</Button>
    </Form>
  );
};

export default CreateServerForm;
