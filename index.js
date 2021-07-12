const express = require("express");
const fetch = require("node-fetch");
const { Parser } = require("htmlparser2");
const { DomHandler } = require("domhandler");
const {
  getChildren,
  getAttributeValue,
  findOne,
  getElementsByTagName,
  find,
  getName,
  innerText,
} = require("domutils");
const exphbs = require("express-handlebars");

const { parseBookData } = require("./controllers/BookData.js");

if (!globalThis.fetch) {
  globalThis.fetch = fetch;
}

const app = express();

app.use(express.static("public"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

const parseBookSearchResult = (cNodes) => {
  const tableRowNodes = find((node) => getName(node) === "tr", cNodes, true);
  return tableRowNodes.map((childrenNode) => {
    const bookDataNode = getChildren(childrenNode);
    const bookCoverNode = findOne(
      (node) => getAttributeValue(node, "itemprop") === "image",
      bookDataNode,
      true
    );
    const bookNameNodes = find(
      (node) => getAttributeValue(node, "itemprop") === "name",
      bookDataNode,
      true
    );

    const bookTitleNode = bookNameNodes[0];
    const bookAuthorNames = bookNameNodes.slice(1);

    return {
      coverImg: getAttributeValue(bookCoverNode, "src"),
      title: innerText(bookTitleNode),
      author: bookAuthorNames.map((node) => innerText(node)),
    };
  });
};

const parseBookSearch = async () => {
  let json;
  const response = await fetch(
    "https://www.goodreads.com/search?utf8=%E2%9C%93&query=Firework"
  );
  const rawHtmlData = await response.text();
  const handler = new DomHandler((error, dom) => {
    if (error) {
      console.error(error);
    } else {
      const mainDom = findOne((ele) => getName(ele) === "body", dom);
      const tableDom = getElementsByTagName("table", mainDom, true);
      json = parseBookSearchResult(getChildren(tableDom[0]));
    }
  });
  const parser = new Parser(handler);
  parser.write(rawHtmlData);
  parser.end();
  return json;
};

app.get("/", async (req, res) => {
  res.render("home");
});

app.get("/book/:bookString", async (req, res) => {
  const book = await parseBookData(
    `www.goodreads.com/book/show/${req.params.bookString}`
  );
  res.render("book", { data: book });
});

app.get("/scrape", async (req, res) => {
  const book = await parseBookData(
    `www.goodreads.com/book/show/5907.The_Hobbit_or_There_and_Back_Again`
  );
  res.render("book", { data: book });
});

app.get("/search", async (req, res) => {
  const json = await parseBookSearch();
  res.render("result", { result: json });
});

app.get("/test", async (req, res) => {
  const json = await parseWebsite();
  res.json(json);
});

app.listen("3000", () => {
  console.log("Express is listen on port 3000");
});
