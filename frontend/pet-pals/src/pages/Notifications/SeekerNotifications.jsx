import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ChatModal } from "../../components/Modal";
import "./style.css";
import CloseIcon from "../../assets/svgs/CloseIcon.svg";
import FilterButton from "./FilterButton";

const SeekerNotifications = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [notificationDetails, setNotificationDetails] = useState({});
  const [totalPages, setTotalPages] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();
  const [chatSender, setChatSender] = useState();
  const [renderPage, setRenderPage] = useState(true);

  //Modal Hooks
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalChatDetail, setModalChatDetail] = useState();

  const handleOpenModal = (notification) => {
    const chatDetail = notificationDetails[notification.id];
    console.log("Chat Details from Notification: ", chatDetail);
    // Set the chatDetail for the modal
    setModalChatDetail(chatDetail);
    setIsModalOpen(true);
  };

  const query = useMemo(() => {
    const page = parseInt(searchParams.get("page") ?? 1);
    const read = searchParams.get("read") ?? "";

    setRenderPage(true);
    return { page, read };
  }, [searchParams]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { page, read } = query;

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
          // `http://localhost:8000/notifications/?page=${page}&read=${read}`,
          `http://localhost:8000/notifications/?page=${page}&read=${read}`,
          requestOptions
        );
        const result = await response.json();

        console.log("First call: ", result);
        console.log(read);
        setNotifications(result.results);

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
        console.error("Error fetching notifications:", error);
      }
    };

    if (renderPage) {
      fetchData();
    }
  }, [query, renderPage]);

  useEffect(() => {
    if (notifications?.length > 0) {
      const fetchNotificationDetails = async (notification) => {
        const petIdMatch = notification.link.match(
          /\/pet\/(\d+)\/applications\/\d+\/$/
        );

        let endpoint_link = petIdMatch
          ? `/pet/${petIdMatch[1]}/`
          : notification.link;

        const myHeaders = new Headers();
        myHeaders.append(
          "Authorization",
          `Bearer ${localStorage.getItem("access")}`
        );

        try {
          const requestOptions = {
            method: "GET",
            headers: myHeaders,
          };

          const response = await fetch(
            `http://localhost:8000${endpoint_link}`,
            requestOptions
          );
          let notificationDetail = await response.json();

          console.log("Second call: ", notificationDetail);

          if (notification.notification_type === "new_message") {
            const response = await fetch(
              `http://localhost:8000/shelter/${notificationDetail.shelter}/`,
              requestOptions
            );
            const senderDetail = await response.json();

            console.log("Third call: ", senderDetail);

            setChatSender(senderDetail);
          }

          setNotificationDetails((prevDetails) => ({
            ...prevDetails,
            [notification.id]: notificationDetail,
          }));
        } catch (error) {
          console.error(
            `Error fetching details for notification ${notification.id}:`,
            error
          );
        }
      };

      notifications.forEach((notification) => {
        console.log(notification);
        fetchNotificationDetails(notification);
        readNotification(notification);
      });
    }
  }, [notifications]);

  const handleNotificationClick = (notification) => {
    navigate(`${notification.link}`);
  };

  const readNotification = async (notification) => {
    console.log("Updating Notification ...", notification.id);
    const formData = new FormData();
    formData.append("read", true);

    try {
      const myHeaders = new Headers();
      myHeaders.append(
        "Authorization",
        `Bearer ${localStorage.getItem("access")}`
      );
      const requestOptions = {
        method: "PATCH",
        headers: myHeaders,
        body: formData,
      };
      const response = await fetch(
        `http://localhost:8000/notifications/${notification.id}/`,
        requestOptions
      );
      console.log("working");
      console.log(response);
      // <Link to={`/notifications`} />;
    } catch (error) {
      console.error(
        `Error fetching details for notification ${notification.id}:`,
        error
      );
    }
  };

  const handleDeleteNotification = async (notificationID) => {
    console.log("Deleting Notification ...", notificationID);
    try {
      const myHeaders = new Headers();
      myHeaders.append(
        "Authorization",
        `Bearer ${localStorage.getItem("access")}`
      );
      const requestOptions = {
        method: "DELETE",
        headers: myHeaders,
      };
      const response = await fetch(
        `http://localhost:8000/notifications/${notificationID}/`,
        requestOptions
      );

      setRenderPage(true);
    } catch (error) {
      console.error(
        `Error fetching details for notification ${notificationID}:`,
        error
      );
    }
  };

  const formatDate = (isoDate) => {
    const options = { month: "long", day: "numeric", year: "numeric" };
    const formattedDate = new Date(isoDate).toLocaleDateString(
      undefined,
      options
    );
    return formattedDate;
  };
  return (
    <>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="notificationContent">
          <div className="notificationsContainer">
          <div className="applicationHeader" style={{display: "flex", gap: "20px", alignItems: "center"}}>
            <h1 className="pageHeadingApp">Notifications</h1>
            <FilterButton
            setParams={setSearchParams}
            query={query}
          />
          </div>

            {notifications?.length === 0 ? (
              <p>No notifications available.</p>
            ) : (
              <div className="notificationGrid">
                {notifications?.map((notification) => (
                  <div style={{ display: "flex", flexDirection: "row" }}>
                    <div
                      key={notification.id}
                      className="notification"
                      onClick={
                        notification.notification_type === "new_message"
                          ? () => handleOpenModal(notification)
                          : () => handleNotificationClick(notification)
                      }
                    >
                      <div className="notificationPic">
                      
                        {notification.notification_type === "new_message" ? (
                          <img
                            id="imgProfile"
                            src={chatSender?.user?.profile_photo}
                            alt="Profile"
                          />
                        ) : (
                          <img
                            id="imgProfile"
                            src={
                              notificationDetails[notification.id]
                                ?.profile_photo
                            }
                            alt="Profile"
                          />
                        )}
                      </div>

                      <div className="notificationText">
                        {notification.notification_type === "new_pet" ? (
                          <>
                            <h5 className="notificationHeading">
                              Are you ready to give{" "}
                              {notificationDetails[notification.id]?.name ||
                                "this pet"}{" "}
                              their forever home?
                            </h5>
                            <p>{formatDate(notification.date_created)}</p>
                          </>
                        ) : notification.notification_type ===
                          "application_status" ? (
                          <>
                            <h5>Your application has been accepted</h5>
                            <p>{formatDate(notification.date_created)}</p>
                          </>
                        ) : (
                          <>
                            <h5>
                              New message from{" "}
                              {chatSender?.shelter_name || "This shelter"}{" "}
                            </h5>
                            <p>{formatDate(notification.date_created)}</p>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="btn" style={{width: "50px", height: "auto", borderTopRightRadius: "10px",
                  borderTopLeftRadius: "0px", borderBottomRightRadius: "10px", borderBottomLeftRadius: "0px",}}>
                    <button
                      className="closeIcon"
                      onClick={() => handleDeleteNotification(notification.id)}
                    >
                      <img src={CloseIcon} />
                    </button>
                    </div>
                  </div>
                ))}
                <div className="pagination">
                  <div className="paginationButtonContainer">
                    {query.page > 1 && query.page <= totalPages && notifications ? (
                      <button
                        className="paginationButton"
                        onClick={() => {
                          setSearchParams({ ...query, page: query.page - 1 });
                          setRenderPage(true);
                        }}
                      >
                        Previous
                      </button>
                    ) : (
                      <></>
                    )}
                    {query.page < totalPages && notifications ? (
                      <button
                        className="paginationButton"
                        onClick={() => {
                          setSearchParams({ ...query, page: query.page + 1 });
                          setRenderPage(true);
                        }}
                      >
                        Next
                      </button>
                    ) : (
                      <></>
                    )}
                  </div>
                  {!notifications ? (
                    <p className="totalPages">No notifications available.</p>
                  ) : query.page <= totalPages ? (
                    <p className="totalPages">
                      Page {query.page} out of {totalPages}.
                    </p>
                  ) : 
                  <p className="totalPages">Page does not exist.</p>
                  }
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      <ChatModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        chatDetail={modalChatDetail}
        currentUser={"seeker"}
      />
    </>
  );
};

export default SeekerNotifications;
