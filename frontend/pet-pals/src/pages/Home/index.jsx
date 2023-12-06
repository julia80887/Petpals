import React, { useEffect, useState, useContext, useMemo } from "react";
import "./style.css";
import DogSVG from "../../assets/svgs/Dog.svg";
import CatSVG from "../../assets/svgs/Cat.svg";
import OtherAnimalsSVG from "../../assets/svgs/otherAnimals.svg";
import ShelterSVG from "../../assets/svgs/animalShelter.svg";
import SliderIconSVG from "../../assets/svgs/Slider.svg";
import FilterButton from "./FilterButton";
import FilterBar from "./FilterBar";
import { FilterModal } from "./FilterModal";
import SortButton from "./SortButton";
import { LoginContext } from "../../contexts/LoginContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";

function Home() {
  const [petListings, setPetListings] = useState([]);
  const [shelterList, setShelterList] = useState([]);
  const { currentUser } = useContext(LoginContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [retrievalType, setRetrievalType] = useState("Pets");
  const [showFilterModal, setShowFilterModal] = useState(false);
  // const [filterModalDict, setFilterModalDict] = useState({});
  const [completeShelterList, setCompleteShelterList] = useState([]);

  // useSearchParams returns a URLSearchParams object
  const [searchParams, _setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const query = useMemo(() => {
    const type = searchParams.get("type") ?? "";
    const shelter = searchParams.get("shelter") ?? "";
    const gender = searchParams.get("gender") ?? "";
    const color = searchParams.get("color") ?? "";
    const lt_size = searchParams.get("lt_size") ?? "";
    const gt_size = searchParams.get("gt_size") ?? "";
    const status = searchParams.get("status") ?? "";
    const order_by = searchParams.get("order_by") ?? "name";

    return {
      type,
      shelter,
      gender,
      color,
      lt_size,
      gt_size,
      status,
      order_by,
    };
  }, [searchParams]);

  useEffect(() => {
    //setSearchParams on render
    _setSearchParams({
      type: query.type,
      shelter: query.shelter,
      gender: query.gender,
      color: query.color,
      lt_size: query.lt_size,
      gt_size: query.gt_size,
      status: query.status,
      order_by: query.order_by,
    });

    console.log("Logged in user: ", localStorage.getItem("shelter_name"));
    console.log("Logged in user: ", localStorage.getItem("id"));

    const fetchData = async () => {
      try {
        const requestOptions = {
          method: "GET",
        };

        let response = null;

        response = await fetch(
          `http://localhost:8000/shelter/`,
          requestOptions
        );

        const result = await response.json();
        setCompleteShelterList(result.map((item) => item.shelter_name));
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    console.log("Retrieval type: ", retrievalType);
    const fetchData = async () => {
      try {
        const requestOptions = {
          method: "GET",
        };
        const {
          type,
          shelter,
          gender,
          color,
          lt_size,
          gt_size,
          status,
          order_by,
        } = query;

        let response = null;

        if (retrievalType === "Pets") {
          response = await fetch(
            `http://localhost:8000/pet/?page=${currentPage}&shelter=${shelter}&gender=${gender}&color=${color}&lt_size=${lt_size}&gt_size=${gt_size}&type=${type}&status=${status}&order_by=${order_by}`,
            requestOptions
          );

          const result = await response.json();

          setTotalPages(
            Math.ceil(
              Number(result.pagination_details["count"]) /
                Number(result.pagination_details["page_size"])
            )
          );

          console.log("Pets: ", result.results);

          // Append new data to existing data
          setPetListings(result.results);
        } else {
          response = await fetch(
            `http://localhost:8000/shelter/`,
            requestOptions
          );

          const result = await response.json();
          console.log("Shelters: ", result);
          setShelterList(result);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchData();
  }, [query, retrievalType]);

  const fetchMore = async () => {
    try {
      const requestOptions = {
        method: "GET",
      };
      const {
        type,
        shelter,
        gender,
        color,
        lt_size,
        gt_size,
        status,
        order_by,
      } = query;

      let response = null;

      if (retrievalType === "Pets") {
        response = await fetch(
          `http://localhost:8000/pet/?page=${
            currentPage + 1
          }&shelter=${shelter}&gender=${gender}&color=${color}&lt_size=${lt_size}&gt_size=${gt_size}&type=${type}&status=${status}&order_by=${order_by}`,
          requestOptions
        );

        const result = await response.json();

        _setSearchParams({
          type: query.type,
          shelter: query.shelter,
          gender: query.gender,
          color: query.color,
          lt_size: query.lt_size,
          gt_size: query.gt_size,
          status: query.status,
          order_by: query.order_by,
        });

        setCurrentPage(currentPage + 1);

        console.log("Pets: ", result.results);

        // Append new data to existing data
        setPetListings((prevDetails) => [...prevDetails, ...result.results]);
      } else {
      }

      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handlePetClick = (pet) => {
    console.log("Pet id: ", pet.id);
    navigate(`/pet/${pet.id}/`);
  };

  const handleShelterClick = (shelter) => {
    console.log("Shelter id: ", shelter.id);
    navigate(`/shelter/${shelter.id}/`);
  };

  return (
    <>
      {/* MOVE TO ITS OWN COMPONENT */}
      {/* THE FILTER BAR AT THE TOP OF THE PAGE */}
      <InfiniteScroll
        dataLength={petListings?.length}
        next={fetchMore}
        hasMore={currentPage < totalPages} // Replace with a condition based on your data source
        loader={<p>Loading...</p>}
        endMessage={<h1>That's all of the pets!</h1>}
      >
        <div className="mainContainer" style={{marginTop: "0px"}}>
          <FilterBar
            setParams={_setSearchParams}
            retrieveShelter={() => setRetrievalType("Shelters")}
            retrievePet={() => setRetrievalType("Pets")}
            query={query}
            reinitializePage={() => setCurrentPage(1)}
          />
          <div className="internalContainer">
            <div className="buttonContainer">
              <FilterButton showFilter={() => setShowFilterModal(true)} />
              <SortButton
                setParams={_setSearchParams}
                query={query}
                reinitializePage={() => setCurrentPage(1)}
              />
            </div>

            <div className="profileGrid">
              {retrievalType === "Pets" && petListings?.length > 0 ? (
                petListings.map((pet) => (
                  <div
                    key={pet.id}
                    className="profileCard"
                    onClick={() => handlePetClick(pet)}
                  >
                    <div className="profilePic">
                      <img
                        src={pet.profile_photo}
                        alt="Pet Profile"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                    <div className="profileCardText">
                      <h3 className="cardTextHeading">{pet.name}</h3>
                      <p className="cardTextSubHeading">{pet.breed}</p>
                      <p className="cardTextSubHeading">
                        {pet?.shelter?.shelter_name}
                      </p>
                    </div>
                  </div>
                ))
              ) : retrievalType === "Pets" ? (
                <h3 className="noResultHeading">No pets found.</h3>
              ) : (
                shelterList.map((shelter) => (
                  <div
                    key={shelter.id}
                    className="profileCard"
                    onClick={() => handleShelterClick(shelter)}
                  >
                    <div className="profilePic">
                      {/* Assuming shelter has a profile_photo property */}
                      <img
                        src={shelter.user.profile_photo}
                        alt="Shelter Profile"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                    <div className="profileCardText">
                      <h3 className="cardTextHeading">
                        {shelter.shelter_name}
                      </h3>
                      <p className="cardTextSubHeading">{shelter.address}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        {showFilterModal && completeShelterList && (
          <FilterModal
            open={showFilterModal}
            onClose={() => setShowFilterModal(false)}
            paramType={query.type}
            setParams={_setSearchParams}
            query={query}
            completeShelterList={completeShelterList}
            reinitializePage={() => setCurrentPage(1)}
          />
        )}
      </InfiniteScroll>
    </>
  );
}

export default Home;
