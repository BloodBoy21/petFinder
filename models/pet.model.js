const Model = require("./model");
class Pet extends Model {
	#table = "pets";
	constructor(data = {}) {
		super(data);
	}
	get table() {
		return this.#table;
	}
}

module.exports = Pet;
