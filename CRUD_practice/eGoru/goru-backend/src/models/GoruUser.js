import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const goruUserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [50, "Name cannot exceed 500"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true, // no two users with same email
      lowercase: true, // always store as lowercase
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // NEVER return password in queries by default
    },
    role: {
      type: String,
      enum: ["buyer", "seller", "admin"], // only these 3 values allowed
      default: "buyer",
    },
    phone: {
      type: String,
      trim: true,
    },
    district: {
      type: String,
      trim: true,
    },
    avatar: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true, // auto adds createdAt and updatedAt
  },
);

goruUserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
});

goruUserSchema.methods.goruComparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const GoruUser = mongoose.model("GoruUser", goruUserSchema);
export default GoruUser;
