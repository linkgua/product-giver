require("dotenv").config();

const config = {
  dev: process.env.NODE_ENV !== "production",
  port: process.env.port || 3000,
  allowlist: JSON.parse(process.env.PAGES_ALLOWED),
  DB_USER: process.env.DB_USER,
  DB_PASSWD: process.env.DB_PASSWD,
  DB_PORT: process.env.DB_PORT,
  DB_HOST: process.env.DB_HOST,
  DB_NAME: process.env.DB_NAME,
  IMAGE_URL: process.env.IMAGE_URL,
};

module.exports = { config };
