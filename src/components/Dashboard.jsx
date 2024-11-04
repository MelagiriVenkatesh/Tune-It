import { useAuth0 } from "@auth0/auth0-react";
import React, { useEffect, useState } from "react";
import Logout from "./Logout";

const Dashboard = () => {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  {console.log('isAuthorized: '+isAuthenticated)}
  const fetchToken = async () => {
    if(isAuthenticated) {
        const access_token = await getAccessTokenSilently({
            audience: 'https://www.googleapis.com/',
            scope: 'https://www.googleapis.com/auth/youtube.readonly',
          });

        const userData = {
            name: user.name,
            email: user.email,
            image: user.picture,
            token: access_token,
        }

        localStorage.setItem('user', JSON.stringify(userData));
    }
  }

  useEffect(() => {
    fetchToken();

  }, [isAuthenticated]);

  return (
    isAuthenticated && (
      <div>
        <img src={user.picture} alt={user.name} />
        <h2>{user.name}</h2>
        <p>{user.email}</p>

        <Logout/>
      </div>
    )
  );
};

export default Dashboard;