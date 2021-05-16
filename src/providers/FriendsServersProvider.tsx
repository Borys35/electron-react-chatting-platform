import { createContext, FC, useContext, useEffect, useState } from "react";
import { useHistory } from "react-router";
import { useAuth } from "./AuthProvider";

interface ContextProps {
  openCurrentFriend: Function;
  changeCurrentFriend: Function;
  openCurrentServer: Function;
  changeCurrentServer: Function;
}

const FriendsServersContext = createContext({} as ContextProps);

export const useFriendsServers = () => useContext(FriendsServersContext);

const FriendsServersProvider: FC = ({ children }) => {
  const history = useHistory();
  const { user } = useAuth();

  const [currentFriendId, setCurrentFriendId] = useState("404");
  const [currentServerId, setCurrentServerId] = useState("404");

  function openCurrentFriend() {
    history.push(`/friends/${currentFriendId}`);
  }
  function changeCurrentFriend(id: string) {
    setCurrentFriendId(id);
    history.push(`/friends/${id}`);
  }
  function openCurrentServer() {
    history.push(`/servers/${currentServerId}`);
  }
  function changeCurrentServer(id: string) {
    setCurrentServerId(id);
    history.push(`/servers/${id}`);
  }

  useEffect(() => {
    if (!user) return;

    setCurrentFriendId(user.database.friends[0]?.uid || "404");
    setCurrentServerId(user.database.servers[0]?.id || "404");
  }, [user]);

  const value = {
    openCurrentFriend,
    changeCurrentFriend,
    openCurrentServer,
    changeCurrentServer,
  };

  return (
    <FriendsServersContext.Provider value={value}>
      {children}
    </FriendsServersContext.Provider>
  );
};

export default FriendsServersProvider;
