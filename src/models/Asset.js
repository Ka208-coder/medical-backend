import mongoose from "mongoose";
import { createSlug } from "../utils/slug.js"; 
const AssetsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    unique: true,     
    required: true,   
  },
  description: {
    type: String,
    required: true,
  },
  condition: {
    type: String,
    enum: ["New", "Used"],
    default: "Used",
  },
  purchaseDate: {
    type: String,
    required: true,
  },
  purchasePrice: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ["Electronics", "Furniture", "Vehicles", "Other"],
    default: "Other",
  },
  unit: {
    type: String,
    required: true,
  },
  images: [
    {
      type: String,
      required: true,
    },
  ],
  thumbnail: {
    type: String,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});


AssetsSchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = createSlug(this.name);
  }
  next();
});

export default mongoose.model("Assets", AssetsSchema);
