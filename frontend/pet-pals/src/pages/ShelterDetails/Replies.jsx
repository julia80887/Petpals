import React, { useEffect, useState } from "react";
import "./style.css";
import { useParams } from "react-router-dom";
import StarSVG from "../../assets/svgs/Star.svg";
import { useNavigate } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";

function Replies({ shelterID, review, reviewID }) {
  const [replies, setReplies] = useState([]);
  const [replyDetails, setReplyDetails] = useState({});
  const [loadingReplies, setLoadingReplies] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [repliesCurrentPage, setRepliesCurrentPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReplyDetails = async () => {
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
          `http://localhost:8000/shelter/${shelterID}/review/${reviewID}/`,
          requestOptions
        );

        const result = await response.json();
        console.log("Review ", reviewID, " replies:  ", result.results);
        setReplies(result.results);
        setTotalPages(
          Math.ceil(
            Number(result.pagination_details["count"]) /
              Number(result.pagination_details["page_size"])
          )
        );
        setLoadingReplies(false);
      } catch (error) {
        setLoadingReplies(false);
        console.error(
          `Error fetching details or replies for Review ${review.id}:`,
          error
        );
      }
    };

    if (review) {
      fetchReplyDetails();
    }
  }, [review]);

  useEffect(() => {
    const fetchReplyDetails = async (reply) => {
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
          `http://localhost:8000/seeker/customuser/${reply.sender}/`,
          requestOptions
        );
        let replyDetail = await response.json();

        setReplyDetails((prevDetails) => ({
          ...prevDetails,
          [reply.id]: replyDetail,
        }));
      } catch (error) {
        console.error(`Error fetching details for Review ${reply.id}:`, error);
      }
    };

    if (replies.length > 0) {
      replies.forEach((reply) => {
        fetchReplyDetails(reply);
      });
    }
  }, [replies]);

  const formatDate = (isoDate) => {
    const options = { month: "long", day: "numeric", year: "numeric" };
    const formattedDate = new Date(isoDate).toLocaleDateString(
      undefined,
      options
    );
    return formattedDate;
  };

  const fetchMoreReplies = async () => {
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
        `http://localhost:8000/shelter/${shelterID}/review/${reviewID}/?page=${
          repliesCurrentPage + 1
        }`,
        requestOptions
      );

      const result = await response.json();
      console.log("Review ", reviewID, " replies:  ", result.results);
      setReplies((prevData) => [...prevData, ...result.results]);
      setRepliesCurrentPage(repliesCurrentPage + 1);
      setLoadingReplies(false);
    } catch (error) {
      setLoadingReplies(false);
      console.error(
        `Error fetching details or replies for Review ${review.id}:`,
        error
      );
    }
  };

  return (
    <>
      <InfiniteScroll
        dataLength={replies.length}
        next={fetchMoreReplies}
        hasMore={repliesCurrentPage < totalPages} // Replace with a condition based on your data source
        loader={<p>Loading...</p>}
        // endMessage={<p>No more replies</p>}
      >
        {loadingReplies ? (
          <p>Loading...</p>
        ) : replies.length === 0 ? (
          <p>No replies available.</p>
        ) : (
          <div className="replyContainer">
            {replies.map((reply, index) => (
              <div
                key={index}
                className="review"
                style={{ justifyContent: "flex-start" }}
              >
                <img
                  className="userProfilePic"
                  src={replyDetails[reply.id]?.profile_photo}
                  style={{ objectFit: "cover" }}
                  alt="User Profile"
                />
                <div className="reviewContent">
                  <div className="reviewerNameDate">
                    <h4 className="reviewerName">
                      {replyDetails[reply.id]?.username}
                    </h4>
                    <h4 className="reviewDate">
                      {formatDate(review.creation_time)}
                    </h4>
                  </div>
                  <p>{reply.content}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </InfiniteScroll>
    </>
  );
}

export default Replies;
