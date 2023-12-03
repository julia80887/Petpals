import React, { useEffect, useState } from "react";
import "./style.css";
import { useParams } from "react-router-dom";
import StarSVG from "../../assets/svgs/Star.svg";
import { useNavigate } from "react-router-dom";
import Replies from "./Replies";

function Reviews({ shelter, shelterID }) {
  const [reviews, setReviews] = useState([]);
  const [reviewDetails, setReviewDetails] = useState({});
  const [showReply, setShowReply] = useState({});
  const [reviewReplies, setReviewReplies] = useState({});
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReviewData = async () => {
      setLoadingReviews(true);
      try {
        if (shelter) {
          const myHeaders = new Headers();
          myHeaders.append(
            "Authorization",
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzAxNjM1MzM4LCJpYXQiOjE3MDE1NDg5MzgsImp0aSI6ImE3NDJiYzUyMzc0NTQ3N2E4MWQ2M2EzOWJkZWY5OTYzIiwidXNlcl9pZCI6MX0.RQlfY5nZhGYtmOlHBw3DC5PSyc3yKzMmeJZnPa2T8wg"
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
          console.log("Shelter Reviews:", result.results);
          setReviews(result.results);
          setTotalPages(
            Math.ceil(
              Number(result.pagination_details["count"]) /
                Number(result.pagination_details["page_size"])
            )
          );
          setLoadingReviews(false);
        }
      } catch (error) {
        setLoadingReviews(false);
        console.error("Error getting reviews:", error);
      }
    };

    if (shelter) {
      fetchReviewData();
    }
  }, [shelter]);

  useEffect(() => {
    const fetchReviewDetails = async (review) => {
      const myHeaders = new Headers();
      myHeaders.append(
        "Authorization",
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzAxNjM1MzM4LCJpYXQiOjE3MDE1NDg5MzgsImp0aSI6ImE3NDJiYzUyMzc0NTQ3N2E4MWQ2M2EzOWJkZWY5OTYzIiwidXNlcl9pZCI6MX0.RQlfY5nZhGYtmOlHBw3DC5PSyc3yKzMmeJZnPa2T8wg"
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
      reviews.forEach((review) => {
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

  const calculateAverageRating = () => {
    const totalReviews = reviews.length;
    let totalStars = 0;

    reviews.forEach((review) => {
      totalStars += parseInt(review.rating);
    });

    return (totalStars / totalReviews).toFixed(1);
  };

  return (
    <>
      {loadingReviews ? (
        <p>Loading...</p>
      ) : reviews.length === 0 ? (
        <p>No reviews available.</p>
      ) : (
        <div className="reviewContainer">
          <div className="reviewHeading">
            <div className="reviewTitleAndStar">
              <img
                src={StarSVG}
                style={{ width: "40px", height: "40px" }}
                alt="Star"
              />
              <h2 className="reviewHeader">
                {calculateAverageRating()} - {reviews.length} Reviews
              </h2>
            </div>
          </div>
          <div>
            {reviews?.map((review, index) => (
              <div
                key={index}
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
                  <p>{review.content}</p>
                  <button onClick={() => toggleReplies(review)}>
                    {showReply[review.id] ? "Hide Replies" : "View Replies"}
                  </button>
                  {showReply[review.id] ? (
                    <Replies
                      shelterID={shelterID}
                      review={review}
                      reviewID={review.id}
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
                  >
                    Reply
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default Reviews;
