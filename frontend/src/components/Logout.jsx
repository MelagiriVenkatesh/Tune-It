import React from 'react'
import axios from 'axios'

const Logout = ({setUserName, setEmail, setPhotoURL, setIsAuth}) => {

  async function handleLogout() {
    await axios.get(`http://localhost:5555/logout`, {
        withCredentials: true,
    });

    setIsAuth((prev) => false);
    setEmail((prev) => '');
    setPhotoURL((prev) => '');
    setUserName((prev) => '');
  }

  return (
    <>
        <button onClick = {() => {handleLogout()}}>Logout</button>
    </>
  )
}

export default Logout