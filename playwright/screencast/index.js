const { chromium } = require("playwright-chromium");
const fs = require('fs');
const util = require('util');

module.exports = async function (context, req) {
    const browser = await chromium.launch({
        _videosPath: process.env.VIDEO_PATH || `${__dirname}/videos`  //  save videos here.
    });
    const browserContext = await browser.newContext({
        _recordVideos: { width: 1024, height: 768 },  // downscale
    });
    const page = await browserContext.newPage();
    const video = await page.waitForEvent('_videostarted');

    await page.goto('https://google.com/');
    await page.fill('input[name=q]', 'azure functions');
    await page.click('input[value="Google Search"]');
    await page.waitForTimeout(2000);
    await page.click('//h3[contains(., "Azure Functions Serverless")]');
    await page.waitForTimeout(2000);
    await page.click('a[href="https://docs.microsoft.com/en-us/azure/azure-functions/"]');
    await page.waitForTimeout(2000);
    await page.click('//a[contains(., "Create your first function (JavaScript)")]');
    await page.waitForTimeout(2000);
    await page.close();

    const videoPath = await video.path();
    context.log(videoPath);
    const videoBuffer = await util.promisify(fs.readFile)(videoPath);
    await browser.close();
    await util.promisify(fs.unlink)(videoPath);

    context.res = {
        body: videoBuffer,
        headers: {
            "content-type": "video/webm"
        }
    };
};
