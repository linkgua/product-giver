const jimp = require('jimp')
const fs = require('fs')
const out = fs.createWriteStream("./logs/images.log");
const connectDB = require("../lib/db");
const errorHandler = require("../lib/errorHandler");
const consoleFile = new console.Console(out);
const { IMAGE_URL } = process.env

const saveImageOfProducts = async () => {
  const db = await connectDB();
  const products = await db.collection("products").find({}).toArray()
  products.map(async (prod) => {
    // if (!prod.image) {
    try {
      await saveImage(prod.originalImage, prod._id)
      prod.image = `${IMAGE_URL}${prod._id}`
      db.collection("products").findOneAndUpdate({ sku: prod.sku }, { $set: prod })
      return prod
    }
    catch (error) {
      errorHandler(error)
    }
    // }
  })
  return true
}

const saveImage = async (url, id) => {
  if (url) {
    const path = `./thumbnails/${id}.jpg`
    const imageURL = url.match(/^\//g) ? unescape(encodeURIComponent(`http:${url}`)) : unescape(encodeURIComponent(url));
    try {
      const image = await jimp.read(imageURL);
      await image.cover(175, 200).writeAsync(path);
      consoleFile.log(`Image save of: ${id} ${new Date}`)
    } catch (error) {
      consoleFile.log(error)
      return error
    }
  }
}

module.exports = {
  saveImageOfProducts
}