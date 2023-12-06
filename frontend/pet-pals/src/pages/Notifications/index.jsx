import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ChatModal } from "../../components/Modal";
import SeekerNotifications from "./SeekerNotifications";
import ShelterNotifications from "./ShelterNotifications";
import "./style.css";

const Notifications = () => {
  const [currentUser, setCurrentUser] = useState("");
  useEffect(() => {
    const username = localStorage.getItem("username");
    const shelter_name = localStorage.getItem("shelter_name");
    if (shelter_name) {
      setCurrentUser("shelter");
    } else {
      setCurrentUser("seeker");
    }
  }, []);
  return (
    <>
      {currentUser === "seeker" ? (
        <SeekerNotifications />
      ) : (
        <ShelterNotifications />
      )}
    </>
  );
};

export default Notifications;
