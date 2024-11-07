import React from 'react'
import Logout from './Logout'
import { useNavigate } from 'react-router-dom'

const Dashboard = ({setIsAuth, setUserName, setEmail, setPhotoURL, username, photoURL, email}) => {

  const navigate = useNavigate();

  function handlePlaylists() {
    navigate('/playlists');
  }

  return (
    <div>
    <img src={photoURL} alt={`${username}'s profile`} />
    <h2>Hello, {username}</h2>
    <h4>Email: {email}</h4>

    <Logout setIsAuth = {setIsAuth} setUserName={setUserName} setEmail={setEmail} setPhotoURL={setPhotoURL}/>
    <br/><br/>
    <button onClick = {() => {handlePlaylists()}}>Go To Playlists</button>
  </div>
  )
}

export default Dashboard