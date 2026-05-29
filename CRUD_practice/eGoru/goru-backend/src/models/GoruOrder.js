import mongoose from "mongoose";

const goruOrderSchema = new mongoose.Schema(
  {
    cow: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GoruCow",
      required: true,
    },
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GoruUser",
      required: true,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GoruUser",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "rejected", "cancelled"],
      default: "pending",
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    deliveryAddress: {
      district: { type: String, required: true },
      details: { type: String },
    },
    note: {
      type: String,
      maxlength: 500,
    },
  },
  {
    timestamps: true,
  },
);

const GoruOrder = mongoose.model("GoruOrder", goruOrderSchema);
export default GoruOrder;
