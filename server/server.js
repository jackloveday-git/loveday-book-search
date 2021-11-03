// Modified server.js by Jack Loveday

// Import dependencies
const { ApolloServer } = require('apollo-server-express');
const { authMiddleware } = require('./utils/auth');

const express = require('express');
const path = require('path');
const db = require('./config/connection');
const routes = require('./routes');
const { typeDefs, resolvers } = require('./schemas');

const app = express();
const PORT = process.env.PORT || 3001;

// Setup the Apollo server
const aServer = new ApolloServer({

  // Pass in Schema data here later
  typeDefs, // Type Defs
  resolvers, // Db Resolvers
  context: authMiddleware
})


// Init the server
aServer.applyMiddleware({ app });

// Connect other middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

// Build html page
app.get('*', (req, res) => {
  res.sendFile(path
    .join(
      __dirname,
      '../client/build/index.html'
    ));
});

// Remove later?
app.use(routes);

// Edit server run/listen
db.once('open', () => {

  // Open up function to add needed edits
  app.listen(PORT, () => {
    console.log(`🌍 Now listening on localhost:${PORT}`);

    // Then Log GraphQL log
    console.log(`Use GraphQL at http://localhost:${PORT}${aServer.graphqlPath}`);
  });
});