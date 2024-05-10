import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
const registerUser = asyncHandler(async (req, res) => {
  //1.get the user  data from front end
  //2.validation
  //3.check if user alredy exist:username ,email
  //4.validatiion-emmpty or not
  //5.check for images ,check for avator
  //6.upload image on cloudinary,avator
  //7.create user object-create entry in db
  //9.remove password and refesh token filed from response
  //10.check for user  creation
  //11.return res
  // const { fullName, email, username, password } = req.body();
  const { fullName, email, username, password } = req.body;
  console.log("email", email);
  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "please fill all the fields");
  }
  const exitedUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (exitedUser) {
    throw new ApiError(409, "username or email already exist");
  }
  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;
  if (!avatarLocalPath) {
    throw new ApiError(400, "please upload avatar  images");
  }
  const avatar = await uploadCloudinary(avatarLocalPath);
  const coverImage = await uploadCloudinary(coverImageLocalPath);
  if (!avatar) {
    throw new ApiError(500, "avatar image upload failed");
  }
  const user = User.create({
    fullName,
    email,
    username: username.toLowerCase(),
    password,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
  });

  const CreatedUser = await user.findById(user._id)
    .select("-password -refeshToken");
  if (!CreatedUser) {
    throw new ApiError(500, "user creation failed");
  }
  return res
    .status(201)
    .json(new ApiResponse(200, CreatedUser, "user registered succesfull"));
});

export { registerUser };
