const connectDB = require("./db");
const { ObjectId } = require("mongodb");
const errorHandler = require("./errorHandler");
const { GraphQLScalarType } = require('graphql');
const { Kind } = require('graphql/language');

module.exports = {
  Product: {
    stores: async ({ stores }) => {
      try {
        const db = await connectDB();
        const ids = stores ? stores.map((id) => ObjectId(id)) : [];
        const storesData = ids.length
          ? await db
            .collection("stores")
            .find({ _id: { $in: ids } })
            .toArray() :
          [];
        return storesData;
      } catch (error) {
        errorHandler(error);
      }
    },
  },
  Date: new GraphQLScalarType({
    name: 'Date',
    description: 'Date custom scalar type',
    parseValue(value) {
      return new Date(value); // value from the client
    },
    serialize(value) {
      return value.getTime(); // value sent to the client
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return parseInt(ast.value, 10); // ast value is always in string format
      }
      return null;
    },
  }),
};
