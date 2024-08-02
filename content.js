import cheerio from "cheerio";
import { getPageContent } from "./puppeteer.js";

export async function getContent(req, res) {
  try {
    const data = await getPageContent(req.query.url);

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
