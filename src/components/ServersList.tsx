import { FC, useState } from "react";
import { FaPlus } from "react-icons/fa";
import ItemWithImage from "./ItemWithImage";
import ListWrapper from "./ListWrapper";
import StandardItem from "./StandardItem";
import AddServerModal from "./AddServerModal";

interface Props {
  values: Array<object>;
  onChange: Function;
  activeId: string;
}

const ServersList: FC<Props> = ({ values, onChange, activeId }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <ListWrapper>
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
          onClick={() => onChange(id)}
        />
      ))}
      <AddServerModal isOpen={isOpen} onRequestClose={() => setIsOpen(false)} />
    </ListWrapper>
  );
};

export default ServersList;
