const mongoClient = require('mongodb').MongoClient;
const objectID = require('mongodb').ObjectID;
const dbName = 'crudDB';
const url = 'mongodb://localhost:27017';
const mongoOptions = { useNewUrlParser: true };

const state = {
    db: null
};

const connect = (cb) => {
    console.log('Attempting connection...')
    if (state.db) {
        cb();
    } else {
        mongoClient.connect(url, mongoOptions, (err, client) => {
            if (err) {
                cb(err)
            } else {
                state.db = client.db(dbName);
                cb();
            }
        })
    }
}

const getPrimaryKey = (_id) => {
    return objectID(_id);
}

const getDB = () => {
    return state.db;
}

module.exports = { getDB, connect, getPrimaryKey };