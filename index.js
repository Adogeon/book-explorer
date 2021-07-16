const express = require("express");
const fetch = require("node-fetch");

const exphbs = require("express-handlebars");

const { parseBookData } = require("./controllers/BookData.js");
const { parseSearchData } = require("./controllers/SearchData.js");

if (!globalThis.fetch) {
  globalThis.fetch = fetch;
}

const app = express();

app.use(express.static("public"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.get("/", async (req, res) => {
  res.render("home");
});

app.get("/book/:bookString", async (req, res) => {
  const book = await parseBookData(
    `https://www.goodreads.com/book/show/${req.params.bookString}`
  );
  res.render("book", { data: book });
});

app.get("/search/:bookSearch", async (req, res) => {
  const result = await parseSearchData(
    `https://www.goodreads.com/search?q=${req.params.bookSearch}&search_type=books`
  );
  res.render("result", { data: result });
});

app.get("/test1", async (req, res) => {
  const book = await parseBookData(
    `https://www.goodreads.com/book/show/5907.The_Hobbit_or_There_and_Back_Again`
  );
  res.render("book", { data: book });
});

app.get("/test2", async (req, res) => {
  const result = await parseSearchData(
    `https://www.goodreads.com/search?q=Monkey&search_type=books`
  );
  res.render("result", { data: result });
});

app.listen("3000", () => {
  console.log("Express is listen on port 3000");
});
