const { requireAdmin } = require("../../../lib/requireAdmin");
const formidable = require("formidable");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

// Disable Next.js's built-in bodyParser to allow formidable to parse multipart/form-data
const config = {
  api: {
    bodyParser: false,
  },
};

const handler = async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  // Ensure uploads directory exists in public
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const form = formidable({
    uploadDir: uploadDir,
    keepExtensions: true,
    maxFiles: 1,
    maxFileSize: 5 * 1024 * 1024, // 5MB limit
  });

  try {
    const [fields, files] = await form.parse(req);
    const file = files.file ? (Array.isArray(files.file) ? files.file[0] : files.file) : null;

    if (!file) {
      res.status(400).json({ error: "No file uploaded" });
      return;
    }

    // Generate a unique clean filename using crypto to prevent duplicate conflicts
    const ext = path.extname(file.originalFilename || "").toLowerCase();
    const newFileName = `${crypto.randomBytes(8).toString("hex")}${ext}`;
    const newFilePath = path.join(uploadDir, newFileName);

    // Rename the temp file to the final destination
    fs.renameSync(file.filepath, newFilePath);

    // Return the accessible public URL path
    const fileUrl = `/uploads/${newFileName}`;
    res.status(200).json({ url: fileUrl });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = requireAdmin(handler);
module.exports.config = config;
