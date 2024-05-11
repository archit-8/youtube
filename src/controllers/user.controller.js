import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
const genereateAcessAndfreshToekn = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.genereateAcessToken();
    const refreshToken = user.genereateRefeshToekn();

    user.refreshToken = refreshToken;
    await user.save({ vaildateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "referesh and acess Token generation ");
  }
};
const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, username, password } = req.body;

  // Check if any required field is empty
  if ([fullName, email, username, password].some((field) => !field.trim())) {
    throw new ApiError(400, "Please fill all the fields");
  }

  // Check if user already exists with the given username or email
  const existingUser = await User.findOne({ $or: [{ username }, { email }] });
  if (existingUser) {
    throw new ApiError(409, "Username or email already exists");
  }

  // Get the paths of avatar and coverImage files from request
  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  // Check if avatar is uploaded
  if (!avatarLocalPath) {
    throw new ApiError(400, "Please upload avatar image");
  }

  // Upload avatar and coverImage to cloudinary
  const avatar = await uploadCloudinary(avatarLocalPath);
  const coverImage = coverImageLocalPath
    ? await uploadCloudinary(coverImageLocalPath)
    : null;

  // Create new user
  const newUser = await User.create({
    fullName,
    email,
    username: username.toLowerCase(), // Convert username to lowercase
    password,
    avatar: avatar.url,
    coverImage: coverImage?.url || "", // Use coverImage URL if available, otherwise use empty string
  });

  // Find the created user by ID and exclude password and refreshToken fields
  const createdUser = await User.findById(newUser._id).select(
    "-password -refreshToken"
  );

  // Check if user creation failed
  if (!createdUser) {
    throw new ApiError(500, "User creation failed");
  }

  // Return successful response
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered successfully"));
});
const loginUser = asyncHandler(async (req, res) => {
  //req body -->
  //username or email
  // find the user
  //password check
  //access and refresh token
  //send  cookie
  const { email, username, password } = req.body;
  if (!username || !email) {
    throw new ApiError(400, "Please provide username or email");
  }
  const user = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  await user.isPasswordCorrect(password);
  if (!isPasswordCorrect) {
    throw new ApiError(401, "Incorrect password");
  }
  const { accessToken, refreshToken } = await genereateAcessAndfreshToekn(
    user._id
  );
  const loggedInUser = user
    .findById(user._id)
    .select("-password -refreshToken");

  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "User logged in successfully"
      )
    );
});
const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1, // this removes the field from document
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"));
});

export { registerUser, loginUser, logoutUser };
