require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const qs = require('querystring');

const app = express();
const PORT = process.env.PORT;

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

app.get('/userDetails', (req, res) => {
    const refresh_token = req.cookies.refresh_token;

    console.log("refresh_token: \n"+refresh_token+"\n\n");
    
    // If refresh_token is missing, make a request to get it
    if (!refresh_token) {
        (async () => {
            try {
                // Redirect to authcode to get authorization code and access_token, refresh_token
                const response = await axios.get(`http://localhost:${PORT}/api/authcode`);
                const data = response.data;

                // Set cookies after receiving the data
                res.cookie('access_token', data.access_token);
                res.cookie('refresh_token', data.refresh_token);
                res.cookie('username', data.username);
                res.cookie('email', data.email);
                res.cookie('photoURL', data.photoURL);

                // Send the user data response
                res.json({
                    username: data.username,
                    email: data.email,
                    photoURL: data.photoURL,
                });
            } catch (err) {
                console.error("Error during authentication:", err);
                res.status(500).json({ msg: 'Error during the authentication process', error: err.message });
            }
        })();
    } else {
        // Send the user data from cookies if refresh_token exists
        const userData = {
            username: req.cookies.username,
            email: req.cookies.email,
            photoURL: req.cookies.photoURL,
        };

        res.json({ userData });
    }
});

// authcode route - redirects to Google OAuth consent screen
app.get('/api/authcode', (req, res) => {

    
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URI}&response_type=code&scope=${SCOPES}&access_type=offline&prompt=consent`;
    console.log("authUrl:\n"+ authUrl+"\n\n");
    
    res.redirect(authUrl);
});

// access_token, refresh_token & user data
app.get('/api/auth/google/callback', async (req, res) => {
    const { code } = req.query;

    if (!code) {
        return res.status(400).send('Authorization code not provided');
    }

    try {
        // Exchange authorization code for access and refresh tokens
        const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', qs.stringify({
            code,
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            redirect_uri: process.env.REDIRECT_URI,
            grant_type: 'authorization_code',
        }));

        console.log("Token Response:", tokenResponse.data);
        // localStorage.setItem("tokenResponse", tokenResponse);
        console.log("tokenResponse: \n"+tokenResponse+"\n\n");
        
        const { access_token, refresh_token, expires_in } = tokenResponse.data;

        // Fetch user profile information
        const userInfoResponse = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });
        
        // localStorage.setItem("userInfoResponse", userInfoResponse);
        console.log("userInfoResponse: \n"+userInfoResponse+"\n\n");
        
        const user = userInfoResponse.data;

        // Set cookies before sending the response
        res.cookie("username", user.name);
        res.cookie("email", user.email);
        res.cookie("photoURL", user.picture);
        res.cookie("access_token", access_token);
        res.cookie("expires_in", expires_in);
        res.cookie("refresh_token", refresh_token);

        // Send the response with user details
        res.json({
            username: user.name,
            email: user.email,
            photoURL: user.picture,
            access_token,
            refresh_token,
        });
    } catch (err) {
        console.error("Error during token exchange or user info fetch:", err.response ? err.response.data : err);
        res.status(500).json({ message: 'Error occurred during authentication', error: err.message });
    }
});

// Server running
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
