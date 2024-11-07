import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Playlists = () => {
    const [playlists, setPlaylists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedVideoId, setSelectedVideoId] = useState(null); // State to track the selected video ID

    useEffect(() => {
        const fetchPlaylists = async () => {
            try {
                setLoading(true);
                const response = await axios.get('http://localhost:5555/api/youtube/playlists', { withCredentials: true });
                setPlaylists(response.data.playlists);
                setLoading(false);
            } catch (err) {
                setError('Failed to load playlists and videos.');
                setLoading(false);
            }
        };

        fetchPlaylists();
    }, []);

    const handleVideoClick = (videoId) => {
        setSelectedVideoId(videoId); // Set the selected video ID to play in the embedded player
    };

    if (loading) return <div>Loading playlists...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <h1>Your YouTube Playlists and Videos</h1>
            {playlists.map((playlist) => (
                <div key={playlist.id} className="playlist">
                    <h2>{"🖥️  "+playlist.snippet.title+"  PLAYLIST🖥️"}</h2>
                    <div>
                        {playlist.videos.map((video) => (
                            <div key={video.id} onClick={() => handleVideoClick(video.contentDetails.videoId)}>
                                <p><strong>{video.snippet.title}</strong></p>
                                {/* Clicking this will set the selected video for the iframe */}
                                <button>Play Video</button>
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            {selectedVideoId && (
                <div className="video-player">
                    <h3>Now Playing</h3>
                    <iframe
                        width="560"
                        height="315"
                        src={`https://www.youtube.com/embed/${selectedVideoId}`}
                        title="YouTube video player"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </div>
            )}
        </div>
    );
};

export default Playlists;
