import styled from "styled-components";
import { colors } from "../styles/theme";

const Input = styled.input`
  border-radius: 4px;
  background-color: ${colors.background100};
  font-size: 1rem;
  border-radius: 4px;
  padding: 0.5em 1.25em;
  color: ${colors.white};
  border: none;
  outline: none;
  transition: background-color 0.1s;

  &:focus {
    background-color: ${colors.background150};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export default Input;
