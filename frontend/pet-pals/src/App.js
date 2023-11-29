import { BrowserRouter, Routes, Route } from "react-router-dom";
import PetDetails from "./pages/PetDetails";
import Home from "./pages/Home";
import "./App.css";
import ShelterDetails from "./pages/ShelterDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="/" element={<Layout />}> */}
        <Route index element={<Home />} />
        <Route path="pet/details/" element={<PetDetails />} />
        {/* <Route path="shelter/details/" element={<ShelterDetails />} /> */}
        {/* </Route> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
