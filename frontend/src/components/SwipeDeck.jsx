import { useState } from "react";
import UserCard from "./UserCard";

export default function SwipeDeck({ users }) {
  const [userIndex, setUserIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const handleSwipe = (direction, user) => {
    console.log(`Swiped ${direction}:`, user.firstName);
    setUserIndex((prev) => prev + 1);
    setIsDragging(false); // hide zones
  };

  return (
    <div className="relative h-[500px] w-full max-w-md mx-auto mt-10">
      {/* Swipe Zones */}
      {isDragging && (
        <>
          <div className="absolute -left-5 sm:-left-16 md:-left-24 top-1/2 transform -translate-y-1/2 h-48 w-10 sm:h-36 sm:w-20 md:h-48 md:w-24 bg-pink-400 opacity-70 rounded-r-md z-10 flex items-center justify-center backdrop-blur-sm bg-opacity-40 border-2 border-pink-300">
            <span className="text-white font-bold rotate-[-90deg] text-xs sm:text-sm md:text-lg">
              Reject
            </span>
          </div>
          <div className="absolute -right-5 sm:-right-16 md:-right-24 top-1/2 transform -translate-y-1/2 h-48 w-10 sm:h-36 sm:w-20 md:h-48 md:w-24 bg-green-400 opacity-70 rounded-l-md z-10 flex items-center justify-center backdrop-blur-sm bg-opacity-40 border-2 border-green-300">
            <span className="text-white font-bold rotate-90 text-xs sm:text-sm md:text-lg">
              Accept
            </span>
          </div>
        </>
      )}

      {users
        .slice(userIndex)
        .reverse()
        .map((user, index) => (
          <UserCard
            key={user._id}
            user={user}
            onSwipe={handleSwipe}
            setIsDragging={setIsDragging}
          />
        ))}
    </div>
  );
}
