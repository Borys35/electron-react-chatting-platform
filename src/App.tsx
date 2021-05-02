import React, { FC } from "react";
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
import Welcome from "./views/Welcome";
import AddFriend from "./views/AddFriend";
import { useAuth } from "./providers/AuthProvider";

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
  const { loading } = useAuth();

  if (loading) return <div>Initializing...</div>;

  return (
    <>
      <Router>
        <Switch>
          <Route exact path="/" component={Welcome} />
          <PublicOnlyRoute path="/sign-up" component={SignUp} />
          <PublicOnlyRoute path="/sign-in" component={SignIn} />
          <PrivateRoute path="/friends" component={Friends} />
          <PrivateRoute path="/add-friend" component={AddFriend} />
          <PrivateRoute path="/servers" component={Servers} />
          <PrivateRoute path="/communities" component={Communities} />
        </Switch>
      </Router>
      {/* {!user ? <SignUp /> : <Friends />} */}
      <GlobalStyle />
    </>
  );
}

export default App;
