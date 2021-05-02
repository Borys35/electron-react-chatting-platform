import { useForm } from "react-hook-form";
import Form from "./Form";
import Field from "./Field";
import Button from "./Button";
import { firestore } from "../lib/firebase";
import firebase from "firebase";
import { useAuth } from "../providers/AuthProvider";

const JoinServerForm = () => {
  const { user } = useAuth();
  const { register, handleSubmit } = useForm();

  const textId = firestore.collection("custom-id").doc().id;
  console.log("yr", textId);

  async function handleJoin({ id }: any) {
    const doc = firestore.collection("servers").doc(id);
    if (!doc) return;

    const serverData = (await doc.get()).data();
    console.log("sdsds", serverData);

    if (!serverData) return;

    console.log("dssds");

    await firestore
      .collection("servers")
      .doc(id)
      .update({
        members: firebase.firestore.FieldValue.arrayUnion({
          id: user.auth.uid,
          username: user.database.username,
          photoURL: user.database.photoURL,
        }),
      });
    await firestore
      .collection("users")
      .doc(user.auth.uid)
      .update({
        servers: firebase.firestore.FieldValue.arrayUnion({
          id,
          name: serverData.name,
          photoURL: serverData.photoURL,
        }),
      });
  }

  return (
    <Form onSubmit={handleSubmit(handleJoin)}>
      <Field label="Server's ID" inputProps={register("id")} />
      <Button>Join</Button>
    </Form>
  );
};

export default JoinServerForm;
