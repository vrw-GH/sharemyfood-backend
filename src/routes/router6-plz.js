import { Router } from "express";
import { getAllEL, getOneEL } from "../controllers/dbData-plz.js";
//TODO import ErrorResponse from "../utils/errorResponse.js"

const dbTable = "plz_de";
const fields = [
  //field,creating,updatable
  ["postal_code", true, false], //char(20)
  ["place_name", true, true], //char(180)
  ["longitude", false, true], //numeric
  ["latitude", false, true], //numeric
];
const keyField = fields[0][0];

// const validateElement = (element, toUpdate) => {  - function not required

const plzRouter = Router();
plzRouter
  .route("/")
  .get(async (req, res) => {
    //                                       get all tuples
    try {
      const tuples = await getAllEL(
        dbTable,
        "postal_code, place_name, longitude, latitude"
      );
      const info = {
        result: true,
        message: `All ${dbTable} list.`,
        records: tuples.length,
      };
      res.json({ info, tuples });
    } catch (error) {
      const info = { result: false, message: `No data found.` };
      res.status(404).json({ info, systemError: error.message });
    }
  })
  .post(async (req, res) => {
    res
      .status(403)
      .json({ info, systemError: "Cannot Post New/delete to this API." });
  })
  .delete(async (req, res) => {
    res.status(403).json({ info, systemError: "Cannot Delete at this API." });
  });

plzRouter
  .route("/:id")
  .get(async (req, res) => {
    //                                         get single tuple
    try {
      const tuples = await getOneEL(dbTable, req.params.id, keyField);
      const info = {
        result: true,
        message: `${dbTable} info for <${req.params.id}>.`,
        records: tuples.length,
      };
      res.json({ info, tuples });
    } catch (error) {
      const info = {
        result: false,
        message: `${dbTable} <${req.params.id}> does not exist.`,
      };
      res.status(404).json({ info, systemError: error.message });
    }
  })
  .post(async (req, res) => {
    res.status(403).json({ info, systemError: "Cannot Update to this API." });
  })
  .delete(async (req, res) => {
    res.status(403).json({ info, systemError: "Cannot Delete at this API." });
  });

export default plzRouter;
