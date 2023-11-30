import React, { useEffect } from "react";

function PetDetails() {
  useEffect(() => {
    var requestOptions = {
      method: "GET",
    };

    fetch("http://localhost:8000/pet/1/", requestOptions)
      .then((response) => response.json())
      .then((result) => console.log(result))
      .catch((error) => console.log("error", error));
  }, []);

  return <></>;
}

export default PetDetails;
