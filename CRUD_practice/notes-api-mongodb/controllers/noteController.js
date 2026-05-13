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
  const note = await Note.create({ title, user: req.user._id });

  res.status(201).json(note);
});

const getAllNotes = asyncHandler(async (req, res) => {
  const notes = await Note.find({ user: req.user._id });
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

  //ownership check
  if (note.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Not authorized");
  }
  res.status(200).json(note);
});

const deleteNote = asyncHandler(async (req, res) => {
  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error("Invalid note id");
  }
  const note = await Note.findById(id);

  if (!note) {
    res.status(404);
    throw new Error("Note not found");
  }

  //ownership check
  if (note.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Not authorized");
  }

  await note.deleteOne();
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

  const note = await Note.findById(id);
  console.log("note result: ", note);

  if (!note) {
    res.status(404);
    throw new Error("Note not found");
  }
  //ownsership check
  if (note.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Not authorized");
  }

  note.title = title || note.title;

  const updateNote = await note.save();
  res.status(200).json(updateNote);
});

module.exports = {
  createNote,
  getAllNotes,
  getSingleNote,
  deleteNote,
  updateNote,
};
