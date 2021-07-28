import React, { FC } from "react";
import styled from "styled-components";
import { colors } from "../styles/theme";
import Input from "./Input";
import ErrorMessage from "./ErrorMessage";
import Select from "./Select";
import Textarea from "./Textarea";
import Checkbox from "./Checkbox";

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
`;

const Field: FC<Props> = React.forwardRef(
  ({ children, label, inputProps, errors, type = "text" }) => {
    if (type === "select")
      return (
        <Wrapper>
          <Label>{label}</Label>
          <Select {...inputProps}>{children}</Select>
          {errors && <ErrorMessage>{errors.message}</ErrorMessage>}
        </Wrapper>
      );
    else if (type === "textarea")
      return (
        <Wrapper>
          <Label>{label}</Label>
          <Textarea {...inputProps}>{children}</Textarea>
          {errors && <ErrorMessage>{errors.message}</ErrorMessage>}
        </Wrapper>
      );
    else if (type === "checkbox")
      return (
        <Wrapper>
          <Label>{label}</Label>
          <Checkbox {...inputProps} />
          {errors && <ErrorMessage>{errors.message}</ErrorMessage>}
        </Wrapper>
      );
    return (
      <Wrapper>
        <Label>{label}</Label>
        <Input {...inputProps} type={type} />
        {errors && <ErrorMessage>{errors.message}</ErrorMessage>}
      </Wrapper>
    );
  }
);

export default Field;
