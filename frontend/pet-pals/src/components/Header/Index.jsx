import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { Outlet } from "react-router-dom";
import "./style.css";
import PetPalsLogo from "../../assets/svgs/logo.svg";
import NotificationsNew from "../../assets/svgs/NotificationNew.svg";
import Vector from "../../assets/svgs/Vector.svg";
import { useState, useContext, useEffect } from "react";
import ShelterAccountMenu from "./ShelterAccountMenu";
import LoggedOutAccountMenu from "./LoggedOut";
import SeekerAccountMenu from "./SeekerAccountMenu";
import { LoginContext } from "../../contexts/LoginContext";

const Layout = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const { currentUser, setCurrentUser } = useContext(LoginContext);
  const [notificationsArray, setnotificationsArray] = useState([]);
  const shelter_name = localStorage.getItem("shelter_name");
  const firstname = localStorage.getItem("firstname");

  const shouldDisplayIcons = shelter_name || firstname;

  const navigate = useNavigate();

  const handleNotificationClick = () => {
    // Navigate to the desired page when the Vector icon is clicked
    navigate("/notifications"); // Replace '/your-target-page' with the actual path
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const requestOptions = {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
        };
        const response = await fetch(
          `http://localhost:8000/notifications/?read=false/`,
          requestOptions
        );
        const result = await response.json();
        setnotificationsArray(result?.results);
        console.log(result.results);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <div className="headerBar">
        <Link to="/" style={{ textDecoration: "none" }}>
          <div className="logo">
            <img src={PetPalsLogo} alt="Pet Pals Logo" />
            <h1 id="logoHeading">PetPals</h1>
          </div>
        </Link>

        <div className="accountSection">
          {shelter_name ? (
            <p className="name">Hello, {shelter_name}</p>
          ) : firstname ? (
            <p className="name">Hello, {firstname}</p>
          ) : null}
          {shouldDisplayIcons && notificationsArray?.length > 0 ? (
            <a onClick={() => handleNotificationClick()}>
              <img
                src={NotificationsNew}
                alt="Notifications New"
                style={{ cursor: "pointer" }}
              />
            </a>
          ) : shouldDisplayIcons ? (
            <a onClick={() => handleNotificationClick()}>
              <img src={Vector} alt="Vector" style={{ cursor: "pointer" }} />
            </a>
          ) : null}

          {shelter_name ? (
            <ShelterAccountMenu />
          ) : firstname ? (
            <SeekerAccountMenu />
          ) : (
            <LoggedOutAccountMenu />
          )}
        </div>
      </div>

      <Outlet />
    </>
  );
};

export default Layout;
