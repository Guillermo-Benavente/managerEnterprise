import puppeteer from "puppeteer";

export async function convertHTMLToPDF(html: string): Promise<Buffer> {
    const browser = await puppeteer.launch({
        headless: true,
        args: [
            "--no-sandbox",
            "--disable-setuid-sandbox"
        ]
    });
    const page = await browser.newPage();
    await page.setContent(`
        <html>
            <head>
            <style>
                body, p, h1, h2, h3, h4, h5, h6, span, li {
                font-family: Arial, sans-serif;
                }
            </style>
            </head>
            <body>${html}</body>
        </html>
        `
    , { waitUntil: 'networkidle0' });
    const uint8 = await page.pdf({
        format: "A4",
        printBackground: true,
        margin: { top: "20px", bottom: "20px", left: "20px", right: "20px" }
    });
    await browser.close();
    return Buffer.from(uint8);
}