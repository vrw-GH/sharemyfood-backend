const errorHandler = (err, req, res, next) => {
  console.log("###Errorhandler#### Origin-code: ", err.code);
  console.log("                    Origin-message: ", err.message);
  console.log("                    Status Code: ", err.statusCode);
  switch (err.message) {
    // simplified messages
    case "jwt malformed":
      err.message = "Invalid login";
      break;
    default:
      // no change
      break;
  }
  switch (err.statusCode) {
    // custom codes :- messages
    case "000":
      err.message = "This error code not defined.";
      break;
    default:
      err.message = "Unknown Error.";
      break;
  }
  process.env.NODE_ENV != "production" &&
    console.log("###errorhandler#### Stack: ", err.stack);
  res.status(err.statusCode || 500).json({ error: err.message });
};

export default errorHandler;
