import React from 'react';
import { BrowserRouter } from "react-router-dom";
import { Routes, Route } from "react-router-dom";

import NavBar from "./Components/NavBar";
import Footer from "./Components/Footer";
import LifeInGridView from "./LifeInGridView";
import FormView from "./FormView";


function App() {
  return (
    <div className="flex flex-col gap-7">
      <BrowserRouter>
        <NavBar/>
          <div className="p-3 ">
              <Routes>
                  <Route path="/" element={<LifeInGridView />} />
                  <Route path="create" element={<FormView />} />
                  <Route path="*" element={<LifeInGridView />} />
              </Routes>
          </div>
        <Footer/>
      </BrowserRouter>
    </div>
  );
}

export default App;
