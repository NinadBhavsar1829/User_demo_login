const mongoCrud = require('../../utils/mongoCrudCommon');

module.exports.aggregateReadAllMongo = async ({ collection, pipeLine }) => {
    return await mongoCrud.aggregate({ collection, pipeLine });
}

module.exports.findMongo = async ({ collection, Query, projectionObj, options }) => {
    const extraOptions = options ? Object.assign(options) : {};
    return await mongoCrud.find({ collection, Query, projectionObj, extraOptions });
}

module.exports.InsertOne = async ({ collection, requiredJSON, session }) => {
    const extraOptions = session ? { session } : null;
    return await mongoCrud.createOne(requiredJSON, collection, extraOptions);
}