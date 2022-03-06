import { Router } from "express";
import { getOneEL } from "../controllers/dbData-users.js";
import { getUser } from "../middlewares/users.js";
import verifyJWT, { newJWT } from "../middlewares/JWT.js";
import ErrorResponse from "../utils/errorResponse.js";

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
    res.status(404).json({ info, sysMessage: error.message });
  }
};

const authRouter = Router(); //*                            "/auth"
authRouter
  .post("/login/:id", getUser) //*                           log-in
  .post("/checkin/:id", verifyJWT, doCheckIn) //*            check-in
  .use("/", (req, res) => {
    const APPDATA = authRouter.appData;
    res.status(501).render("auth.ejs", { APPDATA });
  });

export default authRouter;
