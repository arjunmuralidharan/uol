function Covid19() {
	//////////////////////
	//// CONFIGURATION ///
	//////////////////////

	// General parameters to manage the extension
	const self = this;
	const startDate = 3; // The column index in the data where the time series starts
	this.name = 'COVID-19 Spread';
	this.id = 'covid19';
	this.loaded = false;
	this.selectedCountry = false;

	// Variable to track if navigation buttons are already on-screen
	this.buttonsCreated = false;

	// Retrieve the world map DOM node
	this.worldMap = document.getElementById('worldmap');

	// Layout parameters for the navigation widget
	this.layout = {
		top: 50,
		left: 50,
		margin: 20,
	};

	// Parameters to control the colouring of the map
	// Use "maxCases" to set the number of cases that are shown fully coloured
	this.mapColorSettings = {
		maxCases: 1500,
		minCases: 0,
		mapColorDefault: [200, 200, 200],
		mapColorFilled: [255, 0, 0],
	};

	// All settings for the navigation buttons
	this.navButtons = [
		{
			name: 'forward',
			label: 'Forward >>', // Shown on the button
			top: 70, // y-position
			left: 470, // x-position
			day: 1, // Number of days to jump (forward)
		},
		{
			name: 'back',
			label: '<< Back',
			top: 70,
			left: 360,
			day: -1,
		},
		{
			name: 'end',
			label: 'Latest Date',
			top: 130,
			left: 470,
			day: 'end', // The "end" argument moves the application to the latest available date in the data
		},
		{
			name: 'start',
			label: 'Earliest Date',
			top: 130,
			left: 360,
			day: 'start', // The "null" argument defaults to the earliest date in the available data
		},
	];

	//////////////////////
	//// APP FLOW ////////
	//////////////////////

	// Preload - gets the data from the CSV file
	this.preload = function() {
		this.data = loadTable('./data/covid19/time_series_19-covid-Confirmed.csv', 'csv', 'header', function() {
			self.loaded = true;
		});
	};

	// Setup - show the world map and initiate a function to extract the countries once it is loaded
	this.setup = function() {
		select('#worldmap').show();
		this.worldMap.addEventListener('load', self.getCountries, true);
	};

	// Draw the dynamic parts of the application to the canvas
	this.draw = function() {
		this.colorizeMap(); // Colors the countries
		this.updateButtonState(); // Manages the buttons
		this.displayDataBox(); // Displays detailed data
	};

	// Hide the map and buttons which are drawn only once
	this.destroy = function() {
		select('#worldmap').hide();
		for (let i = 0; i < this.navButtons.length; i++) {
			this[this.navButtons[i].name].hide();
		}
	};

	////////////////////////
	//// SETUP FUNCTIONS ///
	////////////////////////

	// Extracts the countries from the world map SVG
	this.getCountries = function() {
		// Because this function is executed through an event listener, we use the "self" keyword to point to "this" throughout
		self.countries = new Array();
		let worldMapSVG = self.worldMap.contentDocument;
		self.paths = worldMapSVG.getElementsByTagName('path');
		for (let i = 0; i < self.paths.length; i++) {
			self.countries.push(self.paths[i].attributes['id'].value);
		}

		self.addMouseEventsToCountries();
		self.setDay();
	};

	// Add a mouse hover effect to the world map by adding event listeners to each country element in the SVG object
	this.addMouseEventsToCountries = function() {
		// Extract the structure and content of the SVG Map
		let worldMapSVG = this.worldMap.contentDocument;

		for (let i = 0; i < this.countries.length; i++) {
			// Get the SVG path element for the i'th country
			let country = worldMapSVG.getElementById(this.countries[i]);

			// Call the appropriate actions for mousing over or out of a canton
			country.addEventListener('mouseover', this.onCountry, false);
			country.addEventListener('mouseout', this.outCountry, false);
		}
	};

	// Set the current date to be viewed; expressed as a column index in the data
	this.setDay = function(incr) {
		// If an increment was passed as an argument, and it is within the range of dates in the data, then add it to the current date
		if (incr && this.selectedDate + incr < this.data.columns.length && this.selectedDate + incr >= startDate) {
			this.selectedDate += incr;

			// Otherwise if the "end" argument was passed, or the increment overshoots the latest available date, move to the latest date
		} else if (incr == 'end' || this.selectedDate + incr > this.data.columns.length) {
			this.selectedDate = this.data.columns.length - 1;

			// Otherwise move to the first date
		} else if (incr == 'start') {
			this.selectedDate = startDate;
		} else {
			this.selectedDate = this.data.columns.length - 1;
		}

		// Call functions to group the number of infections by country and generate the buttons to navigate the data
		this.groupInfectionsByCountry();
		this.dateButtons();
	};

	// The data lists infections by region / state and multiple rows are present per country
	// This function aggregates the country totals for the currently selected date
	this.groupInfectionsByCountry = function() {
		this.countryResult = new Object();

		// Traverse the list of countries, and for each country traverse the rows in the data
		// Sum up the infections per country and return an object of per-country infections for the current date
		for (let i = 0; i < this.countries.length; i++) {
			this.countryResult[this.countries[i]] = 0; // Set the count of infections to 0
			for (let j = 0; j < this.data.rows.length; j++) {
				let currentCases = this.data.rows[j].getNum(this.selectedDate);
				if (this.countries[i] == this.data.rows[j].get('ID')) {
					// Add the infections of the i'th country to the running total for that country
					this.countryResult[this.countries[i]] += currentCases;
				}
			}
		}

		// Calculate the total number of infections for the selected Date
		this.totalCases = 0;
		for (let k = 0; k < Object.keys(this.countryResult).length; k++) {
			this.totalCases += Object.values(this.countryResult)[k];
		}

		// Create an array to sort the countries by infections
		// We push each country's ID and it's infections number to a new array
		this.topCountries = new Array();
		for (let l = 0; l < Object.keys(this.countryResult).length; l++) {
			this.topCountries.push([Object.keys(this.countryResult)[l], Object.values(this.countryResult)[l]]);
		}

		// Sort the array of infections from highest to lowest infections
		this.topCountries.sort(function(a, b) {
			return b[1] - a[1];
		});

		// Keep only the top 5 countries
		this.topCountries.length = 5;

		// Get the real names of the countries from the data
		// Store the resulting array as a property ready for drawing
		for (let m = 0; m < this.topCountries.length; m++) {
			this.topCountries[m][0] = this.data.findRow(this.topCountries[m][0], 'ID').get('Country/Region');
		}
	};

	// Create navigation buttons to navigate the time series data
	this.dateButtons = function() {
		if (this.selectedDate && this.buttonsCreated == false) {
			// Create a button for each element we configured in the navButtons object
			for (let i = 0; i < this.navButtons.length; i++) {
				this[this.navButtons[i].name] = createButton(this.navButtons[i].label);
				this[this.navButtons[i].name].position(this.navButtons[i].left, this.navButtons[i].top);
				this[this.navButtons[i].name].size(100, 50);
				this[this.navButtons[i].name].mousePressed(function() {
					self.setDay(self.navButtons[i].day);
				});
				this[this.navButtons[i].name].addClass('myButton');
			}
		}
		this.buttonsCreated = true;
	};

	// Fill a country in a color and make it the selected country
	this.onCountry = function(e) {
		self.selectedCountry = e.target.attributes.id.value;
		self.currentColour = e.target.style.fill;
		e.target.style.fill = '#0061a7';
		// e.target.style.strokeWidth = "2px";
	};

	// Reset the country's fill color and the reset the selected country to "false"
	this.outCountry = function(e) {
		self.selectedCountry = false;
		e.target.style.fill = self.currentColour;
		// e.target.style.strokeWidth = "0.5px";
	};

	////////////////////////
	//// DRAW FUNCTIONS ///
	////////////////////////

	// Disable/enable the buttons if the beginning or end of the time series is reached
	this.updateButtonState = function() {
		if (this.buttonsCreated == true) {
			// Explicitly show the buttons in case they were hidden by navigating to another extension
			for (let i = 0; i < this.navButtons.length; i++) {
				this[this.navButtons[i].name].show();
			}

			// Set the forward buttons to disabled if the end of data is reached
			if (this.selectedDate == this.data.columns.length - 1) {
				this[this.navButtons[0].name].attribute('disabled', 'true');
				this[this.navButtons[2].name].attribute('disabled', 'true');
			} else {
				// Reset to enabled
				this[this.navButtons[0].name].removeAttribute('disabled');
				this[this.navButtons[2].name].removeAttribute('disabled');
			}

			// Set the backward buttons to disabled if the start of data is reached
			if (this.selectedDate == startDate) {
				this[this.navButtons[1].name].attribute('disabled', 'true');
				this[this.navButtons[3].name].attribute('disabled', 'true');
			} else {
				// Reset to enabled
				this[this.navButtons[1].name].removeAttribute('disabled');
				this[this.navButtons[3].name].removeAttribute('disabled');
			}
		}
	};

	// "Heatmap" - Fill each country with color based on the number of infections
	this.colorizeMap = function() {
		if (this.countries && this.countryResult && this.selectedCountry == false) {
			for (let i = 0; i < Object.keys(this.countryResult).length; i++) {
				let mappedColor = new Array();
				for (let j = 0; j < this.mapColorSettings.mapColorDefault.length; j++) {
					mappedColor.push(map(Object.values(this.countryResult)[i], this.mapColorSettings.minCases, this.mapColorSettings.maxCases, this.mapColorSettings.mapColorDefault[j], this.mapColorSettings.mapColorFilled[j]));
				}

				this.paths[i].setAttribute('style', `fill: rgba(${mappedColor[0]},${mappedColor[1]},${mappedColor[2]})`);
			}
		}
	};

	// Draw the data box on the side of the map
	this.displayDataBox = function() {
		// Display the currently selected date
		if (this.selectedDate) {
			strokeWeight(0);
			textSize(14);
			textStyle(BOLD);
			textAlign(LEFT, BOTTOM);
			text(this.data.columns[this.selectedDate].toString(), this.layout.left, this.layout.top);
		}

		// Display the total number of cases
		if (this.totalCases > 0) {
			fill(0, 0, 0);
			textAlign(RIGHT);
			textStyle(NORMAL);
			textSize(12);
			text('Confirmed Cases of COVID-19', this.layout.left + 208, this.layout.top + 150);
			textSize(20);
			textStyle(BOLD);
			text(
				this.totalCases.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','), // Regex to insert thousands separator
				this.layout.left + 208,
				this.layout.top + 180
			);
		}

		// Display the number of cases for the currently selected Country (on hover)
		textAlign(LEFT);
		if (this.countryResult && this.selectedCountry) {
			if (this.data.findRow(this.selectedCountry, 'ID')) {
				this.selectedCountryName = this.data.findRow(this.selectedCountry, 'ID').get('Country/Region');
			}
			textSize(20);
			text(this.selectedCountryName + ': ' + this.countryResult[this.selectedCountry].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','), this.layout.left, this.layout.top + 360);
		} else {
			textSize(12);
			textStyle(ITALIC);
			text("Hover over the map to see \na specific country's results.", this.layout.left, this.layout.top + 370);
		}

		// Display a list of the top 5 countries and their infections
		if (this.topCountries) {
			for (let i = 0; i < this.topCountries.length; i++) {
				textSize(14);
				textAlign(LEFT);
				textStyle(BOLD);
				text(this.topCountries[i][0], this.layout.left, this.layout.top + 230 + i * 20);
				textAlign(RIGHT);
				textStyle(NORMAL);
				text(this.topCountries[i][1].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','), this.layout.left + 210, this.layout.top + 230 + i * 20);
			}
		}

		// Divider Line between total cases and top 5 countries
		strokeWeight(2);
		stroke(0);
		line(this.layout.left, this.layout.top + 200, this.layout.left + 210, this.layout.top + 200);
		// Divider Line between total cases and selected country
		line(this.layout.left, this.layout.top + 320, this.layout.left + 210, this.layout.top + 320);
	};
}
