const { supabase, BUCKET } = require("../lib/supabaseClient");

/**
 * Sube un PDF (Buffer) a Supabase Storage
 */
async function uploadPdfBuffer({ buffer, path }) {
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, buffer, {
      contentType: "application/pdf",
      upsert: true,
    });

  if (error) throw error;
  return path;
}

/**
 * Crea URL firmada para descargar el PDF (por X segundos)
 */
async function createSignedPdfUrl(path, expiresInSeconds = 600) {
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(path, expiresInSeconds);

  if (error) throw error;
  return data.signedUrl;
}

module.exports = { uploadPdfBuffer, createSignedPdfUrl };
