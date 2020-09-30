const connectDB = require("./db");
const { ObjectID } = require("mongodb");
const errorHandler = require("./errorHandler");

module.exports = {
  createStore: async (root, { input }) => {
    try {
      const db = await connectDB();
      const store = await db.collection("stores").findOneAndUpdate({ name: input.name }, { $set: input }, { upsert: true, returnOriginal: false });
      return store.value
    } catch (error) {
      errorHandler(error);
    }
  },
  editStore: async (root, { id, input }) => {
    try {
      const db = await connectDB();
      const store = await db
        .collection("stores")
        .findOneAndUpdate({ _id: ObjectID(id) }, { $set: input });
      return store.value;
    } catch (error) {
      errorHandler(error);
    }
  },
  deletedStore: async (root, { id }) => {
    try {
      const db = await connectDB();
      await db.collection("stores").deleteOne({ _id: ObjectID(id) });
      return true;
    } catch (error) {
      errorHandler(error);
    }
  },
  createProduct: async (root, { input }) => {
    try {
      const db = await connectDB();
      const product = await db.collection("products").findOneAndUpdate({ sku: input.sku }, { $set: input }, { upsert: true, returnOriginal: false });
      return product.value
    } catch (error) {
      errorHandler(error);
    }
  },
  editProduct: async (root, { id, input }) => {
    try {
      const db = await connectDB();
      const product = await db
        .collection("products")
        .findOneAndUpdate({ _id: ObjectID(id) }, { $set: input });
      return product.value;
    } catch (error) {
      errorHandler(error);
    }
  },
  deletedProduct: async (root, { id }) => {
    try {
      const db = await connectDB();
      console.log(id);
      const result = await db
        .collection("products")
        .deleteOne({ _id: ObjectID(id) });
      console.log(result);
      return true;
    } catch (error) {
      errorHandler(error);
    }
  },
  addProduct: async (root, { prodId, storeId }) => {
    try {
      const db = await connectDB();
      const store = await db
        .collection("stores")
        .findOne({ _id: ObjectID(storeId) });
      const prod = await db
        .collection("stores")
        .findOne({ _id: ObjectID(storeId) });
      if (!store || !prod) throw new Error("Store or product not found");
      await db
        .collection("stores")
        .updateOne(
          { _id: ObjectID(storeId) },
          { $addToSet: { products: prodId } }
        );
      return store;
    } catch (error) {
      errorHandler(error);
    }
  },
};
