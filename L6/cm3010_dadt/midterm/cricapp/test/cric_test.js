const chai = require("chai");
const chaiHttp = require("chai-http");
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
chai.use(chaiHttp);
chai.should();
// const assert = require("chai").assert;

const cricDB = require("../routes/cric");
const cric = new cricDB();

// const app = require("../app");
const db = require("../mysql");

before(function (done) {
	db.connect(() => {
		done();
	});
});

describe("#LoadData", () => {
	it("should get the data of a single match as an object", () => {
		cric.getMatch("64071").should.be.a("object");
	});
});

describe("#SingleMatch", () => {
	it("should return an array of players for a given match", () => {
		cric.addPlayers(cric.getMatch("64071"))
			.should.be.a("array")
			.that.includes("TM Dilshan")
			.and.have.lengthOf(22);
	});

	it("should return the teams of a given match", () => {
		cric.addTeams(cric.getMatch("64071")).should.eql([
			"Australia",
			"Sri Lanka",
		]);
	});

	it("should return an individual record of a match's data", () => {
		cric.addMatch(cric.getMatch("64071")).should.eql([
			"Australia",
			"Sri Lanka",
			"2004-03-08",
			"Australia",
			"Australia won by 197 runs",
		]);
	});

	it("should return an individual record of a delivery", () => {
		let match = cric.getMatch("64071");
		return cric.getMatchId(match).then((matchId) => {
			cric.getDelivery(matchId, match, 0, 0, 0).should.eql([
				1,
				1,
				0,
				1,
				0,
				0,
				"JL Langer",
				"WPUJC Vaas",
				"ML Hayden",
			]);
		});
	});

	it("should return a list of deliveries for a given match", () => {
		let match = cric.getMatch("64071");
		return cric.getMatchId(match).then((matchId) => {
			cric.addDeliveries(match, matchId).should.have.lengthOf(2420);
		});
	});

	it("should load the data for a wicket", () => {
		let match = cric.getMatch("64071");
		cric.getWicket(1, match.innings[0].overs[11].deliveries[1].wickets[0], 0, 11, 1).should.eql([
			"JL Langer",
			"KC Sangakkara",
			"caught",
			1,
			1,
			11,
			2
		]);
	});

});


after(function (done) {
	db.end(function (err) {
		if (err) {
			throw err;
		}
		done();
	});
});
