const fs = require("fs");
const connection = require("./mysql");

class CricDB {
	constructor(db) {
		this.db = db;
		this.cricData = new Array();
		this.matchDir = "./matches/";
		this.fileNames = fs.readdirSync(this.matchDir);

		for (const file of this.fileNames) {
			let match = this.getMatch(file);
			this.addPlayers(match).then(() => {
				this.addTeams(match).then(() => {
					this.addMatch(match).then(() => {
						this.getMatchId(match).then((matchId) => {
							this.addDeliveries(match, matchId);
							console.log("Match " + matchId + " loaded." );
						});
					});
				});
			});
		}
		return true;
	}

	getMatch(filename) { 
		let matchData = fs.readFileSync(this.matchDir + filename);
		let match = JSON.parse(matchData);
		return match;
	}

	addPlayers(match) {
		return new Promise((resolve, reject) => {
			// Get the players node, and splice together the two teams as a single array.
			let teams = match.info.players;
			let players = teams[Object.keys(teams)[0]]; // Get Team A
			players = players.concat(teams[Object.keys(teams)[1]]); // Merge with Team B

			// Create an array of arrays, each with a single player
			let queryValues = new Array();
			for (const player of players) {
				let tempArray = [player];
				queryValues.push(tempArray);
			}

			let query = "INSERT IGNORE INTO player (name) VALUES ?";
			this.db.query(query, [queryValues], function (err) {
				if (err) reject(err);
				resolve(players);
			});
		});
	}

	addTeams(match) {
		return new Promise((resolve, reject) => {
			let teams = match.info.teams;

			let queryValues = new Array();
			for (const team of teams) {
				let tempArray = [team];
				queryValues.push(tempArray);
			}

			let query = "INSERT IGNORE INTO team (country_name) VALUES ?";
			this.db.query(query, [queryValues], function (err) {
				if (err) reject(err);
				resolve([match.info.teams[0], match.info.teams[1]]);
			});
		});
	}

	addMatch(match) {
		return new Promise((resolve, reject) => {
			let date = match.info.dates[0];
			let team_a = match.info.teams[0];
			let team_b = match.info.teams[1];
			let winner =
				"winner" in match.info.outcome
					? match.info.outcome.winner
					: null;

			// Construct the match outcome, e.g. "Australia won by 197 runs"
			let won_by = new String();
			let outcome = new String();

			if ("result" in match.info.outcome) {
				outcome = match.info.outcome.result;
			} else if (
				"method" in match.info.outcome &&
				"winner" in match.info.outcome
			) {
				outcome = `${match.info.outcome.winner} won, ${match.info.outcome.method}`;
			} else {
				won_by =
					"runs" in match.info.outcome.by
						? `${match.info.outcome.by.runs} runs`
						: `${match.info.outcome.by.wickets} wickets`;
				outcome = `${match.info.outcome.winner} won by ${won_by}`;
			}

			let matchRow = [team_a, team_b, date, winner, outcome];

			let query =
				"INSERT IGNORE INTO `match` (team_A, team_B, date, winner, outcome) VALUES ?";
			this.db.query(query, [[matchRow]], function (err) {
				if (err) reject(err);
				resolve(matchRow);
			});
		});
	}

	getMatchId(match) {
		return new Promise((resolve, reject) => {
			let date = match.info.dates[0];
			let team_a = match.info.teams[0];
			let team_b = match.info.teams[1];
			let matchKey = [team_a, team_b, date];
			let query =
				"SELECT * FROM `match` WHERE team_A=? AND team_B=? AND date=?";
			this.db.query(query, matchKey, (err, result) => {
				if (err) {
					console.log(err);
					reject(err);
				}
				resolve(result[0].match_id);
			});
		});
	}

	getDelivery(matchId, match, innings, over, delivery) {
		return [
			matchId,
			innings + 1,
			over,
			delivery + 1,
			match.innings[innings].overs[over].deliveries[delivery].runs.batter,
			match.innings[innings].overs[over].deliveries[delivery].runs.extras,
			match.innings[innings].overs[over].deliveries[delivery].batter,
			match.innings[innings].overs[over].deliveries[delivery].bowler,
			match.innings[innings].overs[over].deliveries[delivery].non_striker,
		];
	}

	addDeliveries(match, matchId) {
		return new Promise((resolve, reject) => {
			let deliveries = new Array();
			let wickets = new Array();
			for (let i = 0; i < match.innings.length; i++) {
				for (let o = 0; o < match.innings[i].overs.length; o++) {
					for (
						let b = 0;
						b < match.innings[i].overs[o].deliveries.length;
						b++
					) {
						deliveries.push(
							this.getDelivery(matchId, match, i, o, b)
						);
						if (
							match.innings[i].overs[o].deliveries[b].wickets ===
							undefined
						) {
							continue;
						} else {
							wickets.push(
								this.getWicket(
									matchId,
									match.innings[i].overs[o].deliveries[b]
										.wickets[0],
									i,
									o,
									b
								)
							);
						}
					}
				}
			}

			let queryDeliveries =
				"INSERT IGNORE INTO `delivery` (`match_id`, `innings`, `over`, `ball`, `runs`, `extras`, `batter`, `bowler`, `nonstriker`) VALUES ?";
			this.db.query(queryDeliveries, [deliveries], (err) => {
				if (err) reject(err);

				let queryWickets =
					"INSERT IGNORE INTO `wicket` (`playerout`,`fielder`,`kind`, `match_id`, `innings`, `over`, `ball`) VALUES ?";
				this.db.query(queryWickets, [wickets], (err) => {
					if (err) reject(err);
				});

				resolve(deliveries);
			});
		});
	}

	getWicket(matchId, wicketData, innings, over, delivery) {
		let fielder =
			wicketData.fielders !== undefined
				? wicketData.fielders[0].name
				: "";
		return [
			wicketData.player_out,
			fielder,
			wicketData.kind,
			matchId,
			innings + 1,
			over,
			delivery + 1,
		];
	}
}

new CricDB(connection);

module.exports = CricDB;
