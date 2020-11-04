const jimp = require('jimp')
const connectDB = require("../lib/db");
const { IMAGE_URL } = process.env

const saveImageOfProducts = async () => {
  const db = await connectDB();
  const products = await db.collection("products").find({}).toArray()
  products.map(prod => {
    if (!prod.image) {
      saveImage(prod.value.originalImage, prod.value._id)
      prod.image = `${IMAGE_URL}${prod._id}`
      db.collection("products").findOneAndUpdate({ sku: prod.sku }, { $set: prod })
    }
  })
}

const saveImage = async (url, id) => {
  if (url) {
    const path = `./thumbnails/${id}.jpg`
    const imageURL = url.match(/^\//g) ? unescape(encodeURIComponent(`http:${url}`)) : unescape(encodeURIComponent(url));
    try {
      const image = await jimp.read(imageURL);
      await image.cover(175, 200).writeAsync(path);
    } catch (error) {
      console.error(error);
      return error
    }
  }
}

module.exports = {
  saveImageOfProducts
}