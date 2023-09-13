import { MongoClient } from "mongodb";

export default class MongoConnection {

    #db;
    #client;

    constructor(uri, dbName){
        this.#client = new MongoClient(uri);
        this.#db = this.#client.db(dbName);
    }

    getCollection(collectionName){
        return this.#db.collection(collectionName);
    }

}