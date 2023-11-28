import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import PetDetails from "./pages/PetDetails";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <PetDetails />
  </React.StrictMode>
);
