import React, { useEffect, useRef } from "react";
import Modal from "@mui/material/Modal";
import "./style.css";
import { useState } from "react";
import CloseIcon from "../../../assets/svgs/CloseIcon.svg";
import { height } from "@mui/system";

function ChatModal({ open, onClose, review, shelterID, setClicked }) {
  const [chatMessages, setChatMessages] = useState();
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState("seeker");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [inputValue, setInputValue] = useState(""); // New state for input value
  //console.log("in chat", review.id);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSendButtonClick = async () => {
    try {
      // Your shelter ID and review ID (replace them with your actual values)

      const myHeaders = new Headers();
      myHeaders.append(
        "Authorization",
        `Bearer ${localStorage.getItem("access")}`
      );
      myHeaders.append("Content-Type", "application/json");

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify({
          content: inputValue,
        }),
      };

      const response = await fetch(
        `http://localhost:8000/shelter/${shelterID}/review/${review.id}/message/`,
        requestOptions
      );
      console.log("review id: ", review.id);

      // Assuming your API returns the new message in the response
      const newMessage = await response.json();
      console.log("New Message:", newMessage);

      // Clear the input field
      setInputValue("");
      setClicked();
      onClose();

      // Add your logic for handling the new message
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <>
      {
        <Modal
          open={open}
          onClose={onClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div className="chatContainer">
            <div className="chatHeader">
              <h5>Leave a Reply!</h5>
              <div className="closeIcon" onClick={onClose}>
                <img src={CloseIcon} />
              </div>
            </div>
            <div className="bottomBar inputText">
              <textarea
                className="chatInput inputMessage"
                value={inputValue}
                onChange={handleInputChange}
                style={{ borderRadius: "15px", width: "45vw", height: "25vh" }}
              />
            </div>
            <button onClick={handleSendButtonClick} className="sendButton">
              Send
            </button>
          </div>
        </Modal>
      }
    </>
  );
}

export { ChatModal };
