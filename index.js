const express = require("express");
const fetch = require("node-fetch");
const { Parser } = require("htmlparser2");
const { DomHandler } = require("domhandler");
const {
  getChildren,
  getAttributeValue,
  findOne,
  findAll,
  getName,
  removeElement,
  innerText,
  getElementById,
  textContent,
} = require("domutils");
const domRender = require("dom-serializer").default;
const exphbs = require("express-handlebars");

if (!globalThis.fetch) {
  globalThis.fetch = fetch;
}

const app = express();

app.use(express.static("public"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

const parseElement = (ele) => {
  switch (getAttributeValue(ele, "id")) {
    case "coverImage":
      return getAttributeValue(ele, "src");
    case "bookTitle":
      return innerText(ele);
    case "bookSeries":
      return innerText(ele);
    case "description":
      const children = getChildren(ele);
      const descriptions = findAll((ele) => getName(ele) === "span", children);
      return textContent(descriptions[1]);
      break;
    default:
      return {};
  }
};

const parseWebsite = async () => {
  let json;
  const response = await fetch(
    "https://www.goodreads.com/book/show/5907.The_Hobbit_or_There_and_Back_Again"
  );
  const rawHtmlData = await response.text();

  const handler = new DomHandler((error, dom) => {
    if (error) {
      console.error(error);
    } else {
      const scriptDom = findOne((ele) => {
        return getName(ele) === "script";
      }, dom);
      removeElement(scriptDom);
      const mainDom = findOne((ele) => {
        return getName(ele) === "body";
      }, dom);
      json = {};
      json.coverImg = parseElement(getElementById("coverImage", mainDom)) ?? {};
      json.bookTitle = parseElement(getElementById("bookTitle", mainDom)) ?? {};
      json.bookSeries =
        parseElement(getElementById("bookSeries", mainDom)) ?? {};
      json.description =
        parseElement(getElementById("description", mainDom)) ?? {};
    }
  });
  const parser = new Parser(handler);
  parser.write(rawHtmlData);
  parser.end();
  console.log(json);
  return json;
};

app.get("/", async (req, res) => {
  res.render("home");
});

app.get("/scrape", async (req, res) => {
  const json = await parseWebsite();
  res.render("result", { data: json });
});

app.get("/test", async (req, res) => {
  const json = await parseWebsite();
  res.json(json);
});

app.listen("3000", () => {
  console.log("Express is listen on port 3000");
});
