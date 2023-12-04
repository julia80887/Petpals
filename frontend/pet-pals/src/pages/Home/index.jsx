import React, { useEffect, useState, useContext } from 'react';
import './style.css';
import DogSVG from '../../assets/svgs/Dog.svg';
import CatSVG from '../../assets/svgs/Cat.svg';
import OtherAnimalsSVG from '../../assets/svgs/otherAnimals.svg';
import ShelterSVG from '../../assets/svgs/animalShelter.svg';
import SliderIconSVG from '../../assets/svgs/Slider.svg';
import FilterButton from './FilterButton';
import FilterBar from "./FilterBar";
import SortButton from './SortButton';
import { LoginContext } from '../../contexts/LoginContext';

function Home() {
  const [petListings, setPetListings] = useState([]);
  const { currentUser } = useContext(LoginContext);

  useEffect(() => {
    console.log("Logged in user: ", localStorage.getItem('shelter_name'));
    console.log("Logged in user: ", localStorage.getItem('id'));

    const fetchData = async () => {
      try {
        const requestOptions = {
          method: "GET",
        };

        const response = await fetch(
          "http://localhost:8000/pet/",
          requestOptions
        );
        const result = await response.json();
        console.log(result);
        setPetListings(result.results);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchData();
  }, []);

  // Use the following code to see if the useState is correctly set
  // useEffect(() => {
  //   console.log(petListings)
  // }, [petListings]);

  return (
    <>
      {/* MOVE TO IT'S OWN COMPONENT */}
      {/* THE FILTER BAR AT THE TOP OF THE PAGE */}
      <div className="mainContainer">
        <FilterBar />
        <div className="internalContainer">
          <div className="buttonContainer">
            <FilterButton />
            <SortButton />
          </div>

          <div className="profileGrid">
            {petListings.map(pet => (
              <div key={pet.id} className="profileCard">
                <div className="profilePic">
                  <img
                    src={pet.profile_photo}
                    alt="Pet Profile"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div className="profileCardText">
                  <h3 className="cardTextHeading">{pet.name}</h3>
                  <p className="cardTextSubHeading">{pet.breed}</p>
                  <p className="cardTextSubHeading">{pet.shelter.shelter_name}</p>
                  {/* <p className="cardTextSubHeading">{pet.city}</p> */}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
