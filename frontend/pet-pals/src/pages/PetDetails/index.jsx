import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom"; // Import useParams from react-router-dom
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/css/bootstrap.css";
import "./style.css";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import CustomTabPanel from "./CustomTabPanel"; // Replace with the actual path to your CustomTabPanel component

// Function to generate unique accessibility props for each tab
function a11yProps(index) {
  return {
    id: `tab-${index}`,
    "aria-controls": `tabpanel-${index}`,
  };
}

// import "react-select/dist/react-select.css";
// var pet;
function PetDetails() {
  const shelter_user = localStorage.getItem("shelter_name") || "";
  const seeker_user = localStorage.getItem("firstname") || "";
  const user_id = localStorage.getItem("id") || "";
  const [value, setValue] = useState(0);
  const { pet_id } = useParams();
  const [petDetails, setPetDetails] = useState([]);
  const [shelterDetails, setShelterDetails] = useState({});
  const navigate = useNavigate();
  const [loadingShelter, setLoadingShelter] = useState(true);
  const [loadingPets, setLoadingPets] = useState(true);
  const [appsForUser, setAppsForUser] = useState([]);
  let exists = false;

  useEffect(() => {
    const fetchData = async () => {
      setLoadingPets(true);
      try {
        const requestOptions = {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
        };
        const response = await fetch(
          `http://localhost:8000/pet/applications/all/`,
          requestOptions
        );
        const result = await response.json();
        // if (petDetails["detail"] == "Not found.") {
        //   navigate(`/`);
        // }

        // pagination??????
        setAppsForUser([result]);
        console.log(result);

        console.log(result);
        setLoadingPets(false);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const requestOptions = {
          method: "GET",
        };
        console.log(pet_id);
        const response = await fetch(
          `http://localhost:8000/pet/${pet_id}/`,
          requestOptions
        );
        const result = await response.json();
        // if (petDetails["detail"] == "Not found.") {
        //   navigate(`/`);
        // }
        console.log(result["detail"]);
        setPetDetails(result);
        setLoadingPets(false);
      } catch (error) {
        console.error("Error:", error);
        navigate(`/`);
      }
    };

    fetchData();
  }, [pet_id]);
  // let shelterNameURL = '';

  useEffect(() => {
    const fetchData = async () => {
      if (petDetails && petDetails.shelter) {
        try {
          const requestOptions = {
            method: "GET",
            // headers: {
            //   Authorization: `Bearer ${localStorage.getItem("access")}`,
            // },
          };

          console.log(petDetails);
          let id =
            petDetails && petDetails.shelter ? petDetails.shelter.id : "";

          // shelterNameURL = encodeURIComponent(shelter.shelter_name);
          // console.log(shelterNameURL);

          const response = await fetch(
            `http://localhost:8000/shelter/${id}/`,
            requestOptions
          );
          const result = await response.json();
          console.log("Shelter Results: ", result);
          setShelterDetails(result);
          setLoadingShelter(false);
        } catch (error) {
          console.error("Error:", error);
        }
      }
    };
    fetchData();
  }, [petDetails]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  if (loadingShelter || loadingPets) {
    if (petDetails["detail"] == "Not found.") {
      return <h1>This Pet does not exist.</h1>;
    } else {
      console.log(petDetails);
      console.log(shelterDetails);
      return <p>Loading...</p>;
    }
  }

  console.log(appsForUser);
  console.log(exists);
  {
    appsForUser[0].map((item) => (
      <div key={item.id}>
        {item.pet == petDetails.id ? (exists = true) : null}
      </div>
    ));
  }

  if (loadingShelter || loadingPets) {
    <p>Loading.....</p>
  } else {
  if (petDetails && shelterDetails) {
    return (
      <>
        {/* {loadingShelter || loadingPets ? (
          <p>Loading.....</p>
        ) : ( */}
        <div className="mainContainer">
          <div className="detailsContainer">
            <h1 className="textHeading">
              Hi, I’m <span className="chewyHeading">{petDetails.name}</span>!
            </h1>
            <div className="imageContainer">
              <div className="largeImage">
                <img
                  src={petDetails.profile_photo}
                  id="rufusPic"
                  alt={petDetails.name}
                />
              </div>
            </div>
            <div className="contentContianer">
              <div className="internalContainer">
                <div className="contentSelector">
                  <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                    <Tabs
                      value={value}
                      onChange={handleChange}
                      aria-label="basic tabs example"
                    >
                      <Tab label="General Info" {...a11yProps(0)} />
                      <Tab label="Status" {...a11yProps(1)} />
                      {/* </Tabs> */}
                      {/* <CustomTabPanel className="tab" id="generalTab" value={value} index={0}>
                  General Info
                </CustomTabPanel>
                <CustomTabPanel className="tab" id="generalTab" value={value} index={1}>
                  Status
                </CustomTabPanel>
                <CustomTabPanel className="tab" id="generalTab" value={value} index={2}>
                  Images
                </CustomTabPanel> */}

                      {/* <div className="tab" id="generalTab">
                    <Tab label="General Info" {...a11yProps(0)} />
                  </div>
                  <div className="tab" id="statusTab">
                    <Tab label="Status" {...a11yProps(1)} />
                  </div>
                  <div className="tab" id="imageTab">
                    <Tab label="Images" {...a11yProps(2)} />
                  </div> */}
                    </Tabs>
                  </Box>
                </div>

                <CustomTabPanel
                  className="tab"
                  id="generalTab"
                  value={value}
                  index={0}
                >
                  <div className="textContainer" id="petInfo">
                    <div className="specs">
                      <p className="specsLine">
                        {petDetails.breed} · {petDetails.city},{" "}
                        {petDetails.province}
                      </p>
                      <p className="specsLine">{petDetails.gender} · {petDetails.weight} lbs</p>
                      <p className="specsLine">
                        <span className="specLabels">Birthday: </span>
                        {petDetails.date_of_birth}
                      </p>
                      <p className="specsLine">
                        <span className="specLabels">Shelter: </span>
                        {shelterDetails.shelter_name}
                      </p>
                      <p className="specsLine">
                        <span className="specLabels">About: </span>
                        {petDetails.about}
                      </p>
                    </div>
                  </div>
                </CustomTabPanel>

                <CustomTabPanel
                  className="tab"
                  id="generalTab"
                  value={value}
                  index={1}
                >
                  <div className="textContainer" id="petStatus">
                    <div className="specs">
                      <p className="specsLine">
                        <span className="specLabels">Status: </span>{" "}
                        {petDetails.status}
                      </p>
                      <p className="specsLine">
                        <span className="specLabels">Publication Date: </span>
                        {petDetails.publication_date}
                      </p>
                      <p className="specsLine">
                        <span className="specLabels">
                          Application Deadline:{" "}
                        </span>
                        {petDetails.application_deadline}
                      </p>
                      <p className="specsLine">
                        <span className="specLabels">Medical History:</span>{" "}
                        {petDetails.medical_history}
                      </p>
                      <p className="specsLine">
                        <span className="specLabels">Behaviour: </span>
                        {petDetails.behavior}
                      </p>
                    </div>
                  </div>
                </CustomTabPanel>



                {petDetails.status !== "Adopted" ? (
                  <div style={{width: "100%"}}>
                    {shelter_user == "" && (
                      <div className="formContainer">
                        {!exists ? (
                          <h4 className="applyHeading">
                            Ready to give {petDetails.name} a forever home?
                          </h4>
                        ) : (
                          <h4 className="applyHeading">
                            You have already made an application for{" "}
                            {petDetails.name}.
                          </h4>
                        )}

                        {!exists ? (
                          <Link
                            to={`/pet/${petDetails.id}/applications/`}
                            style={{ textDecoration: "none" }}
                          >
                            <div role="button" className="applyButton">
                              Apply Today
                            </div>
                          </Link>
                        ) : (
                          <Link
                            to={`/pet/applications/`}
                            style={{ textDecoration: "none" }}
                          >
                            <div role="button" className="applyButton">
                              My Applications
                            </div>
                          </Link>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="formContainer">
                    <h4 className="applyHeading">This pet has been adopted.</h4>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* )} */}
      </>
    );
  } else {
    return (
      <>
        <p>This pet does not exist.</p>
      </>
    );
  }
}
}

export default PetDetails;
