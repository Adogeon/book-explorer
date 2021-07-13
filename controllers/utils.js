const { Parser } = require("htmlparser2");
const { DomHandler } = require("domhandler");
const { findOne, getName } = require("domutils");
const fetch = require("node-fetch");

/**
 * Parse website according to the input callback
 * @param {string} url the url string to be parse
 * @param {Function} cb callback function for the handler
 * @returns {any} result depend on callback
 */
async function parseURL(url, cb) {
  const fetchRes = await fetch(url);
  const rawHtmlData = await fetchRes.text();
  let cbResult;
  const handler = new DomHandler((error, dom) => {
    if (error) throw new Error(`Parse Error: ${error}`);
    const mainDom = findOne((ele) => getName(ele) === "body", dom);
    cbResult = cb(mainDom);
  });
  const parser = new Parser(handler);
  parser.write(rawHtmlData);
  parser.end();
  //return callback function result
  return cbResult;
}

/**
 * Remove newlines and excess whitespace
 * @param {string} str - input string
 * @returns {string}
 */
function whitespaceTrim(str) {
  return str.replace(/[\n\r]+|[\s]{2,}/g, " ").trim();
}

module.exports = { parseURL, whitespaceTrim };
