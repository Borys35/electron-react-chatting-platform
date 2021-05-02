import React from "react";
import { Link } from "react-router-dom";

export default function Welcome() {
  return (
    <div>
      Welcome
      <Link to="/friends">Friends</Link>
      <Link to="/sign-up">Sign up</Link>
      <Link to="/sign-in">Sign in</Link>
    </div>
  );
}
