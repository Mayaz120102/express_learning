import { useState } from "react";
import { useNavigate } from "react-router-dom";
import goruAxios from "../api/goruAxios";
import GoruImageUpload from "../components/GoruImageUpload";
import toast from "react-hot-toast";

const GoruAddCow = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    breed: "",
    age: "",
    weight: "",
    price: "",
    district: "",
    description: "",
    images: [],
  });

  // handler
  const handleImagesUploaded = (urls) => {
    setFormData({ ...formData, images: urls });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await goruAxios.post("/cows", formData);

      toast.success("Cow listed successfully!");

      navigate(`/cows/${data.cow._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create listing");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent";

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-green-700 mb-8">List Your Cow</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-md p-8 space-y-5"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>

          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Strong Brahman Bull"
            required
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Breed
            </label>

            <input
              name="breed"
              value={formData.breed}
              onChange={handleChange}
              placeholder="e.g. Brahman"
              required
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              District
            </label>

            <input
              name="district"
              value={formData.district}
              onChange={handleChange}
              placeholder="e.g. Dhaka"
              required
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Age (years)
            </label>

            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              placeholder="3"
              required
              min="0"
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Weight (kg)
            </label>

            <input
              type="number"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              placeholder="320"
              required
              min="0"
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price (৳)
            </label>

            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="85000"
              required
              min="0"
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the cow — health, vaccination status, temperament..."
            rows={4}
            className={inputClass}
          />
        </div>

        <GoruImageUpload
          onUploadComplete={handleImagesUploaded}
          existingImages={formData.images}
        />

        <div className="flex gap-4 pt-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition font-medium"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-green-700 text-white py-3 rounded-lg hover:bg-green-800 disabled:bg-green-400 transition font-semibold"
          >
            {loading ? "Listing..." : "List Cow"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default GoruAddCow;
