import { FaHome, FaUser, FaUsers, FaBasketballBall } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import { useFriendsServers } from "../providers/FriendsServersProvider";
import ListWrapper from "./ListWrapper";
import StandardItem from "./StandardItem";

const SectionSelectTab = () => {
  const { pathname } = useLocation();
  const { openCurrentFriend, openCurrentServer } = useFriendsServers();

  return (
    <ListWrapper>
      <StandardItem
        to="/"
        text="Home"
        icon={FaHome}
        active={pathname === "/"}
      />
      <StandardItem
        text="Friends"
        icon={FaUser}
        onClick={() => openCurrentFriend()}
        active={pathname.startsWith("/friends/")}
      />
      <StandardItem
        text="Servers"
        icon={FaUsers}
        onClick={() => openCurrentServer()}
        active={pathname.startsWith("/servers/")}
      />
      <StandardItem
        to="/communities"
        text="Communities"
        icon={FaBasketballBall}
        active={pathname === "/communities"}
      />
    </ListWrapper>
  );
};

export default SectionSelectTab;
