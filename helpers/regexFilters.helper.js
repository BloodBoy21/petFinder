const onlyChars = (str) => str.replace(/[^a-zA-Z ]/g, "");
const onlyEmail = (str) => str.replace(/[^a-zA-Z0-9@.]/g, "");
const onlyNumbers = (str) => str.replace(/\D/g, "");
module.exports = {
	onlyChars,
	onlyEmail,
	onlyNumbers,
};
