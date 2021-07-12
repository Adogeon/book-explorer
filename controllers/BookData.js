const { parseURL, whitespaceTrim } = require("./utils");
const {
  getAttributeValue,
  getElementById,
  getName,
  getChildren,
  textContent,
  find,
} = require("domutils");

/**
 * Represent a book
 * @constructor
 * @param {string} title - The title of the book
 * @param {string} series - The series that the book belong to
 * @param {[string]} authors - The authors name
 * @param {string} desc - the quick description of the book
 * @param {string} imgCover - the url string of the image cover
 * @returns {Object} - The Book object
 */
function Book(title, series, authors, desc, imgCover) {
  return {
    title,
    series,
    authors,
    desc,
    imgCover,
  };
}

/**
 * Parsing book data from the DOM node
 * @param {string} URL - the url string of the goodread webpage for the book
 * @returns {Book} return a Book
 */

async function parseBookData(url) {
  return await parseURL(url, (mainDom) => {
    let title = "";
    let series = "";
    let authors = [];
    let desc = "";
    let imgCover = "";
    // get cover image
    const coverImgDom = getElementById("coverImage", mainDom);
    imgCover = getAttributeValue(coverImgDom, "src");
    //get book title
    const bookTitleDom = getElementById("bookTitle", mainDom);
    title = whitespaceTrim(textContent(bookTitleDom));
    //get book series
    const bookSeriesDom = getElementById("bookSeries", mainDom);
    series = whitespaceTrim(textContent(bookSeriesDom));
    //get book title
    const bookDescDom = getElementById("description", mainDom);
    const descChildren = getChildren(bookDescDom);
    const descTextDoms = find(
      (ele) => getName(ele) === "span",
      descChildren,
      true
    );
    desc = textContent(descTextDoms[1]);
    //get book authors
    const bookAuthorsDom = getElementById("bookAuthors", mainDom);
    const authorNameNodes = find(
      (node) => getAttributeValue(node, "itemprop") === "author",
      getChildren(bookAuthorsDom),
      true
    );
    authors = authorNameNodes.map((node) => whitespaceTrim(textContent(node)));

    return Book(title, series, authors, desc, imgCover);
  });
}

module.exports = { Book, parseBookData };
