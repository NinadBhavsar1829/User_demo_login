const db = require('./mongoCrudCommon');

module.exports.createIndexesOnStartup = async ({ dbConn }) => {
    let promises = [];
    let collection = "";
    ["reg_users", "employees"].forEach((index) => {
        let indexes = [];
        collection = index;
        switch (index) {
            case 'reg_users':
                indexes.push([{ "email_id": 1 }, { unique: true }]);
                indexes.push([{ "created_at": -1 }]);
                break;
            case 'employees':
                indexes.push([{ "email_id": 1 }, { unique: true }]);
                indexes.push([{ "emp_id": 1 }, { unique: true }]);
                indexes.push([{ "created_at": -1 }]);
                indexes.push([{ "first_name": 1 }]);
                indexes.push([{ "last_name": 1 }]);
                indexes.push([{ "org_name": 1 }]);
                break;
        }
        indexes.forEach(index => {
            promises.push(db.createIndex(dbConn, collection, index));
        });
    });
    await Promise.all(promises);
}