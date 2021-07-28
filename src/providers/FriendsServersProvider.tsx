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

  const [currentFriendId, setCurrentFriendId] = useState("none");
  const [currentServerId, setCurrentServerId] = useState("none");

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

    setCurrentFriendId(user.database.friends[0]?.uid || "none");
    setCurrentServerId(user.database.servers[0]?.id || "none");
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
