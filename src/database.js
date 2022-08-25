
const dbUrl = process.env.DB_URL;
const dbName = process.env.DB_NAME;

const { MongoClient } = require("mongodb")

const client = new MongoClient(dbUrl);
client.connect()

const db = client.db(dbName)

module.exports = db