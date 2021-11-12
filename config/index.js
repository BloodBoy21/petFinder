if (process.env.NODE_ENV !== "production") {
	require("dotenv").config();
}
module.exports = {
	PORT: process.env.PORT || 3000,
	NODE_ENV: process.env.NODE_ENV || "development",
	POSTGRES_USER: process.env.POSTGRES_USER,
	POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,
	POSTGRES_DB: process.env.POSTGRES_DB,
	POSTGRES_HOST: process.env.POSTGRES_HOST,
	POSTGRES_PORT: process.env.POSTGRES_PORT,
};
