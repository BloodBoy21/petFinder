class DBerror extends Error {
	constructor(message) {
		super(message);
		this.name = "DBerror";
	}
	static type(correctType, param) {
		if (typeof param === correctType) {
			return true;
		}
		throw new DBerror(`${param} is not a ${correctType}`);
	}
	static isString(param) {
		return DBerror.type("string", param);
	}
	static isNumber(param) {
		return DBerror.type("number", param);
	}
	static isBoolean(param) {
		return DBerror.type("boolean", param);
	}
	static isObject(param) {
		return DBerror.type("object", param);
	}
	static isArray(param) {
		if (Array.isArray(param)) {
			return true;
		}
		throw new DBerror(`${param} is not an array`);
	}
}

class Modelerror extends Error {
	constructor(message) {
		super(message);
		this.name = "Modelerror";
	}
}

module.exports = { DBerror, Modelerror };
