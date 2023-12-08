import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./style.css";
import { Link } from 'react-router-dom';


const FilterButton = ({ setParams, query }) => {
  const [selectedOption, setSelectedOption] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const updateSelectedOption = (option) => {
    let filterByValue;

    // Map the display option to the corresponding value for setParams
    switch (option) {
      case "Approved":
        filterByValue = "Approved";
        break;
      case "Rejected":
        filterByValue = "Rejected";
        break;
      case "Withdrawn":
        filterByValue = "Withdrawn";
        break;
      case "Pending":
        filterByValue = "Pending";
        break;
        case "All":
          filterByValue = "";
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
      setParams({ ...query, page: query.page, application_status: filterByValue, })
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
              onClick={() => updateSelectedOption("Pending")}
            >
              Pending
            </a>
          </li>
          <li>
            <a
              className="dropdown-item"
              onClick={() => updateSelectedOption("Approved")}
            >
              Approved
            </a>
          </li>
          <li>
            <a
              className="dropdown-item"
              onClick={() => updateSelectedOption("Rejected")}
            >
              Rejected
            </a>
          </li>
          <li>
            <a
              className="dropdown-item"
              onClick={() => updateSelectedOption("Withdrawn")}
            >
              Withdrawn
            </a>
          </li>
          <li>

            <a
              className="dropdown-item"
              onClick={() => updateSelectedOption('All')}
              //to={'pet/applications/'}
            >
              All
            </a>
          </li>
        </ul>
      )}
    </div>
  );
};

export default FilterButton;
