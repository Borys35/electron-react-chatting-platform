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
  const { handleSubmit, register } = useForm();

  function handleCreate({ name, type }: any) {
    createRoom(serverId, name, type);
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={() => onRequestClose()}
      closeTimeoutMS={theme.modalCloseTimeoutMS}
    >
      <Container>
        <Form onSubmit={handleSubmit(handleCreate)}>
          <Field label="Name" inputProps={register("name")} />
          <Field label="Type" inputProps={register("type")} />
          <Button>Create</Button>
        </Form>
      </Container>
    </Modal>
  );
};

export default CreateRoomModal;
