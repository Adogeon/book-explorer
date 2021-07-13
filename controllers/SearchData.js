const { parseURL, whitespaceTrim } = require("./utils.js");
const {
  getElementsByTagName,
  getName,
  find,
  getChildren,
  innerText,
  findOne,
  getAttributeValue,
} = require("domutils");
/**
 * Represend search data from goodread result
 * @constructor
 * @param {string} bookString - represent the book identity in goodreads book detail URL
 * @param {string} bookTitle
 * @param {string} coverImg - source of the cover image
 * @param {[string]} authors - array of author names
 */
function SearchData(bookString, bookTitle, coverImg, authors) {
  return { bookString, bookTitle, coverImg, authors };
}

/**
 * Parsing the Goodread search result into array of SearchData
 * @param {string} url - url of the search link
 * @returns {[SearchData]}
 */
async function parseSearchData(url) {
  return await parseURL(url, (mainDom) => {
    const tableDom = getElementsByTagName("table", mainDom, true)[0];
    const tableRowNodes = find(
      (node) => getName(node) === "tr",
      getChildren(tableDom),
      true
    );
    return tableRowNodes.map((node) => {
      const dataNode = getChildren(node);
      const coverNode = findOne(
        (n) => getAttributeValue(n, "itemprop") === "image",
        dataNode,
        true
      );
      const nameNodes = find(
        (n) => getAttributeValue(n, "itemprop") === "name",
        dataNode,
        true
      );

      const titleNode = nameNodes[0];
      const authorNodes = nameNodes.slice(1);

      return {
        coverImg: getAttributeValue(coverNode, "src"),
        title: whitespaceTrim(innerText(titleNode)),
        author: authorNodes.map((n) => whitespaceTrim(innerText(n))),
      };
    });
  });
}

module.exports = { SearchData, parseSearchData };
