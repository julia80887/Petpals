import React from 'react';
import './style.css';

function PetDetails() {
  return (
    <main>
      <div className="filterContainer">
        <div className="filter" id="dogFilter">
          <img src="../assets/svgs/Dog.svg" alt="Dog" />
          <h4>Dog</h4>
        </div>
        <div className="filter" id="catFilter">
          <img src="../assets/svgs/Cat.svg" alt="Cat" />
          <h4>Cats</h4>
        </div>
        <div className="filter" id="otherAnimalsFilter">
          <img src="../assets/svgs/otherAnimals.svg" alt="Other Animals" />
          <h4>Other Animals</h4>
        </div>
        <div className="filter" id="shelterFilter">
          <img src="../assets/svgs/Animal Shelter.svg" alt="Shelter" />
          <h4>Shelters</h4>
        </div>
      </div>
      <div className="sortButtonContainer">
        <a
          id="openModal"
          data-bs-toggle="modal"
          data-bs-target="#filterModal"
          style={{ textDecoration: 'none' }}
        >
          <div
            className="filterButton"
            id="filters"
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              gap: '10px',
              padding: '10px',
              background: 'white',
              border: '2px solid #573f35',
              borderRadius: '10px',
              height: '60px',
            }}
          >
            <img src="../assets/svgs/Slider.svg" alt="Slider" />
            <h4>Filters</h4>
          </div>
        </a>

        {/* <!-- START OF SORT BUTTON --> */}

        <div className="dropdown">
          <button
            className="btn sortButton"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <h4 id="selectedOption">Sort By: Name</h4>
          </button>
          <ul
            className="dropdown-menu"
            aria-labelledby="dropdownMenuButton1"
            data-popper-placement="bottom-start"
          >
            <li>
              <a
                className="dropdown-item"
                href="#"
                onClick={() => updateSelectedOption('Sort By: Name', 'AlphabeticalAnimalsGrid')}
              >
                Name
              </a>
            </li>
            <li>
              <a
                className="dropdown-item"
                href="#"
                onClick={() => updateSelectedOption('Sort By: Nearest', 'DistanceAnimalsGrid')}
              >
                Nearest
              </a>
            </li>
            <li>
              <a
                className="dropdown-item"
                href="#"
                onClick={() => updateSelectedOption('Sort By: Age', 'AgeAnimalsGrid')}
              >
                Age
              </a>
            </li>
            <li>
              <a
                className="dropdown-item"
                href="#"
                onClick={() => updateSelectedOption('Sort By: Size', 'SizeAnimalsGrid')}
              >
                Size
              </a>
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}

export default PetDetails;

// Add this function somewhere in your code
function updateSelectedOption(option, gridType) {
  // Implement the logic to update the selected option and grid type
  console.log(`Selected Option: ${option}, Grid Type: ${gridType}`);
}
