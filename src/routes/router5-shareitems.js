import { Router } from "express";
import {
  getAllEL,
  createEL,
  getOneEL,
  getManyEL,
  updateEL,
  deleteEL,
} from "../controllers/dbData-shareitems.js";
import { validateElement } from "../utils/commonFunctions.js";
// TODO import ErrorResponse from "../utils/errorResponse.js"

const dbTable = "shareitems";
const fields = [
  //field,creating,updatable
  ["id", false, false], //int(auto)
  ["username", true, false], //char(16)
  ["sharestatus", true, true], //char(1)
  ["arrayofitems", true, true], //text[]
  ["location", true, true], //point(x,y)
  ["message", true, true], //text
  ["plz", true, true], //text(20)
];
const idField = fields[0][0];
const keyField = fields[1][0];

const shareitemsRouter = Router(); //* "/api/shareitems"
shareitemsRouter
  .route("/")
  .get(async (req, res) => {
    //                                       get all tuples
    try {
      const tuples = await getAllEL(dbTable, "*");
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
    //                                         create new tuple
    // try {
    //   await getOneEL(dbTable, req.body[keyField]);
    //   const info = {
    //     result: false,
    //     message: `${keyField} <${req.body[keyField]}> already exists.`,
    //   };
    //   res.status(406).json({ info, sysMessage: null });
    // } catch (err) {
    try {
      const newElement = validateElement(req.body, fields, false); // generates error if invalid
      const tuples = await createEL(dbTable, newElement);
      const info = {
        result: true,
        message: `New data for <${req.body[keyField]}> added.`,
        records: tuples.length,
      };
      res.json({ info, tuples });
    } catch (error) {
      const info = {
        result: false,
        message: `Error creating <${req.body[keyField]}>.`,
      };
      res.status(406).json({ info, sysMessage: error.message });
    }
    // }
  })
  .delete((req, res) => {
    const info = {
      result: false,
      message: `Delete all data not allowed.`,
    };
    res.status(403).json({ info, sysMessage: "" });
  });

shareitemsRouter
  .route("/:username")
  .get(async (req, res) => {
    //                                 get tuples for single username
    try {
      const tuples = await getManyEL(dbTable, req.params.username, keyField);
      const info = {
        result: true,
        message: `${dbTable} info for <${req.params.username}>.`,
        records: tuples.length,
      };
      res.json({ info, tuples });
    } catch (error) {
      const info = {
        result: false,
        message: `${dbTable} <${req.params.username}> does not exist.`,
      };
      res.status(404).json({ info, sysMessage: error.message });
    }
  })
  .delete((req, res) => {
    const info = {
      result: false,
      message: `Delete all <${req.params.username}> not allowed.`,
    };
    res.status(403).json({ info, sysMessage: "" });
  });

shareitemsRouter
  .route("/:username/:id")
  .get(async (req, res) => {
    //                                         get tuple for single id
    console.log(req.params.id);
    try {
      const tuples = await getOneEL(dbTable, req.params.id, idField);
      const info = {
        result: true,
        message: `${dbTable} info for <${req.params.username}(${req.params.id})>.`,
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
    //                                         update single tuple
    try {
      let tuples = await getOneEL(dbTable, req.params.id, idField);
      if (!tuples)
        throw Error(`${dbTable} <${req.params.id}> (couldnt find data).`);
      const newElement = validateElement(req.body, fields, true); // generates error if invalid
      tuples = await updateEL(dbTable, newElement, req.params.id, idField);
      if (!tuples) throw Error(`Update failed.`);
      const info = {
        result: true,
        message: `${dbTable} info for <${req.params.id}> updated.`,
        records: tuples.length,
      };
      res.json({ info, tuples });
    } catch (error) {
      const info = {
        result: false,
        message: `${dbTable} <${req.params.id}> error.`,
      };
      res.status(404).json({ info, sysMessage: error.message });
    }
  })
  .delete(async (req, res) => {
    //  Confirm...                     make sure!! - implement at front-end ?
    try {
      let tuples = await getOneEL(dbTable, req.params.id, idField);
      if (!tuples) throw Error(`Error in delete operation.`);
      tuples = await deleteEL(dbTable, req.params.id, idField);
      const info = {
        result: true,
        message: `${dbTable} <${req.params.username}(${req.params.id})> DELETED.`,
      };
      res.json({ info });
    } catch (error) {
      const info = {
        result: false,
        message: `${dbTable} <${req.params.username}(${req.params.id})> does not exist.`,
      };
      res.status(404).json({ info, sysMessage: error.message });
    }
  });

export default shareitemsRouter;
