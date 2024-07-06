import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";

const app = express();
const PORT = 3000;

app.use("/api", function (req, res, next) {
  createProxyMiddleware({
    target: req.query.url,
    changeOrigin: true,
  })(req, res, next);
});

app.listen(3001, () => {
  console.log(`live on ${PORT}`);
});
