import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ChatModal } from "../../components/Modal";
import "./style.css";
import CloseIcon from "../../assets/svgs/CloseIcon.svg";
import FilterButton from "./FilterButton";

const ShelterNotifications = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [notificationDetails, setNotificationDetails] = useState({});
  const [totalPages, setTotalPages] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();
  const [chatSender, setChatSender] = useState();
  const [renderPage, setRenderPage] = useState(true);
  const user_id = localStorage.getItem("id") || "";

  //Modal Hooks
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalChatDetail, setModalChatDetail] = useState();

  const handleOpenModal = (notification) => {
    const chatDetail = notificationDetails[notification.id];
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
          `http://localhost:8000/notifications/?page=${page}&read=${read}`,
          requestOptions
        );
        const result = await response.json();

        console.log("First call: ", result);
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
        console.log("Current notification: ", notification);
        const petIdMatch = notification.link.match(
          /\/pet\/(\d+)\/applications\/\d+\/$/
        );

        let endpoint_link = petIdMatch
          ? `/pet/${petIdMatch[1]}/`
          : notification.notification_type === "review"
          ? `/seeker/customuser/${notification.sender}/`
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
            console.log("Detail: ", notificationDetail);
            const response = await fetch(
              `http://localhost:8000/seeker/${notificationDetail.seeker}/`,
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

      notifications?.forEach((notification) => {
        fetchNotificationDetails(notification);
        readNotification(notification);
      });
    }
  }, [notifications]);

  const handleNotificationClick = (notification) => {
    if (notification.notification_type == "review") {
      navigate(`/shelter/${user_id}/`)
    } else {
      navigate(`${notification.link}`);
    }
    // if (notification.notification_type === "new_pet") {
    //   navigate(`${notification.link}`);
    // } else if (notification.notification_type === "new_application") {
    //   const applicationIdMatch = notification.link.match(
    //     /\/applications\/(\d+)\/$/
    //   );

    //   if (applicationIdMatch) {
    //     const applicationId = applicationIdMatch[1];
    //     navigate(`/applications/${applicationId}/`);
    //   }
    // }
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
            <div
              className="applicationHeader"
              style={{
                display: "flex",
                gap: "20px",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <h1 className="pageHeadingApp">Notifications</h1>
              <FilterButton setParams={setSearchParams} query={query} />
            </div>
            {notifications?.length === 0 ? (
              <p className="noMoreText" style={{ margin: "20px" }}>
                No notifications available.
              </p>
            ) : (
              <div className="notificationGrid">
                {notifications?.map((notification, index) => (
                  <div
                    key={index}
                    style={{ display: "flex", flexDirection: "row" }}
                  >
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
                        {notification.notification_type ===
                        "new_application" ? (
                          <>
                            <h5 className="notificationHeading">
                              New application for{" "}
                              {notificationDetails[notification.id]?.name ||
                                "this pet"}{" "}
                            </h5>
                            <p>{formatDate(notification.date_created)}</p>
                          </>
                        ) : notification.notification_type === "review" ? (
                          <>
                            <h5>
                              You received a review from{" "}
                              {chatSender?.username || "this user"}{" "}
                            </h5>
                            <p>{formatDate(notification.date_created)}</p>
                          </>
                        ) : (
                          <>
                            <h5>
                              New message from{" "}
                              {chatSender?.user?.username || "this user"}{" "}
                            </h5>
                            <p>{formatDate(notification.date_created)}</p>
                          </>
                        )}
                      </div>
                    </div>
                    <div
                      className="btn"
                      style={{
                        width: "50px",
                        height: "auto",
                        borderTopRightRadius: "10px",
                        borderTopLeftRadius: "0px",
                        borderBottomRightRadius: "10px",
                        borderBottomLeftRadius: "0px",
                      }}
                    >
                      <div
                        className="closeIcon"
                        onClick={() =>
                          handleDeleteNotification(notification.id)
                        }
                      >
                        <img src={CloseIcon} />
                      </div>
                    </div>
                  </div>
                ))}
                <div className="pagination">
                  <div className="paginationButtonContainer">
                    {query.page > 1 && query.page <= totalPages ? (
                      <button
                        className="paginationButton"
                        onClick={() =>
                          setSearchParams({ ...query, page: query.page - 1 })
                        }
                      >
                        Previous
                      </button>
                    ) : (
                      <></>
                    )}
                    {query.page < totalPages ? (
                      <button
                        className="paginationButton"
                        onClick={() =>
                          setSearchParams({ ...query, page: query.page + 1 })
                        }
                      >
                        Next
                      </button>
                    ) : (
                      <></>
                    )}
                  </div>
                  {query.page <= totalPages ? (
                    <p className="totalPages">
                      Page {query.page} out of {totalPages}.
                    </p>
                  ) : (
                    <p className="totalPages">Page does not exist.</p>
                  )}
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
        currentUser={"shelter"}
      />
    </>
  );
};

export default ShelterNotifications;
