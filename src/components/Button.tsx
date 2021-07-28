import styled from "styled-components";
import theme from "../styles/theme";

const Button = styled.button<{
  variant?: "primary" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";
}>`
  display: inline-block;
  font-weight: 600;
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
  border-radius: 4px;
  padding: 0.5em 1.25em;
  background-color: ${({ variant = "primary" }) => {
    switch (variant) {
      case "primary":
        return theme.colors.primary;
      case "secondary":
        return theme.colors.background150;
      case "danger":
        return theme.colors.red;
    }
  }};
  color: ${({ variant = "primary" }) => {
    switch (variant) {
      case "primary":
        return theme.colors.black;
      case "secondary":
        return theme.colors.white;
      case "danger":
        return theme.colors.black;
    }
  }};
  border: none;
  outline: none;
  cursor: pointer;
  transition: opacity 0.1s, background-color 0.05s;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &:not([disabled]):hover {
    background-color: ${({ variant = "primary" }) => {
      switch (variant) {
        case "primary":
          return theme.colors.primaryHover;
        case "secondary":
          return theme.colors.background200;
      }
    }};
  }
`;

export default Button;
