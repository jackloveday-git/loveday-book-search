// Modified server.js by Jack Loveday

// Import dependencies
const { ApolloServer } = require('apollo-server-express');
const { authMiddleware } = require('./utils/auth');

const express = require('express');
const path = require('path');
const db = require('./config/connection');
const { typeDefs, resolvers } = require('./schemas');

const app = express();
const PORT = process.env.PORT || 3001;

// Setup the Apollo server
const runServer = async () => {
  const server = new ApolloServer({

    // Pass in Schema data here later
    typeDefs, // Type Defs
    resolvers, // Db Resolvers
    context: authMiddleware
  })

  // Start the server
  await server.runServer();

  // Init the server
  server.applyMiddleware({ app });
  console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
}

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

// Edit server run/listen
db.once('open', () => {

  // Open up function to add needed edits
  app.listen(PORT, () => {
    console.log(`Now listening on localhost:${PORT}`);
  });
});

process.on('uncaughtException', function (err) {
  console.log('Caught exception: ' + err);
});