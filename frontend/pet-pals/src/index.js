import React from "react";
import ReactDOM from "react-dom/client";
import { GoogleOAuthProvider } from '@react-oauth/google';
import "./index.css";
import App from "./App";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <GoogleOAuthProvider clientId="832382730471-g6plcs8fd4jbstt1u1fnjbqgtt48o8lv.apps.googleusercontent.com">

    <App />

  </GoogleOAuthProvider >
);
