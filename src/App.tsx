import React from 'react';
import { BrowserRouter } from "react-router-dom";
import { Routes, Route, Link } from "react-router-dom";

import LifeInGridView from "./LifeInGridView";
import FormView from "./FormView";
import './App.css';


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LifeInGridView />} />
          <Route path="create" element={<FormView />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
