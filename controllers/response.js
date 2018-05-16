module.exports = function(res, code, data) {
    res.setHeader('Content-Type', 'application/json');
    res.status(code).send(data)
}