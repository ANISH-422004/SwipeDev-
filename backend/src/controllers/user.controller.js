const { deleteImage, uploadBufferStream } = require("../utils/imagekit");
const { updateUser, deleteUser, getAllUsers, findUserByEmail } = require("../services/userService");
const { sendEmail } = require("../utils/nodeMailer");
const userModel = require("../models/user.model");





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

    //if password is provided, throw error
    if (password) {
      return res.status(400).json({ message: "Invalid Edit Request" });
    }

    const updates = {};
    if (firstName) updates.firstName = firstName;
    if (lastName) updates.lastName = lastName;
    if (email) updates.email = email;

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

module.exports.deleteUser = async (req, res) => {
  try {
    const userId = req.user._id;

    // Delete the user's profile picture from ImageKit if it exists
    if (req.user.profilePicFileId) {
      await deleteImage(req.user.profilePicFileId);
      console.log("Deleted image from ImageKit:", req.user.profilePicFileId);
    }

    // Delete the user from the database
    const deletedUser = await deleteUser(userId);

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error.message);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

module.exports.getAllUsers = async (req, res) => {
  try {
    const users = await getAllUsers();
    res.status(200).json({ users });
  } catch (error) {
    console.error("Error fetching all users:", error.message);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
}


module.exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log(user)
    // Generate a password reset token and send it to the user's email
    const token = user.generatePasswordResetToken();
    user.passwordResetToken = token;
    await user.save();

    // Send email logic here (using nodemailer or any other service)
    //password resetlink should be sent to the user email

    const resetLink = `${req.protocol}://${req.get("host")}/api/auth/reset-password/${token}`;
    console.log("Password reset link:", resetLink);
    // You can use a service like nodemailer to send the email
    await sendEmail({
      to: user.email,
      subject: "Password Reset",
      htmlContent: `
      <body style="background-color: #000; color: #fff;">
      <p style="color: #fff;">Click the link below to reset your password:</p>
      <a href="${resetLink}" style="color: #007bff; text-decoration: none;">Reset Password</a>
      <p style="color: #fff;">If you did not request this, please ignore this email.</p>
      <p style="color: #fff;">Thank you!</p>
      <p style="color: #fff;">Best regards,</p>
      </body>
      `,
    });
    // Uncomment the following line to send the email using your email service

    // await sendPasswordResetEmail(user.email, token);

    res.status(200).json({ message: "Password reset link sent to your email" });
  } catch (error) {
    console.error("Error in forgot password:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
}


module.exports.resetPassword = async (req, res) => {
  try {
    console.log(req.body)
    const { token, newPassword } = req.body;
    const user = await userModel.findOne({ passwordResetToken: token });
    if (!user) {
      return res.status(404).json({ message: "Invalid or expired token" });
    }

    user.password = newPassword;
    user.passwordResetToken = undefined; // Clear the token after use
    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Error in reset password:", error.message);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
}