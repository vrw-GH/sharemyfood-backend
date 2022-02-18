import jwt from "jsonwebtoken";
import asyncHandler from "../middlewares/asyncHandler.js";
import ErrorResponse from "../utils/errorResponse.js";

const verifyJWT = asyncHandler(async (req, res, next) => {
  const {
    headers: { authorization },
    params: { id },
  } = req;
  if (!authorization) throw new ErrorResponse("Please log in", 401);
  const { username } = jwt.verify(authorization, process.env.NODE_APP_JWT);
  if (!username) throw new ErrorResponse("User Authorization failed.", 404);
  if (id && username != id)
    throw new ErrorResponse("Incorrect User credentials.", 404);
  next();
});

export default verifyJWT;
