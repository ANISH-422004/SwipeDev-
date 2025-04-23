const { deleteImage, uploadBufferStream } = require("../utils/imagekit");
const { validationResult  } = require("express-validator");
const { createuser , loginUser, updateUser } = require("../services/userService");

exports.signupUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: "Validation failed", errors: errors.array() });
    }

    const { firstName, lastName, email, password, age, gender, skills, about } = req.body;

    console.log("Profile picture file found, attempting upload...");

    let uploadedImageData = null;
    if (req.file) {
      const { uploadBufferStream } = require("../utils/imagekit");
const { updateUser } = require("../services/userService");
      uploadedImageData = await uploadBufferStream(req.file.buffer, req.file.originalname);
      console.log("Image uploaded successfully:", uploadedImageData.url);
    }

    const { user, token } = await createuser({
      firstName,
      lastName,
      email,
      password,
      age,
      gender,
      skills,
      about,
    }, uploadedImageData);

    res.status(201).json({ message: "User created successfully", user, token });
  } catch (error) {
    console.error("Error during user signup:", error.message);
    // Optionally handle image cleanup if failure
    if (req.file) {
      await deleteImage(req.file.filename); 
    }
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

exports.loginUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: "Validation failed", errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const { user, token } = await loginUser(email, password);
    res.status(200).json({ message: "Login successful", user, token });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(401).json({ message: error.message });
  }
};

module.exports.getUserProfile = async (req, res) => {
    try {
        const user = req.user; // Assuming user is set in auth middleware
        if (!user) {
        return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ user });
    } catch (error) {
        console.error("Error fetching user profile:", error.message);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

module.exports.updateUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, age, gender, skills, about } = req.body;
    const userId = req.user._id; 

    const updates = {};
    if (firstName) updates.firstName = firstName;
    if (lastName) updates.lastName = lastName;
    if (email) updates.email = email;
    if (password) updates.password = password; 
    if (age) updates.age = age;
    if (gender) updates.gender = gender;
    if (skills) updates.skills = skills;
    if (about) updates.about = about;

    let uploadedImageData = null;
    if (req.file) {
      //remove the previous image if exists form imageKit
      if (req.user.profilePicFileId) {
        await deleteImage(req.user.profilePicFileId); // Delete the old image from ImageKit
        console.log("Deleted old image from ImageKit:", req.user.profilePicFileId);
      }

      uploadedImageData = await uploadBufferStream(req.file.buffer, req.file.originalname);
      updates.profilePic = uploadedImageData.url;
    }

    const updatedUser = await updateUser(userId, updates);

    res.status(200).json({ message: "User updated successfully", user: updatedUser });
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};