const express = require("express");
const router = express.Router();

const {
  createNote,
  getAllNotes,
  getSingleNote,
  deleteNote,
  updateNote,
} = require("../controllers/noteController");

//get all notes

router.get("/", getAllNotes);

//get one
router.get("/:id", getSingleNote);
//post /notes

router.post("/", createNote);

//delelte
router.delete("/:id", deleteNote);

router.put("/:id", updateNote);

module.exports = router;
