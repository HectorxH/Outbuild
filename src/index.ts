import express, { urlencoded, json } from "express";

const port = process.env.PORT || 8000;

const app = express();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port);
