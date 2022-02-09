import React, { useState } from 'react';
import './App.css';
import LifeGridCanvas from "./LifeGridCanvas";

const deathAge = 10;
const periods = [
  { name: "pre-school", color: "yellow", start: new Date("1995-09-01"), end: new Date("1998-06-01") },
  { name: "middle-school", color: "green", start: new Date("1998-09-01"), end: new Date("2003-06-01") },
  { name: "high-school", color: "brown", start: new Date("2003-09-01"), end: new Date("2007-06-01") },
  { name: "college", color: "purple", start: new Date("2007-09-01"), end: new Date("2010-06-01") },
  { name: "IT-schools", color: "pink", start: new Date("2010-09-01"), end: new Date("2015-06-01") },
  { name: "Applidget", color: "#FF09F9", start: new Date("2015-08-01"), end: new Date("2017-11-01") },
  { name: "Amuse", color: "#F109F9", start: new Date("2017-11-01"), end: new Date("2021-12-15") },
  { name: "Ecotree", color: "#F10919", start: new Date("2022-01-03"), end: new Date("2022-02-22") },
]

function App() {
  // february is 1 for month number.
  const [birthday] = useState<Date>(new Date(1992, 1, 2));
  const [forecastDeath] = useState<Date>(new Date(1992 + deathAge, 1, 2));
  return (
    <div className="App">
      <div id="container">
      <h1 id="title">Your life in grid</h1>
      <LifeGridCanvas deathDate={forecastDeath} birthdayDate={birthday} periods={periods} />
      <footer></footer>
    </div>
    </div>
  );
}

export default App;
