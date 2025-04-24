import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@radix-ui/react-dropdown-menu';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import axiosInstance from '@/lib/axiosInstance';

const SignUp = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState('');
  const [about, setAbout] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const navigate = useNavigate();

  const handleProfilePictureChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePicture(file);
      setProfilePicturePreview(URL.createObjectURL(file));
    } else {
      setProfilePicture(null);
      setProfilePicturePreview('');
    }
  };

  const handleAddSkill = () => {
    if (newSkill && !skills.includes(newSkill)) {
      setSkills(prevSkills => [...prevSkills, newSkill]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(prevSkills => prevSkills.filter(skill => skill !== skillToRemove));
  };


  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors([]);



    try {
      const formData = new FormData();
      formData.append('firstName', firstName);
      formData.append('lastName', lastName);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('age', age);
      formData.append('gender', gender);
      formData.append('about', about);
      formData.append('skills', JSON.stringify(skills));


      if (profilePicture) {
        formData.append('profilePic', profilePicture);
      }

      // *** CRITICAL DEBUGGING STEP: Inspect FormData ***
      for (const pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }
      console.log('FormData:', formData.skills);

      
      const res = await axiosInstance.post('http://localhost:3000/api/v1/auth/signup', formData);


      if (res.status === 201) {
        toast.success(res.data.message);
        navigate('/login');
      } else {
        if (res.data.errors) {
          setErrors(res.data.errors);
        } else {
          setErrors([{ msg: res.data.message || "Signup Failed" }]);
        }
        toast.error("Signup Failed");
      }
      
    } catch (error) {
      console.error('Error during signup:', error);
      setErrors([{ msg: error.message || 'An unexpected error occurred.' }]);
      toast.error("Signup Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] py-8">
      <h2 className="text-2xl font-semibold text-gray-300">Create Account 🚀</h2>
      <p className="text-sm text-gray-500 mb-6">
        Join our community
      </p>

      <form
        onSubmit={handleSignUp}
        className="grid w-full max-w-md gap-4 px-4"
      >
        <div className="grid grid-cols-2 gap-4">
          {/* First Name */}
          <div>
            <Label htmlFor="firstName">First Name</Label>
            <Input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              id="firstName"
              placeholder="John"
              className="w-full"
            />
          </div>
          {/* Last Name */}
          <div>
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              id="lastName"
              placeholder="Doe"
              className="w-full"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            id="email"
            placeholder="john.doe@example.com"
            className="w-full"
          />
        </div>

        {/* Password */}
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            id="password"
            placeholder="Password"
            className="w-full"
          />
        </div>

        {/* Age and Gender */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="age">Age</Label>
            <Input
              value={age}
              onChange={(e) => setAge(e.target.value)}
              type="number"
              id="age"
              placeholder="25"
              className="w-full"
            />
          </div>
          <div>
            <Label htmlFor="gender">Gender</Label>
            <Select onValueChange={setGender} value={gender}>
              <SelectTrigger id="gender" className="w-full">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Skills */}
        <div>
          <Label className="text-sm font-medium">Skills</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {skills.map((skill, index) => (
              <div
                key={index}
                className="flex items-center space-x-2 text-sm rounded-lg py-1 px-3 bg-gray-100 dark:bg-gray-700"
              >
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="text-red-500 hover:text-red-700"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
          <div className="flex items-center space-x-2 mt-2">
            <Input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              className="w-full"
              placeholder="Add a skill"
            />
            <Button
              type="button"
              onClick={handleAddSkill}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Add
            </Button>
          </div>
        </div>

        {/* About */}
        <div>
          <Label htmlFor="about">About</Label>
          <Textarea
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            id="about"
            placeholder="Tell us about yourself..."
            className="w-full"
            rows={3}
          />
        </div>

        {/* Profile Picture */}
        <div>
          <Label htmlFor="profilePicture">Profile Picture</Label>
          <Input
            type="file"
            accept="image/*"
            onChange={handleProfilePictureChange}
            id="profilePicture"
            className="w-full"
          />
          {profilePicturePreview && (
            <div className="mt-2">
              <img
                src={profilePicturePreview}
                alt="Profile Preview"
                className="w-20 h-20 object-cover rounded-full"
              />
            </div>
          )}
        </div>

        {/* Errors */}
        {errors.length > 0 && (
          <div className="text-red-500 text-sm mt-2">
            {errors.map((error, index) => (
              <p className="text-center" key={index}>
                {error.msg || error}
              </p>
            ))}
          </div>
        )}

        <Button type="submit" className="w-full mt-2" disabled={loading}>
          {loading ? 'Creating Account...' : 'Sign Up'}
        </Button>
      </form>

      <p className="text-center text-sm text-gray-600 mt-8">
        Already have an account?{' '}
        <Link to="/login" className="text-blue-600 hover:underline font-medium">
          Login
        </Link>
      </p>
    </div>
  );
};

export default SignUp;
