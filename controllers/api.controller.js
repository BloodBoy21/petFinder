const { apiModel } = require("../models/index");
const db = new apiModel("pet_inventary.db");

exports.getAll = async (req, res) => {
	try {
		let data = await db.selectAll("PETS");
		res.json(data);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};
exports.getByType = async (req, res) => {
	try {
		if (!req.query.type) {
			throw new Error("Please select a pet type.");
		}
		let data = await db.select("PETS", "type", `"${req.params.type}"`);
		res.json(data);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};
exports.getAvailables = async (req, res) => {
	try {
		const petType = req.query.type
			? `AND lower(TO_ADOPT.type)="${req.query.type.toLowerCase()}"`
			: "";
		let data = await db.customSelect(
			`SELECT * FROM  PETS,TO_ADOPT WHERE PETS.id = TO_ADOPT.id ${petType}`
		);
		res.json(data);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};
exports.addPet = async (req, res) => {
	try {
		const petModel = { name: null, age: null, gender: null, type: null, adopted: 0, img: null };
		const queryNames = Object.keys(petModel).join(",");
		const validForm = checkJSON(
			req.body,
			Object.keys(petModel).filter((key) => key !== "adopted")
		);
		if (!validForm) throw new Error("Please fill all the fields.");
		const petData = filterData(req.body, petModel);
		const lastID = await db.insertMany("PETS", queryNames, petData);
		await db.insertMany("TO_ADOPT", "id,name,type", [lastID, petModel.name, petModel.type]);
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
		const pet = await db.selectOne("TO_ADOPT", "id", `${req.params.id}`);
		let ownerData = filterData(req.body, ownerModel);
		ownerData.push(...[pet.id, pet.name, Date.now()]);
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
