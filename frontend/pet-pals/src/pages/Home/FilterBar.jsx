import React, { useEffect, useState } from "react";
// import "./style.css";
import DogSVG from "../../assets/svgs/Dog.svg";
import CatSVG from "../../assets/svgs/Cat.svg";
import OtherAnimalsSVG from "../../assets/svgs/otherAnimals.svg";
import ShelterSVG from "../../assets/svgs/animalShelter.svg";

function FilterBar() {
  return (
    <>
      {/* MOVE TO IT'S OWN COMPONENT */}
      {/* THE FILTER BAR AT THE TOP OF THE PAGE */}
      {/* <div className="mainContainer"> */}
      <div className="filterContainer">
        <div className="filter" id="dogFilter">
          <img src={DogSVG} alt="Dog" />
          <h4>Dog</h4>
        </div>
        <div className="filter" id="catFilter">
          <img src={CatSVG} alt="Cat" />
          <h4>Cats</h4>
        </div>
        <div className="filter" id="otherAnimalsFilter">
          <img src={OtherAnimalsSVG} />
          <h4>Other Animals</h4>
        </div>
        <div className="filter" id="shelterFilter">
          <img src={ShelterSVG} />
          <h4>Shelters</h4>
        </div>
      </div>
      {/* </div> */}
    </>
  );
}

export default FilterBar;
