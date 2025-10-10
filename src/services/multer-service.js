import multer from "multer";
import path from "path";
import fs from "fs";


const createUploadPath = (folder) => {
  const uploadPath = path.join("uploads", folder);

  if (!fs.existsSync("uploads")) {
    fs.mkdirSync("uploads");
  }
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath);
  }

  return uploadPath;
};
const makeUploader = (folder) => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const uploadPath = createUploadPath(folder);
      cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
      const safeName = file.originalname.replace(/\s+/g, "-").toLowerCase();
      const uniqueName = Date.now() + "-" + safeName;
      cb(null, uniqueName);
    },
  });

  const fileFilter = (req, file, cb) => {
    const allowedMimes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Only images are allowed. Got: ${file.mimetype}`), false);
    }
  };

  return multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  });
};

// Exported helpers
export const uploadSingle = (fieldName, folder = "general") =>
  makeUploader(folder).single(fieldName);

export const uploadArray = (fieldName, maxCount = 10, folder = "general") =>
  makeUploader(folder).array(fieldName, maxCount);

export const uploadFields = (fields, folder = "general") =>
  makeUploader(folder).fields(fields);
