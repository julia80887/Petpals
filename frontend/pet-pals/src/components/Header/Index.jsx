import React from "react";
import { useNavigate } from 'react-router-dom';
import { Outlet } from "react-router-dom";
import "./style.css";
import PetPalsLogo from "../../assets/svgs/logo.svg";
import NotificationsNew from "../../assets/svgs/NotificationNew.svg";
import Vector from "../../assets/svgs/Vector.svg";
import { useState, useContext, useEffect } from "react";
import ShelterAccountMenu from "./ShelterAccountMenu";
import LoggedOutAccountMenu from "./LoggedOut";
import SeekerAccountMenu from "./SeekerAccountMenu";
import { LoginContext } from '../../contexts/LoginContext';

const Layout = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const { currentUser, setCurrentUser } = useContext(LoginContext);
  const [notificationsArray, setnotificationsArray] = useState([]);
  const shouldDisplayIcons = currentUser.shelter_name || currentUser.firstname;

  console.log(currentUser)


  useEffect(() => {
    const fetchData = async () => {
      try {
        const requestOptions = {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access')}`,
          },

        };
        const response = await fetch(`http://localhost:8000/notifications/?read=false/`, requestOptions);
        const result = await response.json();
        setnotificationsArray(result?.results);
        console.log(result.results)
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchData();

  }, []);



  return (
    <>
      <div className="headerBar">
        <a style={{ textDecoration: "none" }}>
          <div className="logo">
            <img src={PetPalsLogo} alt="Pet Pals Logo" />
            <h1 id="logoHeading">PetPals</h1>
          </div>
        </a>
        <div className="accountSection">
          {currentUser.shelter_name ? (
            <p className="name">Hello, { currentUser.shelter_name}</p>
          ) : currentUser.firstname ? (
            <p className="name">Hello, { currentUser.firstname}</p>
          ) : null}
          {shouldDisplayIcons && notificationsArray.length > 0 ? (
            <img src={NotificationsNew} alt="Notifications New" />
          ) : shouldDisplayIcons ? (
            <img src={Vector} alt="Vector" />
          ) : null}

          {currentUser.shelter_name ? (
            <ShelterAccountMenu />
          ) : currentUser.firstname ? (
            <SeekerAccountMenu />
          ) : (
                <LoggedOutAccountMenu />
              )}
        </div>
        {/* THIS NEEDS TO BE MADE INTO A BUTTON */}
        {/* <div className="dropdown profileOptionsDropdown">
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
        </div> */}
      </div>
      <Outlet />
    </>
  );
};

export default Layout;