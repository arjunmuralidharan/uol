function genRandomArray(n) {
	var arr = [];
	for (var i = 0; i < n; i++) {
		arr[i] = Math.round(10 * Math.random());
	}
	return arr;
}

function swap(array, index1, index2) {
	var saveElement = array[index1];
	array[index1] = array[index2];
	array[index2] = saveElement;
	return array;
}

function bubbleSort(array) {
	var n = array.length;
	for (var i = 1; i < n; i++) {
		var count = 0;
		for (var j = 0; j < n - 1; j++) {
			if (array[j + 1] < array[j]) {
				count++;
				swap(array, j, j + 1);
			}
		}
		if (count == 0) {
			break;
		}
	}
	return array;
}

function binarySearch(array, x) {
	let L = 0;
	let R = array.length - 1;
	while (L <= R) {
		let M = Math.floor((L + R) / 2);
		if (array[M] < x) {
			L = M + 1;
		} else if (array[M] > x) {
			R = M - 1;
		} else {
			return true;
		}
	}
	return false;
}

var arr = genRandomArray(14);
console.log(bubbleSort(arr));
console.log(binarySearch(bubbleSort(arr), 7));

// Do not modify the code below this point--------------------------------
module.exports = {
	genRandomArray: genRandomArray,
	swap: swap,
	bubbleSort: bubbleSort,
	binarySearch: binarySearch
};
