import React, {
  createContext,
  FC,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { auth, firestore } from "../lib/firebase";

interface ContextProps {
  loading: boolean;
  user: any | null;
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
  const loading = authLoading && databaseLoading;
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (!authUser || !databaseUser) return setUser(null);

    setUser({ auth: authUser, database: databaseUser });
  }, [authUser, databaseUser]);

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
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
