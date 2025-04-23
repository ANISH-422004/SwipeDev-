const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
// Email Regex for validation
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        trim: true,
        minlength: [2, 'First name must be at least 2 characters long'],
        maxlength: [50, 'First name can be up to 50 characters'],
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
        trim: true,
        minlength: [2, 'Last name must be at least 2 characters long'],
        maxlength: [50, 'Last name can be up to 50 characters'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        validate: {
            validator: (v) => emailRegex.test(v),
            message: (props) => `${props.value} is not a valid email!`,
        },
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        trim: true,
        minlength: [8, 'Password must be at least 8 characters long'],
    },
    age: {
        type: Number,
        required: [true, 'Age is required'],
        min: [18, 'You must be at least 18 years old'],
        max: [100, 'Age cannot exceed 100'],
    },
    gender: {
        type: String,
        enum: {
            values: ['male', 'female', 'other'],
            message: '{VALUE} is not a valid gender',
        },
        required: [true, 'Gender is required'],
    },
    profilePic: {
        type: String,
        default:
            "https://tamilnaducouncil.ac.in/wp-content/uploads/2020/04/dummy-avatar.jpg"
    },
    profilePicFileId: {
        type: String,
        default: "",
    },
    skills: {
        type: [String],
        validate: {
            validator: (arr) => arr.every(skill => typeof skill === 'string' && skill.length <= 50),
            message: 'Each skill must be a string of max 50 characters',
        },
        validate(arr) {
            if (arr.length > 10) {
                throw new Error('You can only have up to 10 skills');
            }
        },
        default: [],
    },
    about: {
        type: String,
        trim: true,
        maxlength: [500, 'About section can be up to 500 characters'],
        default: "Hello, I am a new user!",
    },

}, {
    timestamps: true,

});



// 🔒 Middleware: Hash password before saving
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// ⚙️ Method: Check password
userSchema.methods.comparePassword = async function (inputPassword) {
    console.log(inputPassword, this.password)
    return await bcrypt.compare(inputPassword, this.password);
  };

// 🔐 Method: Generate token
userSchema.methods.generateAuthToken = function () {
    return jwt.sign(
        { id: this._id, email: this.email },
        config.JWT_SECRET,
        { expiresIn: "7d" }
    );
};

//verify token
userSchema.statics.verifyToken = function (token) {
    return jwt.verify(token, process.env.JWT_SECRET);
};

// 🔒 Method: Generate password reset token
userSchema.methods.generatePasswordResetToken = function () {
    const resetToken = jwt.sign(
        { id: this._id, email: this.email },
        config.JWT_SECRET,
        { expiresIn: "1h" }
    );
    return resetToken;
};


const userModel = mongoose.model("User", userSchema);
module.exports = userModel;