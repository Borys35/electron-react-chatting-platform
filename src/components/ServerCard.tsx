import { FC } from "react";
import styled from "styled-components";
import { useAuth } from "../providers/AuthProvider";
import { useFriendsServers } from "../providers/FriendsServersProvider";
import { colors } from "../styles/theme";
import joinServer from "../utils/joinServer";
import shortenNumber from "../utils/shortenNumber";
import { Avatar } from "./Avatar";
import Button from "./Button";
import Text from "./Text";

interface Props {
  id: string;
  name: string;
  description: string;
  photoURL: string;
  joined: boolean;
  usersCount: number;
  onlineCount: number;
}

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  padding: 1rem;
  gap: 1rem;
  border-radius: 4px;
  background-color: ${colors.background100};
`;

const Description = styled(Text)`
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2; /* Write the number of 
                        lines you want to be 
                        displayed */
  -webkit-box-orient: vertical;
  max-height: 3em;
  margin: 0.5rem 0 2rem 0;
`;

const Stats = styled.div`
  display: flex;

  > * {
    margin-right: 2rem;

    &:last-child {
      margin-right: 0;
    }
  }
`;

const StatNumber = styled.span<{ color: string }>`
  font-weight: bold;
  color: ${({ color }) => color};
`;

const ServerCard: FC<Props> = ({
  id,
  name,
  description,
  photoURL,
  joined,
  usersCount,
  onlineCount,
}) => {
  const { user } = useAuth();
  const { changeCurrentServer } = useFriendsServers();

  function handleJoin(id: string, user: any) {
    joinServer(id, user);
    changeCurrentServer(id);
  }

  return (
    <Wrapper>
      <div>
        <Avatar imageSrc={photoURL} size="lg" />
      </div>
      <div>
        <h5>{name}</h5>
        <Description>{description || "No description added"}</Description>
        <Stats>
          <p>
            USERS:{" "}
            <StatNumber color={colors.blue}>
              {shortenNumber(usersCount)}
            </StatNumber>
          </p>
          <p>
            ONLINE:{" "}
            <StatNumber color={colors.green}>
              {shortenNumber(onlineCount)}
            </StatNumber>
          </p>
        </Stats>
      </div>
      <div>
        {!joined ? (
          <Button onClick={() => handleJoin(id, user)}>Join</Button>
        ) : (
          <Button disabled>Joined</Button>
        )}
      </div>
    </Wrapper>
  );
};

export default ServerCard;
