const dataBase = require("../db");
//Todo create findMany function
class Model {
	#table;
	constructor(data, table) {
		this.DB = dataBase;
		this._data = data;
		this._id = null;
		this.#table = table;
	}
	async save() {
		const data = await this.DB.insert(this.table, this.data);
		this._id = await data[0].id;
		return data;
	}
	async update(data, id = undefined) {
		if (!this.id && !id) throw new modelError("Model could not be updated because is not saved");
		return this.DB.updateByID(this.table, data, this._id || id);
	}
	async delete() {
		if (!this.id) throw new modelError("Model could not be deleted because is not saved");
		return this.DB.deleteByID(this.table, this.id);
	}
	get data() {
		return this._data;
	}
	get id() {
		return this._id;
	}
	get table() {
		return this.#table;
	}
	static async find(id) {
		const model = new this();
		const pet = await model.DB.getByID(model.table, id);
		return pet[0];
	}

	static all() {
		const model = new this();
		return model.DB.getAll(model.table);
	}
}
module.exports = Model;
