const jimp = require('jimp')

saveImage = async (url, id) => {
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
  saveImage
}