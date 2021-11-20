const db = require("../db");
const { DataTypes } = require("sequelize");
const OwnerInfo = db.define("adopted_pet", {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	ownerName: { type: DataTypes.STRING, allowNull: false, field: "name" },
	email: {
		type: DataTypes.STRING,
		allowNull: false,
		validate: {
			isEmail: true,
		},
	},
	petName: { type: DataTypes.STRING, allowNull: false, field: "pet" },
	species: { type: DataTypes.STRING, allowNull: false },
});

(async () => {
	await OwnerInfo.sync({ force: true });
})();

module.exports = OwnerInfo;
