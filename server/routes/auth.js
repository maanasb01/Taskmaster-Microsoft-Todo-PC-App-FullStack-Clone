const express = require("express");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { ToDoList } = require("../models/ToDoList");
const tokenAuth = require("../middlewares/tokenAuth");

//function to assign auth token when user is provided. Returns authToken. Used in Login and Signup Routes.
const assignToken = (user) => {
  const data = {
    user: {
      id: user.id,
    },
  };

  const authtoken = jwt.sign(data, process.env.AUTH_SECRET_KEY, {
    expiresIn: "15h",
  });
  return authtoken;
};

//Create a User using: POST "/auth/createuser". No Login required.
router.post(
  "/createuser",
  [
    body("name").isLength({ min: 3 }),
    body("email").isEmail().withMessage("Please enter a valid email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long")
      .matches(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@#$%^&!])[A-Za-z\d@#$%^&!]*$/)
      .withMessage(
        "Password must contain at least one letter, one numbers, and one special character"
      ),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    //NOTE:  would work even without it too cuz of mongoose unique property
    // const existingUser = await User.findOne({ email: req.body.email });
    // if (existingUser) {
    //     return res.status(400).json({ message: 'Email already exists' });
    // }

    //Storing password using bcryptjs. Generatind Salt first and then hashing the password+salt (bcrypt does it internally)
    const salt = await bcrypt.genSalt(10);
    const secPassword = await bcrypt.hash(req.body.password, salt);

    try {
      const user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPassword,
      });

      // Create the default todo list for the user
      const defaultTodoList = new ToDoList({
        title: `Default Tasks List for user ${user._id}`,
        user: user._id, // Link the list to the new user
        isDefaultTasksList: true,
      });

      await defaultTodoList.save();
      const authToken = assignToken(user);
      const userResponse = {
        _id: user._id,
        name: user.name,
        email: user.email,
      };

      res
        .cookie("authToken", authToken, {
          expires: new Date(Date.now() + 15 * 60 * 60 * 1000),
          httpOnly: true,
        })
        .json({ success: true, user: userResponse });
    } catch (error) {
      if (error.name === "MongoServerError" && error.code === 11000) {
        // Mongoose duplicate key error (code 11000) for unique constraint violation
        return res.status(400).json({
          message: "Email already exists. Please enter a different email.",
          error: error.message,
          success: false,
        });
      } else {
        console.error(error);
        res
          .status(500)
          .json({
            message: "Internal server error",
            error: error.message,
            success: false,
          });
      }
    }
  }
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Please enter a valid email"),
    body("password").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(404).json({ error: errors.array(), success: false });
    }

    try {
      const user = await User.findOne({ email: req.body.email });

      if (user) {
        try {
          //either returning true or false, not returning an error, so in try catch block, it wont go to cath block as long as compare function is working properly
          const passwordMatch = await bcrypt.compare(
            req.body.password,
            user.password
          );

          if (passwordMatch) {
            const authToken = assignToken(user);
            const userResponse = {
              _id: user._id,
              name: user.name,
              email: user.email,
            };
            return res
              .cookie("authToken", authToken, {
                expires: new Date(Date.now() + 15 * 60 * 60 * 1000),
                // expires: new Date(Date.now()+ 15*1000),
                httpOnly: true,
              })
              .json({ success: true, user: userResponse });
          } else {
            return res
              .status(500)
              .json({
                message: "Please Enter Valid Credentials",
                success: false,
              });
          }
        } catch (error) {
          res
            .status(401)
            .json({
              message: "Please Enter Valid Credentials.",
              success: false,
            });
        }
      } else {
        res
          .status(401)
          .json({ message: "Please Enter Valid Credentials.", success: false });
      }
    } catch (error) {
      res
        .status(500)
        .json({ message: "Internal Server Error.", success: false });
    }
  }
);

//Logout Route
router.get("/logout", tokenAuth, (req, res) => {
  try {
    res.clearCookie("authToken");
    res.status(200).json({ message: "Logged out successfully", success: true });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error.", success: false });
  }
});

module.exports = router;
