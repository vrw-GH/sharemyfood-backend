import { Router } from "express";
import jwt from "jsonwebtoken";
import {
  getAllEL,
  getOneEL,
  createEL,
  updateEL,
  deleteEL,
} from "../controllers/dbData-users.js";
import validateElements from "../utils/validations.js";
import verifyJWT from "../middlewares/verifyJWT.js";
//! import ErrorResponse from "../utils/errorResponse.js";

const dbTable = "users";
const fields = [
  //fieldname, creating, updatable
  ["username", true, false], // is keyfield
  ["email", true, true],
  ["password", true, true],
  ["profilepic", false, true], //text
  ["plz", false, true], //char(10)
  ["location", false, true], //point(x,y)
];
const keyField = fields[0][0];

const usersRouter = Router();
usersRouter
  .route("/")

  .get(async (req, res) => {
    //                                         get all tuples
    try {
      const tuples = await getAllEL(dbTable, "username");
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

  .post(
    (req, res, next) => {
      const required = fields.filter((e) => e[1]);
      if (Object.keys(req.body).length < required.length)
        throw new ErrorResponse(
          `Please provide JSON data. {${required.map((e) => e[0])}}`,
          400
        );
      next();
    },
    async (req, res) => {
      // *                              signup (create tuple)
      try {
        await getOneEL(dbTable, req.body[keyField]);
        const info = {
          result: false,
          message: `${keyField} <${req.body[keyField]}> already exists.`,
        };
        res.status(406).json({ info, systemError: null });
      } catch (err) {
        try {
          const newElement = validateElements(req.body, fields, false); // generates error
          const tuples = await createEL(dbTable, newElement);
          const info = {
            result: true,
            message: `New data for <${req.body[keyField]}> added.`,
            records: tuples.length,
          };
          const token = jwt.sign(
            { username: req.body[keyField] },
            process.env.NODE_APP_JWT,
            {
              expiresIn: 60 * 60,
            }
          );
          // console.log(jwt.decode(token)); //* -testing only   ,{complete:true}
          res.json({ info, token, tuples }); //! -remove tuples?
        } catch (error) {
          const info = {
            result: false,
            message: `Error creating <${req.body[keyField]}>.`,
          };
          res.status(406).json({ info, systemError: error.message });
        }
      }
    }
  )

  .delete((req, res) => {
    const info = {
      result: false,
      message: `Delete all data not allowed.`,
    };
    res.status(403).json({ info, systemError: "" });
  });

// --------------------------------------------------------

usersRouter
  .route("/:id")

  .get(verifyJWT, async (req, res) => {
    //*                                        login / get details
    //                                         get single tuple
    try {
      const tuples = await getOneEL(dbTable, req.params.id);
      const info = {
        result: true,
        message: `${dbTable} info for <${req.params.id}>.`,
        records: tuples.length,
      };
      const token = jwt.sign(
        { username: req.params.id },
        process.env.NODE_APP_JWT,
        {
          expiresIn: 60 * 60,
        }
      );
      res.json({ info, token, tuples });
    } catch (error) {
      const info = {
        result: false,
        message: `${dbTable} <${req.params.id}> login error.`,
      };
      res.status(404).json({ info, systemError: error.message });
    }
  })

  .post(verifyJWT, async (req, res) => {
    //                                         update single tuple
    try {
      let tuples = await getOneEL(dbTable, req.params.id);
      if (!tuples)
        throw Error(`${dbTable} <${req.params.id}> (couldnt find data).`);
      const newElement = validateElements(req.body, fields, true);
      tuples = await updateEL(dbTable, newElement, req.params.id);
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
      res.status(404).json({ info, systemError: error.message });
    }
  })

  .delete(verifyJWT, async (req, res) => {
    //TODO  Confirm... make sure!! - implement at front-end ?
    try {
      const tuples = await getOneEL(dbTable, req.params.id);
      if (!tuples) throw Error(`Error in delete operation.`);
      await deleteEL(dbTable, req.params.id);
      const info = {
        result: true,
        message: `${dbTable} <${req.params.id}> DELETED.`,
      };
      res.json({ info });
    } catch (error) {
      const info = {
        result: false,
        message: `${dbTable} <${req.params.id}> does not exist.`,
      };
      res.status(404).json({ info, systemError: error.message });
    }
  });

export default usersRouter;
