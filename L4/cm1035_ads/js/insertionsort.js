function genRandomArray(n) {
	var arr = [];
	for (var i = 0; i < n; i++) {
		arr[i] = Math.round(10 * Math.random());
	}
	return arr;
}

// This implements the swap function
function swap(array, index1, index2) {
	var x = array[index2];
	array[index2] = array[index1];
	array[index1] = x;
	return array;
}

// This implements the shift function
function shift(array, index1, index2) {
	if (index1 < index2) {
		return array;
	}
	var x = array[index1];
	for (var i = index1; i >= index2 + 1; i--) {
		array[i] = array[i - 1];
	}
	array[index2] = x;
	return array;
}

function insertionSort(array) {
	let i = 1;
	while (i < array.length) {
		let x = array[i]; // Store the current element in a temp var
		let j = i - 1; // Refer to the element on the left of i as j
		while (j >= 0 && array[j] > x) {
			// While we are not at the left end and the inspected array element is greater than the current element
			array[j + 1] = array[j]; // Move the value of the previous card to the right
			j--;

		}
		array[j + 1] = x; // Place the element into the leftmost slot where it belongs
		i = i + 1; // move to the next element

	}
	return array;
}

// This will generate a random array with 12 elements, print it to the console, and also print what is returned by insertionSort also to the console
var arr = genRandomArray(5);
console.log(arr);
console.log(insertionSort(arr));

// Do not modify the code below this point--------------------------------
module.exports = {
	genRandomArray: genRandomArray,
	swap: swap,
	shift: shift,
	insertionSort: insertionSort
};
