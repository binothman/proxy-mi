import cheerio from "cheerio";
import { getPageContent } from "./puppeteer.js";

export async function getFeed(req, res) {
  try {
    const data = await getPageContent(req.query.url);

    const $ = cheerio.load(data, { xmlMode: true });
    let rssXML = $("rss");

    if (!rssXML.length) {
      const pre = cheerio.load($("pre").text(), { xmlMode: true });
      rssXML = pre("rss");
    }

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
