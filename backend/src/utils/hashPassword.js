const bcrypt = require("bcryptjs");
// Hashing new passport
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

module.exports = hashPassword;