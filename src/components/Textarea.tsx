import { FC } from "react";
import styled from "styled-components";
import Input from "./Input";

const StyledTextarea = styled(Input)`
  resize: vertical;
  max-height: 200px;
  min-height: 3rem;
  width: 100%;
`;

const Textarea: FC = ({ children, ...props }) => {
  return (
    <StyledTextarea as="textarea" {...props}>
      {children}
    </StyledTextarea>
  );
};

export default Textarea;
