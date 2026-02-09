const fs = require("fs");
const path = require("path");

/**
 * Reemplaza {{variable}} por valores reales
 */
function replacePlaceholders(template, data) {
  let result = template;

  for (const key in data) {
    const regex = new RegExp(`{{\\s*${key}\\s*}}`, "g");
    result = result.replace(regex, data[key] ?? "");
  }

  return result;
}

/**
 * Renderiza base.html + type.html
 */
function renderCertificate({ type, data }) {
  const basePath = path.join(__dirname, "..", "templates", "base.html");
  const typePath = path.join(
    __dirname,
    "..",
    "templates",
    "types",
    `${type}.html`
  );

  const baseHtml = fs.readFileSync(basePath, "utf-8");
  const typeHtml = fs.readFileSync(typePath, "utf-8");

  // primero reemplazamos placeholders del contenido
  const renderedContent = replacePlaceholders(typeHtml, data);

  // luego inyectamos el contenido en la base
  const fullHtml = replacePlaceholders(baseHtml, {
    ...data,
    content: renderedContent,
  });

  const cssPath = path.join(__dirname, "..", "templates", "style", "style-records.css");
  const css = fs.readFileSync(cssPath, "utf-8");

  // Inserta CSS dentro del <head>
  let fullHtmlWithCss = fullHtml.replace(
    "</head>",
    `<style>${css}</style></head>`
  );

  return fullHtmlWithCss
}

module.exports = { renderCertificate };
