import express from "express";
import { AddAsset,GetAssets,GetAssetBySlug,UpdateAsset,DeleteAsset } from "../controllers/AssetsController.js";
import { auth, checkAdmin } from "../middleware/Authcheck.js";
import { uploadFields } from "../Services/multer-service.js";

const router = express.Router();

const assetUploader = uploadFields(
  [
    { name: "thumbnail", maxCount: 1 },
    { name: "images", maxCount: 10 },
  ],
  "assets" // Storage path  (when uploads folder create bydefult one more folder create in upload folder in storage time
            // assetsfolder  )                                                                                                           
);

router.post("/add", auth, assetUploader, AddAsset);
router.get("/get", auth, GetAssets);
router.get("/get/:slug", auth, GetAssetBySlug);
router.put("/update/:id", auth, assetUploader, UpdateAsset);
router.delete("/delete/:id", checkAdmin, DeleteAsset);

export default router;
