import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import UserCard from "./UserCard";
import { toast } from "sonner";
import { removeUserFromFeed } from "@/app/slices/feedSlice";
import axiosInstance from "@/lib/axiosInstance";

export default function SwipeDeck() {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.feed);
  const [isDragging, setIsDragging] = useState(false);

  const handleSwipe = (direction, user) => {

    if (direction === "left") {
      // ignored
      axiosInstance
        .post(`/api/v1/requests/send/ignored/${user._id}`)
        .then((res) => {
          if (res.status === 200) {
            toast.error(`Rejected ${user.firstName}`);
          } else {
            toast.error("Failed to ignore user");
          }
        })
        .catch((err) => {
          console.error(err);
          toast.error("Error ignoring user");
        })
        .finally(() => {
          dispatch(removeUserFromFeed(user._id));
          setIsDragging(false); // hide zones
        });
    } else {
      // intrested
      axiosInstance
        .post(`/api/v1/requests/send/intrested/${user._id}`)
        .then((res) => {
          if (res.status === 200) {
            toast.success(`Accepted ${user.firstName}`);
          } else {
            toast.error("Failed to accept user");
          }
        })
        .catch((err) => {
          console.error(err);
          toast.error("Error accepting user");
        })
        .finally(() => {
          dispatch(removeUserFromFeed(user._id));
          setIsDragging(false); // hide zones
        });
    }

    dispatch(removeUserFromFeed(user._id));
    setIsDragging(false); // hide zones
  };

  return (
    <div className="relative h-[500px] w-full max-w-md mx-auto">
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
        ?.slice()
        .reverse()
        .map((user) => (
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
