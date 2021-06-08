const { makeExecutableSchema } = require("graphql-tools");
const express = require("express");
const { config } = require("./config");
const cors = require("cors");
const { graphqlHTTP } = require("express-graphql");
const { readFileSync } = require("fs");
const { join } = require("path");
const resolvers = require("./lib/resolvers");
const app = express();

if (!config.dev) {
  const corsOptionsDelegate = function (req, callback) {
    console.log(req.header("Origin"));
    let corsOptions = "";
    if (config.allowlist.indexOf(req.header("Origin")) !== -1) {
      corsOptions = { origin: true };
    } else {
      corsOptions = { origin: false };
    }
    callback(null, corsOptions);
  };
  app.use(cors(corsOptionsDelegate));
} else {
  app.use(cors());
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
    graphiql: config.dev,
  })
);

app.get("/thumbnails/:id", (req, res, next) => {
  const { id } = req.params;
  path = `./thumbnails/${id}.jpg`;
  res.sendFile(path, { root: "." });
});

app.listen(config.port, () => {
  console.log(`Server is listening at http://localhost:${config.port}/api`);
});
