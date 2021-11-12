const Pool = require("pg").Pool;
const format = require("pg-format");
const { errorHandler } = require("../helpers/index");
const {
	POSTGRES_DB,
	POSTGRES_HOST,
	POSTGRES_USER,
	POSTGRES_PASSWORD,
	POSTGRES_PORT,
} = require("../config/index");

class DB {
	constructor(database) {
		this.pool = new Pool({
			user: POSTGRES_USER,
			host: POSTGRES_HOST,
			database: database,
			password: POSTGRES_PASSWORD,
			port: POSTGRES_PORT,
		});
	}
	#get_data(data) {
		const keys = Object.keys(data);
		const values = Object.values(data);
		return { keys, values };
	}
	async query(text, params = []) {
		const connection = await this.pool.connect();
		errorHandler.isString(text);
		errorHandler.isArray(params);
		const res = await connection.query(text, params);
		connection.release();
		return res.rows;
	}
	get(table, id) {
		errorHandler.isString(id);
		const query = `SELECT * FROM ${table} WHERE ${id}`;
		return this.query(query);
	}
	getByID(table, id) {
		errorHandler.isNumber(id);
		const query = `SELECT * FROM ${table} WHERE id = ${id}`;
		return this.query(query);
	}
	getAll(table) {
		const query = `SELECT * FROM ${table}`;
		return this.query(query);
	}
	insert(table, data_) {
		errorHandler.isObject(data_);
		const data = this.#get_data(data_);
		const query = format(`INSERT INTO ${table} (${data.keys.join(",")}) VALUES (%L)`, data.values);
		return this.query(query);
	}
	update(table, data, id) {
		errorHandler.isObject(data);
		errorHandler.isString(id);
		const setQuery = Object.keys(data)
			.map((key) => `${key} = '${data[key]}'`)
			.join(", ");
		const query = `UPDATE ${table} SET ${setQuery} WHERE '${id}' RETURNING *`;
		return this.query(query);
	}
	updateByID(table, data, id) {
		errorHandler.isObject(data);
		errorHandler.isNumber(id);
		const setQuery = Object.keys(data)
			.map((key) => {
				let value = typeof data[key] === "string" ? `'${data[key]}'` : data[key];
				return `${key} = ${value}`;
			})
			.join(", ");
		const query = `UPDATE ${table} SET ${setQuery} WHERE id = ${id} RETURNING *`;
		return this.query(query);
	}
	delete(table, id) {
		errorHandler.isNumber(id);
		const query = `DELETE FROM ${table} WHERE ${id} RETURNING *`;
		return this.query(query);
	}
	deleteByID(table, id) {
		errorHandler.isNumber(id);
		const query = `DELETE FROM ${table} WHERE id = ${id} RETURNING *`;
		return this.query(query);
	}
	close() {
		this.pool.end();
	}
}

module.exports = DB;
