const userModel = require("../models/user.model");



// In a middleware before validation
module.exports.normalizeSkills = function(req, res, next) {
  if (typeof req.body.skills === "string") {
    try {
      req.body.skills = JSON.parse(req.body.skills);
    } catch { 
      // Do nothing, express-validator will catch it
    }
  }
  next();
}


module.exports.authMe = async (req, res , next) => {
  try{
      const token = req.header("Authorization")?.split(" ")[1]
      if(!token) return res.status(401).json({message: "Unauthorized"})
      const isVerifiedToken = await userModel.verifyToken(token)
      if(!isVerifiedToken) return res.status(401).json({message: "Unauthorized"})
        const user = await userModel.findById(isVerifiedToken.id).select("-password -__v")
      if(!user) return res.status(404).json({message: "User not found"})

      req.user = user
      
          
      next()
  }catch(err){
      console.error(err)
      return res.status(500).json({message: "Internal Server Error"})
  }
}