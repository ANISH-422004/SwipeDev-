import Login from "@/screen/Login";
import LandingPage from "../screen/LandingPage";
import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "@/screen/Home";
import SignUp from "@/screen/SignUp";
import Protected from "@/components/Protected";
import Profile from "@/screen/Profile";

const Approutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/home" element={<Protected><Home /></Protected>} />
      <Route path="/profile" element={<Protected><Profile /></Protected>} />

    </Routes>
  );
};

export default Approutes;
