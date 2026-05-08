let notes = [
  { id: 1, title: "first note" },
  { id: 2, title: "second note" },
];

const getAllNotes = () => {
  return notes;
};

const getNoteById = (id) => {
  return notes.find((note) => note.id === id);
};

const createNote = (title) => {
  const newNote = {
    id: notes.length + 1,
    title,
  };
  notes.push(newNote);
  return newNote;
};

const updateNote = (id, title) => {
  const note = notes.find((note) => note.id === id);

  if (!note) return null;

  note.title = title;
  return note;
};

const deleteNote = (id) => {
  const index = notes.findIndex((note) => note.id == id);

  if (index === -1) return false;

  return true;
};

module.exports = {
  getAllNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
};
