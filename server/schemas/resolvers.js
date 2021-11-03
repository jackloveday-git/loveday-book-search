// Book Search Resolvers by Jack Lovedy

// Import dependencies and files
const { User, Book } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');

// Base resolvers
const resolvers = {
    Query: {

        // Search User by username
        me: async (parent, args, context) => {

            // Check for valid user
            if (context.user) {
                const userData = await User
                    .findOne({ _id: context.user._id })
                    .select('-__v -password')
                // .populate('books')
                return userData;
            };

            // Otherwise User is not logged in
            throw new AuthenticationError('Please Login.');
        },
    },

    // Mutations
    Mutation: {

        // Login user by email and password
        login: async (parent, {
            email,
            password
        }) => {
            const user = await User
                .findOne({
                    email
                });

            // If User isnt found or null
            if (!user) {
                throw new AuthenticationError('Invalid Login');
            }

            // Next Check password if user exists
            const correctPw = await user.isCorrectPassword(password);
            if (!correctPw) {
                throw new AuthenticationError('Invalid Login'); // Dont specify pw is wrong for security
            }

            // Otherwise login must be valid, create a token, return token and user info
            const token = signToken(user);
            return { token, user };
        },

        // Add a new user
        addUser: async (parent, args) => {

            // Create the user then generate their token and return the info
            const user = await User.create(args);
            const token = signToken(user);
            return { token, user };
        },

        // Save a book for THIS user
        saveBook: async (parent, args, context) => {

            // If we have a user save the book
            if (context.user) {

                // Upload book info and attach to user
                const updatedUser = await User.findByIdAndUpdate(
                    { _id: context.user._id },
                    { $addToSet: { savedBooks: args.input } },
                    { new: true }
                );

                // Return the updated info
                return updatedUser;
            }

            // Otherwise we need a user logged in
            throw new AuthenticationError('Login required');
        },

        // Remove a book for THIS user
        removeBook: async (parent, args, context) => {

            // Check user login
            if (context.user) {

                // If valid user info, delete the book and remove from user db data
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $pull: { savedBooks: { bookId: args.bookId } } },
                    { new: true }
                );

                // Then return updated info
                return updatedUser;
            }

            // Otherwise we need a valid login
            throw new AuthenticationError('Login required');
        }
    }
};

// Export resolvers
module.exports = resolvers;