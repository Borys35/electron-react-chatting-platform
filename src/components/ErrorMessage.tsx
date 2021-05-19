import styled from "styled-components";
import { colors } from "../styles/theme";

const ErrorMessage = styled.span`
  display: inline-block;
  color: ${colors.red};
  font-weight: bold;
`;

export default ErrorMessage;
