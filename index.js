import express from "express";
import fs from "fs";
import cors from "cors";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import "./src/utils/config.cjs";
// import { name as appName, version as appVer } from "./package.json";
// const data = fs.readFileSync("./package.json");
const packageJSON = JSON.parse(fs.readFileSync("./package.json"));

const APPDATA = {
  PROJECT_NAME: packageJSON.name || "Node.js Project",
  PROJECT_VERSION: "v" + packageJSON.version || "0.1",
  DEV_NAME: process.env.NODE_APP_DEV_NAME || "Victor",
  DEV_EMAIL: process.env.NODE_APP_DEV_EMAIL || "victor.wright@outlook.de",
  DEV_PHONE: process.env.NODE_APP_DEV_PHONE || "+4917646774278",
  DEV_LOCATION: process.env.NODE_APP_DEV_LOCATION || "83707, Germany",
  HOST: process.env.HOST || "http://127.0.0.1",
  PORT: process.env.PORT || 5000,
};

// ------------ MY MODULES -----------
import errorHandler from "./src/middlewares/errorHandler.js";
// ------------ MY ROUTES -----------
import authRouter from "./src/routes/router-auth.js";
import baseRoute from "./src/routes/router-indexpage.js";
import recipesRouter from "./src/routes/router1-recipes.js";
import usersRouter from "./src/routes/router2-users.js";
import categoriesRouter from "./src/routes/router3-categories.js";
import ingredientsRouter from "./src/routes/router4-ingredients.js";
import shareitemsRouter from "./src/routes/router5-shareitems.js";
import plzRouter from "./src/routes/router6-plz.js";

const endPoints = {
  route0: ["/", "Info Page", baseRoute], //props issue!!
  route1: ["/api/recipes", "API Recipes", recipesRouter],
  route2: ["/api/users", "API Users", usersRouter],
  route3: ["/api/categories", "API Categories", categoriesRouter],
  route4: ["/api/ingredients", "API Ingredients", ingredientsRouter],
  route5: ["/api/shareitems", "API Shareitems", shareitemsRouter],
  route6: ["/api/plz-de", "API PostalCodes DE", plzRouter],
};

baseRoute.appData = APPDATA;
baseRoute.endPoints = endPoints;
authRouter.appData = APPDATA;

// ------------ MAIN APP -----------
const app = express();
const corsOptions = {
  // {origin: [host, "http://127.0.0.1", "https://abul.db.elephantsql.com/"],}
  origin: "*",
  optionsSuccessStatus: 200, // some legacy browsers
};
app.use(cors(corsOptions));
app.set("view engine", "ejs");
app.use(express.static(join(__dirname, "uploads"))); //for serving something
app.use(express.json());

// ----------- iterate all routers  ----
app.use("/auth", authRouter);
for (let index = 0; index < Object.keys(endPoints).length; index++) {
  var key = "route" + index;
  app.use(endPoints[key][0], endPoints[key][2]);
}

// ----------- Handle unknown endpoint (a web-view)----
app.get("*", (req, res, next) => {
  res.status(404).render("no_route.ejs", { APPDATA });
});

// ----------- lastly error handling  ----
app.use(errorHandler);

// ----------- activate server!  ----
app.listen(process.env.PORT || APPDATA.PORT || 5000, () =>
  console.info(
    `\n${APPDATA.PROJECT_NAME}: \n- Server listens at ${APPDATA.HOST}:${APPDATA.PORT}\n`
  )
);
