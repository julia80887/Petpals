import React from 'react';
import './style.css';


function PetDetails() {
  return (
    <main>
      <div className="detailsContainer">
        <h1 className="textHeading">
          Hi, I’m <span className="chewyHeading">Rufus</span>!
        </h1>
        <div className="imageContainer">
          <div className="largeImage">
            <img src="../assets/pictures/rufus.jpg" id="rufusPic" alt="Rufus" />
          </div>
        </div>
        <div className="contentContianer">
          <div className="internalContainer">
            <div className="contentSelector">
              <div className="tab" id="generalTab">
                <h6>General Info</h6>
              </div>
              <div className="tab" id="statusTab">
                <h6>Status</h6>
              </div>
              <div className="tab" id="imageTab">
                <h6>Images</h6>
              </div>
            </div>
            <div className="textContainer" id="petInfo">
              <div className="specs">
                <p className="specsLine">Golden Retriever · Oakville, On</p>
                <p className="specsLine">Adult · Male · Medium</p>
                <p className="specsLine">
                  <span className="specLabels">Birthday: </span>January 1, 2023
                </p>
                <p className="specsLine">
                  <span className="specLabels">Shelter: </span>Oakville Humane
                  Society
                </p>

                <p className="specsLine">
                  <span className="specLabels">About: </span>Rufus is a menace to
                  society. Do not adopt this dog.
                </p>
              </div>
            </div>

            <div className="textContainer" id="petStatus">
              <div className="specs">
                <p className="specsLine">
                  <span className="specLabels">Status: </span> Available
                </p>
                <p className="specsLine">
                  <span className="specLabels">Publication Date: </span>July 27,
                  2023
                </p>
                <p className="specsLine">
                  <span className="specLabels">Application Deadline: </span>July 27,
                  2024
                </p>
                <p className="specsLine">
                  <span className="specLabels">Medical History:</span> Rufus has a
                  perfect medical history with no illnesses.
                </p>
                <p className="specsLine">
                  <span className="specLabels">Behaviour: </span>Behaviour: Rufus is
                  a well manered dog.
                </p>
              </div>
            </div>

            <div className="textContainer" id="petImages">
              <img src="../assets/pictures/rufus2.jpg" id="dogPic" />
            </div>
            <div className="formContainer">
              <h4 className="applyHeading">Ready to give Rufus a forever home?</h4>
              <a href="AdoptionPage1.html" role="button" class="applyButton">
                Apply Today
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default PetDetails;
