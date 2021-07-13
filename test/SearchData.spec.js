const expect = require("chai").expect;
const { SearchData, parseSearchData } = require("../controllers/SearchData.js");

describe("SearchData", () => {
  it("should match with example", () => {
    const SD1 = SearchData(
      "testBookString123",
      "testBook",
      "www.placeholder/400/400",
      ["testee A", "testee B"]
    );
    expect(SD1).to.be.deep.equal({
      bookString: "testBookString123",
      bookTitle: "testBook",
      coverImg: "www.placeholder/400/400",
      authors: ["testee A", "testee B"],
    });
  });
});

describe("parseSearchData", () => {
  it("shold parse url to correct SearchData", async () => {
    const result = await parseSearchData(
      "https://www.goodreads.com/search?utf8=%E2%9C%93&query=Firework"
    );
    expect(result).to.be.an("array").with.length(20);
    expect(result[0])
      .to.have.property("title")
      .that.is.equal("The Firework-Maker's Daughter");
    expect(result[1])
      .to.have.property("title")
      .that.is.equal("The Firework Exploded (The Holidays, #3)");
  });
});
