import { useForm } from "react-hook-form";
import Form from "./Form";
import Field from "./Field";
import Button from "./Button";
import Select from "./Select";
import { firestore } from "../lib/firebase";
import { useAuth } from "../providers/AuthProvider";
import firebase from "firebase";
import { communityCategories } from "../constraints";
import createRoom from "../utils/createRoom";
import { FC } from "react";
import Checkbox from "./Checkbox";

interface Props {
  onAfterAdd?: Function;
  onClose?: Function;
}

const CreateServerForm: FC<Props> = ({
  onAfterAdd = () => {},
  onClose = () => {},
}) => {
  const { user } = useAuth();
  const { uid } = user.auth;
  const { username, photoURL } = user.database;
  const { register, handleSubmit } = useForm();

  async function handleCreate({ name, description, category, isPrivate }: any) {
    const { id } = await firestore.collection("servers").add({
      name,
      description,
      category,
      photoURL: "https://picsum.photos/id/101/200",
      isPrivate,
      owner: uid,
      members: [{ uid, username, photoURL }],
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
    onClose();
  }

  return (
    <Form onSubmit={handleSubmit(handleCreate)}>
      <h6>Create Server</h6>
      <Field label="Name" inputProps={register("name", { required: true })} />
      <Field
        label="Description"
        inputProps={register("description", { required: true })}
        type="textarea"
      ></Field>
      <Field
        label="Community"
        inputProps={register("category", { required: true })}
        type="select"
      >
        <option value="">Choose a community</option>
        {Object.values(communityCategories).map((c) => (
          <option value={c}>{c}</option>
        ))}
      </Field>
      <Field
        label="Is Private"
        type="checkbox"
        inputProps={register("isPrivate")}
      />
      <Button>Create</Button>
    </Form>
  );
};

export default CreateServerForm;
