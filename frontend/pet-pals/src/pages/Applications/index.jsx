import { useEffect, useState, useMemo } from "react";
import "./style.css";
import DogSVG from "../../assets/svgs/Dog.svg";
import { Link, useSearchParams } from "react-router-dom";
import { ChatModal } from "../../components/Modal";

function Applications() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [applications, setApplications] = useState([]);
  const [petDetails, setPetDetails] = useState({});
  const [shelterDetails, setShelterDetails] = useState({});
  const [totalPages, setTotalPages] = useState(1);

  //Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalChatDetail, setModalChatDetail] = useState();
  const [applicationChat, setApplicationChat] = useState([]);

  const handleOpenModal = (application_id) => {
    console.log("Applicaiton information: ", applicationChat[application_id]);
    console.log(
      "Applicaiton information: ",
      applicationChat[application_id].results[0]
    );
    const chatDetail = applicationChat[application_id].results[0];
    // Set the chatDetail for the modal
    setModalChatDetail(chatDetail);
    setIsModalOpen(true);
  };

  const query = useMemo(
    () => ({
      page: parseInt(searchParams.get("page") ?? 1),
    }),
    [searchParams]
  );

  useEffect(() => {
    const { page } = query;
    const fetchData = async () => {
      try {
        const requestOptions = {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
        };

        const response = await fetch(
          `http://localhost:8000/pet/applications/?page=${page}`,
          requestOptions
        );
        const result = await response.json();

        console.log(result);
        setApplications(result.results || []);
        setTotalPages(
          Math.ceil(
            Number(result.pagination_details["count"]) /
              Number(result.pagination_details["page_size"])
          )
        );
      } catch (error) {
        console.error("Error fetching applications:", error);
      }
    };

    fetchData();
  }, [query]);

  useEffect(() => {
    const fetchData = async () => {
      applications.forEach(async (application) => {
        console.log(application.id);
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
          console.log("Chat retrieval for application: ", result);

          setApplicationChat((prevValues) => ({
            ...prevValues,
            [application.id]: result, // Fix: Use 'result' instead of 'applicationChat[application.id]'
          }));
        } catch (error) {
          console.error("Error:", error);
        }
      });
    };
    fetchData();
  }, [applications]);

  useEffect(() => {
    // Fetch pet details for each application
    const fetchPetDetails = async (petId) => {
      try {
        const requestOptions = {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
        };

        const response = await fetch(
          `http://localhost:8000/pet/${petId}/`,
          requestOptions
        );
        const petDetail = await response.json();

        // Update the petDetails state
        setPetDetails((prevDetails) => ({
          ...prevDetails,
          [petId]: petDetail,
        }));
      } catch (error) {
        console.error(`Error fetching details for pet ${petId}:`, error);
      }
    };

    // Iterate through applications and fetch pet details
    applications.forEach((application) => {
      const petId = application.pet;
      if (!petDetails[petId]) {
        fetchPetDetails(petId);
      }
    });
  }, [applications, petDetails]);

  useEffect(() => {
    // Fetch shelter details for each application
    const fetchShelterDetails = async (shelterId) => {
      try {
        const requestOptions = {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
        };

        const response = await fetch(
          `http://localhost:8000/shelter/${shelterId}/`,
          requestOptions
        );
        const shelterDetail = await response.json();

        // Update the shelterDetails state
        setShelterDetails((prevDetails) => ({
          ...prevDetails,
          [shelterId]: shelterDetail,
        }));
      } catch (error) {
        console.error(
          `Error fetching details for shelter ${shelterId}:`,
          error
        );
      }
    };

    // Iterate through applications and fetch shelter details
    applications.forEach((application) => {
      const shelterId = application.shelter;
      if (!shelterDetails[shelterId]) {
        fetchShelterDetails(shelterId);
      }
    });
  }, [applications, shelterDetails]);

  return (
    <>
      <div className="main">
        <div className="notificationsContainer">
          <h1 className="pageHeading">My Applications</h1>

          <div className="notificationGrid">
            {applications.map((application) => {
              const petId = application.pet;
              const petDetail = petDetails[petId] || {};
              const shelterId = application.shelter;
              const shelterDetail = shelterDetails[shelterId] || {};
              const date = Date(application.publication_date);

              return (
                <div className="rowBox" key={application.id}>
                  <Link
                    to={`/pet/${petId}/applications/${application.id}`}
                    style={{ textDecoration: "none" }}
                  >
                    <div className="notification">
                      <div className="notificationPic">
                        <img
                          src={DogSVG}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                          alt="Dog"
                        />
                      </div>

                      <div className="notificationText">
                        <h5>
                          {petDetail.name} - {shelterDetail.shelter_name}
                        </h5>
                        <p>{String(date).split("2023")[0]} 2023</p>
                      </div>
                    </div>
                  </Link>
                  <div className="buttonPlacement">
                    <button
                      className="applyButton"
                      id="openModalButton"
                      onClick={() => handleOpenModal(application.id)}
                    >
                      View Chat
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          <p className="pagination">
            {query.page > 1 && query.page <= totalPages ? (
              <button
                className="paginationButton"
                onClick={() =>
                  setSearchParams({ ...query, page: query.page - 1 })
                }
              >
                Previous
              </button>
            ) : (
              <></>
            )}
            {query.page < totalPages ? (
              <button
                className="paginationButton"
                onClick={() =>
                  setSearchParams({ ...query, page: query.page + 1 })
                }
              >
                Next
              </button>
            ) : (
              <></>
            )}
          </p>
          {query.page <= totalPages ? (
            <p className="totalPages">
              Page {query.page} out of {totalPages}.
            </p>
          ) : (
            <p className="totalPages">You currently have no applications.</p>
          )}
        </div>
      </div>
      <ChatModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        chatDetail={modalChatDetail}
        currentUser={"seeker"}
      />
    </>
  );
}

export default Applications;
