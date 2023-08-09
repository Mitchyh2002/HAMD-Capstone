import logo from './logo.svg';
import './App.css';
import Content from "./Content"
import { useEffect, useState } from 'react';
import Header from 'Components/Compents';
import Login from 'Components/Login';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  return (
    <div style={{display: 'flex', flexDirection: 'column', height: "100vh"}}>
      <Header />
      {(loggedIn == true)? <Content /> : <Login setLoggedIn={setLoggedIn} />}
    </div>
  );
}

export default App;