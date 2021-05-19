import { FC } from "react";
import styled from "styled-components";
import Input from "./Input";

const StyledSelect = styled(Input)``;

const Select: FC = ({ children, ...props }) => {
  return (
    <StyledSelect as="select" {...props}>
      {children}
    </StyledSelect>
  );
};

export default Select;
