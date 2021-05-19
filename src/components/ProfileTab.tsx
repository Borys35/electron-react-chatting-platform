import styled from "styled-components";
import { FaCog, FaPhoneSlash } from "react-icons/fa";
import { Avatar } from "./Avatar";
import { useAuth } from "../providers/AuthProvider";
import { useWebRTC } from "../providers/WebRTCProvider";
import { useState } from "react";
import ProfileModal from "./ProfileModal";
import IconContainer from "./IconContainer";
import Tab from "./Tab";

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

const ProfileTab = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const { connected, hangUp } = useWebRTC();

  return (
    <div>
      <Tab
        name={user.database.username}
        avatarProps={{
          imageSrc: user.database.photoURL,
          showStatus: true,
          online: true,
        }}
        icons={[
          {
            iconComponent: FaPhoneSlash,
            onClick: () => hangUp(),
            show: connected,
          },
          { iconComponent: FaCog, onClick: () => setIsOpen(true) },
        ]}
      />
      {/* <Wrapper>
        <Avatar
          imageSrc={user.database.photoURL}
          size="md"
          showStatus={true}
          online={true}
        />
        <p>{user.database.username}</p>
      </Wrapper>
      <IconContainer
        icons={[
          {
            iconComponent: FaPhoneSlash,
            onClick: () => hangUp(),
            show: connected,
          },
          { iconComponent: FaCog, onClick: () => setIsOpen(true) },
        ]}
      /> */}
      <ProfileModal isOpen={isOpen} onRequestClose={() => setIsOpen(false)} />
    </div>
  );
};

export default ProfileTab;
