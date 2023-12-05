import React, { useEffect, useRef } from "react";
import Modal from "@mui/material/Modal";
import "./style.css";
import { useState } from "react";
import CloseIcon from "../../assets/svgs/CloseIcon.svg";

function ChatModal({ open, onClose, chatDetail }) {
  const [chatMessages, setChatMessages] = useState();
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState("seeker");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  //CAREFUL WITH CHATDETAIL
  useEffect(() => {
    console.log("Chat Detail: ", chatDetail);
    const fetchData = async () => {
      setLoading(true);
      try {
        var myHeaders = new Headers();
        myHeaders.append(
          "Authorization",
          `Bearer ${localStorage.getItem("access")}`
        );

        var requestOptions = {
          method: "GET",
          headers: myHeaders,
        };

        const response = await fetch(
          `http://localhost:8000/pet/applications/chat/${chatDetail.id}/`,
          requestOptions
        );
        const result = await response.json();
        console.log("Chat messages", result);
        setChatMessages(result?.results);
        setTotalPages(
          Math.ceil(
            Number(result.pagination_details["count"]) /
              Number(result.pagination_details["page_size"])
          )
        );
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Error fetching chat messages:", error);
      }
    };

    fetchData();
  }, [chatDetail]);

  useEffect(() => {
    console.log(currentPage);
  }, [currentPage]);

  const handleScroll = async (event) => {
    const element = event.target;
    // Calculate the scroll position
    const scrollPosition = -1 * element.scrollTop;
    const ninetyPercentScroll = 360 * currentPage * 0.9;
    // const ninetyPercentScroll = 0.9 * element;
    console.log("Scroll Position, ", scrollPosition);
    console.log("Ninety Scroll Position, ", ninetyPercentScroll);

    if (scrollPosition >= ninetyPercentScroll && currentPage < totalPages) {
      // Call your function for loading the next page here
      try {
        const myHeaders = new Headers();
        myHeaders.append(
          "Authorization",
          `Bearer ${localStorage.getItem("access")}`
        );

        const requestOptions = {
          method: "GET",
          headers: myHeaders,
        };

        const response = await fetch(
          `http://localhost:8000/pet/applications/chat/1/?page=${
            currentPage + 1
          }`,
          requestOptions
        );

        const result = await response.json();
        console.log("Chat messages", result);
        setChatMessages((prevChatMessages) => [
          ...prevChatMessages,
          ...result?.results,
        ]);
        setCurrentPage((prevPage) => prevPage + 1);
      } catch (error) {
        setLoading(false);
        console.error("Error fetching chat messages:", error);
      }
    }
  };

  return (
    <>
      {loading ? (
        <p>Loading...</p>
      ) : (
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
              <div className="chatUserInfo">
                <img
                  id="imgProfile"
                  src={chatDetail?.user.profile_photo}
                  alt="Profile"
                />
                <h5>{chatDetail?.shelter_name}</h5>
              </div>
              <div className="closeIcon" onClick={onClose}>
                <img src={CloseIcon} />
              </div>
            </div>
            <div className="chatContent" onScroll={handleScroll}>
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
            </div>
            <div className="bottomBar inputText">
              <input className="chatInput inputMessage" />
              <button className="sendButton">Send</button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}

export { ChatModal };
