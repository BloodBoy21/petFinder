const dataBase = require("./db.model");
class Model {
	#table;
	constructor(data) {
		this.DB = new dataBase();
		this._data = data;
		this._id = null;
	}
	async save() {
		const data = await this.DB.insert(this.table, this._data);
		this._id = await data[0].id;
		return data;
	}
	async update(data) {
		if (!this.id) throw new modelError("Model could not be updated because is not saved");
		return this.DB.updateByID(this.table, data, this.id);
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
	static find(id) {
		const model = new this();
		return model.DB.getByID(model.#table, id);
	}
}
module.exports = Model;
