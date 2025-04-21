const userModel = require("../models/user.model");

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
