import Asset from "../models/Asset.js";
import { createSlug } from "../utils/slug.js";
import {errorresponse,successresponse} from "../services/Errorhandler.js"
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

   
    const thumbnailFile = req.files?.thumbnail?.[0];
    const imageFiles = req.files?.images || [];

    
    if (
      !name ||
      !description ||
      !condition ||
      !purchaseDate ||
      !purchasePrice ||
      !category ||
      !unit ||
      !thumbnailFile ||
      imageFiles.length === 0
    ) {
      return errorresponse();
    }
   

    const thumbnail = `${process.env.baseUrl}/${thumbnailFile.path.replace(/\\/g, "/")}`;
    const images = imageFiles.map((file) =>
      `${process.env.baseUrl}/${file.path.replace(/\\/g, "/")}`
    );

    const slug = createSlug(name);

    const existing = await Asset.findOne({ slug });
    if (existing) {
      return errorresponse (res,400,"already exist asset");
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
    return successresponse(res, 201,
     "Asset created successfully",{
      asset: newAsset,
    });
  } catch (error) {
    return errorresponse(res,500,"server issues");
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

     return successresponse(res, 200, assets, "Asset fetched successfully");
  } catch  {
    return errorresponse(res,500,"internal Server issues");
  }
};

export const GetAssetBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const asset = await Asset.findOne({ slug });

    if (!asset) {
      return errorresponse(res,404, "Asset not found" );
    }
    return successresponse(res, 200, asset, "Asset fetched successfully");

  } catch  {
    return errorresponse(res,500,"internal server issue");
  }
};



export const UpdateAsset = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, condition, purchaseDate, purchasePrice, category, unit } = req.body;

    const thumbnailFile = req.files?.thumbnail?.[0];
    const imageFiles = req.files?.images || [];

    
    const existingAsset = await Asset.findById(id);
    if (!existingAsset) {
      return errorresponse(res,404, "Asset not found" );
    }
    const updatedData = {
      name,
      description,
      condition,
      purchaseDate,
      purchasePrice,
      category,
      unit,
    };
    if (thumbnailFile) {
    updatedData.thumbnail = thumbnailFile.path; 
    }
    if (imageFiles.length > 0) {
      updatedData.images = imageFiles.map((file) => file.path);
    }
    const updatedAsset = await Asset.findByIdAndUpdate(id, updatedData, { new: true });

    return successresponse(res, 200, {
      message: "Asset updated successfully",
      asset: updatedAsset,
    });
  } catch {
    return errorresponse(res,500,"internal server issue");
  }
};


export const DeleteAsset = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return errorresponse (res,403, "Only admin can delete assets" );
    }

    const { id } = req.params;
    const deleted = await Asset.findByIdAndDelete(id);

    if (!deleted) {
      return errorresponse(res,404, "Asset not found");
    }

    return successresponse(res, 200,"Asset deleted successfully");

  } catch {
    return errorresponse(res,500,"internal server issue");
  }
};

