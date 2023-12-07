import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { Outlet } from "react-router-dom";
import "./style.css";
import PetPalsLogo from "../../assets/svgs/logo.svg";
import HasNotification from "../../assets/svgs/HasNotification.svg";
import NoNotification from "../../assets/svgs/NoNotification.svg";
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
  const [loading, setLoading] = useState(false);
  const [prevPicture, setPrevPicture] = useState(
    "http://localhost:8000/media/default.jpg"
  );

  const shouldDisplayIcons = shelter_name || firstname;

  const navigate = useNavigate();
  const [read, setRead] = useState(false);

  const handleNotificationClick = () => {
    // Navigate to the desired page when the Vector icon is clicked
    navigate("/notifications"); // Replace '/your-target-page' with the actual path
  };

  useEffect(() => {
    const checkForProfileAndNotification = async () => {
      try {
        console.log("access", localStorage.getItem("access"));
        console.log("firstname", localStorage.getItem("firstname"));
        console.log("lastname", localStorage.getItem("lastname"));
        console.log("profile_photo", localStorage.getItem("profile_photo"));
        console.log("email", localStorage.getItem("email"));
        console.log("current_user", localStorage.getItem("current_user"));

        if (localStorage.getItem("access")) {
          const requestOptions = {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access")}`,
            },
          };

          const response = await fetch(
            `http://localhost:8000/notifications/?read=false`,
            requestOptions
          );
          const result = await response.json();

          if (result.results && result.results.length > 0) {
            setRead(true);
          } else {
            setRead(false);
          }
          setnotificationsArray(result?.results);

          // checking for shelter profile pic
          if (
            localStorage.getItem("shelter_name") &&
            localStorage.getItem("shelter_name") !== ""
          ) {
            const response = await fetch(
              `http://localhost:8000/shelter/${localStorage.getItem("id")}/`,
              requestOptions
            );
            const result = await response.json();

            if (result?.user?.profile_photo !== prevPicture) {
              setPrevPicture(result?.user?.profile_photo);
            }
          } else if (
            localStorage.getItem("firstname") &&
            localStorage.getItem("firstname") !== ""
          ) {
            // checking for seeker profile pic
            const response = await fetch(
              `http://localhost:8000/seeker/${localStorage.getItem("id")}/`,
              requestOptions
            );
            const result = await response.json();

            if (result?.user?.profile_photo !== prevPicture) {
              setPrevPicture(result?.user?.profile_photo);
            }
          }
        }

        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    if (localStorage.getItem("access")) {
      checkForProfileAndNotification();

      const notificationInterval = setInterval(
        checkForProfileAndNotification,
        10000
      ); // Check every 3s
      setLoading(true);
      return () => clearInterval(notificationInterval);
    }
  }, []);

  if (loading) {
    return <p>Loading....</p>;
  } else {
    return (
      <>
        <div className="headerBar">
          <Link to={"/"} style={{ textDecoration: "none" }}>
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

            {shouldDisplayIcons && read ? (
              <a onClick={() => handleNotificationClick()}>
                <img
                  src={HasNotification}
                  alt="New Notification"
                  style={{ cursor: "pointer" }}
                />
              </a>
            ) : shouldDisplayIcons ? (
              <a onClick={() => handleNotificationClick()}>
                <img
                  src={NoNotification}
                  alt="No Notification"
                  style={{ cursor: "pointer" }}
                />
              </a>
            ) : null}

            {shelter_name ? (
              <ShelterAccountMenu prevPicture={prevPicture} />
            ) : firstname ? (
              <SeekerAccountMenu prevPicture={prevPicture} />
            ) : (
              <LoggedOutAccountMenu />
            )}
          </div>
        </div>

        <Outlet />
      </>
    );
  }
};

export default Layout;
