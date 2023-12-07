import { useState, useContext, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom"; // Import useParams from react-router-dom
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/css/bootstrap.css";
import "./style.css";
import { LoginContext } from "../../contexts/LoginContext";
// import "react-select/dist/react-select.css";

function EditDeletePet() {
  const [errorJson, setErrorJson] = useState({});
  // loading use state
  const [profilePic, setProfilePic] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [resultDetails, setResultDetails] = useState({});
  const shelter_user = localStorage.getItem("shelter_name") || "";
  const seeker_user = localStorage.getItem("firstname") || "";
  const user_id = localStorage.getItem("id") || "";
  // used to put any errors from validation into a dict
  // getting shelter id from the url
  const { pet_id } = useParams();
  // used to store form values
  const [formValues, setFormValues] = useState({
    // name: "",
    // pet_type: "",
    // breed: "",
    // gender: "",
    // color: "",
    // date_of_birth: "",
    // medical_history: "",
    // behavior: "",
    // weight: "",
    // requirements: "",
    // about: "",
    // status: "",
    // application_deadline: "",
    // city: "",
    // province: "",
    // publication_date: "",
  });

  const statuses = ["Adopted", "Available", "Pending"];

  const sex = ["Other", "Female", "Male"];
  const petTypes = [
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

    let d1 = true;
    let d2 = true;

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
    isEmpty = aNumber(weight) && isEmpty;

    // validation for shelter name -> checking not empty
    if (isEmpty && d1 && d2) {
      return true;
    }
    return false;
  }

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
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
        };

        const response = await fetch(
          `http://localhost:8000/pet/${pet_id}/`,
          requestOptions
        );
        const result = await response.json();
        setResultDetails(result);

        setProfilePic(result.profile_photo);
        console.log("GET: " + result.profile_photo);

        if (result.date_of_birth !== "") {
          var birth_year2 = result.date_of_birth.split("-")[0];
          var birth_month2 = result.date_of_birth.split("-")[1];
          var birth_day2 = result.date_of_birth.split("-")[2];
          var final_birthdate2 =
            birth_day2 + "/" + birth_month2 + "/" + birth_year2;
        }

        if (result.application_deadline !== "") {
          var app_year2 = result.application_deadline.split("-")[0];
          var app_month2 = result.application_deadline.split("-")[1];
          var app_day2 = result.application_deadline.split("-")[2];
          var app_deadline2 = app_day2 + "/" + app_month2 + "/" + app_year2;
        }
        // set all form values to the values from backend
        // console.log(result.results);
        setFormValues({
          fileInput: "",
          name: result.name,
          status: result.status,
          weight: result.weight,
          gender: result.gender,
          breed: result.breed,
          about: result.about,
          pet_type: result.pet_type,
          date_of_birth: final_birthdate2,
          application_deadline: app_deadline2,
          medical_history: result.medical_history,
          behavior: result.behavior,
          requirements: result.requirements,
          city: result.city,
          province: result.province,
          color: result.color,
          shelter_id: result.shelter.id,
        });
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Error:", error);
      }
    };

    fetchData();
  }, [pet_id]);

  function handleSubmit(event) {
    event.preventDefault();

    if (validateForm()) {
      event.preventDefault();
      // get rid of all previous errors
      setErrorJson(() => ({}));
      // get rid of all previous errors
      const formData = new FormData();

      // DOUBLE CHECK IT DOESN'T OVERRIDE PREV PP

      if (event.target.fileInput.files[0]) {
        formData.append(
          "profile_photo",
          event.target.fileInput?.files[0]
            ? event.target.fileInput?.files[0]
            : "http://localhost:8000/media/default.jpg"
        );
      }

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
      formData.append("status", formValues.status);
      formData.append("application_deadline", app_deadline);
      formData.append("city", formValues.city);
      formData.append("province", formValues.province);

      // if you are here, validation passed, so make PUT request
      try {
        setLoading(true);
        const requestOptions = {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
          body: formData, // Use the FormData object directly as the body
        };

        fetch(`http://localhost:8000/pet/${pet_id}/`, requestOptions)
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
            if (data["message"] == "Pet successfully updated.") {
              navigate(`/pet/${pet_id}/`);
            }
          })
          .finally(() => setLoading(false));
      } catch (error) {
        setLoading(false);
        console.error("Error:", error);
      }
    }
  }

  function handleDeleteAccount(event) {
    if (formValues) {
      event.preventDefault();
      // get rid of all previous errors
      setErrorJson(() => ({}));

      // Confirm with the user before proceeding with deletion
      const userConfirmed = window.confirm(
        "Are you sure you want to delete this pet? This action cannot be undone."
      );

      if (!userConfirmed) {
        // If the user cancels, do nothing
        console.log("Pet deletion cancelled.");
        return;
      }

      const fetchData = async () => {
        try {
          setLoading(true);
          const requestOptions = {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access")}`,
            },
          };

          const response = await fetch(
            `http://localhost:8000/pet/${pet_id}/`,
            requestOptions
          );

          if (response.ok) {
            // Pet deleted successfully
            console.log("Pet deleted successfully!");
            // console.log(data);
            // navigate(`/pet/${pet_id}/`);
            navigate(`/pets/`);
          } else {
            // Handle errors during deletion
            console.error("Error:", response.statusText);
          }
        } catch (error) {
          // Handle other errors
          console.error("Error:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }

  console.log();
  if (loading) {
    return <p>Loading...</p>;
  }

  console.log(resultDetails);
  if (resultDetails["detail"] != "Not found.") {
    if (
      seeker_user == "" &&
      shelter_user != "" &&
      user_id == formValues.shelter_id
    ) {
      return (
        <>
          <div className="mainContainer">
            <h1>Update Your Pet</h1>
            <div className="container">
              <form
                className="createPetForm"
                style={{ backgroundColor: "white" }}
                onSubmit={handleSubmit}
              >
                <div className="imgPlacement">
                  <div className="frame form-group">
                    <img
                      src={
                        profilePic
                          ? profilePic
                          : "http://localhost:8000/media/default.jpg"
                      }
                      alt="Pet"
                    />
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
                      // required
                    />
                    <p className="error">{errorJson.fileInput || ""}</p>
                  </div>
                </div>

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
                      // required
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
                      // required
                    />
                    <p className="error">{errorJson.weight || ""}</p>
                  </div>
                  <div className="col-sm-3">
                    <select className="form-control" id="weightInput1" required>
                      <option>lbs</option>
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
                      // required
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
                      onChange={handleInputChange}
                      id="pet_type"
                      // required
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
                      // required
                    />
                    <p className="error">{errorJson.breed || ""}</p>
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
                      // required
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
                      // required
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
                      // required
                    />
                    <p className="error">
                      {errorJson.application_deadline || ""}
                    </p>
                  </div>
                </div>

                <div className="form-group row">
                  <label
                    htmlFor="status"
                    className="col-sm-4 col-form-label labelLeft"
                  >
                    Status
                  </label>
                  <div className="col-sm-8">
                    <select
                      className="form-control"
                      id="status"
                      value={formValues.status}
                      onChange={handleInputChange}
                      // required
                    >
                      {[...statuses].map((p) =>
                        formValues.status == { p } ? (
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
                    <p className="error">{errorJson.status || ""}</p>
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
                      // required
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
                      // required
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
                      // required
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
                      // required
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
                      // required
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
                      //required
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
                    {/* <div className="col-sm-6" id="buttonCenter">
                      <a
                        href="ShelterManage.html" // replace with shelter management endpoint
                        className="backButton form-control"
                      >
                        Back
                      </a>
                    </div> */}
                    <div className="col-sm-6" id="buttonCenter">
                      <button
                        type="submit"
                        className="btn btn-primary submitButton"
                      >
                        Save
                      </button>
                    </div>
                    <div className="col-sm-6 buttonCenter">
                      <button
                        type="button"
                        className="backButton form-control"
                        onClick={handleDeleteAccount}
                        style={{ whiteSpace: "nowrap", width: "fit-content" }}
                      >
                        Delete Pet
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
      return <h1>You cannot edit this pet.</h1>;
    }
  } else {
    return <h1>This pet does not exist.</h1>;
  }
}
export default EditDeletePet;
