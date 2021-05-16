import { FC } from "react";
import { useForm } from "react-hook-form";
import Modal from "react-modal";
import styled from "styled-components";
import firebase from "firebase";
import { auth, firestore } from "../lib/firebase";
import { useAuth } from "../providers/AuthProvider";
import theme from "../styles/theme";
import Button from "./Button";
import CreateServerForm from "./CreateServerForm";
import Field from "./Field";
import Form from "./Form";
import JoinServerForm from "./JoinServerForm";
import ListWrapper from "./ListWrapper";
import { Avatar } from "./Avatar";

interface Props {
  isOpen: boolean;
  onRequestClose?: Function;
  onUpdate: Function;
  onDelete: Function;
}

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
`;

const RoomModal: FC<Props> = ({
  isOpen,
  onRequestClose = () => {},
  onUpdate,
  onDelete,
}) => {
  const { user, signOut } = useAuth();
  const { register, handleSubmit, reset } = useForm();

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={() => onRequestClose()}
      onAfterClose={() => reset()}
      closeTimeoutMS={theme.modalCloseTimeoutMS}
    >
      <Container>
        <Form
          onSubmit={handleSubmit((data: any) => onUpdate(data))}
          style={{
            paddingBottom: "1.5rem",
            borderBottom: `1px solid ${theme.colors.background200}`,
          }}
        >
          <Field label={"Room name"} inputProps={register("name")} />
          <Button>Update</Button>
        </Form>
        <div>
          <Button variant="danger" onClick={() => onDelete()}>
            Delete
          </Button>
        </div>
      </Container>
    </Modal>
  );
};

export default RoomModal;
