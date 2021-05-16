import { FC } from "react";
import Modal from "react-modal";
import styled from "styled-components";
import theme from "../styles/theme";
import CreateServerForm from "./CreateServerForm";
import JoinServerForm from "./JoinServerForm";

interface Props {
  isOpen: boolean;
  onRequestClose?: Function;
  onAfterAdd?: Function;
}

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
`;

const AddServerModal: FC<Props> = ({
  isOpen,
  onRequestClose = () => {},
  onAfterAdd = () => {},
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={() => onRequestClose()}
      closeTimeoutMS={theme.modalCloseTimeoutMS}
    >
      <Container>
        <CreateServerForm onAfterAdd={onAfterAdd} />
        <JoinServerForm onAfterAdd={onAfterAdd} />
      </Container>
    </Modal>
  );
};

export default AddServerModal;
