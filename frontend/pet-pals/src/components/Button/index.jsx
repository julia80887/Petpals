import { Button } from "@mui/material";
import React from "react";
import "./style.css";

const MainButton = ({ text, handleClick }) => (
  <button className="mainButton" onClick={() => handleClick()}>
    {text}
  </button>
);

export default MainButton;
