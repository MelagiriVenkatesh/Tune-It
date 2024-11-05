import './Playlist.css'
import React, {useState, useEffect} from 'react'
import {useAuth0} from '@auth0/auth0-react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


const Playlist = () => {

  const {user, getAccessTokenSilently, isAuthenticated} = useAuth0();
  const [playlists, setPlaylists] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  function goToDashboard() {
    navigate('/dashboard');
  }

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
  
        const token = await getAccessTokenSilently();

        const response = await axios(`https://www.googleapis.com/youtube/v3/playlists?part=snippet&mine=true`, {
          headers : {
            Authorization : `Bearer ${token}`,
          }
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        setPlaylists(data.items);
      } catch (err) {
        setError(err.message);
      }
    };

    if (isAuthenticated) {
      fetchPlaylists();
    }
  }, [getAccessTokenSilently, isAuthenticated]);


  return (
    <>
      <div>
          <h2>Hello, {user.name}</h2> 
          <button onClick={goToDashboard}>Go To Dashboard</button>
      </div><br/><br/><br/>
    </>
  )
}

export default Playlist