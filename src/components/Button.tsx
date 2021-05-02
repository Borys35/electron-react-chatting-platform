import styled from "styled-components";
import theme from "../styles/theme";

const Button = styled.button`
  font-size: 1rem;
  border-radius: 4px;
  padding: 0.5em 1.25em;
  background-color: ${theme.colors.primary};
  color: ${theme.colors.black};
`;

export default Button;
