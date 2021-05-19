import { useForm } from "react-hook-form";
import Form from "./Form";
import Field from "./Field";
import Button from "./Button";
import { firestore } from "../lib/firebase";
import firebase from "firebase";
import { useAuth } from "../providers/AuthProvider";
import joinServer from "../utils/joinServer";
import { FC } from "react";

interface Props {
  onAfterAdd?: Function;
  onClose?: Function;
}

const JoinServerForm: FC<Props> = ({
  onAfterAdd = () => {},
  onClose = () => {},
}) => {
  const { user } = useAuth();
  const { register, handleSubmit } = useForm();

  async function handleJoin({ id }: any) {
    joinServer(id, user);
    onAfterAdd(id);
    onClose();
  }

  return (
    <Form onSubmit={handleSubmit(handleJoin)}>
      <h6>Join Server</h6>
      <Field label="Server's ID" inputProps={register("id")} />
      <Button>Join</Button>
    </Form>
  );
};

export default JoinServerForm;
