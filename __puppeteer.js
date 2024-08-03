import puppeteer from "puppeteer-core";

const executablePath = process.env.EXECUTABLE_PATH || "/usr/bin/google-chrome";

export async function getPageContent(url) {
  try {
    const browser = await puppeteer.launch({
      executablePath,
      defaultViewport: null,
      headless: true,
      ignoreHTTPSErrors: true,
      ignoreDefaultArgs: ["--enable-automation"],
      args: [
        "--kiosks",
        "--disable-accelerated-2d-canvas",
        "--disable-backgrounding-occluded-windows",
        "--disable-renderer-backgrounding",
        "--disable-canvas-aa",
        "--disable-2d-canvas-clip-aa",
        "--disable-gl-drawing-for-tests",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--no-zygote",
        "--use-gl=desktop",
        "--hide-scrollbars",
        "--mute-audio",
        "--no-first-run",
        "--disable-infobars",
        "--disable-breakpad",
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-session-crashed-bubble",
        "--single-process",
        "--noerrdialogs",
        "--disabled-setupid-sandbox",
      ],
    });
    const [page] = await browser.pages();

    const client = await page.target().createCDPSession();
    await client.send("Network.disable");

    await page.setRequestInterception(true);

    page.on("request", (request) => {
      if (
        request.resourceType() === "image" ||
        request.resourceType() === "stylesheet" ||
        request.resourceType() === "font" ||
        request.resourceType() === "texttrack" ||
        request.resourceType() === "imageset" ||
        request.resourceType() === "bacon" ||
        request.resourceType() === "csp_report" ||
        request.resourceType() === "object"
      ) {
        request.abort();
      } else {
        request.continue();
      }
    });

    await page.setViewport({ width: 1920, height: 1080 });

    await page.setUserAgent(
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"
    );

    await page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: 0,
    });

    await page.mouse.move(Math.random() * 1000, Math.random() * 1000);
    await page.mouse.click(Math.random() * 1000, Math.random() * 1000);

    const data = await page.evaluate(
      () => document.querySelector("*").innerHTML
    );

    await page.close();
    await browser.close();

    return data;
  } catch (e) {
    console.log("e", e.message);
    return null;
  }
}
