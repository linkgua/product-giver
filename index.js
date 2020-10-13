require("dotenv").config();
const { makeExecutableSchema } = require("graphql-tools");
const express = require("express");
const cors = require("cors");
const { graphqlHTTP } = require("express-graphql");
const { readFileSync } = require("fs");
const { join } = require("path");
const resolvers = require("./lib/resolvers");

const app = express();
const port = process.env.port || 3000;
if (process.env.NODE_ENV === "production") {
  const allowlist = process.env.PAGES_ALLOWED.split(",");
  var corsOptionsDelegate = function (req, callback) {
    var corsOptions;
    if (allowlist.indexOf(req.header("Origin")) !== -1) {
      corsOptions = { origin: true };
    } else {
      corsOptions = { origin: false };
    }
    callback(null, corsOptions);
  };
  app.use(cors(corsOptionsDelegate));
  var allowGraphiql = false;
} else {
  app.use(cors());
  var allowGraphiql = true;
}

// definiendo el esquema
const typeDefs = readFileSync(
  join(__dirname, "lib", "schema.graphql"),
  "utf-8"
);
const schema = makeExecutableSchema({ typeDefs, resolvers });

app.use(
  "/api",
  graphqlHTTP({
    schema: schema,
    rootValue: resolvers,
    graphiql: allowGraphiql,
  })
);

app.get("/thumbnails/:id", (req, res, next) => {
  const { id } = req.params;
  path = `./thumbnails/${id}.jpg`
  res.sendFile(path, { root: '.' })
})

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}/api`);
});
