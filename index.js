const express = require("express");
const fetch = require("node-fetch");
const { Parser } = require("htmlparser2");
const { DomHandler } = require("domhandler");
const {
  getChildren,
  getAttributeValue,
  findOne,
  getName,
  removeElement,
  innerText,
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
  if (Array.isArray(ele)) {
    return ele.map((e) => parseElement(e));
  } else {
    let result = {};
    if (getName(ele) === "script") return;
    if (getName(ele) === "link") return;
    let eleChildrens = getChildren(ele);
    if (eleChildrens.length > 0) {
      result.children = parseElement(eleChildrens);
    }
    result.name = getName(ele);
    result.class = getAttributeValue(ele, "class");
    result.id = getAttributeValue(ele, "id");
    if (getName(ele) === "a") {
      result.innerText = innerText(ele);
      result.url = getAttributeValue(ele, "href");
    }
    return result;
  }
};

const parseWebsite = async () => {
  let json;
  const response = await fetch("https://www.google.com");
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
      json = parseElement(mainDom);
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
