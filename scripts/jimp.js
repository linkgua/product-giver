//DEBUG=app:* node scripts/jimp.js
const jimp = require('jimp')
const { config: { IMAGE_URL } } = require('../config')
const fs = require('fs')
const out = fs.createWriteStream("./logs/images.log");
const consoleFile = new console.Console(out);
const connectDB = require("../lib/db");


const saveImageOfProducts = async () => {
  const db = await connectDB();
  const products = await db.collection("products").find({}).toArray()
  console.log(`${products.length} products`)
  products.map(async (prod) => {
    consoleFile.log(`${prod.id} checked`)
    if (!prod.image) {
      try {
        await saveImage(prod.originalImage, prod._id)
        prod.image = `${IMAGE_URL}${prod._id}`
        db.collection("products").findOneAndUpdate({ sku: prod.sku }, { $set: prod })
        return prod
      }
      catch (error) {
        console.error(error)
      }
    }
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
      console.error(error)
    }
  }
}

saveImageOfProducts()