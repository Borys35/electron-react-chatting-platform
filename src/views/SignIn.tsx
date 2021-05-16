import React from "react";
import styled from "styled-components";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import Button from "../components/Button";
import Field from "../components/Field";
import Form from "../components/Form";
import { auth } from "../lib/firebase";
import { Link } from "react-router-dom";
import PageContainer from "../components/PageContainer";

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
  email: Yup.string().required(),
  password: Yup.string().required(),
});

export default function SignIn() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  async function onSubmit(data: any) {
    const { email, password } = data;
    try {
      await auth.signInWithEmailAndPassword(email, password);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <Container>
      <StyledForm onSubmit={handleSubmit(onSubmit)}>
        <h4>Sign in</h4>
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
        <Button>Sign in</Button>
        <Link to="/sign-up">Sign up instead</Link>
      </StyledForm>
    </Container>
  );
}
