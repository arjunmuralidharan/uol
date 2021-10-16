function getRandArray(n) {
	var arr = [];
	for (let i = 0; i < n; i++) {
		arr[i] = Math.round(10*Math.random());
	}
	return arr;
}

function swap(array,index1,index2) {
	var x = array[index2];
	array[index2] = array[index1];
	array[index1] = x;
	return array;
}

function bubbleSort(array) {
	let n = array.length;
	for (let i = 0; i <= n-2; i++) {
		let count = 0;
		for (let j = 0; j <= n-2; j++) {
			if (array[j+1] < array[j]) {
				swap(array,j,j+1);
				count++;
				console.log(array);
			}
			
		}
		if (count == 0) {
			break;
		}
	
		console.log("Pass complete");
	}
	return array;
}

var array = getRandArray(6);
console.log(array);
console.log(bubbleSort(array));
