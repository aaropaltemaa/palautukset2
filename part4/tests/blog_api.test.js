const { test, after, beforeEach, describe } = require("node:test");
const mongoose = require("mongoose");
const supertest = require("supertest");
const assert = require("node:assert");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const { initialBlogs, blogsInDb, usersInDb } = require("./test_helper");
const app = require("../app");
const api = supertest(app);

const Blog = require("../models/blog");

describe("when there are some blogs saved initially", () => {
  beforeEach(async () => {
    await Blog.deleteMany({});
    await Blog.insertMany(initialBlogs);
  });

  test("blogs are returned as json", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("id is named id", async () => {
    const response = await api.get("/api/blogs");

    response.body.forEach((blog) => {
      assert.ok(blog.id, "Expected blog to have an 'id' property");
      assert.strictEqual(
        blog._id,
        undefined,
        "Expected blog not to have an '_id' property"
      );
    });
  });

  test("the number of likes for a blog post can be updated", async () => {
    const blogsAtStart = await blogsInDb();
    const blogToUpdate = blogsAtStart[0];

    const updatedData = {
      likes: blogToUpdate.likes + 1,
    };

    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedData)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    assert.strictEqual(response.body.likes, updatedData.likes);
  });

  describe("addition of a new blog", () => {
    test("succeeds with valid data", async () => {
      const newBlog = {
        title: "test title",
        author: "unknown author",
        url: "noaccess.com",
        likes: 60,
      };

      await api
        .post("/api/blogs")
        .send(newBlog)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      const blogsAtEnd = await blogsInDb();
      assert.strictEqual(blogsAtEnd.length, initialBlogs.length + 1);

      const titles = blogsAtEnd.map((b) => b.title);
      assert(titles.includes("test title"));
    });

    test("if 'likes' property is missing, it defaults to 0", async () => {
      const newBlog = {
        title: "hey man",
        author: "sauli",
        url: "heyhey.com",
      };

      const resultBlog = await api
        .post("/api/blogs")
        .send(newBlog)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      const blogsAtEnd = await blogsInDb();
      assert.strictEqual(blogsAtEnd.length, initialBlogs.length + 1);
      assert.strictEqual(resultBlog.body.likes, 0);
    });

    test("fails with status code 400 if URL or title is missing", async () => {
      const newBlog = {
        title: "hey man",
        author: "sauli",
      };

      await api.post("/api/blogs").send(newBlog).expect(400);

      const blogsAtEnd = await blogsInDb();

      assert.strictEqual(blogsAtEnd.length, initialBlogs.length);
    });
  });

  describe("deletion of a blog", () => {
    test("succeeds with status code 204 if id is valid", async () => {
      const blogsAtStart = await blogsInDb();
      const blogToDelete = blogsAtStart[0];

      await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

      const blogsAtEnd = await blogsInDb();

      assert.strictEqual(blogsAtEnd.length, initialBlogs.length - 1);

      const titles = blogsAtEnd.map((b) => b.title);
      assert(!titles.includes(blogToDelete.title));
    });
  });
});

after(async () => {
  await mongoose.connection.close();
});
