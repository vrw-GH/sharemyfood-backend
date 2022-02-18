import { Router } from "express";

const baseRoute = Router(); //   need props with appname,host,routeX etc.
baseRoute.route("/").get((req, res) => {
  const APPDATA = baseRoute.appData;
  const endPoints = baseRoute.endPoints;
  res.status(501).render("index.ejs", { APPDATA, endPoints });
});

export default baseRoute;
