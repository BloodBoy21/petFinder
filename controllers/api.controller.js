const { apiModel } = require("../models/index.js");
const { POSTGRES_DB } = require("../config/index");
const { regexFilter } = require("../helpers/index");
const db = new apiModel(POSTGRES_DB);

exports.getAll = async (req, res) => {
	try {
		let data = await db.getAll("pets");
		res.json(data);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};
exports.getByType = async (req, res) => {
	try {
		if (!req.params.type) {
			throw new Error("Please select a pet type.");
		}
		const type = regexFilter.onlyChars(req.params.type).toLowerCase();
		let data = await db.get("pets", `lower(type) = '${type}'`);
		res.json(data);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};
exports.getAvailables = async (req, res) => {
	try {
		const petType = req.query.type
			? `AND lower(TO_ADOPT.type)="${regexFilter.onlyChars(req.query.type).toLowerCase()}"`
			: "";
		let data = await db.query(
			`SELECT * FROM  PETS,TO_ADOPT WHERE PETS.id = TO_ADOPT.id ${petType}`
		);
		res.json(data);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};
exports.addPet = async (req, res) => {
	try {
		await db.insert("pets", req.pet);
		res.sendStatus(200);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};
exports.adoptPet = async (req, res) => {
	try {
		const ownerModel = { name: null, email: null };
		const isJSONvalid = checkJSON(req.body, Object.keys(ownerModel));
		if (!req.params.id) throw new Error("Please select a pet.");
		if (!isJSONvalid) throw new Error("Please fill all the fields.");

		const pet = await db.selectOne("TO_ADOPT", "id", `${regexFilter.onlyNumbers(req.params.id)}`);
		req.body.name = regexFilter.onlyChars(req.body.name);
		req.body.email = regexFilter.onlyEmail(req.body.email);

		let ownerData = filterData(req.body, ownerModel);
		ownerData.push(pet.id, pet.name, Date.now());

		await db.updateRow("PETS", "adopted=1", `id=${pet.id}`);
		await db.deleteRow("TO_ADOPT", "id", `${pet.id}`);
		await db.insertMany("ADOPTED", "owner_name,email,id,name,date", ownerData);

		res.status(200).json({ message: "Pet adopted successfully." });
	} catch (err) {
		res.status(404).json({ message: err.message });
	}
};

const checkJSON = (json, keys) => {
	const JSONdata = keys.map((key) => json[key]);
	return JSONdata.every((key) => key);
};

const filterData = (data, model) => {
	const keysAllowed = Object.keys(model);
	for (const key in data) {
		if (keysAllowed.includes(key)) {
			model[key] = data[key];
		}
	}
	return Object.values(model);
};
