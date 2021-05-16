import { FC, useState } from "react";
import { FaPlus } from "react-icons/fa";
import ItemWithImage from "./ItemWithImage";
import ListWrapper from "./ListWrapper";
import StandardItem from "./StandardItem";
import AddServerModal from "./AddServerModal";
import { useFriendsServers } from "../providers/FriendsServersProvider";
import styled from "styled-components";

const List = styled(ListWrapper)`
  overflow-x: hidden;
  overflow-y: auto;
`;

interface Props {
  values: Array<object>;
  activeId: string;
}

const ServersList: FC<Props> = ({ values, activeId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { changeCurrentServer } = useFriendsServers();

  return (
    <List>
      <StandardItem
        text="Add Server"
        icon={FaPlus}
        onClick={() => setIsOpen(true)}
      />
      {values.map(({ id, name, photoURL }: any) => (
        <ItemWithImage
          key={id}
          imageSrc={photoURL}
          text={name}
          active={id === activeId}
          onClick={() => changeCurrentServer(id)}
        />
      ))}
      <AddServerModal
        isOpen={isOpen}
        onRequestClose={() => setIsOpen(false)}
        onAfterAdd={(id: string) => changeCurrentServer(id)}
      />
    </List>
  );
};

export default ServersList;
