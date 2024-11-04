import { useAuth0 } from "@auth0/auth0-react";
import React from "react";

const Login = () => {
  const { loginWithRedirect, isAuthenticated } = useAuth0();

  {console.log('isAuthorized: '+isAuthenticated)}

  return (
    
    <button onClick={() => loginWithRedirect({
      scope: 'openid profile email https://www.googleapis.com/auth/youtube.readonly',
    })}>
      Log In
    </button>
  );
};

export default Login;
