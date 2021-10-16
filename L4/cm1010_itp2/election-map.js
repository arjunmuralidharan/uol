function ElectionMap() {
	// Initialize basic visualisation variables
	let self = this;
	this.name = "Switzerland 2019 Election Results";
	this.id = "election-map";
	this.loaded = false;

	// Retrieve the SVG map inserted in the index.html file
	this.swissMap = document.getElementById("swissmap");

	this.layout = {
		dataTop: 19,
		dataLeft: 30,
		dataWidth: 200,
		dataHeight: 310,
		dataMargin: 10
	};

	// Preload - gets the data from the CSV file
	this.preload = function() {
		this.data = loadTable(
			"./data/election-map/election-data.csv",
			"csv",
			"header",
			function() {
				self.loaded = true;
				self.getCantonsAndParties();
			}
		);
	};

	// Setup - show and prepare the map for interaction
	this.setup = function() {
		// Show the Swiss map
		select("#swissmap").show();

		// Once the map has loaded, add event listeners to each canton
		this.swissMap.addEventListener(
			"load",
			self.addMouseEventsToCantons,
			true
		);
	};

	// Add the Event Listeners to each canton on the map
	this.addMouseEventsToCantons = function() {
		// Extract the structure and content of the SVG Map
		let swissMapSVG = self.swissMap.contentDocument;

		for (let i = 0; i < self.cantonNames.length; i++) {
			// Get the SVG <path> NodeList for a specific canton and access
			// the first (and in this case only) node at [0]
			let canton = swissMapSVG.getElementsByName(self.cantonNames[i])[0];

			// Call the appropriate actions for mousing over or out of a canton
			canton.addEventListener("mouseover", self.fillCanton, false);
			canton.addEventListener("mouseout", self.emptyCanton, false);
		}
	};

	// Fill a canton in a color and make it the selected canton
	this.fillCanton = function(e) {
		e.target.style.fill = "#7C7C7C";
		self.selectedCanton = e.target.attributes.name.value;
	};

	// Reset the canton's fill color and the reset the selected canton
	this.emptyCanton = function(e) {
		e.target.style.fill = "#BABABA";
		self.selectedCanton = null;
	};

	// Retrieve static data about cantons, parties and their colors
	this.getCantonsAndParties = function() {
		// Get the names of all 26 cantons & remove the first row which isn't needed
		this.cantonNames = this.data.getColumn("Canton");
		this.cantonNames.shift();

		// Get party names and remove the first and last elements which are not needed
		this.parties = this.data.columns;
		this.parties.shift();
		this.parties.pop();

		// Get party colors and remove the first and last elements which are not needed
		this.partyColors = this.data.findRow("PartyColor", "Canton").arr;
		this.partyColors.pop();
		this.partyColors.shift();
	};

	// Draw the election results to the screen as we interact with the map
	this.draw = function() {
		if (!this.loaded) {
			console.log("Data not yet loaded");
			return;
		}
		// Get the election results for the currently selected canton
		this.result = this.data.findRow(this.selectedCanton, "Canton");

		// If a result is available, draw a box on screen and list the results per party
		// Draw colored bars indicating the win percentage of the vote
		if (this.result) {
			// Draw the results box
			fill(255);
			stroke(0);
			rect(
				this.layout.dataLeft,
				this.layout.dataTop,
				this.layout.dataWidth,
				this.layout.dataHeight
			);

			// Draw the name of the canton
			textAlign(LEFT, TOP);
			textSize(16);
			textStyle(BOLD);
			noStroke();
			fill(0);
			text(
				this.result.get("Canton"),
				this.layout.dataLeft + this.layout.dataMargin,
				this.layout.dataTop + this.layout.dataMargin
			);

			// For each party, draw the name and draw a colored bar with the election result
			for (let i = 0; i < this.parties.length; i++) {
				// Draw party names in a list
				fill(0);
				textAlign(LEFT, TOP);
				textSize(10);
				textStyle(NORMAL);
				text(
					this.parties[i] + ": ",
					this.layout.dataLeft + this.layout.dataMargin,
					this.layout.dataTop + 30 + this.layout.dataMargin + 15 * i
				);

				// Draw result bars
				fill(this.partyColors[i]);
				rect(
					this.layout.dataLeft + this.layout.dataMargin + 75,
					this.layout.dataTop + 30 + this.layout.dataMargin + 15 * i,
					map(this.result.get(this.parties[i]), 0, 70, 0, 100),
					10
				);

				// Draw the election results in %
				fill(0);
				textAlign(RIGHT, TOP);
				text(
					this.result.get(this.parties[i]) + "%",
					this.layout.dataLeft + this.layout.dataMargin + 70,
					this.layout.dataTop + 30 + this.layout.dataMargin + 15 * i
				);
			}
		}
	};

	// Hide the map when clicking away
	this.destroy = function() {
		select("#swissmap").hide();
	};
}
