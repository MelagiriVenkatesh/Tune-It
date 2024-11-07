// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom'
// import Playlist from './Playlist';

// const Playlists = () => {
//     const [playlists, setPlaylists] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     const navigate = useNavigate();
//     function handleDashboard() {
//         navigate('/dashboard');
//     }

//     useEffect(() => {
//         const fetchPlaylists = async () => {
//             try {
//                 // Make a request to the backend to get the playlists
//                 const response = await axios.get('http://localhost:5555/api/youtube/playlists', { withCredentials: true });

//                 // Set the playlists data to state
//                 setPlaylists(response.data.items);
//                 setLoading(false);
//             } catch (err) {
//                 // Handle error if there's any
//                 console.error('Error fetching playlists:', err);
//                 setError('Error fetching playlists');
//                 setLoading(false);
//             }
//         };

//         fetchPlaylists();
//     }, []);  // Empty dependency array ensures this runs once when the component mounts

//     if (loading) {
//         return <div>Loading playlists...</div>;
//     }

//     if (error) {
//         return <div>{error}</div>;
//     }

//     return (
//         <div>
//             <button onClick={() => handleDashboard()}>Go To Dashboard</button>
//             <h2>Your YouTube Playlists</h2>
//             <div>
//                 {playlists.map((playlist) => (
//                     <Playlist playlist={playlist}/>
//                 ))}
//             </div>
//         </div>
//     );
// };

// export default Playlists;


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Playlist from './Playlist';

const Playlists = () => {
    const [playlists, setPlaylists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();
    function handleDashboard() {
        navigate('/dashboard');
    }

    useEffect(() => {
        const fetchPlaylists = async () => {
            try {
                // Make a request to the backend to get the playlists
                const response = await axios.get('http://localhost:5555/api/youtube/playlists', { withCredentials: true });

                // Set the playlists data to state
                setPlaylists(response.data.items);
                setLoading(false);
            } catch (err) {
                // Handle error if there's any
                console.error('Error fetching playlists:', err);
                setError('Error fetching playlists');
                setLoading(false);
            }
        };

        fetchPlaylists();
    }, []);  // Empty dependency array ensures this runs once when the component mounts

    if (loading) {
        return <div>Loading playlists...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <button onClick={handleDashboard}>Go To Dashboard</button>
            <h2>Your YouTube Playlists</h2>
            <div>
                {playlists.map((playlist) => (
                    <Playlist key={playlist.id} playlist={playlist} />
                ))}
            </div>
        </div>
    );
};

export default Playlists;
