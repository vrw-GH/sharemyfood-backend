const errorHandler = (err, req, res, next) => {
  switch (err.message) {
    // simplified messages
    case "jwt malformed":
      err.message = "Invalid login";
      break;
    default:
      // err.message = no change
      break;
  }
  switch (err.statusCode) {
    // custom codes :- messages
    case "000":
      err.message = "Error code not defined.";
      break;
    default:
      // err.message = No change;
      break;
  }
  if (errorHandler.MODE.substring(0, 3).toUpperCase() === "DEV") {
    console.log("\n### Error-handler: ---------------- ***");
    console.log("    Origin-code: ", err.code);
    console.log("    Origin-message: ", err.message);
    console.log("    Status Code: ", err.statusCode);
    process.env.NODE_ENV != "production" &&
      console.log("\n### Error-stack:  ---------------- ***\n   ", err.stack);
    console.log("### ------------------------------ /\n");
  }
  res.status(err.statusCode || 500).json({ error: err.message });
};

export default errorHandler;
