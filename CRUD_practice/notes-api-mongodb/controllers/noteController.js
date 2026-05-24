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
  const userId = req.user._id;

  //get query values
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const search = req.query.search || "";
  const sort = req.query.sort || "desc";

  //filtering
  const from = req.query.from;
  const to = req.query.to;
  const date = req.query.date;

  //convert to Date
  const fromDate = from ? new Date(from) : null;
  const toDate = to ? new Date(to) : null;
  const singleDate = date ? new Date(date) : null;

  //validation first
  if (from && isNaN(fromDate.getTime())) {
    res.status(400);
    throw new Error("Invalid 'from' date");
  }

  if (to && isNaN(toDate.getTime())) {
    res.status(400);
    throw new Error("Invalid 'to' date");
  }

  if (date && isNaN(singleDate.getTime())) {
    res.status(400);
    throw new Error("Invalid 'date' ");
  }

  //defin query
  const query = {
    user: userId,
  };

  //search
  if (search) {
    query.title = { $regex: search, $options: "i" };
  }

  if (singleDate) {
    const start = new Date(singleDate);
    start.setHours(0, 0, 0, 0);

    const end = new Date(singleDate);
    end.setHours(23, 59, 59, 999);

    query.createdAt = { $gte: start, $lte: end };
  }

  
  if (!singleDate && (fromDate || toDate)) {
    query.createdAt = {
      ...(fromDate && { $gte: fromDate }),
      ...(toDate && { $lte: toDate }),
    };
  }
  
  //calculate skip
  const skip = (page - 1) * limit;
  //fetch notes
  const notes = await Note.find(query)
    .sort({ createdAt: sort === "asc" ? 1 : -1 })
    .skip(skip)
    .limit(limit);

  //get total count
  const totalNotes = await Note.countDocuments(query);

  res.status(200).json({
    notes,
    page,
    totalPages: Math.ceil(totalNotes / limit),
    totalNotes,
  });
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
