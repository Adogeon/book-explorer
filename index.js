const express = require("express");
const fetch = require("node-fetch");

const app = express();

const response = await fetch("https://news.ycombinator.com/");
const data = await response.text();

app.get("/", (req, res) => {
  res.json({ message: data });
});

app.listen("3000", () => {
  console.log("Express is listen on port 3000");
});
