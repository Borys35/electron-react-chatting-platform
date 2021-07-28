import styled from "styled-components";
import { FaCog, FaPhoneSlash } from "react-icons/fa";
import { Avatar, AvatarProps } from "./Avatar";
import { useAuth } from "../providers/AuthProvider";
import { useWebRTC } from "../providers/WebRTCProvider";
import { FC, useState } from "react";
import ProfileModal from "./ProfileModal";
import IconContainer, { IconProps } from "./IconContainer";

interface Props {
  avatarProps: AvatarProps;
  name: string;
  icons: Array<IconProps>;
}

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  > * {
    margin-right: 1rem;

    &:last-child {
      margin-right: 0;
    }
  }
`;

const Name = styled.p`
  font-weight: bold;
`;

const Tab: FC<Props> = ({ avatarProps, name, icons }) => {
  return (
    <Container>
      <Wrapper>
        <Avatar {...avatarProps} />
        <Name>{name}</Name>
      </Wrapper>
      <IconContainer icons={icons} />
    </Container>
  );
};

export default Tab;
