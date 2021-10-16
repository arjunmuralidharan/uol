let inputRow = new Array(4);
inputRow[0] = 2;
inputRow[1] = 4;
inputRow[2] = 1;
inputRow[3] = 3;

function makeVector(row) {
	let puzzle = new Array(4);
	for (let i = 0; i < puzzle.length; i++) {
		puzzle[i] = row;
		console.log(puzzle);
	}
	return puzzle;
}

// function permuteVector(row, p) {
// 	let q = new Array();

// 	//Enqueue all the row data into the queue
// 	for (let i = 0; i < row.length; i++) {
// 		q.push(row[i]);
// 	}

// 	// Shift the elements by p
// 	for (let i = 1; i <= p; i++) {
// 		let store = q[row.length - 1];
// 		q.pop();
// 		q.unshift(store);
// 	}
// 	console.log(q);
// 	return q;
// }

// function permuteVector(row, p) {
// 	let q = new Array();

// 	//Enqueue all the row data into the queue
// 	for (let i = 0; i < row.length; i++) {
// 		q.push(row[i]);
// 	}

// 	for (var i = q.length - 1; i > 0; i--) {
// 		var j = Math.floor(Math.random() * (i + 1));
// 		var temp = q[i];
// 		q[i] = q[j];
// 		q[j] = temp;
// 	}

// 	console.log(q);
// 	return q;
// }

function permuteVector(row, p) {
	var currentIndex = row.length,
		temporaryValue,
		randomIndex;

	// While there remain elements to shuffle...
	while (currentIndex !== 0) {
		let rowCopy = row.slice();
		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		// And swap it with the current element.
		temporaryValue = row[currentIndex];
		rowCopy[currentIndex] = rowCopy[randomIndex];
		rowCopy[randomIndex] = temporaryValue;
		row = rowCopy;
	}

	return row;
}

function permuteRow(puzzle, x, y, z) {
	puzzle[0] = permuteVector(puzzle[0], x);
	puzzle[1] = permuteVector(puzzle[1], y);
	puzzle[2] = permuteVector(puzzle[2], z);
	return puzzle;
}

function checkColumn(puzzle, j) {
	let temp = new Array(4);
	for (let i = 0; i < temp.length; i++) {
		temp[i] = puzzle[i][j];
	}
	for (let k = 1; k <= temp.length; k++) {
		if (linearSearch(temp, k) == false) {
			return false;
		}
	}
	return true;
}

function linearSearch(vector, item) {
	for (let i = 0; i < vector.length; i++) {
		if (vector[i] == item) {
			return true;
		}
	}
	return false;
}

function colCheck(puzzle) {
	for (let j = 0; j < puzzle.length; j++) {
		if (checkColumn(puzzle, j) == false) {
			return false;
		}
	}
	return true;
}

function makeGrid(puzzle, row1, col1, row2, col2) {
	let r1 = new Array(4);
	r1 = puzzle[row1];
	let r2 = new Array(4);
	r2 = puzzle[row2];
	let temp = new Array(4);
	temp[0] = r1[col1];
	temp[1] = r1[col2];
	temp[2] = r2[col1];
	temp[3] = r2[col2];
	return temp;
}

function checkGrids(puzzle) {
	let grids = new Array(4);
	grids[0] = makeGrid(puzzle, 0, 0, 1, 1);
	grids[1] = makeGrid(puzzle, 0, 2, 1, 3);
	grids[2] = makeGrid(puzzle, 2, 0, 3, 1);
	grids[3] = makeGrid(puzzle, 2, 2, 3, 3);
	for (let i = 0; i < grids.length; i++) {
		for (let k = 1; k <= grids[i].length; k++) {
			if (linearSearch(grids[i], k) == false) {
				return false;
			}
		}
	}
	return true;
}

// function makeSolution(row) {
// 	let puzzle = makeVector(row);
// 	let solution = new Array(0);

// 	for (let x = 0; x <= 3; x++) {
// 		for (let y = 0; y <= 3; y++) {
// 			for (let z = 0; z <= 3; z++) {
// 				let candidate = permuteRow(puzzle, x, y, z);
// 				if (colCheck(candidate) && checkGrids(candidate)) {
// 					solution[solution.length++] = [...candidate];
// 				}
// 			}
// 		}
// 	}
// 	return solution;
// }

function makeSolution(row) {
	let puzzle = makeVector(row);
	while (colCheck(puzzle) == false || checkGrids(puzzle) == false) {
		puzzle = permuteRow(puzzle, 1, 1, 1);
	}
	console.log(puzzle);
	return puzzle;
}

function createPuzzle(puzzle, n) {
	if (n < 0 || n > 16) {
		return false;
	}

	for (let i = 0; i < n; i++) {
		let randSlot = Math.floor(Math.random() * 4);

		while (puzzle[i % 4][randSlot] == "") {
			randSlot = (randSlot % 4) + 1;
		}
		puzzle[i % 4][randSlot] = "";
	}
	return puzzle;
}

//////////////////////////
let solution = makeSolution(inputRow);
// let solNum = Math.floor(Math.random() * solution.length);
// let blankPuzzle = createPuzzle(solution[solNum], 5);
// console.log(blankPuzzle);
