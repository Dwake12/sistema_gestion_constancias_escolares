const fs = require("fs");

/**
 * Convierte un archivo (png, jpg, etc) a Data URI
 */
function fileToDataUri(absPath, mimeType = "image/png") {
  const file = fs.readFileSync(absPath);
  const base64 = file.toString("base64");
  return `data:${mimeType};base64,${base64}`;
}

module.exports = { fileToDataUri };
