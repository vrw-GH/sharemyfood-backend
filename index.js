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
  MODE: process.env.NODE_APP_MODE || "Dev.",
  COOKTIME: process.env.NODE_APP_COOKTIME || "60m",
  WEBSITE: process.env.WEBSITE || packageJSON.homepage || "http://127.0.0.1",
  ROOT: __dirname || "/",
  HOST: process.env.HOST || "http://127.0.0.1",
  PORT: process.env.PORT || 5000,
};

// ------------ MODULES -----------
import errorHandler from "./src/middlewares/errorHandler.js";
// ------------ ROUTES -----------
import baseRoute from "./src/routes/router0-indexpage.js";
import recipesRouter from "./src/routes/router1-recipes.js";
import usersRouter from "./src/routes/router2-users.js";
import categoriesRouter from "./src/routes/router3-categories.js";
import ingredientsRouter from "./src/routes/router4-ingredients.js";
import shareitemsRouter from "./src/routes/router5-shareitems.js";
import plzRouter from "./src/routes/router6-plz.js";
import authRouter from "./src/routes/router-auth.js";

const APIendPoints = {
  route0: ["/", "Info Page", baseRoute], //props issue!!
  route1: ["/api/recipes", "API Recipes", recipesRouter],
  route2: ["/api/users", "API Users", usersRouter],
  route3: ["/api/categories", "API Categories", categoriesRouter],
  route4: ["/api/ingredients", "API Ingredients", ingredientsRouter],
  route5: ["/api/shareitems", "API Shareitems", shareitemsRouter],
  route6: ["/api/plz-de", "API PostalCodes DE", plzRouter],
};

// ------------ ATTACH DATAVARIABLES TO ROUTES -----------
baseRoute.appData = APPDATA;
baseRoute.APIendPoints = APIendPoints;
authRouter.appData = APPDATA;

// ------------ MAIN APP -----------
const app = express();
app.set("view engine", "ejs"); // looks in root/views folder
app.use(express.json());
const origin = "*"; // {origin: [host, "http://127.0.0.1", "https://abul.db.elephantsql.com/"],}
app.use(
  cors({
    origin,
    optionsSuccessStatus: 200, // some legacy browsers
  })
);
app.use("/uploads", express.static(join(__dirname, "/public/uploads"))); // for serving something (mutler?)
app.use("/public", express.static(join(__dirname, "/public")));

// ----------- iterate all routers  ----
for (let index = 0; index < Object.keys(APIendPoints).length; index++) {
  var key = "route" + index;
  app.use(APIendPoints[key][0], APIendPoints[key][2]);
}
app.use("/auth", authRouter);

// ----------- Handle unknown endpoint ----
app.get("*", (req, res, next) => {
  res.status(404).render("routeless.ejs", { APPDATA });
});

// ----------- Error handling  ----
errorHandler.MODE = APPDATA.MODE;
app.use(errorHandler);

// ----------- Activate server!  ----
app.listen(APPDATA.PORT, () =>
  console.info(
    `\n${APPDATA.NAME}: \n- Website: ${APPDATA.WEBSITE} \n- Server: ${APPDATA.HOST}:${APPDATA.PORT}\n- Root: ${APPDATA.ROOT}\n- Mode: ${APPDATA.MODE}/${process.env.NODE_ENV}`
  )
);
