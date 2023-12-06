import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./style.css";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useState, useContext, useEffect } from "react";

const Guidance = () => {
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

  function handleHome() {
    navigate(`/`)
  }


  return (
    <div className="mainContainer" style={{marginTop: "50px"}}>
      <main>
        <h1 className="question">Are you ready to bring your pet home?</h1>
        <div className="containerNEW">
          <div className="adoptionProcess">
            <h2>The Adoption Process</h2>

            <div className="paragraph">
              <p>
                Once your application to adopt a pet has been approved,
                congratulations! Our team is here to provide you with guidance
                every step of the way. We'll help you schedule a visit to our
                adoption center or arrange a meeting with the pet's current
                foster family. During this time, you'll have the opportunity to
                spend quality time with your potential new furry friend,
                ensuring that you both are a perfect match. We encourage you to
                prepare any questions you might have about the pet's history,
                behavior, or medical needs. Our experienced staff will be happy
                to provide all the information you need to make an informed
                decision.
              </p>
            </div>
          </div>

          <div className="fees">
            <h2>Fees</h2>
            <div className="paragraph">
              <p>
                Understanding the financial aspect of adopting a pet is crucial.
                After your application is approved, you'll receive detailed
                information about the adoption fees and associated costs. These
                fees typically cover essential veterinary care, spaying or
                neutering, vaccinations, and microchipping, ensuring your pet's
                health and safety. Our team is committed to transparency, and
                we'll provide a breakdown of all expenses.
              </p>
            </div>
          </div>

          <div className="requirements">
            <h2>Post Adoption Requirements</h2>
            <div className="paragraph">
              <p>
                Once you've welcomed your new furry family member home, there
                are some important post-adoption requirements to keep in mind.
                Regular veterinary check-ups are crucial to monitor your pet's
                health and ensure they receive any necessary vaccinations or
                treatments. Additionally, providing a loving and safe
                environment, proper nutrition, exercise, and socialization are
                essential to your pet's well-being. We encourage adopters to
                consider enrolling in obedience training or behavior classes to
                strengthen the bond with their pet and address any behavioral
                issues. Remember that adopting a pet is a lifelong commitment,
                and our team is always available to offer guidance and support
                as you embark on this wonderful journey together.
              </p>
            </div>
          </div>
          <button onClick={handleHome} className="nextButton form-control">
            Home
          </button>
        </div>
      </main>
    </div>
  );
};

export default Guidance;
