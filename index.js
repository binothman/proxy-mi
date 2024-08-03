import express from "express";
import { getFeed } from "./feed.js";
import { getContent } from "./content.js";

const app = express();
const PORT = process.env.PORT || 4000;

app.use("/feed", getFeed);
app.use("/content", getContent);

// app.use(express.json());

// app.use("/webhook", (req, res) => {
//   console.log("webhook", req.body);
//   res.send({
//     message: "ok",
//   });
// });

app.listen(PORT, () => {
  console.log(`live on ${PORT}`);
});
