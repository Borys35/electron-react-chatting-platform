import styled from "styled-components";
import { FaCog } from "react-icons/fa";
import { Avatar } from "./Avatar";
import { useAuth } from "../providers/AuthProvider";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ServerCard = () => {
  const { user } = useAuth();

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
      </div>
    </Wrapper>
  );
};

export default ServerCard;
