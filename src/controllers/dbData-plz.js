// --------  SELECT A DATABASE FROM HERE ----
import { queryDB, changeDB, deleteDB } from "../db/db-pg.js";
// import { queryDB, changeDB, deleteDB } from "../db/db-mysql.js";

// ------ fields list  ---------
// ["postal-code", true, false], //char(20)
//   ["place-name", true, true], //char(180)
//   ["longitude", false, true], //numeric
//   ["latitude", false, true], //numeric

export const getAllEL = (table, fields) => {
  return queryDB(`SELECT ${fields} FROM ${table};`);
};

export const getOneEL = (table, id, keyField) => {
  const fields = "*";
  return queryDB(
    `SELECT ${fields} FROM ${table} 
    WHERE LOWER(${keyField}) = LOWER($1);`,
    [id]
  );
};
