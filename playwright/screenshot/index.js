const { chromium } = require("playwright-chromium");

module.exports = async function (context, req) {
    const url = req.query.url || "https://google.com/";
    const browser =  await chromium.launch();
    const page = await browser.newPage();
    await page.goto(url);
    const screenshotBuffer = await page.screenshot({ fullPage: true });
    await browser.close();

    context.res = {
        body: screenshotBuffer,
        headers: {
            "content-type": "image/png"
        }
    };
};
