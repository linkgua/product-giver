"use strict";
const fs = require('fs')
const err = fs.createWriteStream("./logs/err.log");
const out = fs.createWriteStream("./logs/out.log");
const consoleFile = new console.Console(out, err);
const errorHandler = (error) => {
  consoleFile.error(error);
  console.log(error)
  throw new Error("Fallo en la operación del servidor");
};

const logHandler = (log) => {
  consoleFile.log(log)
}

module.exports = { errorHandler, logHandler };
