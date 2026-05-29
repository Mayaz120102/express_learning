// GoruImageUpload.jsx
// Reusable image upload component
// Used inside AddCow and EditCow forms

import { useState } from "react";
import goruAxios from "../api/goruAxios";

const GoruImageUpload = ({ onUploadComplete, existingImages = [] }) => {
  const [previews, setPreviews] = useState(existingImages);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);

    if (files.length === 0) return;

    // Client-side validation before uploading
    const oversized = files.filter((f) => f.size > 5 * 1024 * 1024);
    if (oversized.length > 0) {
      setError("Each image must be under 5MB");
      return;
    }

    setError("");
    setUploading(true);

    try {
      // FormData is how browsers send files — not JSON
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("images", file); // 'images' matches our route
      });

      // Note: don't set Content-Type header manually
      // axios detects FormData and sets multipart/form-data automatically
      const { data } = await goruAxios.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const newUrls = [...previews, ...data.urls];
      setPreviews(newUrls);
      onUploadComplete(newUrls); // tell parent form about the new URLs
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = (urlToRemove) => {
    const updated = previews.filter((url) => url !== urlToRemove);
    setPreviews(updated);
    onUploadComplete(updated);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Images (max 5)
      </label>

      {/* Preview grid */}
      {previews.length > 0 && (
        <div className="grid grid-cols-3 gap-3 mb-4">
          {previews.map((url, index) => (
            <div key={index} className="relative group">
              <img
                src={url}
                alt={`preview ${index + 1}`}
                className="w-full h-28 object-cover rounded-xl border"
              />
              {/* Remove button appears on hover */}
              <button
                type="button"
                onClick={() => handleRemove(url)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 text-xs opacity-0 group-hover:opacity-100 transition flex items-center justify-center"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload area */}
      {previews.length < 5 && (
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-green-500 hover:bg-green-50 transition">
          <div className="text-center">
            {uploading ? (
              <p className="text-green-700 animate-pulse text-sm">
                Uploading...
              </p>
            ) : (
              <>
                <p className="text-3xl mb-1">📷</p>
                <p className="text-sm text-gray-500">Click to upload images</p>
                <p className="text-xs text-gray-400 mt-1">
                  JPG, PNG, WEBP up to 5MB
                </p>
              </>
            )}
          </div>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
          />
        </label>
      )}

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
};

export default GoruImageUpload;
