import React, { FC } from "react";
import styled from "styled-components";
import { colors } from "../styles/theme";

interface Props {
  showStatus?: boolean;
  online?: boolean;
  size: "md" | "lg";
  imageSrc: string;
}

const Wrapper = styled.div`
  position: relative;
`;

const Image = styled.img<{ size: "md" | "lg" }>`
  border-radius: 50%;
  width: ${(props) => {
    switch (props.size) {
      case "lg":
        return "50px";
      case "md":
        return "42px";
    }
  }};
  height: ${(props) => {
    switch (props.size) {
      case "lg":
        return "50px";
      case "md":
        return "42px";
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

export const Avatar: FC<Props> = ({
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
