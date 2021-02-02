module.exports = (error, req, res, next) => {
  let statusCode;
  console.log(error);
  res.statusCode != 200 ? statusCode = res.statusCode : statusCode = 500;
  res.status(statusCode).json({
    OPStatus: {
      StatusCode: 'S_S_API_EX_F',
      Status: 'Server execution failed',
      Description: 'Failure while processing in API',
      StatusType: 'F',
      Message: error.message
    },
    data: error.data
  }).end();
}