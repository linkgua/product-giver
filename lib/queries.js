const connectDB = require("./db");
const { ObjectID } = require("mongodb");
const errorHandler = require("./errorHandler");

module.exports = {
  getStores: async () => {
    try {
      const db = await connectDB();
      const store = await db.collection("stores").find().toArray();
      return store;
    } catch (error) {
      errorHandler(error);
    }
  },

  getStoresByName: async (root, { name }) => {
    try {
      const db = await connectDB();
      const stores = await db
        .collection("stores")
        .find({ name: name })
        .toArray();
      return stores;
    } catch (error) {
      errorHandler(error);
    }
  },

  getStore: async (root, { id }) => {
    try {
      const db = await connectDB();
      const stores = await db
        .collection("stores")
        .findOne({ _id: ObjectID(id) });
      return stores;
    } catch (error) {
      errorHandler(error);
    }
  },

  getProducts: async () => {
    try {
      const db = await connectDB();
      const products = await db.collection("products").find().toArray();
      return products;
    } catch (error) {
      errorHandler(error);
    }
  },

  getProductsByKeyword: async (root, { keyword, take = 10, skip = 0 }) => {
    try {
      const db = await connectDB();
      const products = await db
        .collection("products")
        .aggregate([{
          $match: {
            $text: { $search: keyword }
          }
        },
        { $skip: skip },
        { $limit: take },
        ])
        .toArray();
      return products;
    } catch (error) {
      errorHandler(error);
    }
  },

  getProduct: async (root, { id }) => {
    try {
      const db = await connectDB();
      const products = await db
        .collection("products")
        .find({ _id: ObjectID(id) })
        .toArray();
      return products;
    } catch (error) {
      errorHandler(error);
    }
  },

  getProductBySku: async (root, { sku }) => {
    try {
      const db = await connectDB();
      const product = await db.collection("products").findOne({ sku: sku });
      console.log({ product });
      return product;
    } catch (error) {
      errorHandler(error);
    }
  },
};
