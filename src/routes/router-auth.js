import { Router } from "express";
import jwt from "jsonwebtoken";
import { getOneEL } from "../controllers/dbData-users.js";
import verifyJWT from "../middlewares/verifyJWT.js";
import ErrorResponse from "../utils/errorResponse.js";

const doLogin = async (req, res) => {
  //*                                        login
  const dbTable = "users";
  try {
    const tuples = await getOneEL(dbTable, req.params.id);
    const token = jwt.sign(
      { username: req.params.id },
      process.env.NODE_APP_JWT,
      {
        expiresIn: 60 * 60,
      }
    );
    res.json({ token });
  } catch (error) {
    const info = {
      result: false,
      message: ` <${req.params.id}> login error.`,
    };
    res.status(404).json({ info, systemError: error.message });
  }
};

const authRouter = Router();

authRouter.post(
  "/login/:id",
  verifyJWT,
  // (req, res, next) => {
  //   if (!req.headers.authorization)
  //     throw new ErrorResponse(`Please provide token`, 400);
  //   const payload = jwt.verify(req.headers.authorization);
  //   console.log(payload);
  //   if (payload.username !== req.params.username)
  //     throw new ErrorResponse(`Invalid Token`, 400);
  //   next();
  // },
  doLogin
);
authRouter.get("/login", (req, res) => {
  const APPDATA = authRouter.appData;
  res.status(404).render("exp_post.ejs", { APPDATA });
});
// loginRouter.post("/signup", signUp);
authRouter.use("/", (req, res) => {
  const APPDATA = authRouter.appData;
  res.status(501).render("auth.ejs", { APPDATA });
});

export default authRouter;
