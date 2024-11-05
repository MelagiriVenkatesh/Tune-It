import React from 'react'
import { useNavigate } from 'react-router-dom'

const YouTube = () => {

  const navigate = useNavigate();
  function goToPlaylist() {
    navigate("/playlist");
  }

  return (
    
    <button onClick={() => goToPlaylist()}>Explore Playlists</button>
  )
}

export default YouTube