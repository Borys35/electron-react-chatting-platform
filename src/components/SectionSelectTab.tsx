import { FaUser, FaUsers, FaBasketballBall } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import ListWrapper from "./ListWrapper";
import StandardItem from "./StandardItem";

const SectionSelectTab = () => {
  const { pathname } = useLocation();

  return (
    <ListWrapper>
      <StandardItem
        to="/friends"
        text="Friends"
        icon={FaUser}
        active={pathname === "/friends"}
      />
      <StandardItem
        to="/servers"
        text="Servers"
        icon={FaUsers}
        active={pathname === "/servers"}
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
