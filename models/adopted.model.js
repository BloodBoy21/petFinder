const Model = require("./model");

class AdoptedPet extends Model {
	constructor(data = {}) {
		super(data, "adopted_pets");
	}
}
module.exports = AdoptedPet;
