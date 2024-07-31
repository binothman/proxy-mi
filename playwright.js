import playwright from "playwright";

(async () => {
  const browser = await playwright.webkit.launch(); // Or 'firefox' or 'webkit'.
  const page = await browser.newPage();
  await page.goto("https://google.com");
  // other actions...
  await browser.close();
})();
