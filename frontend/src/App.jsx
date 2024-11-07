import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from 'axios'

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
      setIsAuth((prev) => flag.success);
    })();
  }, []);

  async function handleLogin() {
    const response = await axios.get(`http://localhost:5555/userDetails`, {
      withCredentials: true,
    });
    const data = await response.data;

    setUserName((prev) => data.username);
    setEmail((prev) => data.email);
    setPhotoURL((prev) => data.photoURL);
    setIsAuth(true);
  }

  return (
    <div>
      {!isAuth && <button onClick = {async () => await handleLogin()}>Sign in with Google</button>}
      {isAuth  && <h2>Hello, {username}</h2>}
    </div>
  )
}

export default App
