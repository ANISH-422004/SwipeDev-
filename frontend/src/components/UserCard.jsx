import { motion, useAnimation } from "framer-motion";
import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

const swipeConfidenceThreshold = 100;

export default function UserCard({ user, onSwipe, setIsDragging }) {
  const controls = useAnimation();
  const [dragX, setDragX] = useState(0);

  const handleDragEnd = (event, info) => {
    setIsDragging(false);

    if (info.offset.x > swipeConfidenceThreshold) {
      onSwipe("right", user); // intrested
    } else if (info.offset.x < -swipeConfidenceThreshold) {
      onSwipe("left", user);  // ignore
    } else {
      controls.start({ x: 0 }); // snap back
    }

    setDragX(0);
  };

  useEffect(() => {
    if (Math.abs(dragX) > 10) {
      setIsDragging(true);
    }
  }, [dragX]);

  return (
    <motion.div
      className="absolute w-full max-w-md rounded-2xl shadow-lg p-4 cursor-grab z-20"
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={handleDragEnd}
      onDrag={(event, info) => setDragX(info.offset.x)}
      animate={controls}
      whileTap={{ scale: 1.05 }}
    >
      <Card className="overflow-hidden">
        <img
          src={user.profilePic}
          alt={`${user.firstName}'s profile`}
          className="w-full h-52 object-cover"
        />
        <CardContent className="p-4 space-y-2">
          <h2 className="text-xl font-bold">
            {user.firstName} {user.lastName}, {user.age}
          </h2>
          <p className="text-sm text-gray-600">
            {user.about?.split("").slice(0, 150).join("") +
              (user.about?.split("").length > 150 ? "..." : "")}
          </p>
          <div className="flex flex-wrap gap-2 mt-2">
            {user.skills.map((skill, index) => (
              <span
                key={index}
                className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full"
              >
                {skill}
              </span>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between items-center ">
          <button
            className="bg-red-500 text-white px-4 py-2 rounded-lg"
            onClick={() => onSwipe("left", user)}
          >
            Reject
          </button>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded-lg"
            onClick={() => onSwipe("right", user)}
          >
            Accept
          </button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
