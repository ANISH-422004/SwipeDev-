import React from "react";
import loadGif from "../assets/load.gif";
const LoadingScreen = () => {
  return (
    <div className="w-full h-screen flex justify-center items-center">
      <img  className="h-28 w-28" src={loadGif} alt="Loading ... " />
    </div>
  );
};

export default LoadingScreen;
