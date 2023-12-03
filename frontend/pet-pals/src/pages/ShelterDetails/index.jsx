import React, { useEffect, useState } from 'react';
import './style.css';
import { useParams } from 'react-router-dom';
import StarSVG from '../../assets/svgs/Star.svg';
import { useNavigate } from 'react-router-dom';

function ShelterDetails() {

    const { id } = useParams();
    const [shelter, setShelter] = useState({});
    const [pets, setPets] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const requestOptions = {
                    method: 'GET'
                };
                const response = await fetch(`http://localhost:8000/shelter/${id}/`, requestOptions);
                const result = await response.json();
                if ('detail' in result) {
                    navigate('/*')
                }
                else {
                    console.log(result);
                    setShelter(result);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchData();

    }, []);
    let shelterNameURL = '';

    useEffect(() => {
        const fetchData = async () => {

            if (shelter) {
                try {
                    const requestOptions = {
                        method: 'GET'
                    };
                    // let shelterNameURL = shelter.shelter_name.replace(/ /g, '%20');

                    shelterNameURL = encodeURIComponent(shelter.shelter_name);
                    console.log(shelterNameURL);

                    const response = await fetch(`http://localhost:8000/pet/?shelter=${shelterNameURL}`, requestOptions);
                    const result = await response.json();
                    console.log("Pet Results: ", result.results);
                    setPets(result.results);


                } catch (error) {
                    console.error('Error:', error);
                }

            }
        };
        fetchData();
    }, [shelter]);

    const navigatePetDetail = () => {
        // Use the navigate function to redirect to '/'
        navigate('/');
    };

    const navigateMorePets = () => {
        // TEMPORARY -> CHANGE WHEN RUMAISA MAKES SEARCH 
        navigate(`/search/?shelter=${shelterNameURL}`);
    };

    return (
        <main>
            <div className="allContent">
                <div className="pageContent">
                    <div className="mainInfo">
                        <h1 className="mainInfoHeading">{shelter.shelter_name}</h1>
                        <img src={shelter.user && shelter.user.profile_photo} alt="" id="oliver" />
                        <div className="specs">
                            <p>
                                <span className="specLabels">Location: </span>
                                {(shelter.user && shelter.user.address) || 'No address available.'}
                            </p>
                            <p>
                                <span className="specLabels">Phone Number:</span> {(shelter.user && shelter.user.phone_number) || 'No phone number available.'}
                            </p>
                            <p>
                                <span className="specLabels">Email Address:</span> {(shelter.user && shelter.user.email) || 'No email available.'}
                            </p>
                            <p className="mission">
                                <span className="specLabels">Our Mission Statement:</span> {shelter.mission_statement || 'No mission statement available.'}
                            </p>
                        </div>
                    </div>

                    <div className="petListings">
                        <h2 className="petListingsHeadings">Our Pets</h2>

                        <div className="petListingGrid">
                            {pets.length > 0 && pets.map((pet, index) => (
                                index < 3 && (
                                    <div key={index} className="petListingCard">
                                        <div className="profilePic">
                                            <img
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                src={pet.profile_photo}
                                                alt={`Profile picture of ${pet.name}`}
                                            />
                                        </div>
                                        <div className="profileCardText">
                                            <h3 className="cardTextHeading">{pet.name}</h3>
                                            <p className="cardTextSubHeading">{pet.breed}</p>
                                            <p className="cardTextSubHeading">{pet.distance}</p>
                                        </div>

                                        <button className="btn" onClick={navigatePetDetail}>View Full Profile</button>
                                    </div>
                                )
                            ))}
                            {pets.length > 3 && (
                                <div className="petListingCard moreAvailable">
                                    <p className="moreAvailableText">{`+${pets.length - 3} more pets available`}</p>


                                    <button className="btn" onClick={navigateMorePets}>View More Pets</button>
                                </div>
                            )}

                            {pets.length <= 3 && (
                                <div className="petListingCard noMore">

                                    <p className="noMoreText">No more pets available.</p>


                                </div>
                            )}

                        </div>

                    </div>


                </div>
            </div>


        </main>
    );
}

export default ShelterDetails;

