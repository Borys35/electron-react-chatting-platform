import React, { FC, useEffect } from "react";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  RouteProps,
  Switch,
} from "react-router-dom";
import GlobalStyle from "./styles/globalStyle";
import Friends from "./views/Friends";
import Servers from "./views/Servers";
import Communities from "./views/Communities";
import SignUp from "./views/SignUp";
import SignIn from "./views/SignIn";
import Home from "./views/Home";
import AddFriend from "./views/AddFriend";
import { useAuth } from "./providers/AuthProvider";
import FriendsServersProvider from "./providers/FriendsServersProvider";
import NotFound from "./views/NotFound";
import Modal from "react-modal";
import { firestore } from "./lib/firebase";
import { IconContext } from "react-icons/lib";

Modal.setAppElement("#root");
Modal.defaultStyles = {};

const PrivateRoute: FC<RouteProps> = ({ component, ...props }) => {
  const { user } = useAuth();
  const newComponent = user ? component : () => <Redirect to="/sign-up" />;

  return <Route component={newComponent} {...props} />;
};

const PublicOnlyRoute: FC<RouteProps> = ({ component, ...props }) => {
  const { user } = useAuth();
  const newComponent = !user ? component : () => <Redirect to="/" />;

  return <Route component={newComponent} {...props} />;
};

function App() {
  const { user, loading } = useAuth();

  // useEffect(() => {
  //   if (loading) return;

  //   firestore.collection("users").doc(user.auth.uid).update({ online: true });
  //   window.onbeforeunload = () => {
  //     firestore
  //       .collection("users")
  //       .doc(user.auth.uid)
  //       .update({ online: false });
  //   };

  //   return () => {
  //     if (loading) return;
  //   };
  // }, [loading]);

  useEffect(() => {
    (async () => {
      const data = (
        await firestore.collection("tests").doc("test1").get()
      ).data();
      const data1 = (
        await firestore
          .collection("tests")
          .doc("test1")
          .collection("testCol")
          .get()
      ).docs;
      console.log("data", data1);
    })();
  }, []);

  if (loading) return <div>Initializing...</div>;

  return (
    <>
      <Router>
        <FriendsServersProvider>
          <IconContext.Provider value={{ style: { verticalAlign: "middle" } }}>
            <Switch>
              <PrivateRoute exact path="/" component={Home} />
              <PublicOnlyRoute path="/sign-up" component={SignUp} />
              <PublicOnlyRoute path="/sign-in" component={SignIn} />
              <PrivateRoute path="/friends/:uid" component={Friends} />
              <PrivateRoute path="/add-friend" component={AddFriend} />
              <PrivateRoute path="/servers/:id" component={Servers} />
              <PrivateRoute path="/communities" component={Communities} />
              <Route path="*" component={NotFound} />
            </Switch>
            <GlobalStyle />
          </IconContext.Provider>
        </FriendsServersProvider>
      </Router>
    </>
  );
}

export default App;
