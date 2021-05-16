import styled from "styled-components";
import { colors } from "../styles/theme";

const Text = styled.p<{ size?: "sm" | "md" | "lg" }>`
  font-size: ${({ size = "sm" }) => {
    switch (size) {
      case "sm":
        return "1rem";
      case "md":
        return "1.25rem";
      case "lg":
        return "1.5rem";
    }
  }};
  color: ${colors.lightGrey};
  line-height: 1.5em;
`;

export default Text;
