import { Router } from "express";
import { getOneEL } from "../controllers/dbData-users.js";
import verifyJWT, { newJWT } from "../middlewares/JWT.js";
import ErrorResponse from "../utils/errorResponse.js";

const doLogIn = async (req, res) => {};

const doCheckIn = async (req, res) => {
  const dbTable = "users";
  try {
    const tuples = await getOneEL(dbTable, req.params.id);
    const token = newJWT({ username: req.params.id });
    res.json({ token });
  } catch (error) {
    const info = {
      result: false,
      message: ` <${req.params.id}> login error.`,
    };
    res.status(404).json({ info, systemError: error.message });
  }
};

const authRouter = Router(); //* "/auth"
authRouter
  .post("/login/:id", doLogIn) //*                           log-in
  .post("/checkin/:id", verifyJWT, doCheckIn) //*            check-in
  .use("/", (req, res) => {
    const APPDATA = authRouter.appData;
    res.status(501).render("auth.ejs", { APPDATA });
  });

export default authRouter;
