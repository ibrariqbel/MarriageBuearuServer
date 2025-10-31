const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../Models/userModel");
const nodemailer = require("nodemailer");
const { messageHandler } = require("../utils/messageHandler");
const { transporter } = require("../utils/nodemailer");
require("dotenv").config();
const cloudinary = require("cloudinary");
const { uploadToCloud } = require("../utils/cloudinary");

const registerHandler = async (req, res) => {
  try {
    const { username, email, password, phoneNumber, role } = req.body;
    if (
      username !== "" &&
      email !== "" &&
      password !== "" &&
      phoneNumber !== ""
    ) {
      const userfind = await User.findOne({
        $or: [{ email }, { phoneNumber }],
      });

      if (userfind) {
        if (userfind.email === email) {
          return messageHandler(res, 400, "Email Already Exist.");
        }
        if (userfind.phoneNumber === phoneNumber) {
          return messageHandler(res, 400, "Phone Number is Already Exist.");
        }
      }

      const hashPass = await bcrypt.hash(password, 10);
      const userCreate = await User.create({
        username,
        email,
        password: hashPass,
        phoneNumber,
        role,
      });

      if (userCreate) {
        return messageHandler(res, 200, "User Create Successfully", userCreate);
      }
    } else {
      return messageHandler(res, 400, "All Field Required");
    }
  } catch (error) {
    return messageHandler(
      res,
      500,
      `Register Server Error ${error.message}`,
      error
    );
  }
};

const loginHandler = async (req, res) => {
  try {
    const { email, phoneNumber, password } = req.body;
    if ((!email && !phoneNumber) || !password) {
      return messageHandler(
        res,
        400,
        "Email or Phone Number and Password are required"
      );
    }
    const user = await User.findOne({ $or: [{ email }, { phoneNumber }] });
    if (!user) {
      return messageHandler(res, 400, "User Not Found");
    }
    const passVerify = await bcrypt.compare(password, user.password);
    if (passVerify) {
      const userId = user._id;
      const secertkey = process.env.SECERITKEY;
      const token = jwt.sign({ userId }, secertkey);
      if (token) {
        res.cookie("token", token, {
          maxAge: 100 * 60 * 60 * 24 * 30, //one month in milliseconds
          httpOnly: true,
          secure: true,
          sameSite: "None",
        });
      }

      if (user.role === "super admin") {
        return messageHandler(res, 200, `Welcom Super Admin ${user.username}`);
      } else if (user.role === "admin") {
        return messageHandler(
          res,
          200,
          `Welcom Admin ${user.username} You can Register Your Company`
        );
      } else {
        return messageHandler(res, 200, "Logged In Successfully", user);
      }
    } else {
      return messageHandler(res, 400, "Incorrect Password");
    }
  } catch (error) {
    return messageHandler(res, 500, `Login Server Error ${error.message}`);
  }
};

const forgotPassHandler = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || email.trim() === "") {
      return messageHandler(res, 400, "Email Required");
    }

    const user = await User.findOne({ email });
    if (!user) {
      return messageHandler(res, 404, "User Not Found");
    }

    const id = user._id;
    const passwordRestLink = `http://localhost:3001/user/password/reset/${id}`;

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; background-color: #f4f8fb; padding: 30px; text-align: center;">
        <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 12px; padding: 25px; box-shadow: 0 6px 18px rgba(0,0,0,0.1);">
          <h1 style="color: #ff6b6b;">🌸 Journey Of Heart to Heart 🌸</h1>
          <p style="font-size: 16px; color: #444;">
            Hello <b>${user.name || "Friend"}</b>,<br><br>
            We received a request to reset your password for your <b>Journey Of Heart to Heart</b> account.
          </p>
          <a href="${passwordRestLink}" 
             style="display: inline-block; margin: 20px 0; padding: 12px 20px; font-size: 16px; color: #fff; background: #ff6b6b; border-radius: 8px; text-decoration: none; font-weight: bold;">
             🔑 Reset Your Password
          </a>
          <p style="font-size: 14px; color: #777; margin-top: 20px;">
            If you didn’t request this, you can safely ignore this email.<br>
            This link will expire soon for security reasons.
          </p>
          <hr style="margin: 30px 0;">
          <p style="font-size: 12px; color: #aaa;">
            💌 With Love,<br>
            The Journey Of Heart to Heart Team
          </p>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: '"Journey Of Heart to Heart" <todoapps.info@gmail.com>',
      to: email,
      subject: "Password Reset - Journey Of Heart to Heart",
      html: htmlContent, // 🎨 use HTML instead of plain text
    });

    return res
      .status(200)
      .json({ message: "Password Reset Link sent successfully" });
  } catch (error) {
    return messageHandler(
      res,
      500,
      `Forgot Password Server Error: ${error.message}`,
      error
    );
  }
};

