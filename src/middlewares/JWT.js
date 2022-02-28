import jwt from "jsonwebtoken";
import asyncHandler from "./asyncHandler.js";
import ErrorResponse from "../utils/errorResponse.js";

const JWTsecret = process.env.NODE_APP_JWT;
const JWToptions = { expiresIn: 60 * 60 };

const verifyJWT = asyncHandler(async (req, res, next) => {
  const {
    headers: { authorization },
    params: { id },
  } = req;
  if (!authorization) throw new ErrorResponse("Please log in", 401);
  const { username } = jwt.verify(authorization, JWTsecret);
  if (!username) throw new ErrorResponse("User Authorization failed.", 404);
  if (id && username != id)
    throw new ErrorResponse("Incorrect User credentials.", 404);
  next();
});

export const newJWT = (payload) => {
  jwt.sign(payload, JWTsecret, JWToptions);
  // console.log(jwt.decode(token)); //*      -testing only   ,{complete:true}
};

export default verifyJWT;
