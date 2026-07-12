import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string,
    api_key: process.env.CLOUDINARY_API_KEY as string,
    api_secret: process.env.CLOUDINARY_API_SECRET as string,
});

export function uploadBufferToCloudinary(
    buffer: Buffer,
    folder: string
): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { folder, resource_type: "auto" },
            (error, result) => {
                if (error || !result) {
                    return reject(error ?? new Error("Cloudinary upload failed"));
                }
                resolve(result);
            }
        );

        uploadStream.end(buffer);
    });
}

export default cloudinary;