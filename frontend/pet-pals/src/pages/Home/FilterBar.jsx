import React, { useEffect, useState } from "react";
// import "./style.css";
import DogSVG from "../../assets/svgs/Dog.svg";
import CatSVG from "../../assets/svgs/Cat.svg";
import OtherAnimalsSVG from "../../assets/svgs/otherAnimals.svg";
import ShelterSVG from "../../assets/svgs/animalShelter.svg";

function FilterBar({
  setParams,
  retrieveShelter,
  retrievePet,
  query,
  reinitializePage,
}) {
  const handleClick = (text) => {
    // setParams({ type: text });
    reinitializePage();

    setParams({
      type: text,
      shelter: query.shelter,
      gender: query.gender,
      color: query.color,
      lt_size: query.lt_size,
      gt_size: query.gt_size,
      status: query.status,
      order_by: query.order_by,
    });
    retrievePet();
  };

  return (
    <>
      <div className="filterContainer">
        <div
          className="filter"
          id="dogFilter"
          onClick={() => handleClick("Dog")}
        >
          <img src={DogSVG} alt="Dog" />
          <h4>Dog</h4>
        </div>
        <div
          className="filter"
          id="catFilter"
          onClick={() => handleClick("Cat")}
        >
          <img src={CatSVG} alt="Cat" />
          <h4>Cats</h4>
        </div>
        <div
          className="filter"
          id="otherAnimalsFilter"
          onClick={() => handleClick("Other")}
        >
          <img src={OtherAnimalsSVG} />
          <h4>Other Animals</h4>
        </div>
        <div
          className="filter"
          id="shelterFilter"
          onClick={() => retrieveShelter()}
        >
          <img src={ShelterSVG} />
          <h4>Shelters</h4>
        </div>
      </div>
    </>
  );
}

export default FilterBar;
