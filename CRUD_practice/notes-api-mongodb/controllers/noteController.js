const asyncHandler = require("express-async-handler");
const Note = require("../model/noteModel");

const mongoose = require("mongoose");
//create

const createNote = asyncHandler(async (req, res) => {
  const { title } = req.body;
  if (!title) {
    res.status(400);
    throw new Error("Title is required");
  }
  const note = await Note.create({ title });

  res.status(201).json(note);
});

const getAllNotes = asyncHandler(async (req, res) => {
  const notes = await Note.find();
  res.status(200).json(notes);
});

const getSingleNote = asyncHandler(async (req, res) => {
  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error("Invalid note id");
  }

  const note = await Note.findById(id);

  if (!note) {
    res.status(404);
    throw new Error("note not found");
  }
  res.status(200).json(note);
});

const deleteNote = asyncHandler(async (req, res) => {
  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error("Invalid note id");
  }
  const note = await Note.findByIdAndDelete(id);

  if (!note) {
    res.status(404);
    throw new Error("Note not found");
  }
  res.status(200).json({ message: "note deleted successfully" });
});

const updateNote = asyncHandler(async (req, res) => {
  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error("Invalid note id");
  }
  const { title } = req.body;

  if (!title) {
    res.status(400);
    throw new Error("Title is required");
  }

  const note = await Note.findByIdAndUpdate(id, { title }, { new: true });
  console.log("note result: ", note);

  if (!note) {
    res.status(404);
    throw new Error("Note not found");
  }
  res.status(200).json(note);
});

module.exports = {
  createNote,
  getAllNotes,
  getSingleNote,
  deleteNote,
  updateNote,
};
