import React, { FC } from "react";
import styled from "styled-components";
import { colors } from "../styles/theme";
import Input from "./Input";
import ErrorMessage from "./ErrorMessage";

interface Props {
  label: string;
  inputProps: any;
  errors?: any;
  type?: string;
  onChange?: Function;
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-size: 1rem;
  margin-bottom: 0.2em;
`;

const Field: FC<Props> = ({ label, inputProps, errors, type = "text" }) => {
  return (
    <Wrapper>
      <Label>{label}</Label>
      <Input {...inputProps} type={type} />
      {errors && <ErrorMessage>{errors.message}</ErrorMessage>}
    </Wrapper>
  );
};

export default Field;
