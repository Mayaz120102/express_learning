const express = require("express");

const router = express.Router();

const noteController = require("../controllers/noteController");

router.get("/", noteController.getNotes);
router.get("/:id", noteController.getNote);
router.get("/", noteController.createNote);
router.get("/", noteController.updateNote);
router.get("/", noteController.deleteNote);

module.exports = router;
