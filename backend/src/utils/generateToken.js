const jwt = require("jsonwebtoken");
//Generating new JWT tokens
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

module.exports = generateToken;