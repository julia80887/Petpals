import React from 'react';
import './style.css';

const SortButton = () => {
    return (
      <div className="dropdown">
        <button
          className="sortButton"
          type="button"
        >
          <h4 id="selectedOption">Sort By: Name</h4>
        </button>
      </div>
    );
  }

export default SortButton;
