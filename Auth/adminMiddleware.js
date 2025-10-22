const { User } = require("../Models/userModel");
const { messageHandler } = require("../utils/messageHandler");

const checkRole = (roles) => {
  return async (req, res, next) => {
    try {
      const userId = req.userId; 
      const user = await User.findById(userId);

      if (!user) {
        return messageHandler(res, 404, "User not found");
      }

    
      if (!roles.includes(user.role)) {
        return messageHandler(res, 403, "Access Denied: You do not have permission");
      }

      next();
    } catch (error) {
      return messageHandler(res, 500, `Role Check Error: ${error.message}`);
    }
  };
};

module.exports = { checkRole };