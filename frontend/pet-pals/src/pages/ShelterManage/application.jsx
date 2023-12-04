import React, { useState, useEffect, useMemo, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { BasicModal } from "../../components/Modal";
import "./style.css";
import { LoginContext } from "../../contexts/LoginContext";
import MainButton from "../../components/Button";

const Application = ({ application }) => {
  console.log("Pet: ", application);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const { currentUser, setCurrentUser } = useContext(LoginContext);
  //console.log(currentUser)

  // const [searchParams, setSearchParams] = useSearchParams();

  // const query = useMemo(
  //     () => ({
  //         page: parseInt(searchParams.get("page") ?? 1),
  //     }),
  //     [searchParams]
  // );

  // useEffect(() => {
  //     const fetchData = async () => {
  //         try {
  //             setLoading(true);
  //             const { page } = query;
  //             const myHeaders = new Headers();

  //             myHeaders.append(
  //                 "Authorization",
  //                 `Bearer ${localStorage.getItem('access')}`
  //             );

  //             // const requestOptions = {
  //             //     method: "GET"
  //             // };

  //             // if (!currentUser.shelter_name) {
  //             //     navigate('/*')
  //             // }
  //             // const shelterNameURL = encodeURIComponent(currentUser.shelter_name);
  //             // console.log("shelter name: ", currentUser.shelter_name);
  //             const response = await fetch(
  //                 `http://localhost:8000/pet/${value.id}/applications/`,
  //                 {
  //                     headers: {
  //                         Authorization: `Bearer ${localStorage.getItem('access')}`,
  //                     },
  //                 }
  //             );
  //             const result = await response.json();

  //             console.log("First call: ", result.results);
  //             setApplications(result.results);
  //             setTotalPages(
  //                 Math.ceil(
  //                     Number(result.pagination_details["count"]) /
  //                     Number(result.pagination_details["page_size"])
  //                 )
  //             );

  //             setLoading(false);
  //         } catch (error) {
  //             setLoading(false);
  //             console.error("Error fetching applications:", error);
  //         }
  //     };
  //     fetchData();
  // }, [query]);

  const formatDate = (isoDate) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    const formattedDate = new Date(isoDate).toLocaleDateString(
      "en-US",
      options
    );
    return formattedDate;
  };

  return (
    <>
      {/* {applications && applications.map((application, index) => ( */}
      <div key={application.id} className="applicationCard">
        <div className="applicationCardContents">
          <div className="application">
            <div className="applicationInfo">
              <p className="appTextSubHeading">
                <span className="shelterSpecLabels">Applicant Name: </span>{" "}
                {application.seeker.firstname +
                  " " +
                  application.seeker.lastname}
              </p>
              <p className="appTextSubHeading">
                <span className="shelterSpecLabels">Applicant Date: </span>
                {formatDate(application.creation_time)}
              </p>
              <p className="appTextSubHeading">
                <span className="shelterSpecLabels">Status: </span>
                {application.application_status}
              </p>
            </div>
            <div className="buttons">
              {/* <a
                className="btn"
                style={{ width: "100%", height: "fit-content" }}
                href="ApplicationPageSignedInShelter.html"
                role="button"
              >
                View Application
              </a> */}
              <MainButton
                text={"View Application"}
                handleClick={() => alert("clicked!")}
              />
              {/* <button
                className="btn"
                role="button"
                style={{ width: "100%", height: "fit-content" }}
                id="openModalButton2"
              >
                Open Chat
              </button> */}
              <MainButton
                text={"Open Chat"}
                handleClick={() => alert("clicked!")}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ))} */}
    </>
  );
};

export default Application;
