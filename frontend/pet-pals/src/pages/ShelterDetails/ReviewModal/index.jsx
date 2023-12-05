import React, { useEffect, useRef } from "react";
import Modal from "@mui/material/Modal";
import "./style.css";
import { useState } from "react";
import CloseIcon from "../../../assets/svgs/CloseIcon.svg";

function ReviewModal({ open, onClose, shelterID, setClicked }) {
  const [chatMessages, setChatMessages] = useState();
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState("seeker");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [inputValue, setInputValue] = useState(""); // New state for input value
  const [inputRating, setInputRating] = useState(""); // New state for input value
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleRatingChange = (e) => {
    setInputRating(e.target.value);
  };

  const handleSendButtonClick = async () => {
    // Your shelter ID and review ID (replace them with your actual values)
    if (inputRating < 0 || inputRating > 5) {
      setErrorMessage("Rating must be between 0 and 5");
      return;
    } else {
      // Reset the error message if the rating is valid
      setErrorMessage("");
    }

    try {
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
          rating: inputRating.toString(),
          content: inputValue,
        }),
      };

      const response = await fetch(
        `http://localhost:8000/shelter/${shelterID}/review/`,
        requestOptions
      );

      // Assuming your API returns the new message in the response
      const newMessage = await response.json();
      console.log("New Message:", newMessage);

      // Clear the input field
      setInputValue("");
      setInputRating("");
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
              <div className="closeIcon" onClick={onClose}>
                <img src={CloseIcon} />
              </div>
            </div>
            <div className="chatContent">
              <p>{errorMessage}</p>
            </div>
            {/* <div className="chatContent" onScroll={handleScroll}>
              {chatMessages?.map((message, index) => (
                <div key={index}>
                  {message.sender_type === "shelter" ? (
                    <div className="right">
                      <div className="shelterText">
                        <p>{message.content}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="userText">
                      <p>{message.content}</p>
                    </div>
                  )}
                </div>
              ))}
            </div> */}
            <div className="bottomBar inputText">
              <input
                className="chatInput inputMessage"
                type="number"
                value={inputRating}
                onChange={handleRatingChange}
              />
              <input
                className="chatInput inputMessage"
                value={inputValue}
                onChange={handleInputChange}
              />
              <button onClick={handleSendButtonClick} className="sendButton">
                Send
              </button>
            </div>
          </div>
        </Modal>
      }
    </>
  );
}

export { ReviewModal };
