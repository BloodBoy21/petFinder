const Model = require("./model");
class Pet extends Model {
	constructor(data = {}) {
		super(data, "pets");
	}
	getBySpecies(species) {
		return this.DB.get(this.table, `lower(species)='${species}'`);
	}
}

module.exports = Pet;
