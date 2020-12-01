const { MongoClient } = require("mongodb");
const { config } = require("../config")

const mongoURL = config.DB_HOST === 'mongo' || config.DB_HOST === 'dev-mongo' ? `mongodb://${config.DB_HOST}:${config.DB_PORT}/${config.DB_NAME}` : `mongodb+srv://${config.DB_USER}:${config.DB_PASSWD}@${config.DB_HOST}/${config.DB_NAME}?retryWrites=true&w=majority`;
let connection;
const connectDB = async () => {
  if (connection) return connection;
  try {
    const client = await MongoClient.connect(mongoURL, {
      useUnifiedTopology: true,
    });
    connection = client.db(config.DB_NAME);
  } catch (error) {
    console.error(`Error al conenctar DB: ${mongoURL}`, error);
    process.exit(1);
  }
  return connection;
};

module.exports = connectDB;
