const playwright = require('playwright');

// Se convierte el HTML A PDF (buffer)

async function htmlToPdfBuffer(html) {
    const browser = await playwright.chromium.launch()
    const page = await browser.newPage()

    await page.setContent(html, {waitUntil: 'load'})

    const pdfBuffer = await page.pdf({
        format: "A4",
        printBackground: true,
    })

    await browser.close()
    return pdfBuffer
}

module.exports = { htmlToPdfBuffer }