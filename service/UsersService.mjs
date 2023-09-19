import MongoConnection from "../domain/MongoConnection.mjs"
import config from 'config'
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken";

const MONGO_ENV_URI = 'mongodb.env_uri'; // из config/default.json
const MONGO_DB_NAME = 'mongodb.db'; // из config/default.json
const ENV_JWT_SECRET = 'jwt.env_secret'; // из config/default.json

export default class UsersService {

    #collection;

    constructor() {
        // const connection_string = "mongodb+srv://root:artem1234@cluster0.oinopsu.mongodb.net/company?retryWrites=true&w=majority";
        const connection_string = process.env[config.get(MONGO_ENV_URI)]
        const dbName = config.get(MONGO_DB_NAME)
        const connection = new MongoConnection(connection_string, dbName);
        this.#collection = connection.getCollection('accounts');
    }

    async addAccount(account) {

        const accountDB = await toAccountDB(account);
        try {
            await this.#collection.insertOne(accountDB);
        } catch (error) {
            if (error.code == 11000) {
                account = null;
            } else {
                throw error;
            }
        }

        return account;
    }

    async getAccount(username) {
        const document = await this.#collection.findOne({ _id: username });
        return document == null ? null : toAccount(document);
    }

    async login(loginData) {
        const account = await this.getAccount(loginData.username); // получили аккаунта с Хашем
        let accessToken;
        if (account && await bcrypt.compare(loginData.password, account.passwordHash)) {
            accessToken = getJwt(account.username, account.roles);
        }
        return accessToken;
    }

}

async function toAccountDB(account) {
    const passwordHash = await bcrypt.hash(account.password, 10);
    const res = {
        _id: account.username,
        passwordHash,
        roles: account.roles
    };
    return res;
}

function toAccount(accountDB) {
    const res = {
        username: accountDB._id,
        roles: accountDB.roles,
        passwordHash: accountDB.passwordHash
    }
    return res;
}

function getJwt(username, roles) {
    console.log(process.env[config.get(ENV_JWT_SECRET)]);
    return jwt.sign(
        {
            roles
        },
        process.env[config.get(ENV_JWT_SECRET)],
        {
            expiresIn: config.get('jwt.expiresIn'),
            subject: username
        }
    )
}