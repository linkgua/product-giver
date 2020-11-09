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

  getProductsByStores: async (root, { storesIDs, take, skip }) => {
    try {
      const db = await connectDB();
      let date = new Date()
      date = new Date().setDate(date.getDate() - date.getDay() - 6)
      const products = storesIDs ? await db.collection("products").aggregate([{
        $match: {
          image: { $exists: true },
          stores: { $in: storesIDs },
          date: { $gte: new Date(date) }
        }
      },
      { $skip: skip ? skip : 0 },
      { $limit: take ? take : 10 },
      ]).toArray()
        : await db.collection("products").aggregate([{
          $match: {
            image: { $exists: true },
            date: { $gte: new Date(date) }
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

  getProductsByKeywordAndStore: async (root, { keyword, storesIDs, take, skip }) => {
    try {
      const db = await connectDB();
      let date = new Date()
      date = new Date().setDate(date.getDate() - date.getDay() - 6)
      const products = storesIDs ? await db
        .collection("products")
        .aggregate([{
          $match: {
            $text: { $search: keyword },
            image: { $exists: true },
            stores: { $in: storesIDs },
            date: { $gte: new Date(date) }
          }
        },
        { $skip: skip ? skip : 0 },
        { $limit: take ? take : 10 },
        ])
        .toArray()
        : await db.collection("products")
          .aggregate([{
            $match: {
              $text: { $search: keyword },
              image: { $exists: true },
              date: { $gte: new Date(date) }
            }
          },
          { $skip: skip ? skip : 0 },
          { $limit: take ? take : 10 },
          ])
          .toArray()
      return products
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
