const { createuser } = require("../services/userService");

exports.signupUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, age, gender, skills, about } = req.body;

    console.log("Profile picture file found, attempting upload...");

    let uploadedImageData = null;
    if (req.file) {
      const { uploadBufferStream } = require("../utils/imagekit");
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
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};
