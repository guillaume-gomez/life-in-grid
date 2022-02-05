import React from 'react';
import logo from './logo.svg';
import './App.css';
import CustomCanvas from "./CustomCanvas";

function App() {
  return (
    <div className="App">
      <div id="container">
      <h1 id="title">Your life in grid</h1>
      <CustomCanvas />
      <footer></footer>
    </div>
    </div>
  );
}

export default App;
