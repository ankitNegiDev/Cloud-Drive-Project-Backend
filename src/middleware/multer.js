import multer from "multer";

// storing file in memory (not in disk) because we will directly upload to Supabase
const storage = multer.memoryStorage();

export const upload = multer({
    storage,
    limits: {
        fileSize: 50 * 1024 * 1024, // 50 MB limit
    },
});
