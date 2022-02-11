const connectDB = require("./db");
const { ObjectId } = require("mongodb");
const { errorHandler } = require("./errorHandler");
const saveImageOfProducts = require('../scripts/jimp');


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
        .findOneAndUpdate({ _id: ObjectId(id) }, { $set: input });
      return store.value;
    } catch (error) {
      errorHandler(error);
    }
  },
  deletedStore: async (root, { id }) => {
    try {
      const db = await connectDB();
      await db.collection("stores").deleteOne({ _id: ObjectId(id) });
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
  createMultipleProducts: async (root, { input }) => {
    try {
      const db = await connectDB();
      let productsPromise = input.map(async newProduct => {
        const product = await db.collection("products").findOneAndUpdate({ sku: newProduct.sku }, { $set: newProduct }, { upsert: true, returnOriginal: false });
        return product.value ? product.value._id : product.lastErrorObject.upserted
      })
      let response = await Promise.all(productsPromise).then(response => response)
      await saveImageOfProducts();
      return response;
    } catch (error) {
      errorHandler(error);
    }
  },
  editProduct: async (root, { id, input }) => {
    try {
      const db = await connectDB();
      const product = await db
        .collection("products")
        .findOneAndUpdate({ _id: ObjectId(id) }, { $set: input });
      return product.value;
    } catch (error) {
      errorHandler(error);
    }
  },
  editMultipleProducts: async (root, { ids, inputs }) => {
    try {
      const db = await connectDB();
      let productsPromise = ids.map(async (id, index) => {
        const product = await db
          .collection("products")
          .findOneAndUpdate({ _id: ObjectId(id) }, { $set: inputs[index] });
        return product.value;
      });
      return await Promise.all(productsPromise).then(response => response)
    } catch (error) {
      errorHandler(error);
    }
  },
  editProductByKeyword: async (root, { keyword, input }) => {
    try {
      const db = await connectDB();
      const products = await db
        .collection("products")
        .aggregate([{
          $match: {
            $text: { $search: `"${keyword}"` }
          }
        }]).toArray()
      const productsNew = products.map(async (prod) => {
        const { _id: prodId, ...info } = prod
        await db.collection("products").updateOne({ _id: prodId }, { $set: { ...info, ...input } })
      })
      return await Promise.all(productsNew);
    } catch (error) {
      errorHandler(error);
    }
  },
  deletedProduct: async (root, { id }) => {
    try {
      const db = await connectDB();
      await db
        .collection("products")
        .deleteOne({ _id: ObjectId(id) });
      return true;
    } catch (error) {
      errorHandler(error);
    }
  },
  addStoreToProduct: async (root, { prodId, storeId }) => {
    try {
      const db = await connectDB();
      const store = await db
        .collection("stores")
        .findOne({ _id: ObjectId(storeId) });
      const prod = await db
        .collection("products")
        .findOne({ _id: ObjectId(prodId) });
      if (!store || !prod) throw new Error("Store or product not found");
      await db
        .collection("products")
        .updateOne(
          { _id: ObjectId(prodId) },
          { $addToSet: { stores: storeId } }
        );
      return store;
    } catch (error) {
      errorHandler(error);
    }
  },

  addStoreToProductMultiple: async (root, { prodIdArray, storeIdArray }) => {
    try {
      const db = await connectDB();
      const storesPromise = storeIdArray.map(async store => {
        return await db
        .collection("stores")
        .findOne({ _id: ObjectId(store) });
      });
      const stores = await Promise.all(storesPromise).then(response => response);
      const prodsPromise = prodIdArray.map(async prod => {
        return await db
        .collection("products")
        .findOne({ _id: ObjectId(prod) });
      })
      const prods = await Promise.all(prodsPromise).then(response => response);

      if (!stores.length || !prods.length) throw new Error("Stores or products not found");
      
      const storesAndProds = prodIdArray.map((prod, index) => [prod, storeIdArray[index]]);
      const storesAndProdsPromise = storesAndProds.map(async storeAndProd => {
        return await db
          .collection("products")
          .updateOne(
            { _id: ObjectId(storeAndProd[0]) },
            { $addToSet: { stores: storeAndProd[1] } }
          );
      });
      await Promise.all(storesAndProdsPromise).then(response => response)
      return true;
    } catch (error) {
      errorHandler(error);
    }
  },
};
