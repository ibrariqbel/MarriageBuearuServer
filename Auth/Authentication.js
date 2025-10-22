const jwt = require("jsonwebtoken");
const { messageHandler } = require("../utils/messageHandler");
require("dotenv").config();
const Authentication = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    const secertkey = process.env.SECERITKEY;
    if (!token) {
      return messageHandler(res, 401, "No token provided. Access denied.");
    }
    await jwt.verify(token, secertkey, (error, resolve) => {
      if (error) {
        return messageHandler(res, 401, "UnAuthorised");
      } else {
        req.userId = resolve.userId;

        return next();
      }
    });
  } catch (error) {
    return messageHandler(
      res,
      500,
      `Authentication server error ${error.message}`,
      error
    );
  }
};

module.exports = { Authentication };
