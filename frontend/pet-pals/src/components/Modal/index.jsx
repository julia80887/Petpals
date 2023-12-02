import React, { useEffect } from "react";
import Modal from "@mui/material/Modal";
import "./style.css";
import { useState } from "react";

function BasicModal({ open, onClose, chatDetail }) {
  const [chatMessages, setChatMessages] = useState();
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState("seeker");

  //CAREFUL WITH CHATDETAIL
  useEffect(() => {
    console.log("Chat Detail: ", chatDetail);
    const fetchData = async () => {
      setLoading(true);
      try {
        var myHeaders = new Headers();
        myHeaders.append(
          "Authorization",
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzAxNDkzOTA2LCJpYXQiOjE3MDE0MDc1MDYsImp0aSI6ImYxZjk4ODMxYTMyMzQ3MGQ5YmFlNGM3OTU3ZTZlNTM4IiwidXNlcl9pZCI6MX0.aCPhdy1_9mRjUXWHAs6IMbJgitUIbf8AUm5DZcZspD4"
        );

        var requestOptions = {
          method: "GET",
          headers: myHeaders,
        };

        const response = await fetch(
          "http://localhost:8000/pet/applications/chat/1/",
          requestOptions
        );
        const result = await response.json();
        console.log("Chat messages", result);
        setChatMessages(result);
      } catch (error) {
        setLoading(false);
        console.error("Error fetching chat messages:", error);
      }
    };

    fetchData();
  }, [chatDetail]);

  useEffect(() => {
    console.log("Chat Messages: ", chatMessages);
    const subsequentFetchData = async () => {
      try {
        var myHeaders = new Headers();
        myHeaders.append(
          "Authorization",
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzAxNDkzOTA2LCJpYXQiOjE3MDE0MDc1MDYsImp0aSI6ImYxZjk4ODMxYTMyMzQ3MGQ5YmFlNGM3OTU3ZTZlNTM4IiwidXNlcl9pZCI6MX0.aCPhdy1_9mRjUXWHAs6IMbJgitUIbf8AUm5DZcZspD4"
        );

        var requestOptions = {
          method: "GET",
          headers: myHeaders,
        };

        const response = await fetch(
          "http://localhost:8000/pet/applications/chat/1/",
          requestOptions
        );
        const result = await response.json();
        console.log("Chat messages", result);

        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Error fetching processing chat:", error);
      }
    };

    subsequentFetchData();
  }, [chatMessages]);

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className="chatContainer">
          <div className="chatHeader"></div>
          <div className="chatContent">
            <div className="shelterText">
              <p>Yes, he is up for adoption.</p>
            </div>
            <div className="right">
              <div className="userText">
                <p>Okay, fantastic!</p>
              </div>
            </div>
          </div>
          <div className="bottomBar inputText">
            <input className="chatInput inputMessage" />
            <button className="sendButton">Send</button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export { BasicModal };
