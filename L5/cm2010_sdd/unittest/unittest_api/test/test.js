var chai = require("chai");
var chaiHttp = require("chai-http");
var assert =  require("chai").assert
var app = "http://localhost:3000";

chai.use(chaiHttp);

// Set 1: Retrieval of Spells
describe("Retrieve spells", () => {
	// The /spells route should be reached successfully
	describe("Get everything at /spells", () => {
		it("should return successfully", (done) => {
			chai.request(app)
				.get("/spells")
				.end((err, res) => {
					assert.equal(res.status, 200);
					done();
				});
		});
	});

	// It should return an array of objects, each with at least 4 keys
	describe("Ensure spells are spells with correct length", () => {
		it("should return spells with proper length", (done) => {
			chai.request(app)
				.get("/spells")
				.end((err, res) => {
					assert.typeOf(res.body, 'array');
					assert.isAtLeast(res.body.length, 1);
					for (var i = 0; i < res.body.length; i++) {
						assert.lengthOf(Object.keys(res.body[i]), 4);
					}
					done();
				});
		});
	});

	// It should return the spell that was requested
	describe("Get a specific spell", () => {
		// Configure a specific spell to test for
		let testId = 1001;
		it("should return the correct spell that was requested", (done) => {
			chai.request(app)
				.get("/spells/" + testId)
				.end((err, res) => {
					assert.equal(res.body.id, testId);
					done();
				});
		});
	});
});

// Set 2: Updating Spells
describe("Updating Spells", () => {
	// A PUT request can successfully be placed
	describe("Send an update request successfully", () => {
		let testId = 1003;
		it("should place an update request", (done) => {
			chai.request("http://localhost:3000")
				.put("/spells/" + testId)
				.end((err, res) => {
					assert.equal(res.status, 200);
					done();
				});
		});
	});

	describe("Update the name of a spell", () => {
		let testId = 1003;
		let newName = "Hackus maximus";
		it("should update a single attribute of a spell", (done) => {
			chai.request("http://localhost:3000")
				.put("/spells/" + testId)
				.send({ name: newName })
				.end((err, res) => {
					assert.equal(res.body.name, newName);
					done();
				});
		});
	});

	describe("Update multiple fields of a spell", () => {
		let testId = 1003;
		let updatedName = "Hackus maximus";
		let updatedIngredients = [
			{ name: "Stroustrup hair" },
			{ name: "Uncle Bob sweat" },
		];
		let updatedResult = "Clean coding";
		let updatedSpell = {
			id: testId,
			name: updatedName,
			ingredients: updatedIngredients,
			result: updatedResult,
		};
		it("should update multiple fields of a spell", (done) => {
			chai.request("http://localhost:3000")
				.put("/spells/" + testId)
				.send(updatedSpell)
				.end((err, res) => {
					assert.equal(
						JSON.stringify(res.body),
						JSON.stringify(updatedSpell)
					);
					done();
				});
		});
	});
});

// Set 3: Adding spells
describe("Add a new spell", () => {
	// Adding a new dummy spell
	describe("Add a basic spell with an ID", () => {
		let newId = 1004;
		it("should add a spell with an ID", (done) => {
			chai.request("http://localhost:3000")
				.post("/spells/")
				.send({ id: newId })
				.end((err, res) => {
					assert.equal(res.status, 200);
					assert.equal(res.body.id, newId);
					done();
				});
		});
	});

	// Add a spell with all fields
	describe("Add a spell with the right number of fields", () => {
		let newSpell = {
			id: 1005,
			name: "Wingardium Leviosa",
			ingredients: [{ name: "Bird blood" }, { name: "Feather essence" }],
			result: "Dream of Flight",
		};
		it("should add all fields to the spell correctly", (done) => {
			chai.request("http://localhost:3000")
				.post("/spells/")
				.send(newSpell)
				.end((err, res) => {
					assert.equal(
						JSON.stringify(res.body),
						JSON.stringify(newSpell)
					);
					assert.equal(Object.keys(res.body).length, 4);
					done();
				});
		});
	});

	// Handle duplicates
	describe("Attempt to add a duplicate spell", () => {
		// Create a duplicate spell object
		let newSpell = {
			id: 1001,
			name: "Rabbit foot positivity",
			ingredients: [
				{ name: "Foot of rabbit" },
				{ name: "Juice of beetle" },
			],
			result: "Good luck",
		};
		it("should return spells with unique IDs", (done) => {
			// Attempt to create the spell
			chai.request("http://localhost:3000")
				.post("/spells/")
				.send(newSpell)
				.end(() => {
					// Get all spells
					chai.request("http://localhost:3000")
						.get("/spells/")
						.end((err, res) => {
							// Cast the list of spells as a set to get unique spells
							let spellIds = res.body.map(x => x.id);
							let spellSet = new Set(spellIds);
							assert.equal(spellSet.size, res.body.length);
							done();
						});
				});
		});
	});
});
