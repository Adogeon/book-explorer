const { Book, parseBookData } = require("../controllers/BookData");

const expect = require("chai").expect;

describe("Book constructor", () => {
  it("should return a Book Object", () => {
    const book1 = Book(
      "Test book 1",
      "Test Series",
      ["Tester A", "Tester B"],
      "This is a book for testing purpose",
      "www.placeholder.com/300/300"
    );

    expect(book1).to.be.deep.equal({
      title: "Test book 1",
      series: "Test Series",
      authors: ["Tester A", "Tester B"],
      desc: "This is a book for testing purpose",
      imgCover: "www.placeholder.com/300/300",
    });
  });
});

describe("parseBookData", () => {
  it("should return a book object with correct data", async () => {
    const book2 = await parseBookData(
      "https://www.goodreads.com/book/show/7094569-feed"
    );

    expect(book2).to.have.property("title").to.be.equal("Feed");
    expect(book2).to.have.property("authors").to.have.length(1);
    expect(book2).to.have.property("imgCover").to.not.equal("");
    expect(book2).to.have.property("desc").to.not.equal("");
  });
});
