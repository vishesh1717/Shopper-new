import cloudinary from "cloudinary";
import dotenv from "dotenv";

dotenv.config({ path: "backend/config/config.env" });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// export const upload_file = (file, folder) => {
//   return new Promise((resolve, reject) => {
//     cloudinary.uploader.upload(
//       file,
//       (result) => {
//         resolve({
//           public_id: result.public_id,
//           url: result.url,
//         });
//       },
//       {
//         resource_type: "auto",
//         folder,
//       }
//     );
//   });
// };
export const upload_file = async (file, folder) => {
  const TIMEOUT_MS = 10000; // 10 seconds

  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Upload timeout exceeded")), TIMEOUT_MS)
  );

  try {
    const result = await Promise.race([
      cloudinary.uploader.upload(file, {
        resource_type: "auto",
        folder,
      }),
      timeoutPromise,
    ]);

    return {
      public_id: result.public_id,
      url: result.secure_url,
    };
  } catch (error) {
    console.error("Error uploading file to Cloudinary:", error.message || error);
    return null;
  }
};

export const delete_file = async (file) => {
  try {
    const controller = new AbortController();

    const timeout = setTimeout(() => {
      controller.abort();
    }, 10000); // 10 seconds timeout

    const res = await cloudinary.uploader.destroy(file);

    clearTimeout(timeout);

    if (res?.result === "ok" || res?.result === "not_found") {
      return true;
    }

    console.error("Unexpected Cloudinary response:", res);
    return false;
  } catch (error) {
    console.error("Error deleting file from Cloudinary:", error.message || error);
    return false;
  }
};
