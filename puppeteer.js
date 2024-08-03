// import puppeteer from "puppeteer-core";
import fetch from "node-fetch";
// const executablePath = process.env.EXECUTABLE_PATH || "/usr/bin/google-chrome";

export async function getPageContent(url) {
  try {
    const proxyUrl =
      "https://browserless-production-f7b8.up.railway.app/content?token=wwoqW3Cp5qDBDCCGlL7qcUOwvQbaoBJvMPc7Ug2ks6JDaTJb";

    const req = await fetch(proxyUrl, {
      method: "POST",
      body: JSON.stringify({
        url,
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
