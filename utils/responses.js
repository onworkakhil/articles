function standardApiResponse(res, statusCode, data = null, message = '', error = null) {
    res.status(statusCode).json({ data, error, message });
}

module.exports = standardApiResponse;
