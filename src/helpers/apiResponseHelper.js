

function successResponse(res, data = {}, statusCode = 200) {
    data.success = true;
    res.writeHead(statusCode, { 'Content-Type' : 'application/json' });
    return res.end(JSON.stringify(data));
}

module.exports = { successResponse };