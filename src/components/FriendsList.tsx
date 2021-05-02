import { FC } from "react";
import { FaPlus } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import ItemWithImage from "./ItemWithImage";
import ListWrapper from "./ListWrapper";
import StandardItem from "./StandardItem";

interface Props {
  values: Array<object>;
  onChange: Function;
  activeUid?: string;
}

const FriendsList: FC<Props> = ({ values, onChange, activeUid }) => {
  const { pathname } = useLocation();

  return (
    <ListWrapper>
      <StandardItem
        to="/add-friend"
        text="Add Friend"
        icon={FaPlus}
        active={pathname === "/add-friend"}
      />
      {values.map(({ uid, username, photoURL }: any) => (
        <ItemWithImage
          key={uid}
          imageSrc={photoURL}
          text={username}
          active={uid === activeUid}
          onClick={() => onChange(uid)}
        />
      ))}
    </ListWrapper>
  );
};

export default FriendsList;
