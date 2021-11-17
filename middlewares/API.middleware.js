const { formatChecker } = require("../helpers/index");
exports.jsonChecker = async function (req, res, next) {
	const urlPath = /\B(\/pet\/adopt\/\d+)\b/.test(req.url) ? "/pet/adopt" : req.url;
	try {
		if (!req.body.data) throw new Error("No data found");
		const formatMethod = {
			"/pet": formatChecker.addPet,
			"/pet/adopt": formatChecker.adoptPet,
		}[urlPath];
		if (!formatMethod) throw new Error("Invalid url");
		req.pet = formatMethod(req.body.data);
		next();
	} catch (err) {
		res.status(400).json({
			status: "error",
			message: err.message,
		});
	}
};
