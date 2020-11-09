"use strict";
const fs = require('fs')
const err = fs.createWriteStream("./logs/err.log");
const out = fs.createWriteStream("./logs/out.log");
const consoleFile = new console.Console(out, err);
const errorHandler = (error) => {
  consoleFile.error(error);
  throw new Error("Fallo en la operación del servidor");
};

module.exports = errorHandler;
