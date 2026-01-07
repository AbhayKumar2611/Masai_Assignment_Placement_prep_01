const express = require("express");
const UserModel = require("../models/user.models");
const bcrypt = require("bcrypt");
const saltRounds = 10;
var jwt = require("jsonwebtoken");
const JWT_SECRETKEY = process.env.JWT_SECRETKEY

const UserRouter = express.Router();

UserRouter.post("/signup", async (req, res) => {
  try {
    const password = req.body.password;
    bcrypt.hash(password, saltRounds, async function (err, hash) {
      if (err) {
        console.log(err);
        return res.status(500).json({ msg: "Something went wrong" });
      } else {
        await UserModel.create({ ...req.body, password: hash });
        return res.status(201).json({ msg: "Signup is successfull" });
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Something went wrong" });
  }
});

UserRouter.post("/login", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const existingUser = await UserModel.findOne({ email });
    const hashedPassword = existingUser.password;
    bcrypt.compare(password, hashedPassword, function (err, result) {
      // result == true
      if (err) {
        console.log(err);
        return res.status(500).json({ msg: "Something went wrong...." });
      } else {
        if (result) {
          var token = jwt.sign({ userId: existingUser._id }, JWT_SECRETKEY);
          console.log(token)
          return res.status(201).json({ msg: "Login is successfull", token });
        } else {
          return res.status(500).json({ msg: "Something went wrong..." });
        }
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Something went wrong...." });
  }
});

module.exports = UserRouter;
