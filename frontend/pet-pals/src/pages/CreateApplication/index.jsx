import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom"; // Import useParams from react-router-dom
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/css/bootstrap.css";
import "./style.css";
import { useNavigate } from "react-router-dom";
// import "react-select/dist/react-select.css";
// import { LoginContext } from '../../contexts/LoginContext';

function CreateApplication() {
  const { pet_id } = useParams();
  const [errorJson, setErrorJson] = useState({});
  let errorFound = false;
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [petDetails, setPetDetails] = useState({});
  // const { currentUser, setCurrentUser } = useContext(LoginContext);
  const shelter_user = localStorage.getItem('shelter_name') || "";
  const seeker_user = localStorage.getItem('firstname') || "";


  const handleNext = (e) => {
    e.preventDefault();

    if (step == 1) {
      if (validateFormPage1()) {
        setStep(step + 1);
      }
    }
    if (step == 2) {
      if (validateFormPage2()) {
        setStep(step + 1);
      }
    }
    if (step == 3) {
      if (validateFormPage3()) {
        setStep(step + 1);
      }
    }
  };
  const handlePrev = () => {
    if (step == 2) {
      setStep(step - 1);
    }
    if (step == 3) {
      setStep(step - 1);
    }
    if (step == 4) {
      setStep(step - 1);
    }
  };
  // used to store provinces for select dropdown
  const houses = [
    "",
    "House",
    "Apartment",
    "Condo",
    "Townhouse",
    "Mobile Home",
  ];
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
  const owners = ["", "Own", "Rent"];

  const [firstPageFormValues, setFirstPageFormValues] = useState({
    phoneNumber: "",
    inputAddress: "",
    inputAddress2: "",
    inputCity: "",
    inputState: "",
    postalCode: "",
    email: "",
    firstName: "",
    lastName: "",
  });
  const [secondPageFormValues, setSecondPageFormValues] = useState({
    numAdults: "",
    numChildren: "",
    houseType: "",
    ownershipType: "",
    petAloneTime: "",
    currentPets: "",
  });
  const [thirdPageFormValues, setThirdPageFormValues] = useState({
    dailyRoutine: "",
    expenses: "",
    prevPets: "",
    preferences: "",
    reason: "",
  });
  const [fourthPageFormValues, setFourthPageFormValues] = useState({
    name1: "",
    phoneNumber1: "",
    email1: "",
    additionalComments: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const requestOptions = {
          method: "GET",
        };
        const response = await fetch(
          `http://localhost:8000/pet/${pet_id}/`,
          requestOptions
        );
        const result = await response.json();
        // if (petDetails["detail"] == "Not found.") {
        //   navigate(`/`);
        // }
        setPetDetails(result);
        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchData();
  }, [pet_id]);

  function handleSubmit(event) {
    if (!validateFormPage4) {
      return;
    }

    event.preventDefault();
    // get rid of all previous errors
    setErrorJson(() => ({}));
    errorFound = false;

    const formData = new FormData();

    // page 1
    let full_name =
      firstPageFormValues.firstName !== "" &&
      firstPageFormValues.lastName !== ""
        ? firstPageFormValues.firstName + " " + firstPageFormValues.lastName
        : "";

    formData.append("name", full_name);
    formData.append("address1", firstPageFormValues.inputAddress);
    formData.append("address2", firstPageFormValues.inputAddress2);
    formData.append("city", firstPageFormValues.inputCity);
    formData.append("province", firstPageFormValues.inputState);
    formData.append("zip_code", firstPageFormValues.postalCode);

    formData.append("email", firstPageFormValues.email);
    formData.append("phone_number", firstPageFormValues.phoneNumber);

    // page 2
    formData.append("num_adults", secondPageFormValues.numAdults);
    formData.append("num_children", secondPageFormValues.numChildren);
    formData.append("residence", secondPageFormValues.houseType);
    formData.append("ownership", secondPageFormValues.ownershipType);
    formData.append("pet_alone_time", secondPageFormValues.petAloneTime);
    formData.append("current_pets", secondPageFormValues.currentPets);

    // page 3
    formData.append("daily_routine", thirdPageFormValues.dailyRoutine);
    formData.append("expenses", thirdPageFormValues.expenses);
    formData.append("previous_pets", thirdPageFormValues.prevPets);
    formData.append("reason", thirdPageFormValues.reason);
    formData.append("preferences", thirdPageFormValues.preferences);

    // page 4
    formData.append("reference_name", event.target.name1.value);
    formData.append("reference_number", event.target.phoneNumber1.value);
    formData.append("reference_email", event.target.email1.value);
    formData.append(
      "additional_comments",
      event.target.additionalComments.value
    );
    console.log(JSON.stringify(formData));

    // if you are here, validation passed, so make PUT request
    if (petDetails) {
    try {
      const requestOptions = {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access')}`,
        },
        body: formData, // Use the FormData object directly as the body
      };

      fetch(`http://localhost:8000/pet/${pet_id}/applications/`, requestOptions)
        .then((response) => response.json())
        .then((data) => {
          if (data['message'] == 'Application successfully created.') {
              navigate(`/pet/${pet_id}/`);
          }
        });
      // navigate(`/pet/${pet_id}/`);
    } catch (error) {
      console.error("Error:", error);
    }
  }
}

  function validateFormPage4() {
    const name1 = document.getElementById("name1").value;
    const phoneNumber1 = document.getElementById("phoneNumber1").value;
    const email1 = document.getElementById("email1").value;
    const additionalComments =
      document.getElementById("additionalComments").value;

    // validation for shelter name -> checking not empty
    const nameRegex = /.+/;
    if (!nameRegex.test(name1)) {
      setErrorJson((prevValues) => ({
        ...prevValues,
        name1: "Reference name cannot be blank.",
      }));
      console.log(errorJson);
      errorFound = true;
    }

    if (!nameRegex.test(additionalComments)) {
      setErrorJson((prevValues) => ({
        ...prevValues,
        additionalComments:
          "Please write N/A if you have no additional comments.",
      }));
      console.log(errorJson);
      errorFound = true;
    }

    const phoneRegex = /^\d{10,15}$/;
    if (!phoneRegex.test(phoneNumber1)) {
      setErrorJson((prevValues) => ({
        ...prevValues,
        phoneNumber1:
          "Phone number should consist only consist of numbers and be 10 -15 characters in length.",
      }));
      console.log(errorJson);
      errorFound = true;
    }

    // validation for email -> check that valid email field was entered and its not empty
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email1)) {
      setErrorJson((prevValues) => ({
        ...prevValues,
        email1: "Enter a valid email address.",
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

  function validateFormPage3() {
    const dailyRoutine = document.getElementById("dailyRoutine").value;
    const expenses = document.getElementById("expenses").value;
    const prevPets = document.getElementById("prevPets").value;
    const preferences = document.getElementById("preferences").value;
    const reason = document.getElementById("reason").value;

    // validation for shelter name -> checking not empty
    const nameRegex = /.+/;
    if (!nameRegex.test(dailyRoutine)) {
      setErrorJson((prevValues) => ({
        ...prevValues,
        dailyRoutine: "Cannot be blank.",
      }));
      console.log(errorJson);
      errorFound = true;
    }
    if (!nameRegex.test(expenses)) {
      setErrorJson((prevValues) => ({
        ...prevValues,
        expenses: "Cannot be blank.",
      }));
      console.log(errorJson);
      errorFound = true;
    }
    if (!nameRegex.test(prevPets)) {
      setErrorJson((prevValues) => ({
        ...prevValues,
        prevPets: "Cannot be blank.",
      }));
      console.log(errorJson);
      errorFound = true;
    }
    if (!nameRegex.test(preferences)) {
      setErrorJson((prevValues) => ({
        ...prevValues,
        preferences: "Cannot be blank.",
      }));
      console.log(errorJson);
      errorFound = true;
    }
    if (!nameRegex.test(reason)) {
      setErrorJson((prevValues) => ({
        ...prevValues,
        reason: "Cannot be blank.",
      }));
      console.log(errorJson);
      errorFound = true;
    }
    if (errorFound) {
      return false;
    }
    return true;
  }

  // function for validating the values in the form
  function validateFormPage2() {
    const numAdults = document.getElementById("numAdults").value;
    const numChildren = document.getElementById("numChildren").value;
    const houseType = document.getElementById("houseType").value;
    const ownershipType = document.getElementById("ownershipType").value;
    const petAloneTime = document.getElementById("petAloneTime").value;
    const currentPets = document.getElementById("currentPets").value;

    // validation for shelter name -> checking not empty
    const nameRegex = /.+/;
    const numRegex = /^\d+$/;
    if (!numRegex.test(numAdults)) {
      setErrorJson((prevValues) => ({
        ...prevValues,
        numAdults: "Must be a valid number",
      }));
      console.log(errorJson);
      errorFound = true;
    }

    if (!numRegex.test(numChildren)) {
      setErrorJson((prevValues) => ({
        ...prevValues,
        numChildren: "Must be a valid number",
      }));
      console.log(errorJson);
      errorFound = true;
    }

    if (!nameRegex.test(houseType)) {
      setErrorJson((prevValues) => ({
        ...prevValues,
        houseType: "Cannot be blank.",
      }));
      console.log(errorJson);
      errorFound = true;
    }

    if (!nameRegex.test(ownershipType)) {
      setErrorJson((prevValues) => ({
        ...prevValues,
        ownershipType: "Cannot be blank.",
      }));
      console.log(errorJson);
      errorFound = true;
    }

    if (!nameRegex.test(petAloneTime)) {
      setErrorJson((prevValues) => ({
        ...prevValues,
        petAloneTime: "Cannot be blank.",
      }));
      console.log(errorJson);
      errorFound = true;
    }

    if (!nameRegex.test(currentPets)) {
      setErrorJson((prevValues) => ({
        ...prevValues,
        currentPets: "Cannot be blank.",
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

  // function for validating the values in the form
  function validateFormPage1() {
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const email = document.getElementById("email").value;
    const inputAddress = document.getElementById("inputAddress").value;
    const inputAddress2 = document.getElementById("inputAddress2").value;
    const inputCity = document.getElementById("inputCity").value;
    const inputState = document.getElementById("inputState").value;
    const postalCode = document.getElementById("postalCode").value;
    const phoneNumber = document.getElementById("phoneNumber").value;
    console.log(phoneNumber);
    console.log(typeof phoneNumber);

    // validation for shelter name -> checking not empty
    const nameRegex = /.+/;
    if (!nameRegex.test(firstName)) {
      setErrorJson((prevValues) => ({
        ...prevValues,
        firstName: "First name cannot be blank.",
      }));
      console.log(errorJson);
      errorFound = true;
    }

    if (!nameRegex.test(lastName)) {
      setErrorJson((prevValues) => ({
        ...prevValues,
        lastName: "First name cannot be blank.",
      }));
      console.log(errorJson);
      errorFound = true;
    }

    const phoneRegex = /^\d{10,15}$/;
    if (!phoneRegex.test(phoneNumber)) {
      setErrorJson((prevValues) => ({
        ...prevValues,
        phoneNumber:
          "Phone number should consist only consist of numbers and be 10 -15 characters in length.",
      }));
      console.log(errorJson);
      errorFound = true;
    }

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

  /// when press done, this page links to the view applciation page for seekes
  /// which will have the home and edit button

  const handleInputChange = (e) => {
    if (step == 1) {
      setFirstPageFormValues((prevValues) => ({
        ...prevValues,
        [e.target.id]: e.target.value,
      }));
    } else if (step == 2) {
      setSecondPageFormValues((prevValues) => ({
        ...prevValues,
        [e.target.id]: e.target.value,
      }));
    } else if (step == 3) {
      setThirdPageFormValues((prevValues) => ({
        ...prevValues,
        [e.target.id]: e.target.value,
      }));
    } else if (step == 4) {
      setFourthPageFormValues((prevValues) => ({
        ...prevValues,
        [e.target.id]: e.target.value,
      }));
    }
  };

  // event listener for when select in the form is edited
  //   const handleSelectChange = (selectedOption) => {
  //     if (validateForm) {
  //       setFirstPageFormValues((prevValues) => ({
  //         ...prevValues,
  //         user: {
  //           ...prevValues.user,
  //           inputState: selectedOption.target.value,
  //         },
  //       }));
  //     }
  //   };
  if (loading) {
    return <p>Loading...</p>;
  }

  if (petDetails["detail"] == "Not found.") {
    return <h1>This Pet does not exist.</h1>;
  } else {
    console.log(seeker_user);
    console.log(shelter_user);
    console.log(localStorage);
    if (seeker_user != "") {
    switch (step) {
      case 1:
        return (
          <>
            <div className="mainContainer">
              <h1 className="question">
                Are you ready to adopt {petDetails.name}?
              </h1>
              <h2>1. Personal Information</h2>
              <div className="container">
                <form
                  className="createPetForm"
                  style={{ backgroundColor: "white" }}
                  onSubmit={handleNext}
                >
                  <div className="form-group row">
                    <label
                      htmlFor="firstName"
                      className="col-sm-4 col-form-label labelLeft"
                    >
                      First Name
                    </label>
                    <div className="col-sm-8">
                      <input
                        onChange={handleInputChange}
                        type="text"
                        className="form-control"
                        id="firstName"
                        value={firstPageFormValues.firstName}
                        required
                      />
                      <p className="error">{errorJson.firstName || ""}</p>
                    </div>
                  </div>

                  <div className="form-group row">
                    <label
                      htmlFor="lastName"
                      className="col-sm-4 col-form-label labelLeft"
                    >
                      Last Name
                    </label>
                    <div className="col-sm-8">
                      <input
                        onChange={handleInputChange}
                        type="text"
                        className="form-control"
                        id="lastName"
                        value={firstPageFormValues.lastName}
                        required
                      />
                      <p className="error">{errorJson.lastName || ""}</p>
                    </div>
                  </div>

                  <div className="form-group row">
                    <label
                      htmlFor="phoneNumber"
                      className="col-sm-4 col-form-label labelLeft"
                    >
                      Phone #
                    </label>
                    <div className="col-sm-8">
                      <input
                        onChange={handleInputChange}
                        type="tel"
                        className="form-control"
                        id="phoneNumber"
                        value={firstPageFormValues.phoneNumber}
                        required
                      />
                      <p className="error">{errorJson.phoneNumber || ""}</p>
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
                        onChange={handleInputChange}
                        type="email"
                        className="form-control"
                        id="email"
                        value={firstPageFormValues.email}
                        required
                      />
                      <p className="error">{errorJson.email || ""}</p>
                    </div>
                  </div>

                  <div className="form-group row">
                    <label
                      htmlFor="inputAddress"
                      className="col-sm-4 col-form-label labelLeft"
                    >
                      Address 1
                    </label>
                    <div className="col-sm-8">
                      <input
                        onChange={handleInputChange}
                        type="text"
                        className="form-control"
                        id="inputAddress"
                        value={firstPageFormValues.inputAddress}
                        placeholder="Street Address"
                        required
                      />
                      <p className="error">{errorJson.inputAddress || ""}</p>
                    </div>
                  </div>

                  <div className="form-group row">
                    <label
                      htmlFor="inputAddress2"
                      className="col-sm-4 col-form-label labelLeft"
                    >
                      Address 2
                    </label>
                    <div className="col-sm-8">
                      <input
                        onChange={handleInputChange}
                        type="text"
                        className="form-control"
                        id="inputAddress2"
                        value={firstPageFormValues.inputAddress2}
                        placeholder="Unit, Floor"
                        required
                      />
                      <p className="error">{errorJson.inputAddress2 || ""}</p>
                    </div>
                  </div>

                  <div className="form-group row">
                    <label
                      htmlFor="inputCity"
                      className="col-sm-4 col-form-label labelLeft emptyLabel"
                    ></label>
                    <div className="col-sm-8">
                      <input
                        onChange={handleInputChange}
                        type="text"
                        className="form-control"
                        id="inputCity"
                        value={firstPageFormValues.inputCity}
                        placeholder="City"
                        required
                      />
                      <p className="error">{errorJson.inputCity || ""}</p>
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
                        onChange={handleInputChange}
                        value={firstPageFormValues.inputState}
                        style={{
                          backgroundColor: "#FAFAFA",
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
                        {[...provinces].map((p) =>
                          firstPageFormValues.inputState == { p } ? (
                            <option key={p} value={p} selectedOption>
                              {p}
                            </option>
                          ) : (
                            <option key={p} value={p}>
                              {p}
                            </option>
                          )
                        )}
                      </select>
                      <p className="error">{errorJson.inputState || ""}</p>
                    </div>
                    <div className="col-sm-4">
                      <input
                        className="form-control"
                        id="postalCode"
                        value={firstPageFormValues.postalCode}
                        onChange={handleInputChange}
                        placeholder="Postal Code"
                        required
                      />
                      <p className="error">{errorJson.postalCode || ""}</p>
                    </div>
                  </div>

                  <div className="twoButtonPositions">
                    <div className="form-group row">
                      <div className="col-sm-6" id="buttonCenter">
                        <Link
                          className="backButton form-control"
                          to={`/pet/details/${pet_id}/`}
                          style={{ textDecoration: "none" }}
                        >
                          Back
                        </Link>
                      </div>
                      <div className="col-sm-6" id="buttonCenter">
                        <button
                          type="submit"
                          className="btn btn-primary nextButton"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </>
        );

      case 2:
        return (
          <>
            <div className="mainContainer2">
              <h1 className="question">Are you ready to adopt Rufus?</h1>
              <h2>2. Household Information</h2>
              <div className="container">
                <form
                  className="createPetForm"
                  style={{ backgroundColor: "white" }}
                  onSubmit={handleNext}
                >
                  <div className="form-group row">
                    <label
                      htmlFor="numAdults"
                      className="col-sm-4 col-form-label labelLeft"
                    >
                      Number of Adults
                    </label>
                    <div className="col-sm-8">
                      <input
                        className="form-control"
                        id="numAdults"
                        onChange={handleInputChange}
                        value={secondPageFormValues.numAdults}
                        required
                      />
                      <p className="error">{errorJson.numAdults || ""}</p>
                    </div>
                  </div>

                  <div className="form-group row">
                    <label
                      htmlFor="numChildren"
                      className="col-sm-4 col-form-label labelLeft"
                    >
                      Number of Children
                    </label>
                    <div className="col-sm-8">
                      <input
                        className="form-control"
                        id="numChildren"
                        onChange={handleInputChange}
                        value={secondPageFormValues.numChildren}
                        required
                      />
                      <p className="error">{errorJson.numChildren || ""}</p>
                    </div>
                  </div>

                  <div className="form-group row">
                    <label
                      htmlFor="houseType"
                      className="col-sm-4 col-form-label labelLeft"
                    >
                      Type of Residence
                    </label>

                    <div className="col-sm-4">
                      <select
                        id="houseType"
                        onChange={handleInputChange}
                        value={secondPageFormValues.houseType}
                        style={{
                          backgroundColor: "#FAFAFA",
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
                        {[...houses].map((p) =>
                          secondPageFormValues.houseType == { p } ? (
                            <option key={p} value={p} selectedOption>
                              {p}
                            </option>
                          ) : (
                            <option key={p} value={p}>
                              {p}
                            </option>
                          )
                        )}
                      </select>
                      <p className="error">{errorJson.houseType || ""}</p>
                    </div>

                    <div className="col-sm-4">
                      {/* <label
                      htmlFor="ownershipType"
                      className="col-sm-4 col-form-label labelLeft"
                    ></label> */}
                      <select
                        id="ownershipType"
                        onChange={handleInputChange}
                        value={secondPageFormValues.ownershipType}
                        style={{
                          backgroundColor: "#FAFAFA",
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
                        {[...owners].map((p) =>
                          secondPageFormValues.ownershipType == { p } ? (
                            <option key={p} value={p} selectedOption>
                              {p}
                            </option>
                          ) : (
                            <option key={p} value={p}>
                              {p}
                            </option>
                          )
                        )}
                      </select>
                      <p className="error">{errorJson.ownershipType || ""}</p>
                    </div>
                  </div>

                  <div className="form-group row">
                    <label
                      className="col-sm-4 col-form-label descriptionLabel"
                      htmlFor="petAloneTime"
                    >
                      How often will the pet be alone?
                    </label>
                    <div className="col-sm-8">
                      <input
                        className="form-control"
                        id="petAloneTime"
                        value={secondPageFormValues.petAloneTime}
                        onChange={handleInputChange}
                        style={{
                          height: "100px",
                          borderRadius: "70px",
                          paddingBottom: "60px",
                          whiteSpace: "normal",
                        }}
                        required
                      />
                      <p className="error">{errorJson.petAloneTime || ""}</p>
                    </div>
                  </div>

                  <div className="form-group row">
                    <label
                      className="col-sm-4 col-form-label descriptionLabel"
                      htmlFor="currentPets"
                    >
                      Any current pets?
                    </label>
                    <div className="col-sm-8">
                      <input
                        className="form-control"
                        id="currentPets"
                        value={secondPageFormValues.currentPets}
                        onChange={handleInputChange}
                        style={{
                          height: "100px",
                          borderRadius: "70px",
                          paddingBottom: "60px",
                          whiteSpace: "normal",
                        }}
                        required
                      />
                      <p className="error">{errorJson.currentPets || ""}</p>
                    </div>
                  </div>

                  <div className="twoButtonPositions">
                    <div className="form-group row">
                      <div className="col-sm-6" id="buttonCenter">
                        <button
                          type="button"
                          onClick={handlePrev}
                          className="btn btn-primary backButton"
                        >
                          Back
                        </button>
                      </div>
                      <div className="col-sm-6" id="buttonCenter">
                        <button
                          type="submit"
                          className="btn btn-primary nextButton"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </>
        );
      case 3:
        return (
          <>
            <div className="mainContainer3">
              <h1 className="question">Are you ready to adopt Rufus?</h1>
              <h2>3. Lifestyle, Experience, and Preferences</h2>
              <div className="container">
                <form
                  className="createPetForm"
                  style={{ backgroundColor: "white" }}
                  onSubmit={handleNext}
                >
                  <div className="form-group row">
                    <label
                      className="col-sm-4 col-form-label descriptionLabel"
                      htmlFor="dailyRoutine"
                    >
                      Daily Routine
                    </label>
                    <div className="col-sm-8">
                      <input
                        className="form-control"
                        id="dailyRoutine"
                        value={thirdPageFormValues.dailyRoutine}
                        onChange={handleInputChange}
                        placeholder="How much time can you dedicate to the 
                      pet's care and exercise?"
                        style={{
                          height: "100px",
                          borderRadius: "70px",
                          paddingBottom: "60px",
                          whiteSpace: "pre-line",
                        }}
                        required
                      />
                      <p className="error">{errorJson.dailyRoutine || ""}</p>
                    </div>
                  </div>

                  <div className="form-group row">
                    <label
                      className="col-sm-4 col-form-label descriptionLabel"
                      htmlFor="expenses"
                    >
                      Expenses
                    </label>
                    <div className="col-sm-8">
                      <input
                        className="form-control"
                        id="expenses"
                        value={thirdPageFormValues.expenses}
                        onChange={handleInputChange}
                        placeholder="Are you prepared for potential pet-related expenses?"
                        style={{
                          height: "100px",
                          borderRadius: "70px",
                          paddingBottom: "60px",
                          whiteSpace: "normal",
                        }}
                        required
                      />
                      <p className="error">{errorJson.expenses || ""}</p>
                    </div>
                  </div>

                  <div className="form-group row">
                    <label
                      className="col-sm-4 col-form-label descriptionLabel"
                      htmlFor="prevPets"
                    >
                      Previous Pets
                    </label>
                    <div className="col-sm-8">
                      <input
                        className="form-control"
                        id="prevPets"
                        value={thirdPageFormValues.prevPets}
                        onChange={handleInputChange}
                        placeholder="Have you owned pets before? If so, what types and breeds?"
                        style={{
                          height: "100px",
                          borderRadius: "70px",
                          paddingBottom: "60px",
                          whiteSpace: "normal",
                        }}
                        required
                      />
                      <p className="error">{errorJson.prevPets || ""}</p>
                    </div>
                  </div>

                  <div className="form-group row">
                    <label
                      className="col-sm-4 col-form-label descriptionLabel"
                      htmlFor="preferences"
                    >
                      Preferences
                    </label>
                    <div className="col-sm-8">
                      <input
                        className="form-control"
                        id="preferences"
                        value={thirdPageFormValues.preferences}
                        onChange={handleInputChange}
                        placeholder="Are you looking for a specific breed or type of pet?"
                        style={{
                          height: "100px",
                          borderRadius: "70px",
                          paddingBottom: "60px",
                          whiteSpace: "normal",
                        }}
                        required
                      />
                      <p className="error">{errorJson.preferences || ""}</p>
                    </div>
                  </div>

                  <div className="form-group row">
                    <label
                      className="col-sm-4 col-form-label descriptionLabel"
                      htmlFor="reason"
                    >
                      Reason
                    </label>
                    <div className="col-sm-8">
                      <input
                        className="form-control"
                        id="reason"
                        value={thirdPageFormValues.reason}
                        onChange={handleInputChange}
                        placeholder="Why do you want to adopt this pet?"
                        style={{
                          height: "100px",
                          borderRadius: "70px",
                          paddingBottom: "60px",
                          whiteSpace: "normal",
                        }}
                        required
                      />
                      <p className="error">{errorJson.reason || ""}</p>
                    </div>
                  </div>

                  <div className="twoButtonPositions">
                    <div className="form-group row">
                      <div className="col-sm-6" id="buttonCenter">
                        <button
                          type="button"
                          onClick={handlePrev}
                          className="btn btn-primary backButton"
                        >
                          Back
                        </button>
                      </div>
                      <div className="col-sm-6" id="buttonCenter">
                        <button
                          type="submit"
                          className="btn btn-primary nextButton"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </>
        );
      case 4:
        return (
          <>
            <div className="mainContainer">
              <h1 className="question">Are you ready to adopt Rufus?</h1>
              <h2>4. Additional Information</h2>
              <div className="container">
                <form
                  className="createPetForm"
                  style={{ backgroundColor: "white" }}
                  onSubmit={handleSubmit}
                >
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
                        value={fourthPageFormValues.name1}
                        onChange={handleInputChange}
                        placeholder="Name"
                        required
                      />
                      <p className="error">{errorJson.name1 || ""}</p>
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
                        value={fourthPageFormValues.phoneNumber1}
                        onChange={handleInputChange}
                        placeholder="Phone Number"
                        required
                      />
                      <p className="error">{errorJson.phoneNumber1 || ""}</p>
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
                        value={fourthPageFormValues.email1}
                        onChange={handleInputChange}
                        className="form-control"
                        id="email1"
                        placeholder="Email"
                        required
                      />
                      <p className="error">{errorJson.email1 || ""}</p>
                    </div>
                  </div>

                  <div className="form-group row">
                    <label
                      className="col-sm-4 col-form-label descriptionLabel"
                      htmlFor="additionalComments"
                    >
                      Additional Comments
                    </label>
                    <div className="col-sm-8">
                      <input
                        className="form-control descriptionInput"
                        id="additionalComments"
                        onChange={handleInputChange}
                        value={fourthPageFormValues.additionalComments}
                        style={{
                          height: "100px",
                          borderRadius: "70px",
                          paddingBottom: "60px",
                          whiteSpace: "normal",
                        }}
                        required
                      />
                      <p className="error">
                        {errorJson.additionalComments || ""}
                      </p>
                    </div>
                  </div>

                  <div className="twoButtonPositions">
                    <div className="form-group row">
                      <div className="col-sm-6" id="buttonCenter">
                        <button
                          type="button"
                          onClick={handlePrev}
                          className="btn btn-primary backButton"
                        >
                          Back
                        </button>
                      </div>
                      <div className="col-sm-6" id="buttonCenter">
                        <button
                          type="submit"
                          className="btn btn-primary nextButton"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </>
        );
    } 
  } else {
    return <h1>You cannot make an application. Please create an account or log in as a pet seeker.</h1>;
  }
  }
}
export default CreateApplication;
