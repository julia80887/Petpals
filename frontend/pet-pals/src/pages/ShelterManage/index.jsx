import React, { useState, useEffect, useMemo, useContext } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useNavigate, useSearchParams } from "react-router-dom";
import { BasicModal } from "../../components/Modal";
import "./style.css";
import Application from "./application";
import { LoginContext } from "../../contexts/LoginContext";
import MainButton from "../../components/Button";

const ShelterManagement = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [pets, setPets] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [mainTotalPages, setMainTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [mainCurrentPage, setMainCurrentPage] = useState(1);
  const { currentUser, setCurrentUser } = useContext(LoginContext);
  const [applicationDetails, setApplicationDetails] = useState({});
  //console.log(currentUser)
  const shelter_name = localStorage.getItem("shelter_name");
  const [page, setPage] = useState(1);
  const [isFetching, setIsFetching] = useState(false);

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
          `Bearer ${localStorage.getItem("access")}`
        );

        // const requestOptions = {
        //     method: "GET"
        // };

        // if (!currentUser.shelter_name) {
        //     navigate('/*')
        // }
        if (!shelter_name) {
          navigate("/*");
        }

        const shelterNameURL = encodeURIComponent(shelter_name);
        console.log("shelter name: ", shelter_name);
        const response = await fetch(
          `http://localhost:8000/pet/?shelter=${shelterNameURL}&page=${mainCurrentPage}&gender=&color=&size=&type=&order_by=&status=`
        );
        const result = await response.json();

        console.log("First call: ", result);
        setPets(result.results);
        setMainTotalPages(
          Math.ceil(
            Number(result.pagination_details["count"]) /
              Number(result.pagination_details["page_size"])
          )
        );

        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Error fetching pets:", error);
      }
    };
    fetchData();
  }, [query]);

  useEffect(() => {
    if (pets) {
      const fetchData = async (pet) => {
        try {
          setLoading(true);
          const { page } = query;
          const myHeaders = new Headers();

          myHeaders.append(
            "Authorization",
            `Bearer ${localStorage.getItem("access")}`
          );

          // const requestOptions = {
          //     method: "GET"
          // };

          // if (!currentUser.shelter_name) {
          //     navigate('/*')
          // }
          // const shelterNameURL = encodeURIComponent(currentUser.shelter_name);
          // console.log("shelter name: ", currentUser.shelter_name);
          const response = await fetch(
            `http://localhost:8000/pet/${pet.id}/applications/`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("access")}`,
              },
            }
          );
          const result = await response.json();

          console.log("First call: ", result.results);

          setApplicationDetails((prevDetails) => ({
            ...prevDetails,
            [pet.id]: result.results,
          }));
          setTotalPages(
            Math.ceil(
              Number(result.pagination_details["count"]) /
                Number(result.pagination_details["page_size"])
            )
          );

          setLoading(false);
        } catch (error) {
          setLoading(false);
          console.error("Error fetching applications:", error);
        }
      };

      pets.forEach((pet) => {
        fetchData(pet);
      });
    }
  }, [pets]);

  const handleScroll = async (event, petID) => {
    const element = event.target;
    // Calculate the scroll position
    const scrollPosition = element.scrollTop;
    const ninetyPercentScroll = 218 * currentPage;
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
          `http://localhost:8000/pet/${petID}/applications/?page=${
            currentPage + 1
          }`,
          requestOptions
        );

        const result = await response.json();
        console.log("Chat messages", result);
        setApplicationDetails((prevApplications) => [
          ...prevApplications,
          ...result?.results,
        ]);
        setCurrentPage((prevPage) => prevPage + 1);
      } catch (error) {
        setLoading(false);
        console.error("Error fetching chat messages:", error);
      }
    }
  };

  const handleMainScroll = () => {
    const mainElement = document.querySelector(".shelterManageMain");

    if (mainElement) {
      const { scrollTop, scrollHeight, clientHeight } = mainElement;

      if (scrollHeight - scrollTop === clientHeight && !isFetching) {
        // User has reached the bottom
        // Trigger paginated call
        const fetchMoreData = async () => {
          try {
            setIsFetching(true);
            const shelterNameURL = encodeURIComponent(shelter_name);
            // Make your paginated API call
            const response = await fetch(
              `http://localhost:8000/pet/?shelter=${shelterNameURL}/?page=${
                page + 1
              }`
            );
            const newData = await response.json();

            // Update state with the new data
            // ...
            setPets(newData.results);
            console.log("new call");

            // Increment the page number
            setPage(page + 1);
          } catch (error) {
            console.error("Error fetching more data:", error);
          } finally {
            setIsFetching(false);
          }
        };
        fetchMoreData();
      }
    }
  };

  useEffect(() => {
    console.log("Printing the pets: ", pets);
  }, [pets]);

  const fetchMorePets = async () => {
    try {
      setLoading(true);
      const { page } = query;
      const myHeaders = new Headers();

      myHeaders.append(
        "Authorization",
        `Bearer ${localStorage.getItem("access")}`
      );

      const shelterNameURL = encodeURIComponent(shelter_name);
      console.log("shelter name: ", shelter_name);
      console.log(mainCurrentPage);
      const response = await fetch(
        `http://localhost:8000/pet/?page=${
          mainCurrentPage + 1
        }&shelter=${shelterNameURL}`
      );
      const result = await response.json();

      console.log("Paginated Pet call: ", result);
      setPets((prevPets) => [...prevPets, ...result.results.flat()]);
      setMainCurrentPage(mainCurrentPage + 1);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching pets:", error);
    }
  };

  return (
    <>
      <InfiniteScroll
        dataLength={pets.length}
        next={fetchMorePets}
        hasMore={mainCurrentPage < mainTotalPages} // Replace with a condition based on your data source
        loader={<p>Loading...</p>}
        endMessage={<p>That's all of your pets!</p>}
      >
        <main className="shelterManageMain">
          <h1 className="pageHeading">Your Pet Listings</h1>
          <div className="pageContent">
            {/* <a
              className="btn"
              style={{
                width: "fit-content",
                height: "fit-content",
                marginLeft: "10px",
                fontSize: "26px",
              }}
              href="PetCreation.html"
              role="button"
            >
              + Add a new pet
            </a> */}
            <MainButton
              style={{
                display: "flex",
                justifySelf: "flex-start",
                margin: "30px",
              }}
              text={"+ Add a new pet"}
              handleClick={() => navigate(`/pet/`)}
            />
            <div className="petListingGrid">
              {pets &&
                pets.map((pet, index) => (
                  <div key={index} className="petGroup">
                    <div className="shelterProfileCard">
                      <div className="shelterProfilePic">
                        <img
                          src={pet.profile_photo}
                          style={{
                            borderRadius: "10px",
                          }}
                        />
                      </div>
                      <div className="shelterProfileCardContents">
                        <p className="cardTextSubHeading">
                          <span className="shelterSpecLabels">Name: </span>{" "}
                          {pet.name}
                        </p>
                        <p className="cardTextSubHeading">
                          <span className="shelterSpecLabels">Breed: </span>{" "}
                          {pet.breed}
                        </p>
                        <p className="cardTextSubHeading">
                          <span className="shelterSpecLabels">Age: </span>{" "}
                          {pet.date_of_birth}
                        </p>
                        <p className="cardTextSubHeading">
                          <span className="shelterSpecLabels">Weight: </span>{" "}
                          {pet.weight} kg
                        </p>
                        <p className="cardTextSubHeading">
                          <span className="shelterSpecLabels">Gender: </span>{" "}
                          {pet.gender}
                        </p>
                        <p className="cardTextSubHeading">
                          <span className="shelterSpecLabels">Status: </span>{" "}
                          {pet.status}
                        </p>
                        <p className="cardTextSubHeading">
                          <span className="shelterSpecLabels">
                            Description:{" "}
                          </span>{" "}
                          {pet.about}
                        </p>
                        {/* <a className="btn" href="UpdatePet.html" role="button">
                        Edit Profile
                      </a> */}
                        <MainButton
                          text={"Edit Profile"}
                          handleClick={() => navigate(`/pet/${pet.id}/edit/`)}
                        />
                      </div>
                    </div>
                    <div
                      className="applications"
                      onScroll={(event) => handleScroll(event, pet.id)}
                    >
                      {applicationDetails &&
                      applicationDetails[pet.id]?.length > 0 ? (
                        applicationDetails[pet.id].map((application, index) => (
                          <Application application={application} key={index} />
                        ))
                      ) : (
                        <p>No applications for {pet.name}</p>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </main>
      </InfiniteScroll>
    </>
  );
};

export default ShelterManagement;
