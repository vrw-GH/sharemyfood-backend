import pg from "pg";
import ErrorResponse from "../utils/errorResponse.js";
import "../utils/config.cjs";

const connectionString = process.env.NODE_APP_DB_PG1;
const { Pool } = pg;
const conn = new Pool({ connectionString }); // MUST === "connectionString" !!!

conn.connect((err) => {
  !err ? console.info(`- DB: POSTGRES server.\n`) : new ErrorResponse(err, 503);
});

export const queryDB = (sqlString, values) => {
  return new Promise((resolve, reject) => {
    if (values) {
      // for individual inquiries
      sqlString = sqlString.replace("?", "$1");
      conn.query(sqlString, values, (error, results) => {
        !error && results.rows.length > 0
          ? resolve(results.rows) //      returns one tuple
          : reject(
              new ErrorResponse(error || Error("No results returned."), 404)
            );
      });
    } else {
      conn.query(sqlString, (error, results) => {
        !error
          ? resolve(results.rows) //      returns tuples (all)
          : reject(new ErrorResponse(error, 404));
      });
    }
  });
};

export const changeDB = (sqlString, values) => {
  return new Promise((resolve, reject) => {
    conn.query(
      sqlString.replace(";", " RETURNING *;"),
      values,
      (error, results) => {
        if (error) {
          reject(new ErrorResponse(error, 404));
        } else if (results === undefined) {
          // reject("DB Update failed!");
          reject(new ErrorResponse(Error("DB Update failed."), 405));
        } else if (results.rows === undefined) {
          // reject("DB Update failed!");
          reject(new ErrorResponse(Error("DB Update failed!"), 405));
        } else {
          resolve(results.rows); //         returns  changed tuple
        }
      }
    );
  });
};

export const deleteDB = (sqlString, values) => {
  return new Promise((resolve, reject) => {
    conn.query(sqlString, values, (error, results) => {
      !error ? resolve() : reject(new ErrorResponse(error, 404));
    });
  });
};
