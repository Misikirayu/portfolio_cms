const { requireAdmin } = require("../../../lib/requireAdmin");
const formidable = require("formidable");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

// Allowed file extensions — images + all common document types
const ALLOWED_EXTENSIONS = new Set([
  // Documents
  ".pdf", ".doc", ".docx", ".odt", ".rtf", ".txt",
  ".xls", ".xlsx", ".ods", ".csv",
  ".ppt", ".pptx", ".odp",
  // Images
  ".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg", ".avif",
]);

const handler = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Ensure uploads directory exists inside public/
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const form = formidable({
    uploadDir,
    keepExtensions: true,
    maxFiles: 1,
    maxFileSize: 20 * 1024 * 1024, // 20 MB
  });

  let fields, files;
  try {
    [fields, files] = await form.parse(req);
  } catch (err) {
    return res.status(400).json({ error: `Parse error: ${err.message}` });
  }

  const file = files.file
    ? Array.isArray(files.file)
      ? files.file[0]
      : files.file
    : null;

  if (!file) {
    return res.status(400).json({ error: "No file received." });
  }

  const ext = path.extname(file.originalFilename || "").toLowerCase();

  if (!ALLOWED_EXTENSIONS.has(ext)) {
    fs.unlinkSync(file.filepath);
    return res.status(415).json({
      error: `File type "${ext}" is not allowed. Accepted: ${[...ALLOWED_EXTENSIONS].join(", ")}`,
    });
  }

  // Unique filename — prevents collisions and path traversal
  const newFileName = `${crypto.randomBytes(10).toString("hex")}${ext}`;
  const newFilePath = path.join(uploadDir, newFileName);

  try {
    fs.renameSync(file.filepath, newFilePath);
  } catch (err) {
    return res.status(500).json({ error: `Failed to save file: ${err.message}` });
  }

  return res.status(200).json({ url: `/uploads/${newFileName}` });
};

// Wrap with auth, then attach config to the wrapper so Next.js can read it
const wrappedHandler = requireAdmin(handler);

// CRITICAL: config must live on the exported function, not the inner handler.
// Next.js reads `module.exports.config` from whatever the route file exports.
wrappedHandler.config = {
  api: {
    bodyParser: false, // Let formidable parse multipart/form-data
  },
};

module.exports = wrappedHandler;
