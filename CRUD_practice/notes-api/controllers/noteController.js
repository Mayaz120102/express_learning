let notes = [
  { id: 1, title: "first note" },
  { id: 2, title: "second note" },
];

const getAllNotes = (req, res) => {
  res.json(notes);
};

const createNote = (req, res) => {
  const { title } = req.body;
  if (!title || typeof title !== "string") {
    return res
      .status(400)
      .json({ error: "title is required and must be a string" });
  }
  const newNote = {
    id: notes.length + 1,
    title: req.body.title,
  };
  notes.push(newNote);
  res.json(newNote);
};

const getNoteById = (req, res) => {
  const noteId = parseInt(req.params.id);

  const note = notes.find((note) => note.id == noteId);
  if (!note) {
    return res.status(404).json({
      message: "note not found",
    });
  }
  res.json(note);
};

const updateNote = (req, res) => {
  const noteId = parseInt(req.params.id);

  const { title } = req.body;

  const note = notes.find((note) => note.id == noteId);

  if (!note) {
    return res.status(404).json({
      message: "note not found",
    });
  }
  if (!title || typeof title !== "string") {
    return res.status(400).json({
      message: "title is required and must be a string",
    });
  }
  note.title = title;
  res.json(note);
};

const deleteNote = (req, res) => {
  const noteId = parseInt(req.params.id);
  console.log(notes);
  console.log("param id:", noteId, typeof noteId);

  notes.forEach((n) => {
    console.log("note id:", n.id, typeof n.id);
  });
  const noteIndex = notes.findIndex((note) => note.id == noteId);

  if (noteIndex === -1) {
    return res.status(404).json({
      message: "note not found",
    });
  }
  notes.splice(noteIndex, 1);
  res.json({
    message: "note deleted successfully",
  });
};

module.exports = {
  getAllNotes,
  createNote,
  getNoteById,
  updateNote,
  deleteNote,
};
