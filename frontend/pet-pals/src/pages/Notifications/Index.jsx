import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { BasicModal } from "../../components/Modal";
import "./style.css";

const Notifications = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [notificationDetails, setNotificationDetails] = useState({});
  const [totalPages, setTotalPages] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();

  //Modal Hooks
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalChatDetail, setModalChatDetail] = useState();

  const handleOpenModal = (notification) => {
    const chatDetail = notificationDetails[notification.id];
    // Set the chatDetail for the modal
    setModalChatDetail(chatDetail);
    setIsModalOpen(true);
  };
  //

  const query = useMemo(
    () => ({
      page: parseInt(searchParams.get("page") ?? 1),
    }),
    [searchParams]
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { page } = query;

        const myHeaders = new Headers();
        myHeaders.append(
          "Authorization",
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzAxNDkzOTA2LCJpYXQiOjE3MDE0MDc1MDYsImp0aSI6ImYxZjk4ODMxYTMyMzQ3MGQ5YmFlNGM3OTU3ZTZlNTM4IiwidXNlcl9pZCI6MX0.aCPhdy1_9mRjUXWHAs6IMbJgitUIbf8AUm5DZcZspD4" // Replace with a secure way to handle tokens
        );

        const requestOptions = {
          method: "GET",
          headers: myHeaders,
        };

        const response = await fetch(
          `http://localhost:8000/notifications/?page=${page}`,
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

        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Error fetching notifications:", error);
      }
    };

    fetchData();
  }, [query]);

  useEffect(() => {
    if (notifications.length > 0) {
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
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzAxNDkzOTA2LCJpYXQiOjE3MDE0MDc1MDYsImp0aSI6ImYxZjk4ODMxYTMyMzQ3MGQ5YmFlNGM3OTU3ZTZlNTM4IiwidXNlcl9pZCI6MX0.aCPhdy1_9mRjUXWHAs6IMbJgitUIbf8AUm5DZcZspD4" // Replace with a secure way to handle tokens
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
            notificationDetail = await response.json();

            console.log("Third call: ", notificationDetail);
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
        fetchNotificationDetails(notification);
      });
    }
  }, [notifications]);

  const handleNotificationClick = (notification) => {
    if (notification.notification_type === "new_pet") {
      navigate(`${notification.link}`);
    } else if (notification.notification_type === "application_status") {
      const applicationIdMatch = notification.link.match(
        /\/applications\/(\d+)\/$/
      );

      if (applicationIdMatch) {
        const applicationId = applicationIdMatch[1];
        navigate(`/applications/${applicationId}/`);
      }
    } else {
      //Change chat boolean modal to true
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
            <h1 className="pageHeading">Notifications</h1>

            {notifications.length === 0 ? (
              <p>No notifications available.</p>
            ) : (
              <div className="notificationGrid">
                {notifications.map((notification) => (
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
                          src={
                            notificationDetails[notification.id]?.user
                              ?.profile_photo
                          }
                          alt="Profile"
                        />
                      ) : (
                        <img
                          id="imgProfile"
                          src={
                            notificationDetails[notification.id]?.profile_photo
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
                            {notificationDetails[notification.id]
                              ?.shelter_name || "This shelter"}{" "}
                            replied to your chat
                          </h5>
                          <p>{formatDate(notification.date_created)}</p>
                        </>
                      )}
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
      <BasicModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        chatDetail={modalChatDetail}
      />
    </>
  );
};

export default Notifications;
