import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@radix-ui/react-dropdown-menu';
import { Input } from '@/components/ui/input';
import axiosInstance from '../lib/axiosInstance';
import { toast } from 'sonner';

const EditProfile = ({ isOpen, onOpenChange, user, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState('');
  const [about, setAbout] = useState('');

    useEffect(() => {
        if (user) {
            setFirstName(user.firstName || '');
            setLastName(user.lastName || '');
            setEmail(user.email || '');
            setAge(user.age || '');
            setGender(user.gender || '');
            setSkills(user.skills || []);
            setProfilePicturePreview(user.profilePic || '');
            setAbout(user.about || '');
            setProfilePicture(null); // Reset file input
        }
    }, [user]);


  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      setProfilePicturePreview(URL.createObjectURL(file));
    }
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (newSkill && !skills.includes(newSkill)) {
      setSkills([...skills, newSkill]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('firstName', firstName);
            formData.append('lastName', lastName);
            formData.append('email', email);
            formData.append('age', age);
            formData.append('gender', gender);
            if (profilePicture) {
                formData.append('profilePic', profilePicture);
            }
            formData.append('skills', JSON.stringify(skills));
            formData.append('about', about);

            const response = await axiosInstance.patch('/api/v1/users/update', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200) {
                toast.success('Profile updated successfully!');
                onUpdate(); // Notify parent to fetch user data
                onOpenChange(false); // Close the modal
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('Failed to update profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg w-full h-full max-h-screen overflow-auto p-4">
        <DialogHeader className="flex justify-between items-center">
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogClose asChild>
            <button className="text-gray-500 hover:text-gray-800">
            </button>
          </DialogClose>
        </DialogHeader>

        <form className="space-y-4 py-4" onSubmit={handleSubmit}>
          {/* First Name */}
          <div>
            <Label className="text-sm font-medium">First Name</Label>
            <Input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full mt-1 border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
          </div>

          {/* Last Name */}
          <div>
            <Label className="text-sm font-medium">Last Name</Label>
            <Input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full mt-1 border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
          </div>

          {/* Email (read-only) */}
          <div>
            <Label className="text-sm font-medium">Email</Label>
            <Input
              value={email}
              readOnly
              className="w-full mt-1 bg-gray-100 border border-gray-300 rounded-md px-3 py-2 text-sm cursor-not-allowed"
            />
          </div>

          {/* Age */}
          <div>
            <Label className="text-sm font-medium">Age</Label>
            <Input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full mt-1 border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
          </div>

          {/* Gender */}
          <div>
            <Label className="text-sm font-medium">Gender</Label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full mt-1 border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* About */}
          <div>
            <Label className="text-sm font-medium">About</Label>
            <textarea
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              rows="3"
              className="w-full mt-1 border border-gray-300 rounded-md px-3 py-2 text-sm resize-none"
            />
          </div>

          {/* Skills */}
          <div>
            <Label className="text-sm font-medium">Skills</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {skills.map((skill, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 text-sm rounded-lg py-1 px-3"
                >
                  <span>{skill}</span>
                  <button
                    onClick={() => handleRemoveSkill(skill)}
                    className="text-red-500 hover:text-red-700"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>

            {/* Input for new skill */}
            <div className="flex items-center space-x-2 mt-2">
              <Input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                placeholder="Add a skill"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Add
              </button>
            </div>
          </div>

          {/* Profile Picture */}
          <div>
            <Label className="text-sm font-medium">Profile Picture</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={handleProfilePictureChange}
              className="mt-2 w-[40%]"
            />
            {profilePicturePreview && (
              <div className="mt-2">
                <img
                  src={profilePicturePreview}
                  alt="Preview"
                  className="w-20 h-20 object-cover rounded-full"
                />
              </div>
            )}
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              className="px-4 py-2 text-sm font-medium bg-black text-white rounded-md hover:bg-gray-800 transition"
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};


export default EditProfile;