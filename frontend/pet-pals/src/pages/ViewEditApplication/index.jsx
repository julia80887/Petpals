import { useState, useContext, useEffect } from "react";
import { Link, useParams } from "react-router-dom"; // Import useParams from react-router-dom
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/css/bootstrap.css";
import "./style.css";
import { LoginContext } from "../../contexts/LoginContext";
// import "react-select/dist/react-select.css";

function ViewEditApplication() {
  // loading use state
  const { status, setStatus } = useState({});
  const { currentUser, setCurrentUser } = useContext(LoginContext);
  const [loading, setLoading] = useState(true);
  // used to put any errors from validation into a dict
  // getting shelter id from the url
  const { application_id } = useParams();
  const { pet_id } = useParams();
  // used to store form values
  const [formValues, setFormValues] = useState({});

  const provinces = [
    "",
    "AB",
    "BC",
    "MB",
    "NB",
    "NL",
    "NT",
    "NS",
    "NU",
    "ON",
    "PE",
    "QC",
    "SK",
    "YT",
  ];

  // initial fetch
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // const myHeaders = new Headers();
        // myHeaders.append(
        //   Authorization: `Bearer ${localStorage.getItem('access')}`
        // );

        const requestOptions = {
          method: "GET",
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzAxNzkzOTA1LCJpYXQiOjE3MDE3MDc1MDUsImp0aSI6IjQzMThhMjFhNGJiOTRjZjhhMmZlMTA5ZDVkNTBmMTk4IiwidXNlcl9pZCI6MTF9.PEsDrK3_I6m7in-NLVg3jYO8abTRHlf6AuxbArEA8dk`,
          },
        };

        const response = await fetch(
          `http://localhost:8000/pet/${pet_id}/applications/${application_id}/`,
          requestOptions
        );
        const result = await response.json();
        // set all form values to the values from backend
        // console.log(result.results);
        setFormValues({
          phoneNumber: result.phone_number,
          inputAddress: result.address1,
          inputAddress2: result.address2,
          inputCity: result.city,
          inputState: result.province,
          postalCode: result.zip_code,
          email: result.email,
          name: result.name,
          numAdults: result.num_adults,
          numChildren: result.num_children,
          houseType: result.residence,
          ownershipType: result.ownership,
          petAloneTime: result.pet_alone_time,
          currentPets: result.current_pets,
          dailyRoutine: result.daily_routine,
          expenses: result.expenses,
          prevPets: result.previous_pets,
          reason: result.reason,
          name1: result.reference_name,
          phoneNumber1: result.reference_number,
          email1: result.reference_email,
          additionalComments: result.additional_comments,
          application_status: result.application_status,
        });
        console.log("formData:", result.application_status === "Approved");
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Error:", error);
      }
    };

    fetchData();
  }, [pet_id, application_id]);

  //   function setFormStatus(st, event){
  //     setStatus({status: st});
  //     handleEdit(event);
  // }

  // just for console printing purposes
  // useEffect(() => {
  //   console.log("FORM VALUES: ", formValues);
  // }, [formValues]);

  // event listener for when a text field in the form is edited

  // event listener for when a user hits submit on the form
  function handleEdit(event) {
    if (formValues.name != undefined) {
    event.preventDefault();
    // get rid of all previous errors
    let s = "Approved";
    const formData = new FormData();
    formData.append("application_status", s);

    // if you are here, validation passed, so make PUT request
    try {
      setLoading(true);
      const requestOptions = {
        method: "PUT",
        headers: {
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzAxNzkzOTA1LCJpYXQiOjE3MDE3MDc1MDUsImp0aSI6IjQzMThhMjFhNGJiOTRjZjhhMmZlMTA5ZDVkNTBmMTk4IiwidXNlcl9pZCI6MTF9.PEsDrK3_I6m7in-NLVg3jYO8abTRHlf6AuxbArEA8dk`,
        },
        body: formData, // Use the FormData object directly as the body
      };

      fetch(
        `http://localhost:8000/pet/${pet_id}/applications/${application_id}/`,
        requestOptions
      )
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
        })
        .finally(() => setLoading(false));
    } catch (error) {
      setLoading(false);
      console.error("Error:", error);
    }
}
  }
  

  console.log(formValues);
  if (loading) {
      return <p>Loading...</p>;
    
  }

  if (formValues.name != undefined) {
  return (
    <>
      <div className="mainContainer">
        <h1 className="question">Pet Application</h1>
        <div className="container">
          <form className="createPetForm" style={{ backgroundColor: "white" }}>
            <div className="form-group row">
              <label
                htmlFor="name"
                className="col-sm-4 col-form-label labelLeft"
              >
                Name
              </label>
              <div className="col-sm-8">
                <input
                  className="form-control"
                  id="name"
                  value={formValues.name}
                  disabled
                />
              </div>
            </div>

            {/* Add the rest of your form fields here */}

            <div className="form-group row">
              <label
                htmlFor="phoneNumber"
                className="col-sm-4 col-form-label labelLeft"
              >
                Phone #
              </label>
              <div className="col-sm-8">
                <input
                  className="form-control"
                  id="phoneNumber"
                  value={formValues.phoneNumber}
                  disabled
                />
              </div>
            </div>

            <div className="form-group row">
              <label
                htmlFor="email"
                className="col-sm-4 col-form-label labelLeft"
              >
                Email
              </label>
              <div className="col-sm-8">
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  value={formValues.email}
                  disabled
                />
              </div>
            </div>

            <div className="form-group row">
              <label
                htmlFor="inputAddress"
                className="col-sm-4 col-form-label labelLeft"
              >
                Address
              </label>
              <div className="col-sm-8">
                <input
                  className="form-control"
                  id="inputAddress"
                  value={formValues.inputAddress}
                  disabled
                />
              </div>
            </div>

            <div className="form-group row">
              <label
                htmlFor="inputAddress2"
                className="col-sm-4 col-form-label labelLeft emptyLabel"
              >
                Address 2
              </label>
              <div className="col-sm-8">
                <input
                  className="form-control"
                  id="inputAddress2"
                  value={formValues.inputAddress2}
                  disabled
                />
              </div>
            </div>

            <div className="form-group row">
              <label
                htmlFor="inputCity"
                className="col-sm-4 col-form-label labelLeft emptyLabel"
              ></label>
              <div className="col-sm-8">
                <input
                  className="form-control"
                  id="inputCity"
                  value={formValues.inputCity}
                  disabled
                />
              </div>
            </div>

            <div className="form-group row">
              <label
                htmlFor="inputState"
                className="col-sm-4 col-form-label labelLeft emptyLabel"
              ></label>
              <div className="col-sm-4">
                <select
                  id="inputState"
                  value={formValues.inputState}
                  style={{
                    backgroundColor: "#E9ECEF",
                    borderRadius: "100px",
                    padding: "12px",
                    display: "flex",
                    textAlign: "left",
                    alignItems: "flex-start",
                    whiteSpace: "nowrap",
                    width: "100%",
                    opacity: "1",
                    border: "1px solid #dee2e6",
                    fontSize: "14px",
                    color: "#ffffff",
                    height: "46.33px",

                    marginBottom: "10px",
                    marginTop: "10px",
                    fontFamily: "Open Sans",
                    color: "#000000",
                    //   }),
                  }}
                  disabled
                >
                  {[...provinces].map((p) =>
                    formValues.inputState == { p } ? (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ) : (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    )
                  )}
                </select>
              </div>
              <div className="col-sm-4">
                <input
                  className="form-control"
                  id="postalCode"
                  value={formValues.postalCode}
                  disabled
                />
              </div>
            </div>

            <div className="form-group row">
              <label
                htmlFor="numberOfAdultsInput"
                className="col-sm-4 col-form-label labelLeft"
              >
                Number of Adults
              </label>
              <div className="col-sm-8">
                <input
                  className="form-control"
                  id="numberOfAdultsInput"
                  value={formValues.numAdults}
                  disabled
                />
              </div>
            </div>

            <div className="form-group row">
              <label
                htmlFor="numberOfChildrenInput"
                className="col-sm-4 col-form-label labelLeft"
              >
                Number of Children
              </label>
              <div className="col-sm-8">
                <input
                  className="form-control"
                  id="numberOfChildrenInput"
                  value={formValues.numChildren}
                  disabled
                />
              </div>
            </div>

            <div className="form-group row">
              <label
                htmlFor="residenceTypeInput"
                className="col-sm-4 col-form-label labelLeft"
              >
                Type of Residence
              </label>
              <div className="col-sm-4">
                <select
                  id="residenceTypeInput"
                  className="form-control"
                  value={formValues.houseType}
                  disabled
                >
                  <option>House</option>
                  <option>Apartment</option>
                  <option>Condo</option>
                  <option>Townhouse</option>
                  <option>Mobile Home</option>
                </select>
              </div>

              <div className="col-sm-4">
                <select
                  id="ownershipInput"
                  className="form-control"
                  value={formValues.ownershipType}
                  disabled
                >
                  <option>Own</option>
                  <option>Rent</option>
                </select>
              </div>
            </div>

            <div className="form-group row">
              <label
                htmlFor="petAlone"
                className="col-sm-4 col-form-label labelLeft"
              >
                How often will pet be alone?
              </label>
              <div className="col-sm-8">
                <input
                  className="form-control"
                  id="petAlone"
                  value={formValues.petAloneTime}
                  disabled
                />
              </div>
            </div>

            <div className="form-group row">
              <label
                htmlFor="currentPets"
                className="col-sm-4 col-form-label labelLeft"
              >
                Any current pets?
              </label>
              <div className="col-sm-8">
                <input
                  className="form-control"
                  id="currentPets"
                  value={formValues.currentPets}
                  disabled
                />
              </div>
            </div>

            <div className="form-group row">
              <label
                htmlFor="dailyRoutine"
                className="col-sm-4 col-form-label labelLeft"
              >
                Daily Routine
              </label>
              <div className="col-sm-8">
                <input
                  className="form-control"
                  id="dailyRoutine"
                  value={formValues.dailyRoutine}
                  disabled
                />
              </div>
            </div>

            <div className="form-group row">
              <label
                htmlFor="expenses"
                className="col-sm-4 col-form-label labelLeft"
              >
                Expenses
              </label>
              <div className="col-sm-8">
                <input
                  className="form-control"
                  id="expenses"
                  value={formValues.expenses}
                  disabled
                />
              </div>
            </div>

            <div className="form-group row">
              <label
                htmlFor="prevPets"
                className="col-sm-4 col-form-label labelLeft"
              >
                Previous Pets
              </label>
              <div className="col-sm-8">
                <input
                  className="form-control"
                  id="prevPets"
                  value={formValues.prevPets}
                  disabled
                />
              </div>
            </div>

            <div className="form-group row">
              <label
                htmlFor="reason"
                className="col-sm-4 col-form-label labelLeft"
              >
                Reason
              </label>
              <div className="col-sm-8">
                <input
                  className="form-control"
                  id="reason"
                  value={formValues.reason}
                  disabled
                />
              </div>
            </div>

            <div className="form-group row">
              <label
                htmlFor="name1"
                className="col-sm-4 col-form-label labelLeft"
              >
                Reference #1
              </label>
              <div className="col-sm-8">
                <input
                  className="form-control"
                  id="name1"
                  value={formValues.name1}
                  disabled
                />
              </div>
            </div>
            <div className="form-group row">
              <label
                htmlFor="phoneNumber1"
                className="col-sm-4 col-form-label labelLeft emptyLabel"
              ></label>
              <div className="col-sm-8">
                <input
                  className="form-control"
                  id="phoneNumber1"
                  value={formValues.phoneNumber1}
                  disabled
                />
              </div>
            </div>
            <div className="form-group row">
              <label
                htmlFor="email1"
                className="col-sm-4 col-form-label labelLeft emptyLabel"
              ></label>
              <div className="col-sm-8">
                <input
                  type="email"
                  value={formValues.email1}
                  className="form-control"
                  id="email1"
                  disabled
                />
              </div>
            </div>

            {/* user is a seeker */}
            {/* {currentUser.firstname ? ( */}
            <div className="twoButtonPositions">
              <div className="form-group row">
                <div className="col-sm-6" id="buttonCenter">
                  <Link
                    className="backButton form-control"
                    to={`/pet/applications/`}
                    style={{ textDecoration: "none" }}
                  >
                    Back
                  </Link>
                </div>

                {formValues.application_status === "Pending" ? (
                  <div className="col-sm-6" id="buttonCenter">
                    <button
                      type="button"
                      onClick={handleEdit}
                      className="btn btn-primary nextButton"
                    >
                      Approved
                    </button>
                  </div>
                ) : null}
                {formValues.application_status === "Pending" ? (
                  <div className="col-sm-6" id="buttonCenter">
                    <button
                      type="button"
                      onClick={handleEdit}
                      className="btn btn-primary nextButton"
                    >
                      Rejected
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
            {/*               
            ) : currentUser.shelter_name ? (
              <div className="twoButtonPositions">
                <div className="form-group row">
                  <div className="col-sm-6" id="buttonCenter">
                    <Link
                      className="backButton form-control"
                      to={`/`}
                      style={{ textDecoration: "none" }}
                    >
                      Back
                    </Link>
                  </div>

                  <div className="col-sm-6" id="buttonCenter">
                    <button
                      type="button"
                      onClick={setFormStatus("Rejected")}
                      className="btn btn-primary nextButton"
                    >
                      Reject
                    </button>
                  </div>

                  <div className="col-sm-6" id="buttonCenter">
                    <button
                      type="button"
                      onClick={setFormStatus("Approved")}
                      className="btn btn-primary nextButton"
                    >
                      Approve
                    </button>
                  </div>

                </div>
              </div>
            ) : null} */}
          </form>
        </div>
      </div>
    </>
  );
} else {
    return <h1>This Application does not exist.</h1>;
}
}

export default ViewEditApplication;
