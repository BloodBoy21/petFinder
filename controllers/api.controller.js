const { Pet, AdoptPet, AdoptedPet } = require("../models/index.js");
const { POSTGRES_DB } = require("../config/index");
const { regexFilter } = require("../helpers/index");

exports.getAll = async (req, res) => {
	try {
		let data = await Pet.all();
		res.json(data);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};
exports.getBySpecies = async (req, res) => {
	try {
		if (!req.params.type) throw new Error("Please select a pet type.");
		const type = regexFilter.onlyChars(req.params.type).toLowerCase();
		let data = await new Pet().getBySpecies(type);
		res.json(data);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};
//TODO create a model for the availables pets
exports.getAvailables = async (req, res) => {
	try {
		let data;
		if (req.query.type) {
			const type = regexFilter.onlyChars(req.query.type);
			data = await new AdoptPet().joinToModel(Pet, { id: undefined, species: `'${type}'` });
		} else {
			data = await new AdoptPet().joinToModel(Pet, { id: undefined });
		}
		res.json(data);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};
exports.addPet = async (req, res) => {
	try {
		const pet = (await new Pet(req.pet).save())[0];
		const adoptInfo = { id: pet.id, name: pet.name, species: pet.species };
		await new AdoptPet(adoptInfo).save();
		res.sendStatus(200);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};
//TODO create a model for adopted pets
exports.adoptPet = async (req, res) => {
	try {
		if (!req.params.id) throw new Error("Please select a pet.");
		const id = parseInt(regexFilter.onlyNumbers(req.params.id));
		if (!(await AdoptPet.checkIfExists(id))) throw new Error("This pet is already adopted.");
		const petData = await AdoptPet.find(id);
		const owner = regexFilter.onlyChars(req.pet.owner);
		const owner_email = regexFilter.onlyEmail(req.pet.email);
		const ownerData = { owner, owner_email, date: new Date().getDate() };
		Object.assign(petData, ownerData);
		await new Pet().update({ is_adopted: "true" }, id);
		await new AdoptPet().wasAdopted(id);
		await new AdoptedPet(petData).save();
		res.status(200).json({ message: "Pet adopted successfully." });
	} catch (err) {
		res.status(404).json({ message: err.message });
	}
};
