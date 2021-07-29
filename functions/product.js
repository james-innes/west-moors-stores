const info = require("./info.json");

exports.handler = async ({ queryStringParameters }) => ({
	statusCode: 200,
	body: JSON.stringify(info.find(p => p.code == queryStringParameters.code)),
});
