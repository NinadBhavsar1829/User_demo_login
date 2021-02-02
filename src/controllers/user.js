const userService = require('../services/user');

module.exports.registerUser = async (req, res, next) => {
    try {
        let MongoClient = await gClientInstance;
        var session = await MongoClient.startSession();
        await session.startTransaction();
        req.response.data = await userService.registerUser({ body: req.body, res, session });
        await session.commitTransaction();
        await session.endSession();
        next();
    } catch (error) {
        await session.abortTransaction();
        await session.endSession();
        next(error)
    }
}

module.exports.login = async (req, res, next) => {
    try {
        req.response.data = await userService.login({ body: req.body, res });
        next();
    } catch (error) {
        next(error)
    }
}

module.exports.getUserList = async (req, res, next) => {
    try {
        req.response.data = await userService.getUserList({ body: req.body, res });
        next();
    } catch (error) {
        next(error)
    }
}

module.exports.verifyToken = async (req, res, next) => {
    try {
        req.response.data = await userService.verifyToken({ req, res });
        next();
    } catch (error) {
        next(error)
    }
}