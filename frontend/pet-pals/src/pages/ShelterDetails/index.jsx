import React, { useEffect, useState } from 'react';
import './style.css';
import { useParams } from 'react-router-dom';
import StarSVG from '../../assets/svgs/Star.svg';

function ShelterDetails() {
    const { id } = useParams();

    const [shelter, setShelter] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const requestOptions = {
                    method: 'GET'
                };

                const response = await fetch(`http://localhost:8000/shelter/${id}/`, requestOptions);
                const result = await response.json();
                console.log(result);
                setShelter(result);


            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchData();

    }, [id]);



    return (
        <main>
            <div className="allContent">
                <div className="pageContent">
                    <div className="mainInfo">
                        <h1 className="mainInfoHeading">{shelter.shelter_name}</h1>

                        <img src={shelter.user && shelter.user.profile_photo} alt="" id="oliver" />

                        <div className="specs">
                            <div className="ratingContainer">

                                <img className="imastar" src={StarSVG} alt="" />
                            </div>
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
                </div>
            </div>


        </main>
    );
}

export default ShelterDetails;