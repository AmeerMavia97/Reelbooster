// utils/s3Upload.ts
import { toast } from "react-toastify";

/**
 * Upload a file to S3 using presigned URL approach.
 * 1. Get presigned URL from backend
 * 2. Upload directly to S3 (fast - bypasses backend)
 * 3. Return the file URL
 *
 * @param file File to upload
 * @param fileType Type of file ("video" | "image")
 * @param postData function to make API POST requests
 */
export const uploadFileToS3 = async (
  file: File,
  fileType: "video" | "image",
  postData: (url: string, data: any, type?: string) => Promise<any>
): Promise<string | null> => {
  try {
    console.log("Uploading file to S3:", file);

    // Step 1: Get presigned URL from backend
    const res = await postData("/social/get-presigned-url", {
      file_type: fileType,
      mime_type: file.type,
    });

    const presignedUrl = res?.data?.presigned_url;
    const fileUrl = res?.data?.file_url;

    if (!presignedUrl || !fileUrl) {
      throw new Error("Invalid presigned URL response");
    }

    console.log("Got presigned URL, uploading to S3...");

    // Step 2: Upload directly to S3 (fast - bypasses backend)
    const uploadRes = await fetch(presignedUrl, {
      method: "PUT",
      headers: { "Content-Type": file.type },
      body: file,
    });

    if (!uploadRes.ok) {
      throw new Error(`S3 upload failed with status ${uploadRes.status}`);
    }

    console.log("File uploaded successfully:", fileUrl);

    // Step 3: Return the file URL
    return fileUrl;
  } catch (err: any) {
    toast.error("S3 Upload Error: " + err.message);
    return null;
  }
};
