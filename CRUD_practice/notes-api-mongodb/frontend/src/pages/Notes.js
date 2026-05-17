import { useEffect, useState } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  // NEW
  const user = JSON.parse(localStorage.getItem("user") || "null");

  //get all notes
  useEffect(() => {
    API.get("/notes")
      .then((res) => {
        console.log("Notes:", res.data);
        setNotes(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  //create note
  const handleAddNote = async () => {
    if (!title) return toast.error("Title required");

    setLoading(true);

    try {
      const res = await API.post("/notes", { title });
      console.log("Created:", res.data);

      //instant ui update
      setNotes([...notes, res.data]);

      setTitle(""); //clear input

      toast.success("Note added Successfully");
    } catch (err) {
      console.log(err);
      toast.error("Failed to add note");
    } finally {
      setLoading(false);
    }
  };

  //deletenote
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this note?",
    );

    if (!confirmDelete) return;
    setDeletingId(id);

    try {
      await API.delete(`/notes/${id}`);

      console.log("deleted");

      //update ui

      setNotes(notes.filter((note) => note._id !== id));
      toast.success("Note deleted successfully!");
    } catch (err) {
      console.log(err);
      toast.error("Failed to delete note");
    } finally {
      setDeletingId(null);
    }
  };

  //update note
  const handleUpdate = async (id) => {
    if (!editTitle) return toast.error("Title required");

    setUpdatingId(id);

    try {
      const res = await API.put(`/notes/${id}`, {
        title: editTitle,
      });

      //update ui
      const updateNotes = notes.map((note) =>
        note._id === id ? res.data : note,
      );

      setNotes(updateNotes);
      setEditId(null);
      setEditTitle("");
      toast.success("Note updated successfully!");
    } catch (err) {
      console.log(err);
      toast.error("Failed to update note");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleLogout = async () => {
    try {
      await API.post("/users/logout");

      localStorage.removeItem("accessToken");
      localStorage.removeItem("user"); // optional
      window.location.href = "/";
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Navbar user={user} onLogout={handleLogout} />

      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">{user?.name} Notes</h1>

        {/* input */}
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="Enter note title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border p-2 rounded w-full"
          />

          <button
            onClick={handleAddNote}
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            {loading ? "Adding..." : "Add Note"}
          </button>
        </div>

        {/* note list */}
        {notes.length === 0 ? (
          <p className="text-center text-gray-500">No notes found, add one</p>
        ) : (
          <ul className="space-y-3">
            {notes.map((note) => (
              <li
                key={note._id}
                className="border p-4 rounded flex justify-between items-center"
              >
                {editId === note._id ? (
                  <div className="flex gap-2 w-full">
                    <input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="border p-2 rounded w-full"
                    />

                    <button
                      onClick={() => handleUpdate(note._id)}
                      disabled={updatingId === note._id}
                      className="bg-green-500 text-white px-3 py-1 rounded"
                    >
                      {updatingId === note._id ? "Saving..." : "Save"}
                    </button>
                  </div>
                ) : (
                  <>
                    <strong>{note.title}</strong>

                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditId(note._id);
                          setEditTitle(note.title);
                        }}
                        className="bg-yellow-500 text-white px-3 py-1 rounded"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(note._id)}
                        disabled={deletingId === note._id}
                        className="bg-red-500 text-white px-3 py-1 rounded"
                      >
                        {deletingId === note._id ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default Notes;
