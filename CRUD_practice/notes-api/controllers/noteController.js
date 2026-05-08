const noteService = require("../services/noteService");

const getNotes = (req, res) => {
  const notes = noteService.getAllNotes();
  res.json(notes);
};

const getNote = (req, res) => {
  const Id = parseInt(req.params.id);

  const note = noteService.getNoteById(id);
  if (!note) {
    return res.status(404).json({ message: "note not found" });
  }
  res.json(note);
};

const createNote = (req, res) => {
  const { title } = req.body;
  if (!title || typeof title !== "string") {
    return res
      .status(400)
      .json({ error: "title is required and must be a string" });
  }
  const newNote = noteService.createNote(title);

  res.status(201).json(newNote);
};

const updateNote = (req, res) => {
  const id = parseInt(req.params.id);

  const { title } = req.body;

  const updateNote = noteService.updateNote(id, title);

  if (!updateNote) {
    return res.status(404).json({
      message: "note not found",
    });
  }
  if (!title || typeof title !== "string") {
    return res.status(400).json({
      message: "title is required and must be a string",
    });
  }
  res.json(updateNote);
};

const deleteNote = (req, res) => {
  const id = parseInt(req.params.id);
  // console.log(notes);
  // console.log("param id:", noteId, typeof noteId);

  // notes.forEach((n) => {
  //   console.log("note id:", n.id, typeof n.id);
  // });

  const isDeleted = noteService.deleteNote(id);

  if (!isDeleted) {
    return res.status(404).json({ message: "note not found" });
  }

  res.json({ message: "note deleted succesfully" });
};

module.exports = {
  getNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote,
};
