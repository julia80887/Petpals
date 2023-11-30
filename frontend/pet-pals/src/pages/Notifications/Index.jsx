import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./style.css";

const Notifications = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [notificationDetails, setNotificationDetails] = useState({});
  const [totalPages, setTotalPages] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();

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
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzAxMzY5OTc2LCJpYXQiOjE3MDEyODM1NzYsImp0aSI6IjAwNWExYmE5OWI3MzRhNGU5NzdhYzRhYjhiMzc4NjY4IiwidXNlcl9pZCI6MX0.PEGExyhreUB8hPkkX_DC5PWKR5nVTVtzt7uTcUz_ajQ" // Replace with a secure way to handle tokens
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

        console.log(result);
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

        console.log("reached 2", notification.link, notification.id);
        const myHeaders = new Headers();
        myHeaders.append(
          "Authorization",
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzAxMzY5OTc2LCJpYXQiOjE3MDEyODM1NzYsImp0aSI6IjAwNWExYmE5OWI3MzRhNGU5NzdhYzRhYjhiMzc4NjY4IiwidXNlcl9pZCI6MX0.PEGExyhreUB8hPkkX_DC5PWKR5nVTVtzt7uTcUz_ajQ" // Replace with a secure way to handle tokens
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
          const notificationDetail = await response.json();

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

        console.log(notificationDetails);
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
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="notificationPic">
                      <img
                        id="imgProfile"
                        src={
                          notificationDetails[notification.id]?.profile_photo ||
                          "this pet"
                        }
                        alt="Profile"
                      />
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
                      ) : null}
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
    </>
  );
};

export default Notifications;
