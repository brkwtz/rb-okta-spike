import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, useHistory } from "react-router-dom";
import { Security, LoginCallback } from "@okta/okta-react";
import { OktaAuth, toRelativeUrl } from "@okta/okta-auth-js";
import Home from "./Home";

const CALLBACK_PATH = "/login/callback";

const config = {
  clientId: "0oa27ldmhzH2MhT9E5d7",
  issuer: "https://dev-16039191.okta.com/oauth2/default",
  redirectUri: "http://localhost:3000/login/callback",
  scopes: ["openid", "profile", "email", "groups"],
  pkce: true,
};

const oktaAuth = new OktaAuth(config);

function App() {
  // const [corsErrorModalOpen, setCorsErrorModalOpen] = React.useState(false);
  const history = useHistory();
  const restoreOriginalUri = async (_oktaAuth, originalUri) => {
    history &&
      history.replace(
        toRelativeUrl(originalUri || "/", window.location.origin)
      );
  };

  return (
    <Router>
      <Security oktaAuth={oktaAuth} restoreOriginalUri={restoreOriginalUri}>
        <Route path={CALLBACK_PATH} component={LoginCallback} />
        <Route path="/" component={Home} />
      </Security>
    </Router>
  );
}

export default App;
