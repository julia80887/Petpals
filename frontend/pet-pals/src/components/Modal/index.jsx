import React, { useEffect, useRef } from "react";
import Modal from "@mui/material/Modal";
import "./style.css";
import { useState } from "react";
import CloseIcon from "../../assets/svgs/CloseIcon.svg";

function ChatModal({ open, onClose, chatDetail, currentUser }) {
  const [chatMessages, setChatMessages] = useState();
  const [loading, setLoading] = useState(true);
  const [loadingUser, setLoadingUser] = useState(true);
  const [sender, setSenderUser] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [inputValue, setInputValue] = useState("");
  const [renderPage, setRenderPage] = useState(true);

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
        setRenderPage(false);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Error fetching chat messages:", error);
      }
    };
    if (renderPage) {
      fetchData();
    }
  }, [chatDetail, renderPage]);

  useEffect(() => {
    const fetchSender = async () => {
      setLoadingUser(true);

      let endpoint_link = null;
      if (currentUser === "seeker") {
        endpoint_link = `/shelter/${chatDetail?.shelter}/`;
        console.log("Endpoint Link: ", endpoint_link);
      } else {
        endpoint_link = `/seeker/${chatDetail?.seeker}/`;
        console.log("Endpoint Link: ", endpoint_link);
      }
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
          `http://localhost:8000${endpoint_link}`,
          requestOptions
        );
        const result = await response.json();
        console.log("SENDER: ", result);
        setSenderUser(result);
        setLoadingUser(false);
      } catch (error) {
        setLoadingUser(false);
        console.error("Error fetching chat messages:", error);
      }
    };
    if (currentUser && chatDetail) {
      fetchSender();
    }
  }, [currentUser, chatDetail]);

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

  const handleSendButtonClick = async () => {
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
          content: inputValue,
          message_type: "Comment",
        }),
      };

      const response = await fetch(
        `http://localhost:8000/pet/applications/chat/${chatDetail.id}/message/`,
        requestOptions
      );

      // Assuming your API returns the new message in the response
      const newMessage = await response.json();
      console.log("New Message:", newMessage.data.content);

      // Clear the input field
      setInputValue("");
      setRenderPage(true);
      // Add your logic for handling the new message
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
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
                  src={sender?.user?.profile_photo}
                  alt="Profile"
                />
                <h5>{sender?.shelter_name || sender?.user?.username}</h5>
              </div>
              <div className="closeIcon" onClick={onClose}>
                <img src={CloseIcon} />
              </div>
            </div>
            <div className="chatContent" onScroll={handleScroll}>
              {chatMessages?.map((message, index) => (
                <div key={index}>
                  {message.sender_type === currentUser ? (
                    <div className="right">
                      <div className="userText">
                        <p>{message.content}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="receiverText">
                      <p>{message.content}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="bottomBar inputText">
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
      )}
    </>
  );
}

export { ChatModal };
