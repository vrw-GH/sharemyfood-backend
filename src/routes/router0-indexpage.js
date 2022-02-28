import { Router } from "express";

const baseRoute = Router(); //   need props with appname,host,routeX etc.
baseRoute.route("/").get((req, res) => {
  const APPDATA = baseRoute.appData;
  const APIendPoints = baseRoute.APIendPoints;
  res.status(501).render("index.ejs", { APPDATA, APIendPoints });
});

export default baseRoute;
