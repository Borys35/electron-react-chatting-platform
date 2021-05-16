import { FC } from "react";
import styled from "styled-components";
import theme from "../styles/theme";
import timestampToString from "../utils/timestampToString";
import { Avatar } from "./Avatar";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  text: string;
  author: any;
  timestamp: any;
  nextMessage?: boolean;
}

const Wrapper = styled.div`
  display: flex;
`;

const StyledAvatar = styled(Avatar)<{ nextMessage: boolean }>`
  margin-right: 1rem;
  height: ${({ nextMessage }) => (nextMessage ? "0px" : "")};
  visibility: ${({ nextMessage }) => (nextMessage ? "hidden" : "")};
`;

const TopText = styled.div`
  font-size: 0.9rem;
  color: ${theme.colors.lightGrey};
  margin-bottom: 0.3em;
  > span {
    margin-right: 0.5em;
  }
`;

const MessageItem: FC<Props> = ({
  text,
  author: { photoURL, username },
  timestamp,
  nextMessage = false,
  ...props
}) => {
  return (
    <Wrapper {...props}>
      <StyledAvatar size="sm" imageSrc={photoURL} nextMessage={nextMessage} />
      <div>
        {!nextMessage && (
          <TopText>
            <span>{username}</span>
            <span>•</span>
            <span>{timestampToString(timestamp)}</span>
          </TopText>
        )}
        <span>{text}</span>
      </div>
    </Wrapper>
  );
};

export default MessageItem;
