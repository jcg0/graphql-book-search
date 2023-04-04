const { AuthenticationError } = require("apollo-server-express");
const { User, Book } = require("../models");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      // console.log(context)
      if (context.user) {
        return await User.findOne({ _id: context.user._id }).populate(
          "savedBooks"
        );
      }
      throw new AuthenticationError("User not logged in");
    },
  },

  Mutation: {
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },

    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError("No user found with this email address");
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError("Incorrect password");
      }

      const token = signToken(user);

      return { token, user };
    },

    saveBook: async (
      parent,
      { authors, description, title, bookId, image, link },
      context
    ) => {
      // console.log(bookInput)
      if (context.user) {
        const user = await User.findOneAndUpdate(
          { _id: context.user._id },
          {
            $addToSet: {
              savedBooks: { authors, description, title, bookId, image, link },
            },
          },
          { new: true }
        ).populate("savedBooks");
        console.log(user.savedBooks);
        return user;
      }

      throw new AuthenticationError("You need to be logged in!");
    },
    removeBook: async (parent, { bookId }, context) => {
      if (context.user) {
        const book = await User.findOneAndUpdate(
          {
            _id: context.user._id,
          },
          {
            $pull: {
              savedBooks: { bookId },
            },
          },
          {
            new: true,
          }
        );
        console.log(book);
        return book;
      }
      throw new AuthenticationError("You need to be logged in.");
    },
  },
};

module.exports = resolvers;
