import { Router } from "express";
import { getAllEL, getOneEL } from "../controllers/dbData-plz.js";
//TODO import ErrorResponse from "../utils/errorResponse.js"

const dbTable = "plz_de";
const fields = [
  // <fieldname> , <when creating> , <can update>
  ["postal_code", true, false], //char(20)
  ["place_name", true, true], //char(180)
  ["longitude", false, true], //numeric
  ["latitude", false, true], //numeric
];
// const idField = fields[0][0];
const keyField = fields[0][0];

const plzRouter = Router(); //* "/api/plz-de"
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
      res.status(404).json({ info, sysMessage: error.message });
    }
  })
  .post(async (req, res) => {
    res
      .status(403)
      .json({ info, sysMessage: "Cannot Post New/delete to this API." });
  })
  .delete(async (req, res) => {
    res.status(403).json({ info, sysMessage: "Cannot Delete at this API." });
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
      res.status(404).json({ info, sysMessage: error.message });
    }
  })
  .post(async (req, res) => {
    res.status(403).json({ info, sysMessage: "Cannot Update to this API." });
  })
  .delete(async (req, res) => {
    res.status(403).json({ info, sysMessage: "Cannot Delete at this API." });
  });

export default plzRouter;
