class ErrorResponse extends Error {
  constructor(error, statusCode) {
    super(error);
    this.statusCode = statusCode || "000";
    console.log(`### Error - ${this.statusCode}: ${error}`);
  }
}

export default ErrorResponse;
