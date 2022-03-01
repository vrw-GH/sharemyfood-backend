import {
  getAllEL,
  getOneEL,
  createEL,
  updateEL,
  deleteEL,
} from "../controllers/dbData-users.js";
import { newJWT } from "./JWT.js";
import validateElements from "../utils/validations.js";
import ErrorResponse from "../utils/errorResponse.js";

const dbTable = "users";
const fields = [
  // <fieldname> , <when creating> , <can update>
  ["username", true, false], // is keyfield
  ["email", true, true],
  ["password", true, true],
  ["profilepic", false, true], //text
  ["plz", false, true], //char(10)
  ["location", false, true], //point(x,y)
];
// const idField = fields[0][0];
const keyField = fields[0][0];

export const getUsers = async (req, res) => {
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
};

export const createUser = async (req, res) => {
  try {
    await getOneEL(dbTable, req.body[keyField]);
    const info = {
      result: false,
      message: `${keyField} <${req.body[keyField]}> already exists.`,
    };
    res.status(406).json({ info, systemError: null });
  } catch (err) {
    try {
      const newElement = await validateElements(req.body, fields, false); // generates error
      const token = await newJWT({ username: req.body[keyField] });
      const tuples = await createEL(dbTable, newElement);
      const info = {
        result: true,
        message: `New data for <${req.body[keyField]}> added.`,
        records: tuples.length,
      };
      res.json({ info, token, tuples }); //*                returns a token (signed-in)!
    } catch (error) {
      const info = {
        result: false,
        message: `Error creating <${req.body[keyField]}>.`,
      };
      res.status(406).json({ info, systemError: error.message });
    }
  }
};

export const getUser = async (req, res) => {
  try {
    const tuples = await getOneEL(dbTable, req.params.id);
    const info = {
      result: true,
      message: `${dbTable} info for <${req.params.id}>.`,
      records: tuples.length,
    };
    res.json({ info, tuples });
  } catch (error) {
    const info = {
      result: false,
      message: `${dbTable} <${req.params.id}> login error.`,
    };
    res.status(404).json({ info, systemError: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const tuples = await getOneEL(dbTable, req.params.id);
    if (!tuples) throw Error(`Couldnt find <${req.params.id}>.`);
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
};

export const deleteUser = async (req, res) => {
  //TODO  Confirm... make sure!! - implement at front-end ?
  try {
    const tuples = await getOneEL(dbTable, req.params.id);
    if (!tuples) throw Error(`Couldnt find <${req.params.id}>.`);
    await deleteEL(dbTable, req.params.id);
    const info = {
      result: true,
      message: `${dbTable} <${req.params.id}> DELETED.`,
    };
    res.json({ info });
  } catch (error) {
    const info = {
      result: false,
      message: `${dbTable}: Error deleting <${req.params.id}>.`,
    };
    res.status(404).json({ info, systemError: error.message });
  }
};

// ---------- Middleware -----------
export const checkBody = (req, res, next) => {
  const required = fields.filter((e) => e[1]);
  if (Object.keys(req.body).length < required.length)
    throw new ErrorResponse(
      `Please provide JSON data. {${required.map((e) => e[0])}}`,
      400
    );
  next();
};
