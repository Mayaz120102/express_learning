import { useEffect, useState } from "react";
import API from "../api/axios";

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");

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
    if (!title) return alert("title required");

    try {
      const res = await API.post("/notes", { title });
      console.log("Created:", res.data);

      //instant ui update
      setNotes([...notes, res.data]);

      setTitle(""); //clear input
    } catch (err) {
      console.log(err);
    }
  };

  //deletenote
  const handleDelete = async (id) => {
    try {
      await API.delete(`/notes/${id}`);
      console.log("deleted");
      //update ui
      setNotes(notes.filter((note) => note._id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  //update note
  const handleUpdate = async (id) => {
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
    } catch (err) {
      console.log(err);
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
    <div>
      <button onClick={handleLogout}>Logout</button>
      <h1>{user?.name} Notes</h1>

      {/* input */}
      <input
        type="text"
        placeholder="Enter note title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <button onClick={handleAddNote}>Add note</button>

      <hr />

      {/* notelist */}
      {notes.length === 0 ? (
        <p>no notes found</p>
      ) : (
        <ul>
          {notes.map((note) => (
            <li key={note._id}>
              {editId === note._id ? (
                <>
                  <input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                  />
                  <button onClick={() => handleUpdate(note._id)}>Save</button>
                </>
              ) : (
                <>
                  <strong>{note.title}</strong>
                  <button
                    onClick={() => {
                      setEditId(note._id);
                      setEditTitle(note.title);
                    }}
                  >
                    Edit
                  </button>
                  <button onClick={() => handleDelete(note._id)}>Delete</button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notes;
