const { test, describe } = require("node:test");
const assert = require("node:assert");
const {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
} = require("../utils/list_helper");

const blogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0,
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0,
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0,
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0,
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0,
  },
];

const singleBlog = [
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf",
    likes: 5,
    __v: 0,
  },
];

test("dummy returns 1", () => {
  assert.strictEqual(dummy([]), 1);
});

describe("total likes", () => {
  test("of empty list is zero", () => {
    assert.strictEqual(totalLikes([]), 0);
  });

  test("when list has only one blog, equals the likes of that", () => {
    assert.strictEqual(totalLikes(singleBlog), 5);
  });

  test("of a bigger list is calculated right", () => {
    assert.strictEqual(totalLikes(blogs), 24);
  });
});

describe("favorite blog", () => {
  test("blog with the most likes is calculated right", () => {
    assert.deepStrictEqual(favoriteBlog(blogs), blogs[2]);
  });
});

describe("most blogs", () => {
  test("returns the author with most blogs", () => {
    const result = {
      author: "Robert C. Martin",
      blogs: 3,
    };
    assert.deepStrictEqual(mostBlogs(blogs), result);
  });
});
