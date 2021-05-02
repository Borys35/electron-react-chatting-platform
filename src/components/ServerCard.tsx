import { FC } from "react";
import styled from "styled-components";
import { colors } from "../styles/theme";
import { Avatar } from "./Avatar";
import Button from "./Button";

interface Props {}

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  padding: 1rem;
  gap: 1rem;
  border-radius: 4px;
  background-color: ${colors.background100};
`;

const ServerCard: FC<Props> = () => {
  return (
    <Wrapper>
      <div>
        <Avatar imageSrc="" size="lg" />
      </div>
      <div>
        <h5>Title</h5>
        <p>Arcu est senectus ac lectus ipsum, facilisi vitae varius mag...</p>
        <p>USERS: 34.5K</p>
        <p>ONLINE: 23.8K</p>
      </div>
      <div>
        <Button>Join</Button>
      </div>
    </Wrapper>
  );
};

export default ServerCard;
