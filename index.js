import express from "express";
import nodeFetch from "node-fetch";

const app = express();
const PORT = 3003;

app.use("/api", async function (req, res) {
  const request = await nodeFetch(req.query.url);
  const text = await request.text();

  const content_type = request.headers.get("content-type");

  res.set("Content-Type", content_type);
  res.send(text);
});

app.listen(PORT, () => {
  console.log(`live on ${PORT}`);
});
