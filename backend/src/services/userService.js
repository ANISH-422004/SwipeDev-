const connectionRequestModel = require("../models/connectionRequest.model");
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


//get all users
exports.getAllUsers = async () => {
  const users = await userModel.find().select("-password -__v"); // Exclude password and __v field
  return users;
} 

// find user by email
exports.findUserByEmail = async (email) => {
  const user = await userModel.findOne({ email }).select("-password -__v");
  if (!user) throw new Error("User not found");
  return user;
}

// find user by id
exports.findUserById = async (userId) => {
  const user = await userModel.findById(userId).select("-password -__v");
  if (!user) throw new Error("User not found");
  return user;
}

//get suggested user for feed
module.exports.getSuggestedUsersForFeed = async (loggedInUserId, skip = 0, limit = 10) => {
  // Step 1: Find all sent/received connection requests involving the user
  const connections = await connectionRequestModel.find({
      $or: [
          { senderId: loggedInUserId },
          { receiverId: loggedInUserId }
      ]
  });

  // Step 2: Build a Set of user IDs to exclude
  const userToHide = new Set();
  connections.forEach((item) => {
      const otherUserId = item.senderId.toString() === loggedInUserId.toString()
          ? item.receiverId.toString()
          : item.senderId.toString();
      userToHide.add(otherUserId);
  });

  // Step 3: Query users with pagination
  const users = await userModel.find({
      _id: {
          $nin: [loggedInUserId, ...userToHide]
      }
  })
  .skip(skip)
  .limit(limit);

  return users;
};
