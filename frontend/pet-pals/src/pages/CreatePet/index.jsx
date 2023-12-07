import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom"; // Import useParams from react-router-dom
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/css/bootstrap.css";
import "./style.css";
import { useNavigate } from "react-router-dom";
// import "react-select/dist/react-select.css";

function CreatePet() {
  const [errorJson, setErrorJson] = useState({});
  const navigate = useNavigate();
  const shelter_user = localStorage.getItem("shelter_name") || "";
  const seeker_user = localStorage.getItem("firstname") || "";

  const [formValues, setFormValues] = useState({
    name: "",
    pet_type: "",
    breed: "",
    gender: "",
    color: "",
    date_of_birth: "",
    medical_history: "",
    behavior: "",
    weight: "",
    requirements: "",
    about: "",
    status: "",
    application_deadline: "",
    city: "",
    province: "",
    publication_date: "",
    ///
    fileInput: "",
  });

  //   const weight = ["kg", "lbs"];

  const sex = ["", "Other", "Female", "Male"];
  const petTypes = [
    "",
    "Dog",
    "Cat",
    "Fish",
    "Bird",
    "Small Rodents",
    "Reptiles",
    "Rabbits",
    "Horses",
    "Other",
  ];

  const handleInputChange = (e) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [e.target.id]: e.target.value,
    }));
  };

  function notEmpty(label, field) {
    const nameRegex = /.+/;
    if (!nameRegex.test(field)) {
      console.log("Field: ", field);
      setErrorJson((prevValues) => ({
        ...prevValues,
        [label]: "Cannot be blank.",
      }));
      return false;
    }
    return true;
  }

  function aNumber(field) {
    const numRegex = /^\d*\.?\d+$/;
    if (!numRegex.test(field)) {
      setErrorJson((prevValues) => ({
        ...prevValues,
        weight: "Must be a number.",
      }));
      console.log(errorJson);
      return false;
    }
    return true;
  }

  function validateForm() {
    setErrorJson({});
    const name = document.getElementById("name").value;
    const pet_type = document.getElementById("pet_type").value;
    const breed = document.getElementById("breed").value;
    const gender = document.getElementById("gender").value;
    const color = document.getElementById("color").value;
    const date_of_birth = document.getElementById("date_of_birth").value;
    const medical_history = document.getElementById("medical_history").value;
    const behavior = document.getElementById("behavior").value;
    const weight = document.getElementById("weight").value;
    const requirements = document.getElementById("requirements").value;
    const about = document.getElementById("about").value;
    const application_deadline = document.getElementById(
      "application_deadline"
    ).value;
    const city = document.getElementById("city").value;
    const province = document.getElementById("province").value;
    const fileInput = document.getElementById("fileInput").value;

    let d1 = true;
    let d2 = true;
    let d3 = true;

    const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
    if (!dateRegex.test(date_of_birth)) {
      setErrorJson((prevValues) => ({
        ...prevValues,
        date_of_birth: "Must be in the format dd/mm/yyyy.",
      }));
      d1 = false;
      console.log(errorJson);
    }
    if (!dateRegex.test(application_deadline)) {
      setErrorJson((prevValues) => ({
        ...prevValues,
        application_deadline: "Must be in the format dd/mm/yyyy.",
      }));
      d2 = false;
      console.log(errorJson);
    }

    if (province.length != 2) {
      setErrorJson((prevValues) => ({
        ...prevValues,
        province: "Must only be 2 letters.",
      }));
      d3 = false;
      console.log(errorJson);
    }

    console.log(d1);
    console.log(d2);
    let isEmpty = notEmpty("name", name);
    isEmpty = notEmpty("pet_type", pet_type) && isEmpty;
    isEmpty = notEmpty("breed", breed) && isEmpty;
    isEmpty = notEmpty("gender", gender) && isEmpty;
    isEmpty = notEmpty("color", color) && isEmpty;
    isEmpty = notEmpty("date_of_birth", date_of_birth) && isEmpty;
    isEmpty = notEmpty("medical_history", medical_history) && isEmpty;
    isEmpty = notEmpty("behavior", behavior) && isEmpty;
    isEmpty = notEmpty("weight", weight) && isEmpty;
    isEmpty = notEmpty("requirements", requirements) && isEmpty;
    isEmpty = notEmpty("about", about) && isEmpty;
    isEmpty = notEmpty("application_deadline", application_deadline) && isEmpty;
    isEmpty = notEmpty("city", city) && isEmpty;
    isEmpty = notEmpty("province", province) && isEmpty;
    isEmpty = notEmpty("fileInput", fileInput) && isEmpty;
    isEmpty = aNumber(weight) && isEmpty;
    // validation for shelter name -> checking not empty
    if (isEmpty && d1 && d3 && d2) {
      return true;
    }
    return false;
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (validateForm()) {
      event.preventDefault();
      // get rid of all previous errors
      setErrorJson(() => ({}));

      const formData = new FormData();

      if (formValues.date_of_birth !== "") {
        var birth_year = formValues.date_of_birth.split("/")[2];
        var birth_month = formValues.date_of_birth.split("/")[1];
        var birth_day = formValues.date_of_birth.split("/")[0];
        var final_birthdate = birth_year + "-" + birth_month + "-" + birth_day;
      }

      if (formValues.application_deadline !== "") {
        var app_year = formValues.application_deadline.split("/")[2];
        var app_month = formValues.application_deadline.split("/")[1];
        var app_day = formValues.application_deadline.split("/")[0];
        var app_deadline = app_year + "-" + app_month + "-" + app_day;
      }

      formData.append("name", formValues.name);
      formData.append("pet_type", formValues.pet_type);
      formData.append("gender", formValues.gender);
      formData.append("breed", formValues.breed);
      formData.append("color", formValues.color.toLowerCase());
      formData.append("date_of_birth", final_birthdate);
      formData.append("medical_history", formValues.medical_history);
      formData.append("behavior", formValues.behavior);
      formData.append("weight", formValues.weight);
      formData.append("requirements", formValues.requirements);
      formData.append("about", formValues.about);
      formData.append("status", "Available");
      formData.append("application_deadline", app_deadline);
      formData.append("city", formValues.city);
      formData.append("province", formValues.province);

      // Append user data
      if (event.target.fileInput.files[0]) {
        formData.append(
          "profile_photo",
          event.target.fileInput?.files[0]
            ? event.target.fileInput?.files[0]
            : "http://localhost:8000/media/default.jpg"
        );
      }

      // if you are here, validation passed, so make PUT request
      try {
        const requestOptions = {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
          body: formData, // Use the FormData object directly as the body
        };

        fetch(`http://localhost:8000/pet/`, requestOptions)
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
            if (data["message"] == "Pet successfully created.") {
              navigate(`/pet/${data["pet_id"]}/`);
            }
          });
        // navigate(`/pet/${pet_id}/`);
      } catch (error) {
        console.error("Error:", error);
      }
    }
    return;
  }

  if (shelter_user != "" && seeker_user == "") {
    return (
      <>
        <div className="mainContainer">
          <h1>Create Your Pet</h1>
          <div className="containerNEW">
            <form
              className="createPetForm"
              style={{ backgroundColor: "white" }}
              onSubmit={handleSubmit}
            >
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
                    onChange={handleInputChange}
                    required
                  />
                  <p className="error">{errorJson.name || ""}</p>
                </div>
              </div>

              <div className="form-group row">
                <label
                  htmlFor="weight"
                  className="col-sm-4 col-form-label labelLeft"
                >
                  Weight
                </label>
                <div className="col-sm-5">
                  <input
                    className="form-control"
                    id="weight"
                    value={formValues.weight}
                    onChange={handleInputChange}
                    placeholder="Must be in lbs"
                    required
                  />
                  <p className="error">{errorJson.weight || ""}</p>
                </div>
                <div className="col-sm-3">
                  <select className="form-control" id="weightInput1" required>
                    <option defaultValue>lbs</option>
                  </select>
                </div>
              </div>

              <div className="form-group row">
                <label
                  htmlFor="gender"
                  className="col-sm-4 col-form-label labelLeft"
                >
                  Gender
                </label>
                <div className="col-sm-8">
                  <select
                    className="form-control"
                    value={formValues.gender}
                    onChange={handleInputChange}
                    id="gender"
                    required
                  >
                    {[...sex].map((p) =>
                      formValues.gender == { p } ? (
                        <option key={p} value={p} defaultValue>
                          {p}
                        </option>
                      ) : (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      )
                    )}
                  </select>
                  <p className="error">{errorJson.gender || ""}</p>
                </div>
              </div>

              <div className="form-group row">
                <label
                  htmlFor="pet_type"
                  className="col-sm-4 col-form-label labelLeft"
                >
                  Pet Type
                </label>
                <div className="col-sm-8">
                  <select
                    className="form-control"
                    value={formValues.pet_type}
                    // defaultValue="Dog"
                    onChange={handleInputChange}
                    id="pet_type"
                    required
                  >
                    {[...petTypes].map((p) =>
                      formValues.pet_type == { p } ? (
                        <option key={p} value={p} defaultValue>
                          {p}
                        </option>
                      ) : (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      )
                    )}
                  </select>
                  <p className="error">{errorJson.pet_type || ""}</p>
                </div>
              </div>

              <div className="form-group row">
                <label
                  htmlFor="breed"
                  className="col-sm-4 col-form-label labelLeft"
                >
                  Breed
                </label>
                <div className="col-sm-8">
                  <input
                    className="form-control"
                    id="breed"
                    value={formValues.breed}
                    onChange={handleInputChange}
                    required
                  />
                  <p className="error">{errorJson.breed || ""}</p>
                </div>
              </div>

              <div className="form-group row">
                <label
                  htmlFor="fileInput"
                  className="col-sm-4 col-form-label labelLeft"
                >
                  Profile Photo
                </label>
                <div className="col-sm-8">
                  <input
                    type="file"
                    className="form-control"
                    id="fileInput"
                    //   value={formValues.fileInput}
                    onChange={handleInputChange}
                    required
                  />
                  <p className="error">{errorJson.fileInput || ""}</p>
                </div>
              </div>

              <div className="form-group row">
                <label
                  htmlFor="about"
                  className="col-sm-4 col-form-label labelLeft"
                >
                  About
                </label>
                <div className="col-sm-8">
                  <input
                    className="form-control descriptionInput"
                    id="about"
                    placeholder="Tell everyone about your pet"
                    value={formValues.about}
                    onChange={handleInputChange}
                    required
                    style={{
                      height: "100px",
                      borderRadius: "70px",
                      paddingBottom: "60px",
                      whiteSpace: "normal",
                    }}
                  />
                  <p className="error">{errorJson.about || ""}</p>
                </div>
              </div>

              <div className="form-group row">
                <label
                  htmlFor="date_of_birth"
                  className="col-sm-4 col-form-label labelLeft"
                >
                  Birthday
                </label>
                <div className="col-sm-8">
                  <input
                    className="form-control"
                    id="date_of_birth"
                    placeholder="dd/mm/yyyy"
                    value={formValues.date_of_birth}
                    onChange={handleInputChange}
                    required
                  />
                  <p className="error">{errorJson.date_of_birth || ""}</p>
                </div>
              </div>

              <div className="form-group row">
                <label
                  htmlFor="application_deadline"
                  className="col-sm-4 col-form-label labelLeft"
                >
                  Application Deadline
                </label>
                <div className="col-sm-8">
                  <input
                    className="form-control"
                    id="application_deadline"
                    placeholder="dd/mm/yyyy"
                    value={formValues.application_deadline}
                    onChange={handleInputChange}
                    required
                  />
                  <p className="error">
                    {errorJson.application_deadline || ""}
                  </p>
                </div>
              </div>

              <div className="form-group row">
                <label
                  htmlFor="city"
                  className="col-sm-4 col-form-label labelLeft"
                >
                  City
                </label>
                <div className="col-sm-8">
                  <input
                    className="form-control"
                    id="city"
                    value={formValues.city}
                    onChange={handleInputChange}
                    required
                  />
                  <p className="error">{errorJson.city || ""}</p>
                </div>
              </div>

              <div className="form-group row">
                <label
                  htmlFor="province"
                  className="col-sm-4 col-form-label labelLeft"
                >
                  Province
                </label>
                <div className="col-sm-8">
                  <input
                    className="form-control"
                    id="province"
                    value={formValues.province}
                    onChange={handleInputChange}
                    placeholder="Please limit input to 2 letters."
                    required
                  />
                  <p className="error">{errorJson.province || ""}</p>
                </div>
              </div>

              <div className="form-group row">
                <label
                  htmlFor="color"
                  className="col-sm-4 col-form-label labelLeft"
                >
                  Color
                </label>
                <div className="col-sm-8">
                  <input
                    className="form-control"
                    id="color"
                    value={formValues.color}
                    onChange={handleInputChange}
                    required
                  />
                  <p className="error">{errorJson.color || ""}</p>
                </div>
              </div>

              <div className="form-group row">
                <label
                  htmlFor="medical_history"
                  className="col-sm-4 col-form-label labelLeft"
                >
                  Medical History
                </label>
                <div className="col-sm-8">
                  <input
                    className="form-control descriptionInput"
                    id="medical_history"
                    placeholder="Describe the pet's medical history."
                    value={formValues.medical_history}
                    onChange={handleInputChange}
                    required
                    style={{
                      height: "100px",
                      borderRadius: "70px",
                      paddingBottom: "60px",
                      whiteSpace: "normal",
                    }}
                  />
                  <p className="error">{errorJson.medical_history || ""}</p>
                </div>
              </div>

              <div className="form-group row">
                <label
                  htmlFor="behavior"
                  className="col-sm-4 col-form-label labelLeft"
                >
                  Behaviour
                </label>
                <div className="col-sm-8">
                  <input
                    className="form-control descriptionInput"
                    id="behavior"
                    placeholder="Describe the pet's behaviour."
                    value={formValues.behavior}
                    onChange={handleInputChange}
                    required
                    style={{
                      height: "100px",
                      borderRadius: "70px",
                      paddingBottom: "60px",
                      whiteSpace: "normal",
                    }}
                  />
                  <p className="error">{errorJson.behavior || ""}</p>
                </div>
              </div>

              <div className="form-group row">
                <label
                  htmlFor="requirements"
                  className="col-sm-4 col-form-label labelLeft"
                >
                  Requirements
                </label>
                <div className="col-sm-8">
                  <input
                    className="form-control descriptionInput"
                    id="requirements"
                    placeholder="Describe the pet's special needs and requirements."
                    value={formValues.requirements}
                    onChange={handleInputChange}
                    required
                    style={{
                      height: "100px",
                      borderRadius: "70px",
                      paddingBottom: "60px",
                      whiteSpace: "normal",
                    }}
                  />
                  <p className="error">{errorJson.requirements || ""}</p>
                </div>
              </div>

              <div className="twoButtonPositions">
                <div className="form-group row">
                  <div className="col-sm-6" id="buttonCenter">
                    {/* <button className="btn btn-primary backButton"> */}
                    <Link
                      className="btn btn-primary backButton"
                      to={`/pets/`}
                      style={{ textDecoration: "none" }}
                    >
                      Back
                    </Link>
                    {/* </button> */}
                  </div>
                  <div className="col-sm-6" id="buttonCenter">
                    <button
                      type="submit"
                      className="btn btn-primary submitButton"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </>
    );
  } else {
    return (
      <h1>
        You cannot create a pet. Please create an account or log in as a pet
        shelter.
      </h1>
    );
  }
}
export default CreatePet;
