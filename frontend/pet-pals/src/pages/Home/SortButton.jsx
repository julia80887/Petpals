import React, { useState } from "react";
import "./style.css";

const Dropdown = ({ setParams, query }) => {
  const [selectedOption, setSelectedOption] = useState("Name");
  const [showDropdown, setShowDropdown] = useState(false);

  const updateSelectedOption = (option) => {
    let sortByValue;

    // Map the display option to the corresponding value for setParams
    switch (option) {
      case "Name":
        sortByValue = "name";
        break;
      case "Date":
        sortByValue = "publication_date";
        break;
      case "Age":
        sortByValue = "date_of_birth";
        break;
      case "Size":
        sortByValue = "weight";
        break;
      default:
        sortByValue = "name"; // Default to 'Name'
    }

    setSelectedOption(option);
    setParams({
      page: query.page,
      type: query.type,
      shelter: query.shelter,
      gender: query.gender,
      color: query.color,
      lt_size: query.lt_size,
      gt_size: query.gt_size,
      status: query.status,
      order_by: sortByValue,
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
        <h4 id="selectedOption">Sort By: {selectedOption}</h4>
      </button>
      {showDropdown && (
        <ul className="dropdown-menu show">
          <li>
            <a
              className="dropdown-item"
              onClick={() => updateSelectedOption("Name")}
            >
              Name
            </a>
          </li>
          <li>
            <a
              className="dropdown-item"
              onClick={() => updateSelectedOption("Date")}
            >
              Date
            </a>
          </li>
          <li>
            <a
              className="dropdown-item"
              onClick={() => updateSelectedOption("Age")}
            >
              Age
            </a>
          </li>
          <li>
            <a
              className="dropdown-item"
              onClick={() => updateSelectedOption("Size")}
            >
              Size
            </a>
          </li>
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
