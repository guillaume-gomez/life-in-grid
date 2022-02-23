import React from 'react';
import { BrowserRouter } from "react-router-dom";
import { Routes, Route, Link } from "react-router-dom";

import NavBar from "./NavBar";
import Footer from "./Footer";
import LifeInGridView from "./LifeInGridView";
import FormView from "./FormView";


function App() {
  return (
      <div className="flex flex-col gap-7">
        <NavBar/>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<LifeInGridView />} />
              <Route path="create" element={<FormView />} />
            </Routes>
          </BrowserRouter>
        <Footer/>
    </div>
  );
}

export default App;
