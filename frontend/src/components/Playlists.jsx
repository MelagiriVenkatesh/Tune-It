import React from 'react'
import { useNavigate } from 'react-router-dom'

const Playlists = () => {

  const navigate = useNavigate();
  function handleDashboard() {
    navigate('/dashboard');
  }

  return (
    <>
        <button onClick={() => handleDashboard()}>Go To Dashboard</button>
    </>

  )
}

export default Playlists