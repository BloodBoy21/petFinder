const Pool = require("pg").Pool;
const format = require("pg-format");
const { errorHandler } = require("./helpers/index");
const {
	POSTGRES_DB,
	POSTGRES_HOST,
	POSTGRES_USER,
	POSTGRES_PASSWORD,
	POSTGRES_PORT,
} = require("./config/index");
const dbError = errorHandler.DBerror;
const modelError = errorHandler.Modelerror;
class Database {
	constructor(database = POSTGRES_DB) {
		if (Database.instance instanceof Database) return Database.instance;
		this.pool = new Pool({
			user: POSTGRES_USER,
			host: POSTGRES_HOST,
			database: database,
			password: POSTGRES_PASSWORD,
			port: POSTGRES_PORT,
		});
		Object.freeze(this);
		Database.instance = this;
	}
	#get_data(data) {
		const keys = Object.keys(data);
		const values = Object.values(data);
		return { keys, values };
	}
	async query(text, params = []) {
		const connection = await this.pool.connect();
		dbError.isString(text);
		dbError.isArray(params);
		const res = await connection.query(text, params);
		connection.release();
		return res.rows;
	}
	get(table, id) {
		dbError.isString(id);
		const query = `SELECT * FROM ${table} WHERE ${id}`;
		return this.query(query);
	}
	getByID(table, id) {
		dbError.isNumber(id);
		const query = `SELECT * FROM ${table} WHERE id = ${id}`;
		return this.query(query);
	}
	getAll(table) {
		const query = `SELECT * FROM ${table}`;
		return this.query(query);
	}
	insert(table, data_) {
		dbError.isObject(data_);
		const data = this.#get_data(data_);
		const query = format(
			`INSERT INTO ${table} (${data.keys.join(",")}) VALUES (%L) RETURNING *`,
			data.values
		);
		return this.query(query);
	}
	update(table, data, id) {
		dbError.isObject(data);
		dbError.isString(id);
		const setQuery = Object.keys(data)
			.map((key) => `${key} = '${data[key]}'`)
			.join(", ");
		const query = `UPDATE ${table} SET ${setQuery} WHERE '${id}' RETURNING *`;
		return this.query(query);
	}
	updateByID(table, data, id) {
		dbError.isObject(data);
		dbError.isNumber(id);
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
		dbError.isNumber(id);
		const query = `DELETE FROM ${table} WHERE ${id} RETURNING *`;
		return this.query(query);
	}
	deleteByID(table, id) {
		dbError.isNumber(id);
		const query = `DELETE FROM ${table} WHERE id = ${id} RETURNING *`;
		return this.query(query);
	}
	close() {
		this.pool.end();
	}
}
module.exports = new Database(POSTGRES_DB);
