const _ = require('lodash');

module.exports.getPipeLine = ({ body }) => {
    let pipeLine = [];
    if (body.search_text) {
        pipeLine.push(
            {
                $match: {
                    $or: [
                        { first_name: new RegExp(body.search_text, "i") },
                        { last_name: new RegExp(body.search_text, "i") },
                        { emp_id: new RegExp(body.search_text, "i") }
                    ]
                }
            })
    }
    pipeLine.push(
        {
            $sort: _.zipObject(body.sort_by.map(o => o === "emp_id" ? "created_at" : o), body.sort_by.map(() => 1))
        },
        {
            $skip: (body.page_no - 1) * body.records_per_page
        },
        {
            $limit: body.records_per_page
        },
        {
            $project: {
                _id: 0,
                first_name: 1,
                last_name: 1,
                email_id: 1,
                org_name: 1,
                emp_id: 1
            }
        }
    );
    return pipeLine;
}