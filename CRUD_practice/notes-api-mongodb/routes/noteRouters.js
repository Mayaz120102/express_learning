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

//protect middleware to all routes
router.use(protect);

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
