const ROLES = require("../config/auth_roles");
const mongoose = require("mongoose");

const ClientSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "client username is required!"],
    },
    password: {
      type: String,
      required: [true, "client password is required!"],
    },
    email: {
      type: String,
      required: [true, "client email is required!"],
    },
    telephone: {
      type: String,
      required: [true, "client phone number is required!"],
    },
    profile: {
      type: String,
      required: [true, "client profile pic is required!"],
    },
    refresh_token: {
      type: String,
    },
    user_role: {
      type: Number,
      default: ROLES.STAFF,
    },
    status: {
      type: String,
      default: "activated",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Client", ClientSchema);
