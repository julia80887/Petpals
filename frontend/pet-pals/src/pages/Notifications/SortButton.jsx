import React, { useState } from "react";
import "./style.css";

const Dropdown = ({ setParams, query }) => {
  const [selectedOption, setSelectedOption] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const updateSelectedOption = (option) => {
    let sortByValue;

    // Map the display option to the corresponding value for setParams
    switch (option) {
      case "Creation":
        sortByValue = "Creation";
        break;
      case "Update":
        sortByValue = "Update";
        break;
      default:
        sortByValue = ""; 
    }

    setSelectedOption(option);
    // setParams((prevDetails) => ({
    //   ...prevDetails,
    //   page: query.page,
    //   order_by: sortByValue,
    // }));
    
    setParams({ ...query, page: 1, order_by: sortByValue, })
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
        <h4 id="selectedOption">Sort By: {selectedOption}</h4>
      </button>
      {showDropdown && (
        <ul className="dropdown-menu show">
          <li>
            <a
              className="dropdown-item"
              onClick={() => updateSelectedOption("Update")}
            >
              Update
            </a>
          </li>
          <li>
            <a
              className="dropdown-item"
              onClick={() => updateSelectedOption("Creation")}
            >
              Creation
            </a>
          </li>
        </ul>
      )}
    </div>
  );
};

export default Dropdown;