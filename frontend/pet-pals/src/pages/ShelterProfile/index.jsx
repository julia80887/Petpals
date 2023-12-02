import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom"; // Import useParams from react-router-dom
import "bootstrap/dist/css/bootstrap.min.css";
import "./style.css";
// import "react-select/dist/react-select.css";

function ShelterProfile() {
  // boolean variable to represent that an error was found when validating fields
  let errorFound = false;
  const [profilePic, setProfilePic] = useState("");
  // loading use state
  const [loading, setLoading] = useState(true);
  // used to put any errors from validation into a dict
  const [errorJson, setErrorJson] = useState({});
  // boolean use state to change to and from edit mode when edit button clicked
  const [isEditMode, setIsEditMode] = useState(false);
  // getting shelter id from the url
  const { shelter_id } = useParams();
  // used to store form values
  const [formValues, setFormValues] = useState({
    user: {
      fileInput: "",
      email: "",
      password: "",
      inputAddress: "",
      inputAddress2: "",
      inputCity: "",
      inputState: "",
      postalCode: "",
      phoneNumber: "",
    },
    shelterName: "",
  });
  // used to store provinces for select dropdown
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

  // function for validating the values in the form
  function validateForm() {
    const shelterName = document.getElementById("shelterName").value;
    const email = document.getElementById("email").value;
    const inputAddress = document.getElementById("inputAddress").value;
    const inputAddress2 = document.getElementById("inputAddress2").value;
    const inputCity = document.getElementById("inputCity").value;
    const inputState = document.getElementById("inputState").value;
    const postalCode = document.getElementById("postalCode").value;
    const phoneNumber = document.getElementById("phoneNumber").value;

    // validation for shelter name -> checking not empty
    const nameRegex = /.+/;
    if (!nameRegex.test(shelterName)) {
      setErrorJson((prevValues) => ({
        ...prevValues,
        shelterName: "Shelter name cannot be blank.",
      }));
      console.log(errorJson);
      errorFound = true;
    }

    // const phoneRegex = /^\d{10,15}$/;
    // if (!phoneRegex.test(phoneNumber)) {
    //     setErrorJson((prevValues) => ({
    //       ...prevValues,
    //       phoneNumber: "Phone number should consist of 10-15 digits.",
    //     }));
    //     console.log(errorJson);
    //     errorFound = true;
    //   }

    // validation for address -> check that either all address fields are blank or all address fields
    // are filled out
    if (
      !(
        (!nameRegex.test(inputAddress) &&
          !nameRegex.test(inputAddress2) &&
          !nameRegex.test(inputCity) &&
          !nameRegex.test(inputState) &&
          !nameRegex.test(postalCode)) ||
        (nameRegex.test(inputAddress) &&
          nameRegex.test(inputAddress2) &&
          nameRegex.test(inputCity) &&
          nameRegex.test(inputState) &&
          nameRegex.test(postalCode))
      )
    ) {
      setErrorJson((prevValues) => ({
        ...prevValues,
        postalCode: "All address fields must be filled in or blank.",
      }));
      console.log(errorJson);
      errorFound = true;
    }

    // validation for email -> check that valid email field was entered and its not empty
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorJson((prevValues) => ({
        ...prevValues,
        email: "Enter a valid email address.",
      }));
      console.log(errorJson);
      errorFound = true;
    }

    // if any errors were found, return false
    if (errorFound) {
      return false;
    }
    return true;
  }

  // initial fetch
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const myHeaders = new Headers();
        myHeaders.append(
          "Authorization",
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzAxNTYwNjI0LCJpYXQiOjE3MDE0NzQyMjQsImp0aSI6ImQxOTA5Y2FiNmYxMzQ1NDU5ZThhNjAyNzViNzcyODRjIiwidXNlcl9pZCI6MTF9.dzzLs16Ic9Vf_my12nYBS6CjQfKIoQTvTdg4eqIw3h0"
        );

        const requestOptions = {
          method: "GET",
          headers: myHeaders,
        };

        const response = await fetch(
          `http://localhost:8000/shelter/${shelter_id}/`,
          requestOptions
        );
        const result = await response.json();
        // set all form values to the values from backend
        setProfilePic(result.user.profile_photo);

        setFormValues({
          user: {
            fileInput: "",
            email: result.user.email,
            password: "", // password cannot be changed
            // split address given by backend into 5 different address fields
            inputAddress: result.user.address
              ? result.user.address.split(",")[0]
              : "",
            inputAddress2: result.user.address
              ? result.user.address.split(",")[1]
              : "",
            inputCity: result.user.address
              ? result.user.address.split(",")[2]
              : "",
            inputState: result.user.address
              ? result.user.address.split(",")[3]
              : "",
            postalCode: result.user.address
              ? result.user.address.split(",")[4]
              : "",
            phoneNumber: result.user.phone_number || "",
          },
          shelterName: result.shelter_name,
        });
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Error:", error);
      }
    };

    fetchData();
  }, []);

  // just for console printing purposes
  // useEffect(() => {
  //   console.log("FORM VALUES: ", formValues);
  // }, [formValues]);

  // event listener for when a text field in the form is edited
  const handleInputChange = (e) => {
    if (validateForm) {
      console.log(`Name: ${e.target.id}, Value: ${e.target.value}`);
      setFormValues((prevValues) => ({
        ...prevValues,
        user: {
          ...prevValues.user,
          [e.target.id]: e.target.value,
        },
      }));
    }
  };

  // event listener for when shelter name in the form is edited
  const handleNameChange = (e) => {
    if (validateForm) {
      //   const { name, value } = e.target;
      console.log(`Name: ${e.target.id}, Value: ${e.target.value}`);
      setFormValues((prevValues) => ({
        ...prevValues,
        shelterName: e.target.value,
      }));
    }
  };

  // event listener for when select in the form is edited
  const handleSelectChange = (selectedOption) => {
    if (validateForm) {
      setFormValues((prevValues) => ({
        ...prevValues,
        user: {
          ...prevValues.user,
          inputState: selectedOption.value,
        },
      }));
    }
  };

  // event listener for when a user hits submit on the form
  function handle_submit(event) {
    event.preventDefault();
    // get rid of all previous errors
    setErrorJson(() => ({}));
    errorFound = false;

    // concatenate addresses to pass to backend -> if all fields empty, set it to null
    let full_address =
      event.target.inputAddress.value !== '' &&
        event.target.inputAddress2.value !== '' &&
        event.target.inputCity.value !== '' &&
        event.target.postalCode.value !== ''
        ? event.target.inputAddress.value +
        " ," +
        event.target.inputAddress2.value +
        " ," +
        event.target.inputCity.value +
        " ," +
        event.target.inputState.value +
        " ," +
        event.target.postalCode.value
        : '';
    const formData = new FormData();
    //data to pass to backend
    // const stuff = {
    //   shelter_name: event.target.shelterName.value,
    //   user: {
    //     profile_photo: event.target.fileInput &&
    //       event.target.fileInput.value != "" ? event.target.fileInput.value : "http://localhost:8000/media/default.jpg",
    //     email: event.target.email ? event.target.email.value : null,
    //     address: full_address,
    //     phone_number:
    //       event.target.phoneNumber && event.target.phoneNumber.value
    //         ? event.target.phoneNumber.value
    //         : null,
    //   }
    // };

    // Append shelter_name
    formData.append('shelter_name', event.target.shelterName.value);

    // Append user data
    if (event.target.fileInput.files[0]) {
      formData.append('user.profile_photo', event.target.fileInput?.files[0] ? event.target.fileInput?.files[0] : "http://localhost:8000/media/default.jpg");

    }

    if (full_address !== "") {
      formData.append('user.address', full_address);

    }
    formData.append('user.email', event.target.email ? event.target.email.value : null);
    console.log("value", event.target.phoneNumber);
    console.log("type", typeof event.target.phoneNumber);
    if (event.target.phoneNumber) {
      console.log('reached')
      formData.append('user.phone_number', event.target.phoneNumber && event.target.phoneNumber.value ? event.target.phoneNumber.value : "");

    }

    //console.log(formData.get('user.phone_number'));
    console.log(formData.get('user.profile_photo'));
    // chekc if form is valid, if not remain in edit mode and return early
    if (!validateForm()) {
      setIsEditMode(true);
      return;
    }

    // if you are here, validation passed, so make PUT request
    try {
      setLoading(true);
      const requestOptions = {
        method: 'PUT',
        headers: {
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzAxNTYwNjI0LCJpYXQiOjE3MDE0NzQyMjQsImp0aSI6ImQxOTA5Y2FiNmYxMzQ1NDU5ZThhNjAyNzViNzcyODRjIiwidXNlcl9pZCI6MTF9.dzzLs16Ic9Vf_my12nYBS6CjQfKIoQTvTdg4eqIw3h0',
        },
        body: formData, // Use the FormData object directly as the body
      };

      fetch(`http://localhost:8000/shelter/${shelter_id}/`, requestOptions)
        .then((response) => response.json())
        .then((data) => { console.log(data); })
        .then((data) => {

          setProfilePic(data?.data?.user?.profile_photo); console.log("RESPONSE: ", data);
        }
        )
        .finally(() => setLoading(false));
    } catch (error) {
      setLoading(false);
      console.error('Error:', error);
      setIsEditMode(true);
    }
  }

  return (
    <>
      {loading ? (
        <p>Loading.....</p>
      ) : (
          <div className="allData">
            <h1>Your Shelter Profile</h1>
            <div className="container">
              <form
                className="createPetForm"
                style={{ backgroundColor: "white" }}
                onSubmit={handle_submit}
              >
                <div className="imgPlacement">
                  <div className="frame form-group">
                    <img
                      src={profilePic ? profilePic : "http://localhost:8000/media/default.jpg"}
                      alt="Shelter"
                    />
                  </div>
                </div>

                <div className="form-group row">
                  <label
                    htmlFor="fileInput"
                    className="col-sm-4 col-form-label labelLeft"
                  >
                    Photo
                </label>
                  <div className="col-sm-8">
                    <input
                      type="file"
                      className="form-control"
                      id="fileInput"
                      disabled={!isEditMode}
                      onChange={handleInputChange}
                    // defaultValue={formValues.user.fileInput}
                    />
                  </div>
                </div>

                <div className="form-group row">
                  <label
                    htmlFor="shelterName"
                    className="col-sm-4 col-form-label labelLeft"
                  >
                    Shelter Name
                </label>
                  <div className="col-sm-8">
                    <input
                      type="text"
                      className="form-control"
                      id="shelterName"
                      defaultValue={formValues.shelterName} // Replace with the actual value
                      disabled={!isEditMode}
                      onChange={handleNameChange}
                    />
                    <p className="error">{errorJson.shelterName || " "}</p>
                  </div>
                  {/* {error && <p className="error">{error}</p>} */}
                </div>

                <div className="form-group row">
                  <label
                    htmlFor="input"
                    className="col-sm-4 col-form-label labelLeft"
                  >
                    Email
                </label>
                  <div className="col-sm-8">
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      defaultValue={formValues.user.email}
                      disabled={!isEditMode}
                      onChange={handleInputChange}
                    />
                    <p className="error">{errorJson.email || " "}</p>
                  </div>
                </div>

                <div className="form-group row">
                  <label
                    htmlFor="password"
                    className="col-sm-4 col-form-label labelLeft"
                  >
                    Password
                </label>
                  <div className="col-sm-8">
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      defaultValue={formValues.user.password}
                      disabled
                      onChange={handleInputChange}
                      style={isEditMode ? { cursor: "not-allowed" } : {}}
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
                      type="text"
                      className="form-control"
                      id="inputAddress"
                      defaultValue={formValues.user.inputAddress}
                      disabled={!isEditMode}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="form-group row">
                  <label
                    htmlFor="inputAddress2"
                    className="col-sm-4 col-form-label labelLeft emptyLabel"
                  ></label>
                  <div className="col-sm-8">
                    <input
                      type="text"
                      className="form-control"
                      id="inputAddress2"
                      defaultValue={formValues.user.inputAddress2}
                      disabled={!isEditMode}
                      onChange={handleInputChange}
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
                      type="text"
                      className="form-control"
                      id="inputCity"
                      defaultValue={formValues.user.inputCity}
                      disabled={!isEditMode}
                      onChange={handleInputChange}
                    />
                  </div>

                  <label
                    htmlFor="inputState"
                    className="col-sm-4 col-form-label labelLeft"
                  >
                    Province
                </label>
                  {/* <div className="" style={{display: "flex", alignItems: "center"}}> */}
                  {/* <select
                id="inputState"
                className="form-control"
                value={profileInfo.address ? profileInfo.address.split(', ')[3] : ""}
                disabled
              > */}
                  <div className="col-sm-4">
                    <select
                      id="inputState"
                      onChange={handleSelectChange}
                      defaultValue={formValues.user.inputState}
                      disabled={!isEditMode}
                      style={{
                        backgroundColor: !isEditMode ? "#E9ECEF" : "#FAFAFA",
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
                    >
                      {[...provinces].map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-sm-4">
                    <input
                      type="text"
                      className="form-control"
                      id="postalCode"
                      defaultValue={formValues.user.postalCode}
                      disabled={!isEditMode}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="errorBox">
                    <p className="error">{errorJson.postalCode || ""}</p>
                  </div>
                </div>

                <div className="form-group row">
                  <label
                    htmlFor="phoneNumber"
                    className="col-sm-4 col-form-label labelLeft"
                    id="phoneNumber"
                  >
                    Phone Number
                </label>
                  <div className="col-sm-8">
                    <input
                      type="text"
                      className="form-control"
                      id="phoneNumber"
                      defaultValue={formValues.user.phoneNumber}
                      disabled={!isEditMode}
                      onChange={handleInputChange}
                    />
                    <p className="error">{errorJson.phoneNumber || ""}</p>
                  </div>
                </div>

                <div className="twoButtonPositions">
                  <div className="form-group row">
                    <div className="col-sm-6 buttonCenter">
                      <button
                        type={!isEditMode ? "submit" : "button"}
                        className="backButton form-control"
                        onClick={() => setIsEditMode(!isEditMode)}
                      >
                        {isEditMode ? "Save" : "Edit"}
                      </button>
                    </div>
                    <div className="col-sm-6 buttonCenter">
                      <Link
                        className="nextButton form-control"
                        to={`/`}
                        style={{ textDecoration: "none" }}
                      >
                        Home
                    </Link>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
    </>
  );
}

export default ShelterProfile;
