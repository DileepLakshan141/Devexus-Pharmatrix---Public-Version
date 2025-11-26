import React from "react";
import DevPlaceHolderImage from "../../assets/images/develop-placeholder.png";

function UnderDev() {
  return (
    <div
      style={{
        width: "100%",
        height: "700px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        color: "grey",
      }}
    >
      <img
        src={DevPlaceHolderImage}
        alt="dev-placeholder"
        style={{ width: "300px" }}
      />
      <h3>Component under development!</h3>
    </div>
  );
}

export default UnderDev;
