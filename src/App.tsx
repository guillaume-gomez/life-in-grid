import React, { useState } from 'react';
import './App.css';
import LifeGridCanvas from "./LifeGridCanvas";

const deathAge = 90;

function App() {
  const [birthday] = useState<Date>(new Date(1992, 1, 2));
  const [forecastDeath] = useState<Date>(new Date(1992 + deathAge, 1, 2));
  return (
    <div className="App">
      <div id="container">
      <h1 id="title">Your life in grid</h1>
      <LifeGridCanvas deathDate={forecastDeath} birthdayDate={birthday} />
      <footer></footer>
    </div>
    </div>
  );
}

export default App;
