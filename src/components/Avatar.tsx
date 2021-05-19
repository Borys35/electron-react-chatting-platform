import React, { FC } from "react";
import styled from "styled-components";
import { colors } from "../styles/theme";

export interface AvatarProps {
  imageSrc: string;
  showStatus?: boolean;
  online?: boolean;
  size?: "sm" | "md" | "lg";
}

const Wrapper = styled.div`
  position: relative;
`;

const Image = styled.img<{ size?: "sm" | "md" | "lg" }>`
  border-radius: 50%;
  width: ${({ size = "sm" }) => {
    switch (size) {
      case "lg":
        return "50px";
      case "md":
        return "42px";
      case "sm":
        return "34px";
    }
  }};
  height: ${({ size = "sm" }) => {
    switch (size) {
      case "lg":
        return "50px";
      case "md":
        return "42px";
      case "sm":
        return "34px";
    }
  }};
`;

const StatusDot = styled.div`
  position: absolute;
  background-color: ${colors.green};
  width: 12px;
  height: 12px;
  bottom: 0;
  right: 0;
  border-radius: 50%;
`;

export const Avatar: FC<AvatarProps> = ({
  showStatus = false,
  online = false,
  size,
  imageSrc,
  ...props
}) => {
  return (
    <Wrapper {...props}>
      <Image src={imageSrc} alt="Avatar" size={size} />
      {showStatus && online && <StatusDot />}
    </Wrapper>
  );
};
