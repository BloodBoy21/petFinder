const sqlite3 = require("sqlite3").verbose();

class Database {
	constructor(dbName) {
		this.dbPath = dbName;
		this.db = new sqlite3.Database(dbName);
	}
	createTable(tableName, tableFields) {
		return new Promise((resolve, reject) => {
			this.db.run(`CREATE TABLE IF NOT EXISTS ${tableName} (${tableFields})`, (err) => {
				if (err) reject(err);
				resolve();
			});
		});
	}
	selectAll(tableName) {
		return new Promise((resolve, reject) => {
			this.db.all(`SELECT * FROM ${tableName}`, (err, rows) => {
				if (err) reject(err);
				resolve(rows);
			});
		});
	}
	select(tableName, tableFields, tableValues) {
		return new Promise((resolve, reject) => {
			this.db.all(
				`SELECT * FROM ${tableName} WHERE ${tableFields} = ${tableValues}`,
				(err, rows) => {
					if (err) reject(err);
					resolve(rows);
				}
			);
		});
	}
	selectOne(tableName, tableFields, tableValues) {
		return new Promise((resolve, reject) => {
			this.select(tableName, tableFields, tableValues)
				.then((rows) => {
					if (rows.length > 0) {
						resolve(rows[0]);
					} else {
						reject("No rows found");
					}
				})
				.catch((err) => {
					reject(err);
				});
		});
	}
	deleteRow(tableName, tableFields, tableValues) {
		return new Promise((resolve, reject) => {
			this.db.run(`DELETE FROM ${tableName} WHERE ${tableFields} = ${tableValues}`, (err) => {
				if (err) reject(err);
				resolve();
			});
		});
	}
	updateRow(tableName, tableFields, select) {
		return new Promise((resolve, reject) => {
			this.db.run(`UPDATE ${tableName} SET ${tableFields} WHERE ${select}`, (err) => {
				if (err) reject(err);
				resolve();
			});
		});
	}
	insertMany(tableName, tableFields, tableValues) {
		return new Promise((resolve, reject) => {
			let values = tableValues.map(() => "?").join(",");
			this.db.run(
				`INSERT INTO ${tableName} (${tableFields}) VALUES (${values})`,
				tableValues,
				function (err) {
					if (err) reject(err);
					resolve(this.lastID);
				}
			);
		});
	}
	close() {
		this.db.close();
	}
	customSelect(query) {
		return new Promise((resolve, reject) => {
			this.db.all(query, function (err, rows) {
				if (err) reject(err);
				resolve(rows);
			});
		});
	}
}

module.exports = Database;
