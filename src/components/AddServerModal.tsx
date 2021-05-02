import { FC } from "react";
import Modal from "react-modal";
import styled from "styled-components";
import CreateServerForm from "./CreateServerForm";
import JoinServerForm from "./JoinServerForm";

interface Props {
  isOpen: boolean;
  onRequestClose?: Function;
}

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
`;

const AddServerModal: FC<Props> = ({ isOpen, onRequestClose = () => {} }) => {
  return (
    <Modal isOpen={isOpen} onRequestClose={() => onRequestClose()}>
      <Container>
        <div>
          <CreateServerForm />
        </div>
        <div>
          <JoinServerForm />
        </div>
      </Container>
    </Modal>
  );
};

export default AddServerModal;
