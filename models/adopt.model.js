const Model = require("./model");
class AdoptPet extends Model {
	constructor(data = {}) {
		super(data, "available_pets");
	}
	getBySpecies(species) {
		return this.DB.query(
			`SELECT * FROM ${this.table} JOIN pets ON ${this.table} 
      .id =pets.id WHERE species = '${species}'
      `
		);
	}

	joinToModel(model, conf) {
		const model_ = new model();
		const queryParams = Object.keys(conf)
			.map((key) => {
				let value = conf[key] ?? `${model_.table}.${key}`;
				return `${this.table}.${key} = ${value}`;
			})
			.join(" AND ");
		console.log(queryParams);
		return this.DB.query(
			`SELECT * FROM ${this.table} JOIN ${model_.table} ON `.concat(queryParams)
		);
	}
	wasAdopted(id) {
		this._id = id;
		return this.delete();
	}
	static async checkIfExists(id) {
		const model = new this();
		const pet = await model.DB.getByID(model.table, id);
		if (pet.length > 0) {
			return true;
		}
		return false;
	}
}
module.exports = AdoptPet;
