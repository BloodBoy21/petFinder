/* eslint-disable linebreak-style */
const { Pet, AvailablePet, Owner } = require("../models/index.js");
const { regexFilter } = require("../helpers/index");
const availablePet = require("../models/availablePet.model.js");
exports.getPet = async (req, res) => {
	if (!req.params.id) throw new Error("Please select a pet.");
	const id = parseInt(regexFilter.onlyNumbers(req.params.id));
	try {
		let pet = await AvailablePet.checkIfExists(id);
		pet = await Pet.findByPk(pet.id);
		res.json(pet);
	} catch (err) {
		res.status(404).json({ message: err.message });
	}
};
exports.getAll = async (req, res) => {
	try {
		let data = await Pet.findAll();
		res.status(200).send(data);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};
exports.getBySpecies = async (req, res) => {
	try {
		if (!req.params.species) throw new Error("Please select a species.");
		const species = regexFilter.onlyChars(req.params.species).toLowerCase();
		let data = await Pet.getBySpecies(species);
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
			const species = regexFilter.onlyChars(req.query.species);
			data = await Pet.findAll({
				where: {
					species,
					adopted: false,
				},
			}); //!Return only if species is selected with first letter capitalized
		} else {
			data = await Pet.findAll({ where: { adopted: false } });
		}
		res.json(data);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};
exports.addPet = async (req, res) => {
	try {
		const pet = await new Pet(req.pet).save();
		const adoptInfo = { id: pet.id, name: pet.name, species: pet.species, location: pet.location };
		await new AvailablePet(adoptInfo).save();
		res.status(200).json({ message: "Pet added successfully.", data: pet });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};
exports.adoptPet = async (req, res) => {
	try {
		if (!req.params.id) throw new Error("Please select a pet.");
		const id = parseInt(regexFilter.onlyNumbers(req.params.id));
		let pet = await availablePet.checkIfExists(id);
		pet = await Pet.findByPk(pet.id);
		const ownerName = regexFilter.onlyChars(req.pet.owner);
		const email = regexFilter.onlyEmail(req.pet.email);
		const ownerData = {
			ownerName,
			email,
			id: pet.id,
			petName: pet.name,
			species: pet.species,
		};
		await Pet.wasAdopted(pet.id);
		await AvailablePet.adopted(pet.id);
		await new Owner(ownerData).save();
		res.status(200).json({ message: "Pet adopted successfully." });
	} catch (err) {
		res.status(404).json({ message: err.message });
	}
};
