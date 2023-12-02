import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PetDetails from "./pages/PetDetails";
import Applications from "./pages/Applications";
import Home from "./pages/Home";
import "./App.css";
import ShelterDetails from "./pages/ShelterDetails";
import NotFound from "./pages/404/Index";
import Layout from "./components/Header/Index";
import ShelterLogin from "./pages/ShelterLogin";
import SeekerLogin from "./pages/SeekerLogin";
import ShelterSignUp from "./pages/ShelterSignUp";
import SeekerSignUp from "./pages/SeekerSignUp";
import { LoginContext, useLoginContext } from './contexts/LoginContext';

function App() {
  const [currentUser, setCurrentUser] = useState({});

  return (
    <BrowserRouter>
      <LoginContext.Provider value={{ currentUser, setCurrentUser }}>
        <Routes>

          <Route path="/" element={<Layout />}>
            {/* <Route path="/" element={<Layout />}> */}
            <Route index element={<Home />} />
            <Route path="pet/details/" element={<PetDetails />} />
            <Route path="pet/applications/" element={<Applications />} />
            <Route path="/shelter/login/" exact element={<ShelterLogin />} />
            <Route path="/seeker/login/" exact element={<SeekerLogin />} />

            <Route path="/shelter/signup/" exact element={<ShelterSignUp />} />
            <Route path="/seeker/signup/" exact element={<SeekerSignUp />} />

            <Route path="shelter/:id/" element={<ShelterDetails />} />
            <Route path="*" element={<NotFound />} />

          </Route>
        </Routes>
      </LoginContext.Provider>

    </BrowserRouter>
  );
}

export default App;