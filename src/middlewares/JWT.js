import jwt from "jsonwebtoken";
import asyncHandler from "./asyncHandler.js";
import ErrorResponse from "../utils/errorResponse.js";

const JWTsecret = process.env.NODE_APP_JWT;
const JWToptions = { expiresIn: 60 * 60 };
const MODE = process.env.NODE_APP_DEV_MODE;

const verifyJWT = asyncHandler(async (req, res, next) => {
  const {
    headers: { authorization },
    params: { id },
  } = req;
  if (!authorization) throw new ErrorResponse("Please log in first", 401);
  const { username } = jwt.verify(authorization, JWTsecret);
  if (!username) throw new ErrorResponse("User Authorization failed.", 404);
  if (id && username != id)
    throw new ErrorResponse("Incorrect User credentials.", 404);
  next();
});

export const newJWT = async (payload) => {
  const token = jwt.sign(payload, JWTsecret, JWToptions);
  process.env.NODE_ENV === "development" && //*                    in development only
    console.log(jwt.decode(token, { complete: false }));
  MODE.substring(0, 3).toUpperCase() === "DEV" && console.log("token:", token);
  return token;
};

export default verifyJWT;
