import { User } from "../models/user.model.js";
import { Apiresponse } from "../utils/Apiresponse.js";

const generateTokens = async (id) => {
  const user = await User.findById(id);
  const accessToken = await user.generateAccessToken();
  const refreshToken = await user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  return { accessToken, refreshToken };
};

const registerUser = async (req, res) => {
  try {
    const { email, username, password } = req.body;

    if ([email, username, password].some((item) => item.trim() === "")) {
      return res.status(400).json("All fields are required to register");
    }

    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      return res.status(400).json("User already exists");
    }

    const addToDb = { email, username, password };
    const userDb = await User.create(addToDb);

    const createdUser = await User.findById(userDb._id).select(
      "-password -refreshToken"
    );
    if (!createdUser) {
      return res.status(500).json("Unable to connect to the database");
    }

    return res
      .status(201)
      .json(
        new Apiresponse(201, "User account successfully created", createdUser)
      );
  } catch (error) {
    return res.status(500).json(`Error during registration: ${error.message}`);
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if ([email, password].some((item) => item.trim() === "")) {
      return res.status(400).json("All fields are required to login");
    }

    const findUser = await User.findOne({ email });

    if (!findUser) {
      return res.status(404).json("No user found with the provided email");
    }

    const checkingPass = await findUser.checkPass(password);
    if (!checkingPass) {
      return res.status(401).json("Incorrect password");
    }

    const { accessToken, refreshToken } = await generateTokens(findUser._id);

    const loggedUser = await User.findById(findUser._id).select(
      "-password -refreshToken"
    );

    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new Apiresponse(
          200,
          {
            user: loggedUser,
            accessToken,
            refreshToken,
          },
          "User logged in successfully"
        )
      );
  } catch (error) {
    return res.status(500).json(`Error during login: ${error.message}`);
  }
};

export { registerUser, loginUser };
