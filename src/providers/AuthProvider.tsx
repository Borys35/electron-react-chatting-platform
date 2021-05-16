import React, {
  createContext,
  FC,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import firebase from "firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { auth, firestore } from "../lib/firebase";

declare global {
  interface Window {
    unloading: boolean;
  }
}

interface AuthUser {
  uid: string;
  displayName: string;
  photoURL: string;
}

interface DatabaseUser {
  username: string;
  photoURL: string;
  online: boolean;
  friends: Array<any>;
  servers: Array<any>;
}

interface ContextProps {
  loading: boolean;
  user: { auth: firebase.User; database: DatabaseUser };
  signOut: Function;
}

const AuthContext = createContext({} as ContextProps);

export const useAuth = () => useContext(AuthContext);

const AuthProvider: FC = ({ children }) => {
  // const [loading, setLoading] = useState(true);
  const [authUser, authLoading] = useAuthState(auth);
  const [databaseUser, databaseLoading] = useDocumentData(
    firestore
      .collection("users")
      .doc(auth.currentUser ? auth.currentUser.uid : "empty-path")
  );
  const [loading, setLoading] = useState(true);
  // const loading = authLoading || databaseLoading;
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (authLoading || databaseLoading) return;

    if (!authUser || !databaseUser) setUser(null);
    else {
      // firestore.collection("users").doc(authUser.uid).update({ online: true });
      setUser({ auth: authUser, database: databaseUser });
    }

    setLoading(false);

    // return () => {
    //   if (!authUser) return;

    //   firestore.collection("users").doc(authUser.uid).update({ online: false });
    // };
  }, [authUser, authLoading, databaseUser, databaseLoading]);

  // function setOnline(online: boolean) {
  //   firestore.collection("users").doc(user.auth.uid).update({ online });
  // }

  const setOnline = useCallback(
    (online: boolean) => {
      if (user)
        firestore.collection("users").doc(user.auth.uid).update({ online });
    },
    [user]
  );

  useEffect(() => {
    if (loading) return;

    if (!window.unloading) setOnline(true);

    window.onbeforeunload = () => {
      window.unloading = true;
      setOnline(false);
    };
  }, [loading, setOnline]);

  function signOut() {
    setOnline(false);
    auth.signOut();
  }

  // useEffect(() => {
  //   const unsubscribe = auth.onAuthStateChanged(async (user) => {
  //     if (user) {
  //       const docGet = await firestore.collection("users").doc(user.uid).get();
  //       setUser({ auth: user, database: docGet.data() });
  //     } else {
  //       setUser(null);
  //     }
  //     setLoading(false);
  //   });

  //   return unsubscribe;
  // }, []);

  const value = {
    loading,
    user,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
