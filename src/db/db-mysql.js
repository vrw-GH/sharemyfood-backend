import mysql from "mysql2"; //"mysql"
import ErrorResponse from "../utils/ErrorResponse.js";
import "../utils/config.cjs";

const connectionString = process.env.NODE_APP_DB_MYSQL1;
const conn = mysql.createConnection(connectionString);

conn.connect((err) => {
  !err
    ? console.info("### Connected to the MySQL server.")
    : new ErrorResponse(err, 503);
});

// mysql package doesnt work with async, so we have to leverage nodepromises
export const queryDB = (sqlString, values) => {
  return new Promise((resolve, reject) => {
    if (values) {
      conn.query(sqlString, values, (error, results) => {
        !error && results.length > 0
          ? resolve(results) //      returns one tuple
          : reject(
              new ErrorResponse(error || Error("No results returned."), 404)
            );
      });
    } else {
      conn.query(sqlString, (error, results) => {
        if (error) {
          reject(new ErrorResponse(error, 404));
        } else {
          resolve(results);
        }
      });
    }
  });
};

export const changeDB = (sqlString, values) => {
  throw new ErrorResponse(Error("Feature development."), 903);
  // **changeDB  here still gives mySQL Errors!!!!                    - to do

  return new Promise((resolve, reject) => {
    if (values) {
      // sqlString = sqlString.replace(";", "RETURNING *;");
      conn.query(sqlString, values, (error, results) => {
        if (error) reject(error);
        resolve(results.rows); //                   returns a tuple
      });
    } else {
      // not needed! these functions only with values?!
      reject(error);
    }
  });
};

export const deleteDB = (sqlString, values) => {
  //  solve FK problem
  return new Promise((resolve, reject) => {
    if (findDB(values)) {
      sqlString = sqlString.replace("$1", "?");
      conn.query(sqlString, values, (error, results) => {
        error ? reject(new ErrorResponse(error, 404)) : resolve();
      });
    }
  });
};

const findDB = (values) => true; // check for existing
