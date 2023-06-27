require('dotenv').config();
const jwt = require("jsonwebtoken");
const Recruiter = require("../models/recruiter");

const auth = async (req, res, next) => {
  try {
    if (!req.header("Authorization")) {
      return res.status(401).send({
        message: "Please provide a token to get details",
        error: "Please provide a token to get details",
      });
    }

    const token = req.header('Authorization').replace('Bearer ', '');

    const decode = jwt.verify(token, process.env.JWTRECRUITER);

    const user = await Recruiter.findOne({ _id: decode._id });

    if (!user) {
      return res.status(401).send({
        message: "User not found",
        error: "User not found",
      });
    }

    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    res.status(401).send({
      message: "Please authenticate",
      error: error,
    });
  }
};

module.exports = auth;
