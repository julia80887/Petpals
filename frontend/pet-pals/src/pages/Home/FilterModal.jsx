import React, { useEffect, useRef } from "react";
import Modal from "@mui/material/Modal";
import "./style.css";
import { useState } from "react";
import CloseIcon from "../../assets/svgs/CloseIcon.svg";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";

function FilterModal({
  open,
  onClose,
  paramType,
  setParams,
  query,
  completeShelterList,
}) {
  const [chatMessages, setChatMessages] = useState();
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState("seeker");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedType, setSelectedType] = useState(paramType);
  const [statusType, setStatusType] = useState(paramType);

  const [selectedShelter, setSelectedShelter] = useState("Select Shelter");
  const [shelterOptions, selectShelterOptions] = useState([]);
  const [filterDict, setFilterDict] = useState({});

  console.log("complete shleter list: ", completeShelterList);

  const typeOptions = [
    "Dog",
    "Cat",
    "Bird",
    "Fish",
    "Rodent",
    // "Hamster",
    // "Guinea Pig",
    "Rabbit",
    "Amphibian",
    "Reptile",
    "Exotic",
  ];

  const statusOptions = ["Available", "Adopted", "Pending"];

  const petColors = [
    "Black",
    "White",
    "Brown",
    "Grey",
    "Orange",
    "Red",
    "Green",
    "Multicolor",
    "Other",
  ];

  const genderOptions = ["Male", "Female", "Other"];

  useEffect(() => {
    // Set shelterOptions when completeShelterList changes
    selectShelterOptions(completeShelterList);
    console.log("shelter list: ", shelterOptions);
  }, [completeShelterList]);

  const clearAllFilters = () => {
    setFilterDict({});
    setParams({
      page: 1,
      order_by: "name",
    });
    onClose();
  };

  const updateTypeSelectedOption = (type) => {
    setSelectedType(type);
  };

  const updateStatusSelectedOption = (status) => {
    setStatusType(status);
  };

  const updateShelterSelectedOption = (shelter) => {
    setSelectedShelter(shelter);
  };

  const updateFilterDict = (key, value) => {
    setFilterDict((prevFilterDict) => ({ ...prevFilterDict, [key]: value }));
  };

  function setSize(gt, lt) {
    setParams({
      page: query.page,
      type: query.type,
      shelter: query.shelter,
      gender: query.gender,
      color: query.color,
      lt_size: lt,
      gt_size: gt,
      order_by: query.order_by,
      status: query.status,
    });
  }

  useEffect(() => {
    console.log("filter dict: ", filterDict);
  }, [filterDict]);

  const showPets = () => {
    if (Object.keys(filterDict).length === 0) {
      // If filterDict is empty, setParams with the original query values
      setParams({
        page: query.page,
        type: query.type,
        shelter: query.shelter,
        gender: query.gender,
        color: query.color,
        lt_size: query.lt_size,
        gt_size: query.gt_size,
        order_by: query.order_by,
        status: query.status,
      });
    } else {
      // If filterDict is not empty, update the params with filterDict values
      setParams({
        page: filterDict.page || query.page,
        type: filterDict.type || query.type,
        shelter: filterDict.shelter || query.shelter,
        gender: filterDict.gender || query.gender,
        color: filterDict.color || query.color,
        lt_size: filterDict.lt_size || query.lt_size,
        gt_size: filterDict.gt_size || query.gt_size,
        order_by: filterDict.order_by || query.order_by,
        status: filterDict.status || query.status,
      });
    }

    onClose();
  };

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div className="modalContent">
          {/* Modal Header */}
          <div className="modalHeader">
            <h5 className="modalTitle">Filters</h5>
            <div className="closeIcon" onClick={onClose}>
              <img src={CloseIcon} />
            </div>
          </div>
          {/* Modal Header */}

          <div className="modalBody">
            <div className="ModalFilter Shelter">
              <h6 className="modalSubHeading">Shelter</h6>
              <Select
                className="shelterDropdown"
                value={selectedShelter}
                onChange={(e) => {
                  updateShelterSelectedOption(e.target.value);
                  updateFilterDict("shelter", e.target.value);
                }}
              >
                {shelterOptions.map((shelter, index) => (
                  <MenuItem
                    key={index}
                    value={shelter}
                    onClick={() => {
                      updateShelterSelectedOption(shelter);
                      updateFilterDict("shelter", shelter);
                    }}
                  >
                    {shelter}
                  </MenuItem>
                ))}
              </Select>
            </div>

            {/* Size Button Container */}
            <div className="ModalFilter Size">
              <h6 className="modalSubHeading">Size</h6>
              <div className="sizeButtonContainer">
                {/* FIX THIS  */}
                  <div className="sizeButton" id="small" onClick={() => setSize(0, 25)}>
                    Small <span>(0-25 lbs)</span>
                  </div>
                <div className="sizeButton" id="medium" onClick={() => setSize(26, 60)}>
                  Medium <span>(26-60 lbs)</span>
                </div>
                <div className="sizeButton" id="large" onClick={() => setSize(61, 100)}>
                  Large <span>(61-100 lbs)</span>
                </div>
                <div className="sizeButton" id="xlarge" onClick={() => setSize(101, 1000)}>
                  Extra Large <span>(101 lbs or more)</span>
                </div>
              </div>
            </div>
            {/* Size Button Container */}

            {/* Animal Type Dropdown */}
            <div className="ModalFilter animalType">
              <h6 className="modalSubHeading">Animal Type</h6>
              <Select
                className="animalTypeDropdown"
                value={selectedType}
                onChange={(e) => {
                  updateTypeSelectedOption(e.target.value);
                  updateFilterDict("type", e.target.value);
                }}
              >
                {typeOptions.map((type, index) => (
                  <MenuItem
                    key={index}
                    value={type}
                    onClick={() => {
                      updateTypeSelectedOption(type);
                      updateFilterDict("type", type);
                    }}
                  >
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </div>

            {/* Status Dropdown */}
            <div className="ModalFilter animalType">
              <h6 className="modalSubHeading">Status</h6>
              <Select
                className="animalTypeDropdown"
                value={statusType}
                onChange={(e) => {
                  updateStatusSelectedOption(e.target.value);
                  updateFilterDict("status", e.target.value);
                }}
              >
                {statusOptions.map((status, index) => (
                  <MenuItem
                    key={index}
                    value={status}
                    onClick={() => {
                      updateStatusSelectedOption(status);
                      updateFilterDict("status", status);
                    }}
                  >
                    {status}
                  </MenuItem>
                ))}
              </Select>
            </div>
            {/* Color Radio  */}

            <div className="ModalFilter Colour">
              <h6 className="modalSubHeading">Colour</h6>
              <div className="radioButtonContainer">
                {petColors.map((color, index) => (
                  <div key={index} className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="colour"
                      id={`radio${index + 1}`}
                      value={color.toLowerCase()}
                      onChange={(e) =>
                        updateFilterDict("color", e.target.value)
                      }
                    />
                    <label
                      className="form-check-label"
                      htmlFor={`radio${index + 1}`}
                    >
                      {color}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="ModalFilter Gender">
              <h6 className="modalSubHeading">Gender</h6>
              <div className="genderRadioGroup">
                {genderOptions.map((option, index) => (
                  <div key={index} className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="gender"
                      id={option.toLowerCase()}
                      value={option}
                      onChange={(e) =>
                        updateFilterDict("gender", e.target.value)
                      }
                    />
                    <label
                      className="form-check-label"
                      htmlFor={option.toLowerCase()}
                    >
                      {" "}
                      {option}{" "}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="modalFooter">
            <button type="button" className="btn" onClick={clearAllFilters}>
              Clear All
            </button>
            <button type="button" className="btn ShowPets" onClick={showPets}>
              Show Pets
            </button>
          </div>
          {/* Modal Footer */}
        </div>
      </Modal>
    </>
  );
}

export { FilterModal };
