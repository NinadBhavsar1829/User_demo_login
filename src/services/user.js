const mongoRepo = require('../repositories/mongodb');
const util = require('util');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
jwt.sign = util.promisify(jwt.sign);
const _ = require('lodash');
const getUserListPipeLine = require('../utils/AggregatePipeLines/getUserList');

module.exports.registerUser = async ({ body, res, session }) => {
    // A unique index on 'email_id' has been defined so that duplicacy is avoided and find operation
    // would follow O(1) time complexity.
    const user = await mongoRepo.findMongo({
        collection: 'reg_users',
        Query: { email_id: body.email_id.toLowerCase() },
        projectionObj: { _id: 0, email_id: 1 },
        options: { limit: 1, session }
    });
    if (user.length) {
        res.statusCode = 400;
        throw new Error(`User with mail id-"${body.email_id}" already exists`);
    }
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(body.password, salt);
    // An index is created on 'created_at' field so that sorting won't occupy entire RAM 
    // in case of huge Users' records
    const lastEmpId = await mongoRepo.findMongo({
        collection: 'employees',
        Query: {},
        projectionObj: { _id: 0, emp_id: 1 },
        options: { limit: 1, sort: { created_at: -1 }, session }
    });
    let emp_id = "emp_id_1";
    if (lastEmpId[0]) {
        emp_id = /(\d+)/i.exec(lastEmpId[0].emp_id)[1];
        emp_id = `emp_id_${parseInt(emp_id) + 1}`;
    }
    const created_at = new Date();
    const userJSON = { email_id: body.email_id.toLowerCase(), password: hashedPassword, created_at };
    const employeeJSON = Object.assign({}, _.omit(body, ["password"]), { email_id: body.email_id.toLowerCase(), emp_id, created_at });
    const response = await Promise.all([
        mongoRepo.InsertOne({ collection: 'reg_users', requiredJSON: userJSON, session }),
        mongoRepo.InsertOne({ collection: 'employees', requiredJSON: employeeJSON, session })
    ]);
    return response[1];
}

module.exports.login = async ({ body, res }) => {
    const user = await mongoRepo.findMongo({
        collection: 'reg_users',
        Query: { email_id: body.email_id.toLowerCase() },
        projectionObj: { _id: 0, email_id: 1, password: 1 },
        options: { limit: 1 }
    });
    if (!user.length) {
        res.statusCode = 401;
        throw new Error('Invalid Username or Password');
    }
    const isPassValid = await bcrypt.compare(body.password, user[0].password);
    if (!isPassValid) {
        res.statusCode = 401;
        throw new Error('Invalid Username or Password');
    }
    const token = await jwt.sign({ email_id: user[0].email_id }, gConfig.token.secret, { expiresIn: '8h' });
    res.set('auth-token', token);
    return { token };
}

module.exports.getUserList = async ({ body }) => {
    const collection = 'employees';
    const pipeLine = getUserListPipeLine.getPipeLine({ body });
    const response = await mongoRepo.aggregateReadAllMongo({ collection, pipeLine });
    return response;
}

module.exports.verifyToken = async ({ req, res }) => {
    try {
        req.user = jwt.verify(req.get('auth-token'), gConfig.token.secret);
        return req.user;
    } catch (error) {
        res.statusCode = 401;
        error.message = "Invalid Token";
        throw error;
    }
}