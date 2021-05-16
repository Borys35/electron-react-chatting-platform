import { FC } from "react";
import { FaPlus } from "react-icons/fa";
import { useHistory, useLocation } from "react-router-dom";
import ItemWithImage from "./ItemWithImage";
import ListWrapper from "./ListWrapper";
import StandardItem from "./StandardItem";
import { useFriendsServers } from "../providers/FriendsServersProvider";

interface Props {
  values: Array<object>;
  activeUid?: string;
}

const FriendsList: FC<Props> = ({ values, activeUid }) => {
  const { pathname } = useLocation();
  const { changeCurrentFriend } = useFriendsServers();

  return (
    <ListWrapper>
      <StandardItem
        to="/add-friend"
        text="Add Friend"
        icon={FaPlus}
        active={pathname === "/add-friend"}
      />
      {values.map(({ uid, username, photoURL }: any) => (
        // changeCurrentFriend
        <ItemWithImage
          key={uid}
          imageSrc={photoURL}
          text={username}
          active={uid === activeUid}
          onClick={() => changeCurrentFriend(uid)}
        />
      ))}
    </ListWrapper>
  );
};

export default FriendsList;
