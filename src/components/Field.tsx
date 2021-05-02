import React, { FC } from "react";
import styled from "styled-components";
import { colors } from "../styles/theme";
import Input from "./Input";

interface Props {
  label: string;
  inputProps: any;
  errors?: any;
  type?: string;
  onChange?: Function;
}

const Label = styled.label`
  font-size: 1rem;
  margin-bottom: 0.1em;
`;

const Error = styled.span`
  color: ${colors.red};
`;

const Field: FC<Props> = ({ label, inputProps, errors, type = "text" }) => {
  return (
    <div>
      <Label>{label}</Label>
      <Input {...inputProps} type={type} />
      {errors && <Error>{errors.message}</Error>}
    </div>
  );
};

export default Field;
