const conn = require('../connections/mongodb');

module.exports.findAll = async (filter, collection, projectionObj) => {
  let coll = conn.getDb().collection(collection);
  if (coll) {
    return await coll.find(filter, projectionObj || {}).toArray();
  } else {
    throw new Error('Connection has been lost to Mongo.');
  }
}

exports.find = async ({ collection, Query, projectionObj, extraOptions }) => {
  let coll = conn.getDb().collection(collection);
  if (coll) {
    return await coll.find(Query, { projection: projectionObj, ...extraOptions }).toArray();
  } else {
    throw new Error('Connection has been lost to Mongo.');
  }
}

module.exports.createIndex = async (db, collection, index) => {
  let coll = db.collection(collection);
  if (coll) {
    return await coll.createIndex(...index);
  } else {
    throw new Error('Connection has been lost to Mongo.');
  }
}

module.exports.deleteCollection = async ({ collection, options }) => {
  let db = conn.getDb();
  if (db) {
    return await db.dropCollection(collection, options);
  } else {
    throw new Error('Connection has been lost to Mongo.');
  }
}

module.exports.createOne = async (data, collection, options) => {
  let coll = conn.getDb().collection(collection);
  if (coll) {
    const result = await coll.insertOne(data, options);
    return crtHandler(result);
  } else {
    throw new Error('Connection has been lost to Mongo.');
  }
}

module.exports.InsertMany = async ({ collection, requiredJSON }) => {
  let coll = conn.getDb().collection(collection);
  if (coll) {
    const result = await coll.insertMany(requiredJSON)
    return crtHandler(result);
  } else {
    throw new Error('Connection has been lost to Mongo.');
  }
}

module.exports.aggregate = async ({ collection, pipeLine }) => {
  let coll = conn.getDb().collection(collection);
  if (coll) {
    return await coll.aggregate(pipeLine).toArray();
  } else {
    throw new Error('Connection has been lost to Mongo.');
  }
}

module.exports.updateOne = async ({ collection, json, query, options }) => {
  let coll = conn.getDb().collection(collection);
  if (coll) {
    const result = await coll.updateOne(query, json, options);
    return crtHandler(result);
  } else {
    throw new Error('Connection has been lost to Mongo.');
  }
}

module.exports.documentcount = async ({ collection }) => {
  let coll = conn.getDb().collection(collection);
  if (coll) {
    return await coll.find().count();
  } else {
    throw new Error('Connection has been lost to Mongo.');
  }
}

module.exports.successHandler = {
  StatusCode: 'S_D_INS_S',
  Status: 'Insert Successful',
  Description: 'Record(s) inserted successfully',
  StatusType: 'S',
  Message: 'Record(s) inserted successfully'
}

const crtHandler = (response) => {
  var result = {};
  result.OPStatus = Object.assign({}, this.successHandler);
  return result;
};


