// import puppeteer from "puppeteer-core";
import fetch from "node-fetch";
// const executablePath = process.env.EXECUTABLE_PATH || "/usr/bin/google-chrome";
const token = process.env.BROWSERLESS_TOKEN;
const proxyUrl = `https://browserless-production-f7b8.up.railway.app/content?token=${token}`;
export async function getPageContent(url) {
  try {
    const req = await fetch(proxyUrl, {
      method: "POST",
      body: JSON.stringify({
        url,
        rejectResourceTypes: [
          "image",
          "stylesheet",
          "font",
          "texttrack",
          "script",
        ],
        rejectRequestPattern: ["/^.*\\.(css)"],
        gotoOptions: {
          waitUntil: "domcontentloaded",
        },
        setJavaScriptEnabled: false,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await req.text();

    return data;
  } catch (e) {
    console.log("e", e.message);
    return null;
  }
}
