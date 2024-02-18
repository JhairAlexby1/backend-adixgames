const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const server = process.env.ATLAS_URI;
const database = process.env.ATLAS_DB;

class Database {
    constructor() {
        this._connect();
    }

    _connect() {
        mongoose.connect(`${server}/${database}`)
            .then(() => {
                console.log('Database connection successful');
            })
            .catch(err => {
                console.error('Database connection error');
            });
    }
}

module.exports = new Database();