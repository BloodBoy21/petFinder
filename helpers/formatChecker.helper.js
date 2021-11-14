const propertiesInJSON = [
	"photo",
	"name",
	"species",
	"age",
	"location",
	"gender",
	"owner",
	"email",
];
const typesForEachProperty = {
	name: "string",
	species: "string",
	age: "number",
	location: "string",
	gender: "string",
	owner: "string",
	email: "string",
	photo: "string",
};
function jsonHasOwnProperty(json, keys) {
	let result = true;
	keys.forEach((key) => {
		if (!json.hasOwnProperty(key)) {
			result = false;
		}
	});
	return result;
}
function filterJSON(json, filters) {
	let result = {};
	Object.keys(json).forEach((key) => {
		if (filters.includes(key)) {
			result[key] = json[key];
		}
	});
	return result;
}
function jsonCorrectPropertyType(json) {
	let result = true;
	Object.keys(json).forEach((key) => {
		if (typesForEachProperty[key] !== typeof json[key]) {
			result = false;
		}
	});
	return result;
}
function addPet(pet) {
	const allowedProperties = propertiesInJSON.slice(0, -3);
	const requiredProperties = allowedProperties.slice(1, -1);
	if (!jsonHasOwnProperty(pet, requiredProperties)) throw new Error("Invalid format");
	pet = filterJSON(pet, allowedProperties);
	if (!jsonCorrectPropertyType(pet)) {
		throw new Error("Invalid  data type sent");
	}
	return pet; //returns the pet object with the correct format
}
//TODO adopt format method
function adoptPet(owner) {
	const allowedProperties = propertiesInJSON.slice(-2, -1);
	const requiredProperties = allowedProperties;
	if (!jsonHasOwnProperty(pet, requiredProperties)) throw new Error("Invalid format");
	owner = filterJSON(owner, allowedProperties);
	if (!jsonCorrectPropertyType(owner)) {
		throw new Error("Invalid  data type sent");
	}
	return pet; //returns the owner object with the correct format
}
module.exports = {
	addPet,
	adoptPet,
};
