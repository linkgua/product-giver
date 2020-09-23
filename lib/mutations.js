const connectDB = require("./db");
const { ObjectID } = require("mongodb");
const errorHandler = require("./errorHandler");

module.exports = {
  createStore: async (root, { input }) => {
    try {
      const db = await connectDB();
      const store = await db.collection("stores").insertOne(input);
      input._id = store.insertedId;
      return input;
    } catch (error) {
      errorHandler(error);
    }
  },
  editStore: async (root, { id, input }) => {
    try {
      const db = await connectDB();
      await db
        .collection("stores")
        .updateOne({ _id: ObjectID(id) }, { $set: input });
      const store = await db
        .collection("stores")
        .findOne({ _id: ObjectID(id) });
      return store;
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
      const product = await db.collection("products").insertOne(input);
      input._id = product.insertedId;
      return input;
    } catch (error) {
      errorHandler(error);
    }
  },
  editProduct: async (root, { id, input }) => {
    try {
      const db = await connectDB();
      await db
        .collection("products")
        .updateOne({ _id: ObjectID(id) }, { $set: input });
      const product = await db
        .collection("products")
        .findOne({ _id: ObjectID(id) });
      return product;
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
