const { returnBookString } = require("../controllers/utils");

const expect = require("chai").expect;

describe("returnBookString()", () => {
  it("should remove bookString from the input url", () => {
    expect(
      returnBookString(
        "/book/show/40873920-the-lost-city-of-the-monkey-god?from_search=true&from_srp=true&qid=jy51tVb9Zq&rank=5"
      )
    ).to.be.equal("40873920-the-lost-city-of-the-monkey-god");
    expect(
      returnBookString(
        "/book/show/44776548-year-of-the-monkey?from_search=true&from_srp=true&qid=jy51tVb9Zq&rank=9"
      )
    ).to.be.equal("44776548-year-of-the-monkey");
  });
});
