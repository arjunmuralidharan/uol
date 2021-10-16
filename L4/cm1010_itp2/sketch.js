// global: TechDiversityRace
// Global variable to store the gallery object. The gallery object is
// a container for all the visualisations.
var gallery;

function setup() {
	// Create a canvas to fill the content div from index.html.
	canvasContainer = select("#app");
	var c = createCanvas(1000, 600);
	c.parent("app");

	// Create a new gallery object.
	gallery = new Gallery();

	// Add the visualisation objects here.
	gallery.addVisual(new TechDiversityRace());
	gallery.addVisual(new TechDiversityGender());
	gallery.addVisual(new PayGapByJob2017());
	gallery.addVisual(new PayGapTimeSeries());
	gallery.addVisual(new ClimateChange());
	gallery.addVisual(new ElectionMap());
	gallery.addVisual(new Covid19());
}

function draw() {
	background(255);
	if (gallery.selectedVisual != null) {
		gallery.selectedVisual.draw();
	}
}
