import { FC } from "react";
import Modal from "react-modal";
import styled from "styled-components";
import { useForm } from "react-hook-form";
import Button from "./Button";
import Field from "./Field";
import Form from "./Form";
import { firestore } from "../lib/firebase";
import firebase from "firebase";
import createRoom from "../utils/createRoom";
import theme from "../styles/theme";

interface Props {
  isOpen: boolean;
  onRequestClose?: Function;
  serverId: string;
}

const Container = styled.div``;

const CreateRoomModal: FC<Props> = ({
  isOpen,
  onRequestClose = () => {},
  serverId,
}) => {
  const { handleSubmit, register, reset } = useForm();

  function handleCreate({ name }: any) {
    createRoom(serverId, name);
    onRequestClose();
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={() => onRequestClose()}
      onAfterClose={() => reset()}
      closeTimeoutMS={theme.modalCloseTimeoutMS}
    >
      <Container>
        <Form onSubmit={handleSubmit(handleCreate)}>
          <h5>Create Room</h5>
          <Field
            label="Name"
            inputProps={register("name", { required: true })}
          />
          <Button>Create</Button>
        </Form>
      </Container>
    </Modal>
  );
};

export default CreateRoomModal;
