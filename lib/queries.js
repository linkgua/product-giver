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

  getProducts: async (root, { take, skip }) => {
    try {
      const db = await connectDB();
      const products = await db.collection("products").aggregate([{
        $match: {
          image: {$exists:true}
        }
      },
      { $skip: skip ? skip : 0 },
      { $limit: take ? take : 10 },
      ]).toArray();
      return products;
    } catch (error) {
      errorHandler(error);
    }
  },

  getProductsByKeyword: async (root, { keyword, take, skip }) => {
    try {
      const db = await connectDB();
      const products = await db
        .collection("products")
        .aggregate([{
          $match: {
            $text: { $search: keyword },
            image: {$exists:true}
          }
        },
        { $skip: skip ? skip : 0 },
        { $limit: take ? take : 10 },
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
      return product;
    } catch (error) {
      errorHandler(error);
    }
  },
};
