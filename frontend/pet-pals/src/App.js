import { BrowserRouter, Routes, Route } from "react-router-dom";
import PetDetails from "./pages/PetDetails";
import Home from "./pages/Home";
import "./App.css";
import ShelterDetails from "./pages/ShelterDetails";
import NotFound from "./pages/404/Index";
import Layout from "./components/Header/Index";
import Notifications from "./pages/Notifications/Index";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="pet/:petID/" element={<PetDetails />} />
          <Route path="notifications/" element={<Notifications />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
