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
    const page = parseInt(searchParams.get("page") ?? 1);
    const type = searchParams.get("type") ?? "";
    const shelter = searchParams.get("shelter") ?? "";
    const gender = searchParams.get("gender") ?? "";
    const color = searchParams.get("color") ?? "";
    const size = searchParams.get("size") ?? "";
    const status = searchParams.get("status") ?? "";
    const order_by = searchParams.get("order_by") ?? "name";

    return { page, type, shelter, gender, color, size, status, order_by };
  }, [searchParams]);

  useEffect(() => {
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
        //console.log(result);
        // const shelterNames = result.map((item) => item.shelter_name);
        //console.log(shelterNames);
        setCompleteShelterList(result.map((item) => item.shelter_name));
        //console.log("shelters: ", completeShelterList);
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
        const { page, type, shelter, gender, color, size, status, order_by } =
          query;

        let response = null;

        if (retrievalType === "Pets") {
          response = await fetch(
            `http://localhost:8000/pet/?page=${page}&shelter=${shelter}&gender=${gender}&color=${color}&size=${size}&type=${type}&order_by=${order_by}&status=${status}`,
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

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop ===
          document.documentElement.offsetHeight &&
        !loading &&
        query.page < totalPages
      ) {
        setLoading(true);
        setCurrentPage((prevPage) => prevPage + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [loading, query.page, totalPages]);

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
      <div className="mainContainer">
        <FilterBar
          setParams={_setSearchParams}
          retrieveShelter={() => setRetrievalType("Shelters")}
          retrievePet={() => setRetrievalType("Pets")}
          query={query}
        />
        <div className="internalContainer">
          <div className="buttonContainer">
            <FilterButton showFilter={() => setShowFilterModal(true)} />
            <SortButton setParams={_setSearchParams} query={query} />
          </div>

          <div className="profileGrid">
            {retrievalType === "Pets" && petListings.length > 0 ? (
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
                      {pet.shelter.shelter_name}
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
                    <h3 className="cardTextHeading">{shelter.shelter_name}</h3>
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
        />
      )}
    </>
  );
}

export default Home;
