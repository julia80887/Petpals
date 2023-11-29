import React from 'react';
import SliderIconSVG from '../../assets/svgs/Slider.svg';
import './style.css';

const FilterButton = () => {
//   const openModal = () => {
//     // Handle modal opening logic here
//   };

  return (
    <button
    className="filterButton"
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
    //   id="openModal"
    //   data-bs-toggle="modal"
    //   data-bs-target="#filterModal"
      onClick={() => {alert("clicked!")}}
    >
        <img src={SliderIconSVG} alt="Slider icon" />
        <h4>Filters</h4>
    </button>
  );
};

export default FilterButton;
