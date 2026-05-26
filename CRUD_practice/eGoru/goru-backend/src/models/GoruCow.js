import mongoose from "mongoose";

const goruCowSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    breed: {
      type: String,
      required: [true, "Breed is required"],
      trim: true,
    },
    age: {
      type: Number,
      required: [true, "Age is required"],
      min: [0, "Age cannot be negative"],
    },
    weight: {
      type: Number,
      required: [true, "Weight is required"],
      min: [0, "Weight cannot be negative"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    district: {
      type: String,
      required: [true, "District is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    images: {
      type: [String], // array of image URLs
      default: [],
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GoruUser", // references the User model
      required: true,
    },
    isAvailable: {
      type: Boolean,
      default: true, // becomes false when sold
    },
  },
  {
    timestamps: true,
  },
);

// Index for faster search queries — we'll use these in Phase 4
goruCowSchema.index({ title: "text", breed: "text", description: "text" });
goruCowSchema.index({ district: 1 });
goruCowSchema.index({ price: 1 });

const GoruCow = mongoose.model("GoruCow", goruCowSchema);
export default GoruCow;
