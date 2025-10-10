import express from "express";
import { AddAsset,GetAssets,GetAssetBySlug,UpdateAsset,DeleteAsset } from "../Controllers/AssetsController.js";
import { auth, checkAdmin } from "../Middleware/Authcheck.js";
import { uploadFields } from "../Services/multer-service.js";

const router = express.Router();

const assetUploader = uploadFields(
  [
    { name: "thumbnail", maxCount: 1 },
    { name: "images", maxCount: 10 },
  ],
  "assets"
);

router.post("/add", auth, assetUploader, AddAsset);
router.get("/get", auth, GetAssets);
router.get("/get/:slug", auth, GetAssetBySlug);
router.put("/update/:id", auth, assetUploader, UpdateAsset);
router.delete("/delete/:id", checkAdmin, DeleteAsset);

export default router;
