import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PetDetails from "./pages/PetDetails";
import Applications from "./pages/Applications";
import Home from "./pages/Home";
import "./App.css";
import ShelterDetails from "./pages/ShelterDetails";
import NotFound from "./pages/404";
import Layout from "./components/Header";
import Notifications from "./pages/Notifications";
import ShelterLogin from "./pages/ShelterLogin";
import SeekerLogin from "./pages/SeekerLogin";
import ShelterSignUp from "./pages/ShelterSignUp";
import SeekerSignUp from "./pages/SeekerSignUp";
import { LoginContext, useLoginContext } from "./contexts/LoginContext";
import ShelterProfile from "./pages/ShelterProfile";
import SeekerProfile from "./pages/SeekerProfile";
import CreateApplication from "./pages/CreateApplication";
import ViewEditApplication from "./pages/ViewEditApplication";
import CreatePet from "./pages/CreatePet";
import EditDeletePet from "./pages/EditDeletePet";
import { GoogleOAuthProvider } from "@react-oauth/google";
import ShelterManage from "./pages/ShelterManage";
import Guidance from "./pages/Guidance";

function App() {
  const [currentUser, setCurrentUser] = useState({});

  return (
    <BrowserRouter>
      <GoogleOAuthProvider clientId="832382730471-hkl70jvnciutl8u460v58gd7tvcm4b49.apps.googleusercontent.com">
        <LoginContext.Provider value={{ currentUser, setCurrentUser }}>
          <Routes>
            <Route path="/" element={<Layout />}>
              {/* <Route path="/" element={<Layout />}> */}
              <Route index element={<Home />} />
              <Route path="pet/:pet_id/" element={<PetDetails />} />

              <Route path="pets/" element={<ShelterManage />} />

              <Route path="pet/" element={<CreatePet />} />
              <Route path="pet/:pet_id/edit/" element={<EditDeletePet />} />

              <Route path="notifications/" element={<Notifications />} />
              <Route path="pet/applications/" element={<Applications />} />
              <Route
                path="pet/:pet_id/applications/"
                element={<CreateApplication />}
              />

              <Route path="shelter/login/" exact element={<ShelterLogin />} />
              <Route path="seeker/login/" exact element={<SeekerLogin />} />

              <Route
                path="/pet/:pet_id/applications/:application_id/"
                element={<ViewEditApplication />}
              />

              <Route path="shelter/signup/" exact element={<ShelterSignUp />} />
              <Route path="seeker/signup/" exact element={<SeekerSignUp />} />
              <Route path="shelter/:id/" element={<ShelterDetails />} />
              <Route
                path="profile/shelter/:shelter_id/"
                element={<ShelterProfile />}
              />
              <Route
                path="profile/seeker/:seeker_id/"
                element={<SeekerProfile />}
              />
              <Route
                path="pet/guidance/"
                element={<Guidance />}
              />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </LoginContext.Provider>
      </GoogleOAuthProvider>
    </BrowserRouter>
  );
}

export default App;
