import puppeteer from "puppeteer";

export async function getContent(req, res) {
  try {
    const browser = await puppeteer.launch({
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
      ],
    });
    const [page] = await browser.pages();

    await page.setViewport({ width: 1920, height: 1080 });

    await page.setUserAgent(
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"
    );

    await page.goto(req.query.url, { waitUntil: "domcontentloaded" });

    await page.mouse.move(Math.random() * 1000, Math.random() * 1000);
    // await page.mouse.click(Math.random() * 1000, Math.random() * 1000);

    const data = await page.evaluate(
      () => document.querySelector("*").innerHTML
    );

    await browser.close();

    res.header("Content-Type", "text/html");
    res.type("text/html");
    res.contentType("text/html");

    res.send(data);
  } catch (e) {
    console.log("e", e.message);
    res.send({
      error: 1,
    });
  }
}
