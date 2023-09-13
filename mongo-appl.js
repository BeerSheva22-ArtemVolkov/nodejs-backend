import MongoConnection from "./domain/MongoConnection.mjs";

const mongoConnection = new MongoConnection(process.env.ATLAS_URI, 'college');
const studentsMDB = mongoConnection.getCollection('studetns');

studentsMDB.find({phone:{$regex:/^050/}}).toArray().then(data => console.log(data))