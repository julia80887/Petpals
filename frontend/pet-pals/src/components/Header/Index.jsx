import React from "react";
import { Outlet } from "react-router-dom";
import "./style.css";
import PetPalsLogo from "../../assets/svgs/logo.svg";
import ProfileButton from "../../assets/svgs/profileButton.svg";
import { useState } from "react";

const Layout = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  return (
    <>
      <div className="headerBar">
        <a style={{ textDecoration: "none" }}>
          <div className="logo">
            <img src={PetPalsLogo} alt="Pet Pals Logo" />
            <h1 id="logoHeading">PetPals</h1>
          </div>
        </a>
        <div className="dropdown profileOptionsDropdown">
          <a data-bs-toggle="dropdown" aria-expanded="false">
            <img
              src={ProfileButton}
              alt="Profile Options"
              id="profileOptions"
            />
          </a>
          {showDropdown && (
            <ul class="dropdown-menu">
              <li>
                <a class="dropdown-item" href="SignupUser.html">
                  Sign up
                </a>
              </li>
              <li>
                <a class="dropdown-item" href="Login.html">
                  Login
                </a>
              </li>
            </ul>
          )}
        </div>
      </div>
      <Outlet />
    </>
  );
};

export default Layout;
