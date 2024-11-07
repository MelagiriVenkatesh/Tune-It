import axios from 'axios';
import React from 'react'

const Login = ({setIsAuth, setUserName, setEmail, setPhotoURL}) => {

    async function dataFetching() {
        const response = await axios.get(`http://localhost:5555/userDetails`, {
          withCredentials: true,
        });
        const data = await response.data;
    
        setUserName((prev) => data.username);
        setEmail((prev) => data.email);
        setPhotoURL((prev) => data.photoURL);
        setIsAuth((prev) => true);
    }

    function handleLogin() {

        const authWindow = window.open('http://localhost:5555/userDetails', '_blank', 'width=450,height=600');
        const checkAuthInterval = setInterval(async () => {
            if (authWindow.closed) {
                clearInterval(checkAuthInterval);
                await dataFetching();
            }
        }, 500);
    }

  return (
    <button onClick={handleLogin}>Sign in with Google</button>
  )
}

export default Login