import styled from "styled-components";
import { FaCog, FaPhoneSlash } from "react-icons/fa";
import { Avatar } from "./Avatar";
import { useAuth } from "../providers/AuthProvider";
import { useWebRTC } from "../providers/WebRTCProvider";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ServerCard = () => {
  const { user } = useAuth();
  const { connected, hangUp } = useWebRTC();

  return (
    <Wrapper>
      <div>
        <Avatar
          imageSrc={user.database.photoURL}
          size="md"
          showStatus={true}
          online={true}
        />
        <p>{user.database.username}</p>
      </div>
      <div>
        <FaCog />
        {connected && <FaPhoneSlash onClick={() => hangUp()} />}
      </div>
    </Wrapper>
  );
};

export default ServerCard;
