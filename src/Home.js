import { useOktaAuth } from "@okta/okta-react";
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

const Home = () => {
  const history = useHistory();
  const { authState, oktaAuth } = useOktaAuth();
  console.log("okta auth", oktaAuth);
  console.log("auth state", authState);
  const [userInfo, setUserInfo] = useState(null);
  const [token, setToken] = useState(null);
  const login = () => oktaAuth.signInWithRedirect({ originalUri: "/home" });

  useEffect(() => {
    if (!authState?.isAuthenticated) {
      // When user isn't authenticated, forget any user info
      setUserInfo(null);
      setToken(null);
    } else {
      oktaAuth.getUser().then((info) => {
        setUserInfo(info);
      });
      const tokenB = oktaAuth.getIdToken();
      setToken(tokenB);
    }
  }, [authState, oktaAuth]); // Update if authState changes

  const logout = async () => {
    const basename =
      window.location.origin + history.createHref({ pathname: "/" });
    try {
      await oktaAuth.signOut({ postLogoutRedirectUri: basename });
    } catch (err) {
      // if (isCorsError(err)) {
      //   setCorsErrorModalOpen(true);
      // } else {
      //   throw err;
      // }
    }
  };

  if (!authState) {
    return <div>Loading authentication...</div>;
  } else if (!authState.isAuthenticated) {
    return (
      <div>
        <button
          onClick={login}
          style={{
            padding: 100,
            margin: 100,
            backgroundColor: "purple",
            color: "white",
          }}
        >
          LOG IN WITH THE BIG BUTTON
        </button>
      </div>
    );
  } else if (userInfo) {
    console.log("hello");
    return (
      <div>
        <p>Welcome back, {userInfo.name}!</p>
        <p>Here is all your user info:</p>
        <ul>
          {Object.keys(userInfo).map((key) => (
            <li>{`${key}: ${JSON.stringify(userInfo[key])}`}</li>
          ))}
        </ul>
        <p>Here is your token:</p>
        <p>{token}</p>
        {authState.isAuthenticated && (
          <button
            id="logout-button"
            onClick={logout}
            style={{ width: 200, margin: 20, backgroundColor: "yellow" }}
          >
            Logout with the wiiiiiiide button
          </button>
        )}
      </div>
    );
  } else {
    return (
      <div>
        <p>Something else!</p>
      </div>
    );
  }
};

export default Home;
