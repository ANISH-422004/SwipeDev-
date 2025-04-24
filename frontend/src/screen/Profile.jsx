import EditProfile from "@/components/EditProfile";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/lib/axiosInstance";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const Profile = () => {
    const user = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const [isEditOpen, setIsEditOpen] = useState(false);
  
      const handleUpdate = async () => {
          try {
              const userResponse = await axiosInstance.get('/api/v1/users/profile');
              if (userResponse.status === 200) {
                  dispatch(addUser(userResponse.data.user));
              } else {
                  console.error("Failed to fetch updated user data", userResponse);
                  toast.error("Failed to fetch updated user data. Profile may not be fully updated.");
              }
          } catch (error) {
               console.error("Failed to fetch updated user data", error);
               toast.error("Failed to fetch updated user data. Profile may not be fully updated.");
          }
      }
  
    if (!user) return <div>Loading...</div>;
  
    return (
      <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
        {/* Profile Header */}
        <div className="flex items-center gap-6">
          <img src={user.profilePic} alt="Profile" className="w-28 h-28 rounded-full object-cover border border-gray-300" />
          <div>
            <h1 className="text-2xl font-semibold">{user.firstName} {user.lastName}</h1>
            <p className="text-sm text-gray-600">{user.email}</p>
            <div className="text-sm text-gray-500 mt-1">Age: {user.age} • Gender: {user.gender}</div>
          </div>
        </div>
  
        {/* About */}
        <div>
          <h2 className="text-lg font-medium mb-1">About</h2>
          <p className="text-gray-700 text-sm">{user.about}</p>
        </div>
  
        {/* Skills */}
        <div>
          <h2 className="text-lg font-medium mb-2">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {user.skills && user.skills.map((skill, index) => (
              <span
                key={index}
                className="text-sm border border-gray-300 rounded-full px-3 py-1 text-gray-700"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
  
        {/* Edit Button */}
        <div>
          <Button variant="outline" onClick={() => setIsEditOpen(true)}>
            Edit Profile
          </Button>
        </div>
  
        <EditProfile
          isOpen={isEditOpen}
          onOpenChange={setIsEditOpen}
          user={user}
          onUpdate={handleUpdate}
        />
      </div>
    );
  };
  
  export default Profile;
  