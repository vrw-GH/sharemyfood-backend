import { Router } from "express";
import {
  getUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  checkBody,
} from "../middlewares/users.js";
import verifyJWT from "../middlewares/JWT.js";
import ErrorResponse from "../utils/errorResponse.js";

const usersRouter = Router(); //*              "/api/users"
usersRouter
  .route("/")
  .get(getUsers) //*                           get all users (all tuples)
  .post(checkBody, createUser) //*             create new user (new tuple)
  .delete(() => {
    throw new ErrorResponse("Delete all data not allowed.", 403);
  });
usersRouter
  .route("/:id")
  .get(verifyJWT, getUser) //*                 get user data if authorised (returns tuple)
  .post(verifyJWT, updateUser) //*             update user if authorised (update tuple)
  .delete(verifyJWT, deleteUser); //*          remove user if authorised (delete tuple)

export default usersRouter;
