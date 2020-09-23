const { MongoClient } = require("mongodb");
const { DB_USER, DB_PASSWD, DB_PORT, DB_HOST, DB_NAME } = process.env;

const mongoURL = DB_HOST === 'mongo' ? `mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}` : `mongodb+srv://${DB_USER}:${DB_PASSWD}@${DB_HOST}/${DB_NAME}?retryWrites=true&w=majority`;
let connection;
const connectDB = async () => {
  if (connection) return connection;
  try {
    const client = await MongoClient.connect(mongoURL, {
      useUnifiedTopology: true,
    });
    connection = client.db(DB_NAME);
  } catch (error) {
    console.error(`Error al conenctar DB: ${mongoURL}`, error);
    process.exit(1);
  }
  return connection;
};

module.exports = connectDB;
