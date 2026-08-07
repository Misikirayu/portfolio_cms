import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../lib/auth";
import formidable from "formidable";
import path from "path";
import fs from "fs";
import crypto from "crypto";

// CRITICAL: must be a named export called `config` on the module.
// This tells Next.js to skip its built-in body parser so formidable can handle
// the multipart/form-data stream directly.
export const config = {
  api: {
    bodyParser: false,
  },
};

// Allowed file extensions — images + all common document types
const ALLOWED_EXTENSIONS = new Set([
  ".pdf", ".doc", ".docx", ".odt", ".rtf", ".txt",
  ".xls", ".xlsx", ".ods", ".csv",
  ".ppt", ".pptx", ".odp",
  ".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg", ".avif",
]);

export default async function handler(req, res) {
  // Inline auth guard
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user) {
    return res.status(401).json({ error: "Not authenticated" });
  }

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

  let files;
  try {
    [, files] = await form.parse(req);
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
    try { fs.unlinkSync(file.filepath); } catch (_) {}
    return res.status(415).json({
      error: `File type "${ext || "(none)"}" is not allowed. Accepted: ${[...ALLOWED_EXTENSIONS].join(", ")}`,
    });
  }

  const newFileName = `${crypto.randomBytes(10).toString("hex")}${ext}`;
  const newFilePath = path.join(uploadDir, newFileName);

  try {
    fs.renameSync(file.filepath, newFilePath);
  } catch (err) {
    return res.status(500).json({ error: `Failed to save file: ${err.message}` });
  }

  return res.status(200).json({ url: `/uploads/${newFileName}` });
}
