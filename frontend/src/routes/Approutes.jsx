import LandingPage from "../screen/LandingPage";
import React from "react";
import { Route, Routes } from "react-router-dom";

const Approutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
    </Routes>
  );
};

export default Approutes;
