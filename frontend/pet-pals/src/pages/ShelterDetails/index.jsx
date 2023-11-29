import React from 'react';
import './style.css';


function ShelterDetails() {
    return (
        <main>
            <div className="allContent">
                <div className="pageContent">
                    <div className="mainInfo">
                        <h1 className="mainInfoHeading">Oakville &amp Milton Humane Society</h1>

                        <img src="../assets/pictures/oliver.png" id="oliver" />

                        <div className="specs">
                            <div className="ratingContainer">
                                <p><span className="specLabels">Rating:</span> 4.12</p>
                                <img className="imastar" src="../assets/svgs/Star.svg" />
                            </div>
                            <p>
                                <span className="specLabels">Location:</span>
                445 Cornwall Rd, Oakville, ON L6J 758
              </p>
                            <p>
                                <span className="specLabels">Phone Number:</span> (905)-845-1551
              </p>
                            <p>
                                <span className="specLabels">Email Address:</span> shelter@omhs.ca
              </p>
                            <p className="mission">
                                <span className="specLabels">Our Mission Statement:</span> We are
                dedicated to protecting and making life better for animals and
                connecting the communities that care about them in Oakville and
                Milton.
              </p>
            </div>
            </div>
            </div>
            </div>
                

        </main>
    );
}

export default ShelterDetails;