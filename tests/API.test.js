const http = require("http");
const request = require("request");
describe("API", () => {
	describe("GET /api/pet/all", () => {
		it("should return a list of pets", (done) => {
			http
				.get("http://localhost:3000/api/pet/all", (res) => {
					res.on("data", (data) => {
						const pets = JSON.parse(data);
						expect(pets).toBeInstanceOf(Array);
						done();
					});
				})
				.on("error", (err) => {
					console.log("Error: " + err.message);
				});
		});
	});
	describe("GET /api/pet/:id", () => {
		it("should return a pet", (done) => {
			http
				.get("http://localhost:3000/api/pet/1", (res) => {
					res.on("data", (data) => {
						const pet = JSON.parse(data);
						expect(pet).toBeInstanceOf(Object);
						done();
					});
				})
				.on("error", (err) => {
					console.log("Error: " + err.message);
				});
		});
	});
	describe("POST /api/pet/add", () => {
		it("should add a pet", (done) => {
			const pet = {
				name: "Luna",
				species: "Cat",
				gender: "Female",
				age: 1,
				location: "New York",
			};
			const options = {
				url: "http://localhost:3000/api/pet",
				json: true,
				body: { data: pet },
			};
			request.post(options, (err, res, body) => {
				if (err) {
					return console.log(err);
				}
				expect(res.statusCode).toBe(200);
				expect(body.data.name).toBe(pet.name);
				done();
			});
		});
	});
	describe("Get /api/pet/adopt?species=", () => {
		it("should return a list of available pets by species", (done) => {
			http
				.get("http://localhost:3000/api/pet/adopt?species=Cat", (res) => {
					res.on("data", (data) => {
						const pets = JSON.parse(data);
						expect(pets).toBeInstanceOf(Array);
						done();
					});
				})
				.on("error", (err) => {
					console.log("Error: " + err.message);
				});
		});
	});
	describe("Post /api/pet/adopt/", () => {
		it("should adopt a pet", (done) => {
			const pet = {
				name: "Luna",
				species: "Cat",
				age: 1,
				location: "New York",
				gender: "Female",
			};
			Owner = {
				owner: "Alan",
				email: "death1027@outlook.com",
			};
			const options = {
				url: "http://localhost:3000/api/pet",
				json: true,
				body: { data: pet },
			};
			request.post(options, (err, res, body) => {
				if (err) return console.log(err);
				const petData = res.body.data;
				options.url = `http://localhost:3000/api/pet/adopt/${petData.id}`;
				options.body = { data: Owner };
				request.post(options, (err, res, body) => {
					if (err) return console.log(err);
					expect(res.statusCode).toBe(200);
					done();
				});
			});
		});
	});
});
