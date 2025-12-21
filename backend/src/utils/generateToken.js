const jwt = require("jsonwebtoken");
//Generating new JWT tokens
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

const generateResetToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "50m" });
};

module.exports = { generateToken, generateResetToken };