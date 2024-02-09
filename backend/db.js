const mongoose = require("mongoose");
mongoose.connect(
  "mongodb+srv://vishruthvs2003:zgHs5W6OVdvzv2p8@cluster0.fd6ek8i.mongodb.net/paytm"
);
const userSchema = mongoose.Schema({
  userName: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    minLength: 3,
    maxLength: 30,
    // sparse: true,
  },
  password: {
    type: String,
    required: true,
    minLength: 6,
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
    maxLength: 50,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    maxLength: 50,
  },
});
const User = mongoose.model("User", userSchema);
module.exports = { User };
