import React, { useState } from "react";
import styled from "styled-components";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import Button from "../components/Button";
import Field from "../components/Field";
import Form from "../components/Form";
import { auth, firestore } from "../lib/firebase";
import { Link } from "react-router-dom";
import PageContainer from "../components/PageContainer";
import ErrorMessage from "../components/ErrorMessage";

const Container = styled(PageContainer)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledForm = styled(Form)`
  width: min(440px, 100%);
  padding: 2rem;
`;

const schema = Yup.object({
  username: Yup.string().required(),
  email: Yup.string().email().required(),
  password: Yup.string().min(6).required(),
  password2: Yup.string()
    .oneOf(
      [Yup.ref("password"), null],
      "confirmation must be the same as password"
    )
    .required(),
});

export default function SignUp() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  async function onSubmit(data: any) {
    setLoading(true);
    const { username, email, password } = data;

    try {
      const { empty } = await firestore
        .collection("users")
        .where("username", "==", username)
        .get();
      if (!empty) throw new Error("There is a user with this username");

      const { user } = await auth.createUserWithEmailAndPassword(
        email,
        password
      );

      console.log("user", user);

      if (!user) return;

      await user.updateProfile({
        displayName: username,
        photoURL: "https://picsum.photos/seed/picsum/200",
      });
      await firestore.collection("users").doc(user.uid).set({
        username,
        photoURL: "https://picsum.photos/seed/picsum/200",
        online: true,
        friends: [],
        servers: [],
      });
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  }

  return (
    <Container>
      <StyledForm onSubmit={handleSubmit(onSubmit)}>
        <h4>Create an account</h4>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <Field
          inputProps={register("username")}
          label="Username"
          errors={errors.username}
        />
        <Field
          inputProps={register("email")}
          label="Your e-mail"
          errors={errors.email}
        />
        <Field
          inputProps={register("password")}
          type="password"
          label="Password"
          errors={errors.password}
        />
        <Field
          inputProps={register("password2")}
          type="password"
          label="Confirm Password"
          errors={errors.password2}
        />
        <Button disabled={loading}>
          {!loading ? "Sign up" : "Proceeding"}
        </Button>
        <Link to="/sign-in">Sign in instead</Link>
      </StyledForm>
    </Container>
  );
}
