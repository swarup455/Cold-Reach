import multer from "multer";

const storage = multer.memoryStorage();

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

export const upload = multer({
    storage,
    limits: { fileSize: MAX_FILE_SIZE_BYTES },
});