const resetPass = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);

    if (!user) {
      return messageHandler(res, 404, "User Id Not Found");
    }
    const { newPass, confirmPass } = req.body;
    if (newPass !== confirmPass) {
      return messageHandler(res, 400, "Password Does not Match");
    }
    console.log("User Id is:", userId);
    console.log("Confirm Password is:", newPass);

    const hashPass = await bcrypt.hash(newPass, 10);
    const updatePass = await User.findByIdAndUpdate(
      userId,
      {
        password: hashPass,
      },
      { new: true }
    );
    if (updatePass) {
      return res.status(200).json({ message: "Password changed successfully" });
    } else {
      return res
        .status(500)
        .json({ message: "Some error. Kindly try again after some time" });
    }
  } catch (error) {
    return messageHandler(
      res,
      500,
      `Reset Password Message ${error.message}`,
      error
    );
  }
};
const getUserbyId = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return messageHandler(res, 404, "User Id Not Found");
    }
    const user = await User.findById(userId).select('-password');

    if (!user) {
      return messageHandler(res, 404, "User Not Found");
    }

    return messageHandler(res, 200, "User Found", user);
  } catch (error) {
    return messageHandler(
      res,
      500,
      `Get user Server Error ${error.message}`,
      error
    );
  }
};
const getAllUser = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return messageHandler(res, 404, "User Not Found");
    }
    const requester = await User.findById(userId);
    if (!requester) {
      return messageHandler(res, 400, "Requester Not Found");
    }
    if (requester.role !== "super admin") {
      return messageHandler(
        res,
        403,
        "Access denied: Only super admin can view all users"
      );
    }

    const users = await User.find();
    if (!users.length) {
      return messageHandler(res, 404, "No users found");
    }
    return messageHandler(res, 200, `${users.length} users found`, users);
  } catch (error) {
    return messageHandler(
      res,
      500,
      `Get All User Server Error ${error.message}`,
      error
    );
  }
};

const deleteUser = async (req, res) => {
  try {
    const userID = req.userId;
    console.log("User Id:", userID);
    const { password } = req.body;
    if (!userID) {
      return messageHandler(res, 404, "User ID Not Found");
    }
    const user = await User.findById(userID);
    console.log(user);
    if (!user) {
      return messageHandler(res, 404, "User Not Found");
    }
    const passVerify = await bcrypt.compare(password, user.password);
    if (!passVerify) {
      return messageHandler(res, 400, "Password Incorrect");
    }
    await User.findByIdAndDelete(userID);
    return messageHandler(res, 200, "User Delete Succesfully");
  } catch (error) {
    return messageHandler(
      res,
      500,
      `Delete Server Error ${error.message}`,
      error
    );
  }
};

const uploadUserProfile = async (req, res) => {
  try {
    const userID = req.userId;
    const user = await User.findById(userID);
    if (!user) {
      return messageHandler(res, 404, "User Not Found");
    }

    if (!req.file) {
      return messageHandler(res, 400, "No file uploaded");
    }
    const imagePath = req.file.path;
    const upload = await uploadToCloud(imagePath);

    if (upload) {
      user.profilePicUrl = upload.secure_url;
      await user.save();
      return messageHandler(res, 200, "Upload Succesfully", upload);
    } else {
      return messageHandler(res, 400, "some Error, try After some time");
    }
  } catch (error) {
    return messageHandler(
      res,
      500,
      `Upload Image Profile Server Error ${error.message}`,
      error
    );
  }
};

const logoutHandler = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });
    return messageHandler(res, 200, "Logged out successfully");
  } catch (error) {
    return messageHandler(
      res,
      500,
      `Logout Server Error: ${error.message}`,
      error
    );
  }
};

module.exports = {
  registerHandler,
  loginHandler,
  forgotPassHandler,
  resetPass,
  getUserbyId,
  deleteUser,
  uploadUserProfile,
  getAllUser,
  logoutHandler,
};
