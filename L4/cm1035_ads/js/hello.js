let inputRow = new Array(4);
inputRow[0] = 2;
inputRow[1] = 4;
inputRow[2] = 1;
inputRow[3] = 3;

function makeVector(row) {
	let puzzle = new Array(4);
	for (let i = 0; i < puzzle.length; i++) {
		puzzle[i] = row;
	}
	console.log("Original:");
	console.log(puzzle);

	return puzzle;
}

function permuteVector(row, p) {
	let q = new Array();

	//Enqueue all the row data into the queue
	for (let i = 0; i < row.length; i++) {
		q.push(row[i]);
	}

	// Shift the elements by p
	for (let i = 1; i <= p; i++) {
		let store = q[row.length - 1];
		q.pop();
		q.unshift(store);
	}
	return q;
}

function permuteRow(puzzle, x, y, z) {
	puzzle[0] = permuteVector(puzzle[0], x);
	puzzle[1] = permuteVector(puzzle[1], y);
	puzzle[2] = permuteVector(puzzle[2], z);
	console.log("Modified:");
	console.log(puzzle);
	return puzzle;
}

function checkColumn(puzzle, j) {
	let temp = new Array(4);
	let trueCounter = 0;
	for (let i = 0; i < temp.length; i++) {
		temp[i] = puzzle[i][j];
	}
	console.log(temp);
	for (let k = 1; k <= temp.length; k++) {
		if (linearSearch(temp, k)) {
			trueCounter++;
		}
	}
	if (trueCounter == temp.length) {
		return true;
	} else {
		return false;
	}
}

function linearSearch(vector, item) {
	for (let i = 0; i < vector.length; i++) {
		if ((vector[i] == item)) {
			// console.log(temp);
			return true;
		}
	}
	return false;
}

var puzzle = makeVector(inputRow);
permuteRow(puzzle, 1, 2, 3);
console.log(checkColumn(puzzle, 0));
