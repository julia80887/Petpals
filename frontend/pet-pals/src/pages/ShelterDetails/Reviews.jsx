import React, { useEffect, useState } from "react";
import "./style.css";
import { useParams } from "react-router-dom";
import StarSVG from "../../assets/svgs/Star.svg";
import { useNavigate } from "react-router-dom";
import Replies from "./Replies";
import InfiniteScroll from "react-infinite-scroll-component";
import { ChatModal } from "./Modal";
import { ReviewModal } from "./ReviewModal";

function Reviews({ shelter, shelterID }) {
  const [reviews, setReviews] = useState([]);
  const [reviewDetails, setReviewDetails] = useState({});
  const [showReply, setShowReply] = useState({});
  const [reviewReplies, setReviewReplies] = useState({});
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [reviewCurrentPage, setReviewCurrentPage] = useState(1);
  const [clicked, setClicked] = useState(false);
  const navigate = useNavigate();
  const [reviewClicked, setReviewClicked] = useState(false);

  // const [isModalOpen, setIsModalOpen] = useState(false);

  // const openModal = () => {
  //   setIsModalOpen(true);
  // };

  const [isModalOpen, setIsModalOpen] = useState({});

  const openModal = (reviewID) => {
    setIsModalOpen((prev) => ({
      ...prev,
      [reviewID]: true,
    }));
  };

  const closeModal = (reviewID) => {
    setIsModalOpen((prev) => ({
      ...prev,
      [reviewID]: false,
    }));
  };

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const handleOpenModal = () => {
    //const chatDetail = notificationDetails[notification.id];
    // Set the chatDetail for the modal
    //setModalChatDetail(chatDetail);
    setIsReviewModalOpen(true);
  };

  useEffect(() => {
    console.log("CURRENT PAGE: ", reviewCurrentPage);
    console.log(" TOTAL PAGES:", totalPages);
  }, [reviewCurrentPage, totalPages]);

  useEffect(() => {
    const fetchReviewData = async () => {
      setLoadingReviews(true);
      setReviewCurrentPage(1);
      try {
        if (shelter) {
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
            `http://localhost:8000/shelter/${shelterID}/review/`,
            requestOptions
          );

          const result = await response.json();
          console.log("REACHED: ", result.results);
          console.log("Shelter Reviews:", result.results);
          setReviews(result.results);
          setTotalPages(
            Math.ceil(
              Number(result.pagination_details["count"]) /
                Number(result.pagination_details["page_size"])
            )
          );
          setLoadingReviews(false);

          if (reviewClicked) {
            setReviewClicked(false);
          }
        }
      } catch (error) {
        setLoadingReviews(false);
        console.error("Error getting reviews:", error);
      }
    };

    if (shelter) {
      fetchReviewData();
    }
  }, [shelter, reviewClicked]);

  useEffect(() => {
    const fetchReviewDetails = async (review) => {
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
          `http://localhost:8000/seeker/customuser/${review.user}/`,
          requestOptions
        );
        let reviewDetail = await response.json();

        setReviewDetails((prevDetails) => ({
          ...prevDetails,
          [review.id]: reviewDetail,
        }));
        setShowReply((prevDetails) => ({
          ...prevDetails,
          [review.id]: false,
        }));
      } catch (error) {
        console.error(`Error fetching details for Review ${review.id}:`, error);
      }
    };

    if (reviews.length > 0) {
      reviews?.forEach((review) => {
        fetchReviewDetails(review);
      });
    }
  }, [reviews]);

  const toggleReplies = async (review) => {
    setShowReply((prevDetails) => ({
      ...prevDetails,
      [review.id]: !prevDetails[review.id],
    }));
  };

  const formatDate = (isoDate) => {
    const options = { month: "long", day: "numeric", year: "numeric" };
    const formattedDate = new Date(isoDate).toLocaleDateString(
      undefined,
      options
    );
    return formattedDate;
  };

  const fetchMoreReviews = async () => {
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
        `http://localhost:8000/shelter/${shelterID}/review/?page=${
          reviewCurrentPage + 1
        }`,
        requestOptions
      );
      const result = await response.json();
      console.log("Shelter Reviews:", result.results);
      console.log("REACHED 1: ", result.results);
      setReviews((prevData) => [...prevData, ...result.results]);
      setReviewCurrentPage(reviewCurrentPage + 1);
      setLoadingReviews(false);
    } catch (error) {
      setLoadingReviews(false);
      console.error("Error getting reviews:", error);
    }
  };

  useEffect(() => {
    console.log("Reviews: ", reviews);
  }, [reviews]);

  // const calculateAverageRating = () => {
  //   const totalReviews = reviews.length;
  //   let totalStars = 0;

  //   reviews?.forEach((review) => {
  //     totalStars += parseInt(review.rating);
  //   });

  //   return (totalStars / totalReviews).toFixed(1);
  // };

  return (
    <>
      <InfiniteScroll
        dataLength={reviews.length}
        next={fetchMoreReviews}
        hasMore={reviewCurrentPage < totalPages} // Replace with a condition based on your data source
        loader={<p>Loading...</p>}
        endMessage={<p>No more reviews</p>}
      >
        {loadingReviews ? (
          <p>Loading...</p>
        ) : reviews.length === 0 ? (
          <p>No reviews available.</p>
        ) : (
          <div className="reviewContainer">
            <div className="reviewHeading">
              <div className="reviewTitleAndStar">
                {/* <h2 className="reviewHeader">
                  {calculateAverageRating()} - {reviews.length} Reviews
                </h2> */}
                <h2 className="reviewHeader">Reviews</h2>
                <button onClick={() => handleOpenModal()}>
                  Leave a Review
                </button>

                <ReviewModal
                  open={isReviewModalOpen}
                  onClose={() => setIsReviewModalOpen(false)}
                  shelterID={shelterID}
                  setClicked={() => setReviewClicked(true)}
                />
              </div>
            </div>
            <div>
              {reviews?.map((review, index) => (
                <div
                  key={review.id}
                  className="review"
                  style={{ justifyContent: "flex-start" }}
                >
                  <img
                    className="userProfilePic"
                    src={reviewDetails[review.id]?.profile_photo}
                    style={{ objectFit: "cover" }}
                    alt="User Profile"
                  />
                  <div className="reviewContent">
                    <div className="reviewerNameDate">
                      <h4 className="reviewerName">
                        {reviewDetails[review.id]?.username}
                      </h4>
                      <h4 className="reviewDate">
                        {formatDate(review.creation_time)}
                      </h4>
                    </div>
                    <div className="rating">
                      <img
                        src={StarSVG}
                        style={{ width: "40px", height: "40px" }}
                        alt="Star"
                      />
                      <p>{review.rating}</p>
                    </div>

                    <p>{review.content}</p>
                    <button onClick={() => toggleReplies(review)}>
                      {showReply[review.id] ? "Hide Replies" : "View Replies"}
                    </button>
                    {showReply[review.id] ? (
                      <Replies
                        shelterID={shelterID}
                        review={review}
                        reviewID={review.id}
                        clicked={clicked}
                        setClicked={() =>
                          setClicked((prevClicked) => !prevClicked)
                        }
                      />
                    ) : null}
                  </div>
                  <div
                    className="bGroup"
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    <button
                      className="btn"
                      role="button"
                      style={{ height: "fit-content", width: "100%" }}
                      id={`openModalButton${index + 1}`}
                      onClick={() => openModal(review.id)}
                    >
                      Reply
                    </button>
                    <ChatModal
                      open={isModalOpen[review.id] || false}
                      onClose={() => closeModal(review.id)}
                      review={review}
                      shelterID={shelterID}
                      setClicked={() => setClicked(true)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </InfiniteScroll>
    </>
  );
}

export default Reviews;
