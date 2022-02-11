const connectDB = require("./db");
const  ObjectID = require('mongodb').ObjectId;
const { errorHandler, logHandler } = require("./errorHandler");
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
      date = new Date().setDate(date.getDate() - date.getDay() - 23)
      logHandler({ date: new Date(date), storesIDs, take })
      const products = storesIDs ? await db.collection("products").aggregate([{
        $match: {
          originalImage: { $exists: true },
          stores: { $in: storesIDs },
          date: { $gte: new Date(date) },
        }
      },
      { $sample: { size: take } },
      ]).toArray()
        : await db.collection("products").aggregate([{
          $match: {
            originalImage: { $exists: true },
            date: { $gte: new Date(date) },
          }
        },
        { $sample: { size: take } },
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
      date = new Date().setDate(date.getDate() - date.getDay() - 180)
      logHandler({ date, keyword, storesIDs, take })
      const products = storesIDs ? await db
        .collection("products")
        .aggregate([{
          $match: {
            $text: { $search: `"${keyword}"` },
            originalImage: { $exists: true },
            stores: { $in: storesIDs },
            // date: { $gte: new Date(date) },
          }
        },
        { $sort: { score: { $meta: "textScore" } } },
        { $skip: skip ? skip : 0 },
        { $limit: take ? take : 10 },
        ])
        .toArray()
        : await db.collection("products")
          .aggregate([{
            $match: {
              $text: { $search: `"${keyword}"` },
              originalImage: { $exists: true },
              stores: { $exists: true },
              date: { $gte: new Date(date) },
            }
          },
          { $sort: { score: { $meta: "textScore" } } },
          { $skip: skip ? skip : 0 },
          { $limit: take ? take : 10 },
          ])
          .toArray()
      return products
    } catch (error) {
      console.log(error)
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

  getProductsById: async (root, { ids }) => {
    try {
      const db = await connectDB();
      const products = ids ? await db
        .collection("products")
        .find({_id: { $in: ids.map(id => ObjectID(id)) }})
        .toArray()
        : []
      return products;
    } catch (error) {
      errorHandler(error);
    }
  },
  getProductsByUrl: async (root, { urls }) => {
    try {
      const db = await connectDB();
      const products = await db.collection("products").aggregate([{
        $match: {
          originalImage: { $exists: true },
          url: { $in: urls },
        }
      },
      ]).toArray()
      console.log({products})
      return products;
    } catch (error) {
      errorHandler(error);
    }
  },
};
