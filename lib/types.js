const connectDB = require("./db");
const { ObjectID } = require("mongodb");
const errorHandler = require("./errorHandler");

module.exports = {
  Store: {
    products: async ({ products }) => {
      try {
        const db = await connectDB();
        const ids = products ? products.map((id) => ObjectID(id)) : [];
        const productsData = ids.length
          ? await db
              .collection("products")
              .find({ _id: { $in: ids } })
              .toArray()
          : [];
        return productsData;
      } catch (error) {
        errorHandler(error);
      }
    },
  },
};
