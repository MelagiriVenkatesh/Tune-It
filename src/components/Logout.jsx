import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const { logout } = useAuth0();
  const navigate = useNavigate(); // Hook to navigate

  const doLogout = () => {
    localStorage.removeItem('user');
    logout({ returnTo: window.location.origin }); 
    navigate("/"); 
  }

  return (
    <button onClick={doLogout}>
      Log Out
    </button>
  );
};

export default Logout;
