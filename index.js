import express from "express";
import cors from "cors";
import fs from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ------------ CONFIGURE -----------
import "./src/utils/config.cjs";
const packageJSON = JSON.parse(fs.readFileSync("./package.json"));
const APPDATA = {
  TITLE: packageJSON.name || "Node.js Project",
  NAME:
    packageJSON.name
      .replace(/-/g, " ")
      .replace(/(^\w{1})|(\s+\w{1})/g, (chr) => chr.toUpperCase()) || "",
  VER: "v" + packageJSON.version || "0.1",
  INFO: packageJSON.info || "",
  DESCR: packageJSON.description || "new project",
  DEVTEAM: process.env.NODE_APP_DEV_TEAM || "",
  DEVLEAD: process.env.NODE_APP_DEV_LEAD || "Victor Wright",
  EMAIL: process.env.NODE_APP_DEV_EMAIL || "victor.wright@outlook.de",
  PHONE: process.env.NODE_APP_DEV_PHONE || "+4917646774278",
  LOCATION: process.env.NODE_APP_DEV_ADDR || "83707, Germany",
  WEBSITE: packageJSON.homepage || process.env.HOST || "http://127.0.0.1",
  ROOT: __dirname || "/",
  HOST: process.env.HOST || packageJSON.homepage || "http://127.0.0.1",
  PORT: process.env.PORT || 5000,
};

// ------------ MODULES -----------
import errorHandler from "./src/middlewares/errorHandler.js";
// ------------ ROUTES -----------
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
// app.use(express.static(join(__dirname, "uploads"))); // for serving something (mutler?)
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

// ----------- Error handling  ----
app.use(errorHandler);

// ----------- Activate server!  ----
app.listen(APPDATA.PORT, () =>
  console.info(
    `\n${APPDATA.NAME}: \n- Server listens at ${APPDATA.HOST}:${APPDATA.PORT}\n- Root is ${APPDATA.ROOT}\n`
  )
);
