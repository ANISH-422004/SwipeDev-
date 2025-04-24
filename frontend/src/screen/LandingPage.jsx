import React, { useEffect } from "react";
import { motion } from "framer-motion";
// import { Card, CardContent } from '@/components/ui/card';
import { Button } from "../components/ui/button";
import { FaGithub, FaHeart } from "react-icons/fa";
import axiosInstance from "@/lib/axiosInstance";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "@/app/slices/userSlice";

const developers = [
  { name: "Alice", tech: "React, Node.js", image: "/dev1.png" },
  { name: "Bob", tech: "Python, Flask", image: "/dev2.png" },
  { name: "Clara", tech: "Java, Spring", image: "/dev3.png" },
];

const LandingPage = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user); 

  useEffect(() => { // logic if user has a token then auto Login and store that user data in Store 
    const token = localStorage.getItem("token");

    if (!token || user) return; 

    axiosInstance
      .get("/api/v1/users/profile")
      .then((res) => {
        dispatch(addUser(res.data.user)); 
      })
      .catch((err) => {
        console.log(err)
      });
  }, []);

  return (
    <div className=" min-h-screen flex flex-col items-center justify-between">
      {/* Hero Section */}
      <header className="text-center mt-20 px-4">
        <h1 className="text-5xl md:text-6xl font-bold mb-4">SwipeDev</h1>
        <p className="text-xl md:text-2xl mb-8 gradient-text">
          Connect with developers who share your passion for code. Find your
          perfect tech match, collaborate on projects, and build something
          amazing together.
        </p>

        <Button className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-full text-lg">
          Get Started
        </Button>
      </header>

      {/* 3D Background Waves */}
      <div className="absolute top-0 left-0 w-full h-full z-0 overflow-hidden">
        <canvas id="stars" className="w-full h-full"></canvas>
      </div>

      {/* Dev Cards */}
      {/* <section className="z-10 mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
        {developers.map((dev, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: idx * 0.2 }}
          >
            <Card className="bg-gray-900 hover:scale-105 transform transition duration-300 rounded-2xl shadow-xl">
              <img src={dev.image} alt={dev.name} className="rounded-t-2xl w-full h-48 object-cover" />
              <CardContent className="p-4">
                <h2 className="text-2xl font-semibold mb-2">{dev.name}</h2>
                <p className="text-gray-400">{dev.tech}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </section> */}
    </div>
  );
};

export default LandingPage;

// Optional: Include this script somewhere (like index.html or as a separate React hook) to render the canvas effect
// Based on 3D star field effect
// const canvas = document.getElementById('stars');
// const ctx = canvas.getContext('2d');
// // Add your own 3D background animation logic or use a Three.js component
