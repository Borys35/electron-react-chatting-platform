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
}

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
`;

const ProfileModal: FC<Props> = ({ isOpen, onRequestClose = () => {} }) => {
  const { user, signOut } = useAuth();
  const { register, handleSubmit, reset } = useForm();

  function handleOnSubmit({
    newUsername,
    newEmail,
    newPassword,
    oldPassword,
  }: any) {
    if (!user.auth.email) return;

    const credential = firebase.auth.EmailAuthProvider.credential(
      user.auth.email,
      oldPassword
    );
    user.auth
      .reauthenticateWithCredential(credential)
      .then(() => {
        if (newUsername) {
          user.auth.updateProfile({ displayName: newUsername });
          firestore
            .collection("users")
            .doc(user.auth.uid)
            .update({ username: newUsername });
        }
        if (newEmail) user.auth.updateEmail(newEmail);
        if (newPassword) user.auth.updatePassword(newPassword);

        onRequestClose();
      })
      .catch((err) => console.error(err));
  }

  function hideEmail(email: string | null) {
    if (!email) return null;

    const start = email.substr(0, 3);
    const end = email.substr(email.lastIndexOf(".") + 1);
    return `${start}***${end}`;
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={() => onRequestClose()}
      onAfterClose={() => reset()}
      closeTimeoutMS={theme.modalCloseTimeoutMS}
    >
      <Container>
        <Form onSubmit={handleSubmit(handleOnSubmit)}>
          <Field label={"New username"} inputProps={register("newUsername")} />
          <Field label={"New e-mail"} inputProps={register("newEmail")} />
          <Field
            label={"New password"}
            inputProps={register("newPassword")}
            type="password"
          />
          <Field
            label={"Old password *"}
            inputProps={register("oldPassword")}
            type="password"
          />
          <Button>Change</Button>
        </Form>
        <ListWrapper>
          <Avatar size="lg" imageSrc={user.database.photoURL} />
          <p>Username: {user.database.username}</p>
          <p>E-mail: {hideEmail(user.auth.email)}</p>
          <Button variant="secondary" onClick={() => signOut()}>
            Sign out
          </Button>
        </ListWrapper>
      </Container>
    </Modal>
  );
};

export default ProfileModal;
