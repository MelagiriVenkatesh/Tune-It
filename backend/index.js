require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const qs = require('querystring');

const app = express();
const PORT = process.env.PORT || 5555;

app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: `http://localhost:3333`,
}));

const SCOPES = [
    'profile',
    'email',
    'https://www.googleapis.com/auth/youtube.readonly',
].join(' ');


// Route to fetch YouTube playlists
// app.get('/api/youtube/playlists', async (req, res) => {
//     const access_token = req.cookies.access_token; 

//     if (!access_token) {
//         return res.status(401).json({ message: 'Access token is missing. Please log in.' });
//     }

//     try {
//         // Fetch the user's playlists from the YouTube API
//         const response = await axios.get('https://www.googleapis.com/youtube/v3/playlists', {
//             headers: {
//                 Authorization: `Bearer ${access_token}`, // Authorization header with the access token
//             },
//             params: {
//                 part: 'snippet',  // Required to fetch playlist details
//                 mine: 'true',     // Ensures it only returns the authenticated user's playlists
//             },
//         });

//         const data = await response.data;
//         res.json(data);

//     } catch (error) {
//         console.error('Error fetching YouTube playlists:', error.response ? error.response.data : error.message);
//         res.status(500).json({ message: 'Error fetching YouTube playlists', error: error.message });
//     }
// });

app.get('/api/youtube/playlists', async (req, res) => {
    const access_token = req.cookies.access_token;

    if (!access_token) {
        return res.status(401).json({ message: 'Not authenticated' });
    }

    try {
        // Step 1: Get the playlists
        const playlistsResponse = await axios.get('https://www.googleapis.com/youtube/v3/playlists', {
            params: {
                part: 'snippet,contentDetails',
                mine: true,
            },
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });

        const playlists = playlistsResponse.data.items;

        // Step 2: Fetch videos for each playlist
        const playlistsWithVideos = await Promise.all(
            playlists.map(async (playlist) => {
                const playlistId = playlist.id;

                let videos = [];
                let nextPageToken = null;

                // Fetch videos for each playlist, handling pagination
                do {
                    const videosResponse = await axios.get('https://www.googleapis.com/youtube/v3/playlistItems', {
                        params: {
                            part: 'snippet,contentDetails',
                            playlistId: playlistId,
                            pageToken: nextPageToken, // Pagination token for next page
                        },
                        headers: {
                            Authorization: `Bearer ${access_token}`,
                        },
                    });

                    // Add the videos from the current page
                    videos = videos.concat(videosResponse.data.items);

                    // Get the nextPageToken if available, for the next request
                    nextPageToken = videosResponse.data.nextPageToken;
                } while (nextPageToken); // Keep fetching until there are no more pages

                return {
                    ...playlist,
                    videos,
                };
            })
        );

        res.json({ playlists: playlistsWithVideos });
    } catch (error) {
        console.error('Error fetching playlists or videos:', error.message);
        res.status(500).json({ message: 'Failed to fetch playlists or videos', error: error.message });
    }
});


app.get('/logout', (req, res) => {
    // Set cookies with the same name but expired date to immediately remove them
    res.cookie('username', '', { expires: new Date(0), httpOnly: true });
    res.cookie('email', '', { expires: new Date(0), httpOnly: true });
    res.cookie('photoURL', '', { expires: new Date(0), httpOnly: true });
    res.cookie('access_token', '', { expires: new Date(0), httpOnly: true });
    res.cookie('expires_in', '', { expires: new Date(0), httpOnly: true });
    res.cookie('refresh_token', '', { expires: new Date(0), httpOnly: true });

    // Send a response after clearing cookies
    res.json({ message: 'Cookies cleared successfully' });
});


// Check if the user is authenticated
app.get('/isAuth', (req, res) => {
    const refresh_token = req.cookies.refresh_token;
    res.json({ success: !!refresh_token });
});

// Redirects to Google for authentication if no refresh token is found
app.get('/userDetails', (req, res) => {
    const refresh_token = req.cookies.refresh_token;

    if (!refresh_token) {
        const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URI}&response_type=code&scope=${SCOPES}&access_type=offline&prompt=consent`;
        return res.redirect(authUrl); // Redirect to Google OAuth
    }

    // If refresh_token exists, send user info from cookies
    const { username, email, photoURL } = req.cookies;
    res.json({ username, email, photoURL });
});

// Handles callback from Google and retrieves access & refresh tokens
app.get('/api/auth/google/callback', async (req, res) => {
    const { code } = req.query;

    if (!code) {
        return res.status(400).send('Authorization code not provided');
    }

    try {
        // Exchange code for tokens
        const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', qs.stringify({
            code,
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            redirect_uri: process.env.REDIRECT_URI,
            grant_type: 'authorization_code',
        }));

        const { access_token, refresh_token, expires_in } = tokenResponse.data;

        // Fetch user profile information
        const userInfoResponse = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: { Authorization: `Bearer ${access_token}` },
        });

        const user = userInfoResponse.data;

        // Set user details and tokens in cookies
        res.cookie("username", user.name);
        res.cookie("email", user.email);
        res.cookie("photoURL", user.picture);
        res.cookie("access_token", access_token, { httpOnly: true });
        res.cookie("expires_in", expires_in, { httpOnly: true });
        res.cookie("refresh_token", refresh_token, { httpOnly: true });

        // Redirect back to the frontend or send a message
        res.send('<script>window.close();</script>'); // Closes the OAuth window
    } catch (err) {
        console.error("Error during token exchange or user info fetch:", err.response ? err.response.data : err);
        res.status(500).json({ message: 'Error during authentication', error: err.message });
    }
});

// Server running
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
