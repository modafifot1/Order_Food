import cloud from "cloudinary";
import multer from "multer";
import { envVariables } from "../configs";
const { cloud_name, api_key_cloud, api_secret_cloud } = envVariables;
cloud.v2.config({
  cloud_name: cloud_name,
  api_key: api_key_cloud,
  api_secret: api_secret_cloud,
});

export const upload = new multer({
  dest: "uploads/",
});
export const uploadSingle = async (file) => {
  return new Promise((resolve) => {
    cloud.uploader
      .upload(file, {
        folder: "food",
      })
      .then((result) => {
        if (result) {
          const fs = require("fs");
          fs.unlinkSync(file);
          resolve({
            url: result.secure_url,
          });
        }
      });
  });
};
