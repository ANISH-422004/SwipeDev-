const userModel = require("../models/user.model");

// Create user
exports.createuser = async (userData, uploadedImageData = null) => {
  // 1. Merge image data if available
  const finalUserData = {
    ...userData,
    skills: userData.skills || [],
    about: userData.about || undefined,
    ...(uploadedImageData && {
      profilePic: uploadedImageData.url,
      profilePicFileId: uploadedImageData.fileId,
    }),
  };

  // 2. Create user
  const newUser = await userModel.create(finalUserData);
  if (!newUser) throw new Error("User creation failed");

  // 3. Generate token
  const token = newUser.generateAuthToken();

  // 4. Prepare clean user response
  const userResponse = newUser.toObject();
  delete userResponse.password;
  delete userResponse.__v;

  return { user: userResponse, token };
};


// Login user
exports.loginUser = async (email, password) => {
  const user = await userModel.findOne({ email });

  if (!user) {
    throw new Error("User not found");
  }

  const isMatch = await user.comparePassword(password); // Ensure comparePassword is in schema

  console.log(isMatch)

  if (!isMatch) {
    throw new Error("Incorrect password");
  }

  const token = user.generateAuthToken();

  const userResponse = user.toObject();
  delete userResponse.password;
  delete userResponse.__v;

  return { user: userResponse, token };
};


// Update user
exports.updateUser = async (userId, updateData, uploadedImageData = null) => {


  const updatedUser = await userModel.findByIdAndUpdate(userId, updateData, { new: true });
  if (!updatedUser) throw new Error("User update failed");

  const userResponse = updatedUser.toObject();
  delete userResponse.password;
  delete userResponse.__v;

  return userResponse;
}


// Delete user
exports.deleteUser = async (userId) => {
  const deletedUser = await userModel.findByIdAndDelete(userId);
  if (!deletedUser) throw new Error("User deletion failed");

  return deletedUser;
}
