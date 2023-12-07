import React, { useState, useEffect } from "react";
import "./style.css";

const FilterButton = ({ setParams, query }) => {
  const [selectedOption, setSelectedOption] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    switch (query.read) {
      case "true":
        setSelectedOption("Read");
        break;
      case "false":
        setSelectedOption("Unread");
        break;
      default:
        setSelectedOption("");
    }
  }, [query]);
  const updateSelectedOption = (option) => {
    let filterByValue;

    // Map the display option to the corresponding value for setParams
    switch (option) {
      case "Read":
        filterByValue = "true";
        break;
      case "Unread":
        filterByValue = "false";
        break;
      default:
        filterByValue = "";
    }

    setSelectedOption(option);
    // setParams((prevDetails) => ({
    //     ...prevDetails,
    //     page: query.page,
    //     application_status: filterByValue,
    //   }));
    setParams({
      ...query,
      page: 1,
      read: filterByValue,
    });
    toggleDropdown();
    // Add any other logic you want to perform when an option is selected
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <div className="dropdown-container">
      <button
        className="sortButton"
        type="button"
        onClick={() => toggleDropdown()}
      >
        <h4 id="selectedOption">Filter By: {selectedOption}</h4>
      </button>
      {showDropdown && (
        <ul className="dropdown-menu show">
          <li>
            <a
              className="dropdown-item"
              onClick={() => updateSelectedOption("Read")}
            >
              Read
            </a>
          </li>
          <li>
            <a
              className="dropdown-item"
              onClick={() => updateSelectedOption("Unread")}
            >
              Unread
            </a>
          </li>
        </ul>
      )}
    </div>
  );
};

export default FilterButton;
