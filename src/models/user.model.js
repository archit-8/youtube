import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowecase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowecase: true,
      trime: true,
    },
    fullName: {
      type: String,
      unique: false,
      lowecase: true,
      trim: true,
      index: true,
    },
    avatar: {
      type: String, //cloud url
      required: true,
    },
    coverImage: {
      type: String,
      required: false,
    },
    watchHistroy: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    password: {
      type: String,
      required: [true, "password is required"],
    },
    refeshToken: {
      type: String,
    },
  },
  { timestamps: true }
);
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};
userSchema.methods.genereateAcessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      username: this.username,
      email: this.email,
      fullName: this.fullname,
    },
    process.env.ACESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACESS_TOKEN_SECRET_EXPIRE,
    }
  );
};
userSchema.methods.genereateRefeshToekn = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      fullName: this.fullname,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRE,
    }
  );
};
export const User = mongoose.model("User", userSchema);
