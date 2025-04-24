const { createuser, loginUser } = require("../services/userService");
const { uploadBufferStream, deleteImage } = require("../utils/imagekit");
const { validationResult } = require("express-validator");



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
      res.status(401).json({ errors:[ error.message ]});
    }
  };