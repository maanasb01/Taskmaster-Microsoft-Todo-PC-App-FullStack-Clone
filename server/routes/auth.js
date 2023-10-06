const express = require("express");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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

//Create a User using: POST "/api/auth/createuser". No Login required.
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
    console.log(req.body);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

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
      const authtoken = assignToken(user);
      res.json({ authtoken });
      //res.json(user);
    } catch (error) {
      if (error.name === "MongoServerError" && error.code === 11000) {
        // Mongoose duplicate key error (code 11000) for unique constraint violation
        return res.status(400).json({
          message: "Email already exists. Please enter a different email.",
          error: error.message,
        });
      } else {
        console.error(error);
        res
          .status(500)
          .json({ message: "Internal server error", message: error.message });
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
    //check for errors in the request with express-validator.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(404).json({ error: errors.array() });
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
            const authtoken = assignToken(user);
            return res.json({ authtoken });
          } else {
            return res.status(500).json({ message: "Internal Server Error." });
          }
        } catch (error) {
          console.log(error);
          res.status(401).json({ message: "Please Enter Valid Credentials." });
        }
      } else {
        res.status(401).json({ message: "Please Enter Valid Credentials." });
      }
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error." });
    }
  }
);

module.exports = router;
