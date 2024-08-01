import puppeteer from "puppeteer-core";
import cheerio from "cheerio";
import locateChrome from "locate-chrome";

export async function getFeed(req, res) {
  try {
    const executablePath = await new Promise((resolve) =>
      locateChrome((arg) => resolve(arg))
    );

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
      if (request.resourceType() === "image") request.abort();
      else request.continue();
    });

    await page.setViewport({ width: 1920, height: 1080 });

    await page.setUserAgent(
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"
    );

    await page.goto(req.query.url, {
      waitUntil: "domcontentloaded",
      timeout: 0,
    });

    await page.mouse.move(Math.random() * 1000, Math.random() * 1000);
    await page.mouse.click(Math.random() * 1000, Math.random() * 1000);

    const data = await page.evaluate(
      () => document.querySelector("*").innerHTML
    );

    const $ = cheerio.load(data, { xmlMode: true });
    let rssXML = $("rss");

    if (!rssXML.length) {
      const pre = cheerio.load($("pre").text(), { xmlMode: true });
      rssXML = pre("rss");
    }

    await browser.close();

    if (rssXML.length === 0) {
      return res.status(403).send({
        error: 1,
      });
    }

    res.header("Content-Type", "text/xml");
    res.type("text/xml");
    res.contentType("text/xml");

    res.send(
      '<?xml version="1.0" encoding="UTF-8"?> <rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:media="http://search.yahoo.com/mrss/" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:mi="http://schemas.ingestion.microsoft.com/common/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dc="http://purl.org/dc/elements/1.1/" >' +
        rssXML.html() +
        "</rss>"
    );
  } catch (e) {
    console.log("e", e.message);
    res.send({
      error: 1,
    });
  }
}
