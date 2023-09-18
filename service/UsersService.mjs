import MongoConnection from "../domain/MongoConnection.mjs";
import bcrypt from 'bcrypt';

export default class UsersService {

    #collection;

    constructor(connection_string, dbName) {
        const connection = new MongoConnection(connection_string, dbName);
        this.#collection = connection.getCollection('accounts');
    }

    async addAccount(account) {

        const accountDB = await toAccountDB(account);
        try {
            await this.#collection.insertOne(accountDB);
        } catch (error) {
            if (error.code == 11000){
                account = null;
            } else {
                throw error;
            }
        }
        
        return account;
    }

    toAccount(accountDB) {
        const res = {
            username: accountDB._id,
            roles: accountDB.roles
        }
        return res;
    }

    async getAccount(username) {
        const document = await this.#collection.findOne({_id: username});
        return document == null ? null : this.toAccount(document);
    }

}

async function toAccountDB(account){
    const passwordHash = await bcrypt.hash(account.password, 10);
    const res = {
        _id: account.username,
        passwordHash,
        roles: account.roles
    };
    return res;
}