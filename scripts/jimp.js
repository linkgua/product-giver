//DEBUG=app:* node scripts/jimp.js
const jimp = require("jimp");
const {
  config: { IMAGE_URL },
} = require("../config");
const fs = require("fs");
const out = fs.createWriteStream("./logs/images.log");
const consoleFile = new console.Console(out);
const connectDB = require("../lib/db");

const saveImageOfProducts = async () => {
  console.log("iniciando");
  const db = await connectDB();
  const products = await db
    .collection("products")
    .aggregate([{ $match: { image: { $exists: false } } }])
    .toArray();
  console.log(`${products.length} products`);
  for (let index = 0; index < products.length; index++) {
    const prod = products[index];
    console.log(prod._id);
    if (!prod.image) {
      try {
        await saveImage(prod.originalImage, prod._id);
        prod.image = `${IMAGE_URL}${prod._id}`;
        db.collection("products").findOneAndUpdate(
          { sku: prod.sku },
          { $set: prod }
        );
      } catch (error) {
        console.error(error);
      }
    }
  }
  console.log("fin");
  return true;
};

const saveImage = async (url, id) => {
  if (url) {
    const path = `./thumbnails/${id}.jpg`;
    const imageURL = url.match(/^\//g)
      ? unescape(encodeURIComponent(`http:${url}`))
      : unescape(encodeURIComponent(url));
    try {
      console.log("==", imageURL)
      const image = await jimp.read(imageURL);
      console.log(image)
      console.log("====")
      const data = image.cover(175, 200);
      console.log({data})
      await image.cover(175, 200).writeAsync(path);
      consoleFile.log(`Image save of: ${id} ${new Date()}`);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
};

module.exports = saveImageOfProducts;
