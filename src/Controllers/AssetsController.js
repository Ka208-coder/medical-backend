import Asset from "../models/Asset.js";
import { createSlug } from "../utils/slug.js";

export const AddAsset = async (req, res) => {
  try {

    const {
      name,
      description,
      condition,
      purchaseDate,
      purchasePrice,
      category,
      unit,
    } = req.body;

   
    const thumbnail = req.files?.thumbnail?.[0]?.path || null;
    const images = req.files?.images?.map((file) => file.path) || [];

    if (
      !name ||
      !description ||
      !condition ||
      !purchaseDate ||
      !purchasePrice ||
      !category ||
      !unit ||
      !thumbnail ||
      images.length === 0
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const slug = createSlug(name);
    const existing = await Asset.findOne({ slug });
    if (existing) {
      return res.status(400).json({ message: "Asset with similar name already exists" });
    }

    const userId = req.user?.id;

    const newAsset = new Asset({
      name,
      slug,
      description,
      condition,
      purchaseDate,
      purchasePrice,
      category,
      unit,
      images,       
      thumbnail,   
      createdBy: userId,
    });

    await newAsset.save();

    res.status(201).json({
      message: "Asset created successfully",
      asset: newAsset,
    });
  } catch (error) {
    console.error("Error in AddAsset:", error);
    res.status(500).json({ message: error.message });
  }
};



export const GetAssets = async (req, res) => {
  try {
    const assets = await Asset.find();

    if (!assets || assets.length === 0) {
      return res.status(200).json({
        message: "No Assets at this moment",
        assets: [],
      });
    }

    res.status(200).json(assets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const GetAssetBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const asset = await Asset.findOne({ slug });

    if (!asset) {
      return res.status(404).json({ message: "Asset not found" });
    }

    res.status(200).json(asset);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const UpdateAsset = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, condition, purchaseDate, purchasePrice, category, unit } = req.body;

    if (!name || !description || !condition || !purchaseDate || !purchasePrice || !category || !unit) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const updatedAsset = await Asset.findByIdAndUpdate(
      id,
      { name, description, condition, purchaseDate, purchasePrice, category, unit },
      { new: true }
    );

    if (!updatedAsset) {
      return res.status(404).json({ message: "Asset not found" });
    }

    res.status(200).json({
      message: "Asset updated successfully",
      asset: updatedAsset,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const DeleteAsset = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admin can delete assets" });
    }

    const { id } = req.params;
    const deleted = await Asset.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Asset not found" });
    }

    res.status(200).json({ message: "Asset deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

