const express = require("express");

const router = express.Router();

const {
  getAllNotes,
  createNote,
  getNoteById,
  updateNote,
  deleteNote,
} = require("./../controllers/noteController");

router.get("/", getAllNotes);
// router.get("/", (req, res) => {
//   res.send("notes route wroking");
// });

router.post("/", createNote);
router.get("/:id", getNoteById);

router.put("/:id", updateNote);

router.delete("/:id", deleteNote);

module.exports = router;
