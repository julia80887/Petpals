import React, { useEffect, useState } from "react";
import "./style.css";
import { useParams } from "react-router-dom";
import StarSVG from "../../assets/svgs/Star.svg";
import { useNavigate } from "react-router-dom";
import Reviews from "./Reviews";

function ShelterDetails() {
  const { id } = useParams();
  const [shelter, setShelter] = useState({});
  const [reviews, setReviews] = useState([]);
  const [reviewDetails, setReviewDetails] = useState({});
  const [pets, setPets] = useState([]);
  const [loadingShelter, setLoadingShelter] = useState(true);
  const [loadingPets, setLoadingPets] = useState(true);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const navigate = useNavigate();
  const shelter_user = localStorage.getItem("shelter_name") || "";
  const seeker_user = localStorage.getItem("firstname") || "";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const requestOptions = {
          method: "GET",
        };
        const response = await fetch(
          `http://localhost:8000/shelter/${id}/`,
          requestOptions
        );
        const result = await response.json();
        console.log(result);
        setShelter(result);
        setLoadingShelter(false);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    const fetchPetData = async () => {
      setLoadingPets(true);
      if (shelter && shelter.shelter_name) {
        try {
          const requestOptions = {
            method: "GET",
          };
          const shelterNameURL = encodeURIComponent(shelter.shelter_name);
          const response = await fetch(
            `http://localhost:8000/pet/?shelter=${shelterNameURL}&page=1&gender=&color=&size=&type=&order_by=&status=`,
            requestOptions
          );
          const result = await response.json();
          console.log(result);
          setPets(result.results);
          setLoadingPets(false);
        } catch (error) {
          setLoadingPets(false);
          console.error("Error:", error);
        }
      }
    };

    // const fetchReviewData = async () => {
    //   setLoadingReviews(true);
    //   if (shelter) {
    //     try {
    //       var myHeaders = new Headers();
    //       myHeaders.append(
    //         "Authorization",
    //         `Bearer ${localStorage.getItem("access")}`
    //       );

    //       const requestOptions = {
    //         method: "GET",
    //         headers: myHeaders,
    //       };

    //       const response = await fetch(
    //         `http://localhost:8000/shelter/${id}/review/`,
    //         requestOptions
    //       );
    //       const result = await response.json();
    //       setReviews(result.results);
    //       setLoadingReviews(false);
    //     } catch (error) {
    //       setLoadingReviews(false);
    //       console.error("Error getting reviews:", error);
    //     }
    //   }
    // };

    fetchPetData();
    // fetchReviewData();
  }, [shelter]);

  useEffect(() => {
    if (reviews?.length > 0) {
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
          // if (!reviewDetail) {
          return (
            <>
              <p>no.</p>
            </>
          );
          // }

          setReviewDetails((prevDetails) => ({
            ...prevDetails,
            [review.id]: reviewDetail,
          }));
        } catch (error) {
          console.error(
            `Error fetching details for Review ${review.id}:`,
            error
          );
        }
      };

      reviews.forEach((review) => {
        fetchReviewDetails(review);
      });
    }
  }, [reviews]);

  const navigatePetDetail = (petID) => {
    navigate(`/pet/${petID}`);
  };

  const navigateMorePets = () => {
    navigate(`/search/?shelter=${encodeURIComponent(shelter.shelter_name)}`);
  };

  if (loadingShelter || loadingPets) {
    return <p>Loading...</p>;
  }

  return (
    <div className="allContent">
      <div className="pageContent" style={{ alignItems: "center" }}>
        <div className="mainInfo" style={{ width: "90vw", minWidth: "330px" }}>
          <h1 className="mainInfoHeading">{shelter.shelter_name}</h1>
          <img
            src={shelter.user && shelter.user.profile_photo}
            alt=""
            id="oliver"
          />
          <div className="specs">
            <p>
              <span className="specLabels">Location: </span>
              {(shelter.user && shelter.user.address) ||
                "No address available."}
            </p>
            <p>
              <span className="specLabels">Phone Number:</span>{" "}
              {(shelter.user && shelter.user.phone_number) ||
                "No phone number available."}
            </p>
            <p>
              <span className="specLabels">Email Address:</span>{" "}
              {(shelter.user && shelter.user.email) || "No email available."}
            </p>
            <p className="mission">
              <span className="specLabels">Our Mission Statement:</span>{" "}
              {shelter.mission_statement || "No mission statement available."}
            </p>
          </div>
        </div>

        <div className="petListings">
          <h2 className="petListingsHeadings">Our Pets</h2>
          {/* <div class="petListingGrid">
                            {pets.map((pet, index) => (
                                index < 3 && (
                                    <div key={index} className="profileCard">
                                        <div className="profilePic">
                                            <img
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                src={pet.imageSrc}
                                                alt={`Profile picture of ${pet.name}`}
                                            />
                                        </div>
                                        <div className="profileCardText">
                                            <h3 className="cardTextHeading">{pet.name}</h3>
                                            <p className="cardTextSubHeading">{pet.breed}</p>
                                            <p className="cardTextSubHeading">{pet.distance}</p>
                                        </div>
                                        <a className="btn" href="PetDetails.html" role="button">
                                            View Full Profile
                                    </a>
                                    </div>
                                )
                            ))}
                        </div> */}
          <div
            className="petListingGridShelter"
            style={{ flexDirection: "row" }}
          >
            {pets?.length > 0 &&
              pets.map(
                (pet, index) =>
                  index < 3 && (
                    <div key={index} className="petListingCard">
                      <div className="profilePic">
                        <img
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                          src={pet.profile_photo}
                          alt={`Profile picture of ${pet.name}`}
                        />
                      </div>
                      <div className="profileCardText">
                        <h3 className="cardTextHeading">{pet.name}</h3>
                        <p className="cardTextSubHeading">{pet.breed}</p>
                        <p className="cardTextSubHeading">{pet.distance}</p>
                      </div>

                      <button
                        className="btn nextButton"
                        onClick={() => navigatePetDetail(pet.id)}
                        style={{ width: "fit-content" }}
                      >
                        View Full Profile
                      </button>
                    </div>
                  )
              )}
            {pets?.length > 3 && (
              <div className="petListingCard moreAvailable">
                <p className="moreAvailableText">{`+${
                  pets?.length - 3
                } more pets available`}</p>

                <button className="btn" onClick={navigateMorePets}>
                  View More Pets
                </button>
              </div>
            )}

            {pets?.length <= 3 && (
              <div className="petListingCard noMore">
                <p className="noMoreText">No more pets available.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      {seeker_user !== "" || shelter_user !== "" ? (
        <Reviews shelter={shelter} shelterID={id} />
      ) : (
        <h3>Please log in to see reviews.</h3>
      )}
    </div>
  );
}

export default ShelterDetails;
