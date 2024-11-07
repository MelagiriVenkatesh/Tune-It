import { useEffect, useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import axios from 'axios';
import Logout from './components/Logout';
import {Navigate, Routes, Route, BrowserRouter} from 'react-router-dom'
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Playlists from './components/Playlists';


function App() {
  const [username, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    (async () => {
      const response = await axios.get(`http://localhost:5555/isAuth`, {
        withCredentials: true,
      });
      const flag = await response.data;
      setIsAuth(flag.success);
    })();
  }, []);

  useEffect(() => {
    (async () => {
       await dataFetching();
    })();
  }, [username, email, photoURL])

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
   
    const authWindow = window.open('http://localhost:5555/userDetails', '_blank', 'width=400,height=600');

    const checkAuthInterval = setInterval(async () => {
      if (authWindow.closed) {
        clearInterval(checkAuthInterval);
        await dataFetching();
      }
    }, 500);
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={isAuth ? <Navigate to="/dashboard"/> : <Login setIsAuth = {setIsAuth} setUserName={setUserName} setEmail={setEmail} setPhotoURL={setPhotoURL}/>}/>
        <Route path="/dashboard" element={isAuth ? <Dashboard setIsAuth = {setIsAuth} setUserName={setUserName} setEmail={setEmail} setPhotoURL={setPhotoURL} username={username} email={email} photoURL={photoURL}/> : <Navigate to="/"/>}/>
        <Route path="/playlists" element={isAuth ? <Playlists/> : <Navigate to="/"/>}/>
      </Routes>
    </BrowserRouter>
  );
}


/* 

    <div>
      {!isAuth && <button onClick={handleLogin}>Sign in with Google</button>}
      {isAuth && (
        <div>
          <img src={photoURL} alt={`${username}'s profile`} />
          <h2>Hello, {username}</h2>
          <h4>Email: {email}</h4>

          <Logout setIsAuth = {setIsAuth} setUserName={setUserName} setEmail={setEmail} setPhotoURL={setPhotoURL}/>
        </div>
      )}
    </div>

*/

export default App;
