import { FC } from "react";
import { Avatar } from "./Avatar";

interface Props {
  text: string;
  author: any;
  timestamp: any;
}

const MessageItem: FC<Props> = ({ text, author, timestamp }) => {
  return (
    <div>
      <Avatar size="md" imageSrc={author.photoURL} />
      {author.username} - {text}
    </div>
  );
};

export default MessageItem;
