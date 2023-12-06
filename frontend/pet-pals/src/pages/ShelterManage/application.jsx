import React, { useState, useEffect, useMemo, useContext } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { BasicModal } from "../../components/Modal";
import "./style.css";
import { LoginContext } from "../../contexts/LoginContext";
import MainButton from "../../components/Button";
import { ChatModal } from "../../components/Modal";

const Application = ({ pet, application }) => {
  console.log("Pet: ", application);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const { currentUser, setCurrentUser } = useContext(LoginContext);
  console.log("application: ", application);

  //Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalChatDetail, setModalChatDetail] = useState();
  //const [applicationChat, setApplicationChat] = useState([]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const requestOptions = {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
        };
        const response = await fetch(
          `http://localhost:8000/pet/applications/${application.id}/chat/`,
          requestOptions
        );

        const result = await response.json();
        console.log("reached");
        console.log(result?.results[0]);

        setModalChatDetail(result?.results[0]);

        // setApplicationChat((prevValues) => ({
        //   ...prevValues,
        //   [application.id]: result, // Fix: Use 'result' instead of 'applicationChat[application.id]'
        // }));
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchData();
  }, [isModalOpen]);

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
      {/* {modalChatDetail && ( */}
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
                <MainButton text="View User Profile" handleClick={() => navigate(`/profile/seeker/${application.seeker.id}/`)}>
                {/* <Link to={`/pet/${pet.id}/applications/${application.id}/`}>
                </Link> */}
                </MainButton>
                <MainButton text="View Application" handleClick={() => navigate(`/pet/${pet.id}/applications/${application.id}/`)}>
                {/* <Link to={`/pet/${pet.id}/applications/${application.id}/`}>
                </Link> */}
                </MainButton>

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
                  handleClick={() => handleOpenModal()}
                />
                <ChatModal
                  open={isModalOpen}
                  onClose={() => setIsModalOpen(false)}
                  chatDetail={modalChatDetail}
                  currentUser={"shelter"}
                />
              </div>
            </div>
          </div>
        </div>
      {/* )} */}
    </>
  );
};

export default Application;
