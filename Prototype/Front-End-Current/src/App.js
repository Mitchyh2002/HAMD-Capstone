import logo from './logo.svg';
import './App.css';
import Content from "./Content"
import { useEffect, useState } from 'react';
import Header from 'Components/Compents';

function App() {
  return (
    <div style={{display: 'flex', flexDirection: 'column', height: "100vh"}}>
      <Header />
      <Content />
    </div>
  );
}

export default App;