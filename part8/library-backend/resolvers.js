const User = require("./models/user");
const { GraphQLError } = require("graphql");
const jwt = require("jsonwebtoken");
const Book = require("./models/book");
const Author = require("./models/author");
const { PubSub } = require("graphql-subscriptions");
const pubsub = new PubSub();

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allAuthors: async () => Author.find({}),
    allBooks: async (root, args) => {
      const query = {};
      if (args.author) {
        const author = await Author.findOne({ name: args.author });
        if (author) query.author = author._id;
      }
      if (args.genre) {
        query.genres = { $in: [args.genre] };
      }
      return Book.find(query).populate("author");
    },
    me: (root, args, context) => context.currentUser,
  },

  Author: {
    bookCount: async (root) => Book.countDocuments({ author: root._id }),
  },

  Mutation: {
    addBook: async (root, args, context) => {
      let author;
      const currentUser = context.currentUser;

      if (!currentUser) {
        throw new GraphQLError("not authenticated", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }

      try {
        author = await Author.findOne({ name: args.author });
        if (!author) {
          author = new Author({ name: args.author });
          await author.save();
        }
      } catch (error) {
        throw new GraphQLError("Creating author failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.author,
            errorMessage: error.message,
          },
        });
      }

      const book = new Book({ ...args, author: author._id });

      await book.save();
      const populatedBook = await book.populate("author");
      pubsub.publish("BOOK_ADDED", { bookAdded: populatedBook });
      return populatedBook;
    },

    editAuthor: async (root, args, context) => {
      const currentUser = context.currentUser;

      if (!currentUser) {
        throw new GraphQLError("not authenticated", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }

      try {
        const author = await Author.findOne({ name: args.name });
        if (!author) {
          return null;
        }
        author.born = args.setBornTo;
        await author.save();
        return author;
      } catch (error) {
        throw new GraphQLError("Editing author failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args,
            errorMessage: error.message,
          },
        });
      }
    },

    createUser: async (root, args) => {
      const user = new User({
        username: args.username,
        favoriteGenre: args.favoriteGenre,
      });

      try {
        return await user.save();
      } catch (error) {
        throw new GraphQLError("Creating the user failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args,
            errorMessage: error.message,
          },
        });
      }
    },

    login: async (root, args) => {
      const user = await User.findOne({ username: args.username });

      if (!user || args.password !== "secret") {
        throw new GraphQLError("Wrong credentials", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      };

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) };
    },
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator("BOOK_ADDED"),
    },
  },
};

module.exports = resolvers;
