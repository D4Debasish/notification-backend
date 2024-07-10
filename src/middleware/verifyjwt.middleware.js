import jwt from "jsonwebtoken";
import { User } from "../models/user.model";

export const verifyJwt = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res.status(400).json("No cookies are present");
    }
    const decodedToken = jwt.verify(token, process.env.ACCESS_SECRET_KEY);
    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      return res.status(400).json("Error in fetching token");
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(400).json("Error in verifyJWT");
  }
};
