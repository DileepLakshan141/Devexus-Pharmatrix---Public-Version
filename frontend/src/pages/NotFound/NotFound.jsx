import React from "react";
import NotFoundImage from "../../assets/images/not-found.png";

function NotFound() {
  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <img
        src={NotFoundImage}
        alt="404-page-not-found-image"
        style={{ width: "400px" }}
      />
      <h2
        style={{ fontFamily: "Manrope", fontWeight: "500", marginTop: "20px" }}
      >
        This page is not available right now
      </h2>
    </div>
  );
}

export default NotFound;
