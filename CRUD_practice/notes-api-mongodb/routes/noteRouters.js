const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
  createNote,
  getAllNotes,
  getSingleNote,
  deleteNote,
  updateNote,
} = require("../controllers/noteController");

//get all notes

router.get("/", protect, getAllNotes);

//get one
router.get("/:id", protect, getSingleNote);
//post /notes

router.post("/", protect, createNote);

//delelte
router.delete("/:id", protect, deleteNote);

router.put("/:id", protect, updateNote);

module.exports = router;
