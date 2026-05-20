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
  const [fetchLoading, setFetchLoading] = useState(false); // ⭐ NEW
  const [deletingId, setDeletingId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(""); // ⭐ NEW
  const [sort, setSort] = useState("desc");

  const user = JSON.parse(localStorage.getItem("user") || "null");

  // ✅ DEBOUNCE SEARCH
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // ✅ RESET PAGE WHEN SEARCH OR SORT CHANGES
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, sort]);

  // ✅ FETCH NOTES (SINGLE SOURCE OF TRUTH)
  const fetchNotes = async () => {
    try {
      setFetchLoading(true);

      const res = await API.get(
        `/notes?page=${page}&limit=5&sort=${sort}&search=${debouncedSearch}`,
      );

      setNotes(res.data.notes || []);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.log(err);
    } finally {
      setFetchLoading(false);
    }
  };

  // ✅ TRIGGER FETCH
  useEffect(() => {
    fetchNotes();
  }, [page, sort, debouncedSearch]);

  // ✅ ADD NOTE (SYNC WITH BACKEND)
  const handleAddNote = async () => {
    if (!title.trim()) return toast.error("Title required");

    setLoading(true);

    try {
      await API.post("/notes", { title: title.trim() });

      setTitle("");
      toast.success("Note added Successfully");

      await fetchNotes(); // ⭐ IMPORTANT (sync pagination)
    } catch (err) {
      console.log(err);
      toast.error("Failed to add note");
    } finally {
      setLoading(false);
    }
  };

  // ✅ DELETE NOTE
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this note?",
    );
    if (!confirmDelete) return;

    setDeletingId(id);

    try {
      await API.delete(`/notes/${id}`);
      toast.success("Note deleted successfully!");

      // ⭐ handle empty page case
      if (notes.length === 1 && page > 1) {
        setPage(page - 1);
      } else {
        await fetchNotes();
      }
    } catch (err) {
      console.log(err);
      toast.error("Failed to delete note");
    } finally {
      setDeletingId(null);
    }
  };

  // ✅ UPDATE NOTE
  const handleUpdate = async (id) => {
    if (!editTitle.trim()) return toast.error("Title required");

    setUpdatingId(id);

    try {
      await API.put(`/notes/${id}`, {
        title: editTitle.trim(),
      });

      setEditId(null);
      setEditTitle("");

      toast.success("Note updated successfully!");

      await fetchNotes(); // ⭐ sync
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
      localStorage.removeItem("user");
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

        {/* ADD NOTE */}
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

        {/* SEARCH */}
        <input
          type="text"
          placeholder="🔍 Search notes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md px-4 py-2 mb-4 border border-gray-300 rounded-lg shadow-sm text-sm outline-none transition focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />

        {/* SORT */}
        <div className="flex justify-end mb-4">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg shadow-sm text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>
        </div>

        {/* NOTES */}
        {fetchLoading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : notes.length === 0 ? (
          <p className="text-center text-gray-500">No notes found</p>
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

        {/* PAGINATION */}
        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1 || fetchLoading}
            className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
          >
            Prev
          </button>

          <span className="font-bold">
            Page {page} of {totalPages}
          </span>

          <button
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages || fetchLoading}
            className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
};

export default Notes;
