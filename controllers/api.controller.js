const { Pet, AdoptPet, AdoptedPet } = require("../models/index.js");
const { regexFilter } = require("../helpers/index");
exports.getPet = async (req, res) => {
	if (!req.params.id) throw new Error("Please select a pet.");
	const id = parseInt(regexFilter.onlyNumbers(req.params.id));
	try {
		const data = await new AdoptPet().joinToModel(Pet, { id: undefined });
		const pet = data.filter((pet) => pet.id === id)[0];
		res.json(pet);
	} catch (err) {
		res.status(404).json({ message: err.message });
	}
};
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
		if (!req.params.species) throw new Error("Please select a pet type.");
		const species = regexFilter.onlyChars(req.params.species).toLowerCase();
		let data = await new Pet().getBySpecies(species);
		res.json(data);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};
//Todo fix case where species is selected
exports.getAvailables = async (req, res) => {
	try {
		let data;
		if (req.query.species) {
			const type = regexFilter.onlyChars(req.query.species);
			data = await new AdoptPet().joinToModel(Pet, { id: undefined, species: `'${type}'` }); //!Return only if species is selected with first letter capitalized
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
