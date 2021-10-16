function genDay() {
	//first generate a month
	var month = 1 + Math.round(11 * Math.random());

	if ((month % 2 == 1 && month <= 7) || (month % 2 == 0 && month >= 8)) {
		var day = 1 + Math.round(30 * Math.random());
	} else if (month == 2) {
		day = 1 + Math.round(27 * Math.random());
	} else {
		day = 1 + Math.round(29 * Math.random());
	}
	return [day, month];
}

function genBirthdays(n) {
	var birthdays = [];
	var nst = n.toString();
	for (var i = 0; i < n; i++) {
		var str = i.toString();
		var lim = nst.length - str.length;
		for (var j = 1; j <= lim; j++) {
			str = "0" + str;
		}
		birthdays[2 * i] = str;
		birthdays[1 + 2 * i] = genDay();
	}
	return birthdays;
}

// search for unique birthdays in the array
function find(birthdays) {
	let uniqueBirthdays = [];
	let i = 1;
	while (i < birthdays.length) {
		let count = 0;
		let j = 1;
		while (j < birthdays.length) {
			// console.log(count);
			let birthday1 = birthdays[i].toString();
			let birthday2 = birthdays[j].toString();
			if (birthday1 == birthday2) {
				count = count + 1;
			}
			j = j + 2;

			// console.log(count);
		}
		if (count == 1) {
			uniqueBirthdays.push(birthdays[i - 1]);
		}
		i = i + 2;
	}
	return uniqueBirthdays;
}

///////////////////////////////////////////

function swap(array, index1, index2) {
	var x1 = array[index2];
	var x2 = array[index2 - 1];
	array[index2] = array[index1];
	array[index1] = x1;
	array[index2 - 1] = array[index1 - 1];
	array[index1 - 1] = x2;
	return array;
}

function bubbleSort(array) {
	var n = array.length;
	for (var i = 0; i <= n - 2; i++) {
		var count = 0;
		for (var j = 1; j <= n - 3; j = j + 2) {
			if (array[j + 2][1] < array[j][1]) {
				swap(array, j, j + 2);
				count++;
			}
		}
		if (count == 0) {
			break;
		}
	}
	return array;
}

function bubbleSortDays(array) {
	var n = array.length;
	for (var i = 0; i <= n - 2; i++) {
		var count = 0;
		for (var j = 1; j <= n - 3; j = j + 2) {
			if (
				array[j + 2][1] == array[j][1] &&
				array[j + 2][0] < array[j][0]
			) {
				swap(array, j, j + 2);
				count++;
			}
		}

		if (count == 0) {
			break;
		}
	}
	return array;
}

// sort then search for unique birthdays
function findSorted(birthdays) {
	let sortedBirthdays = bubbleSortDays(bubbleSort(birthdays));
	let uniqueBirthdays = find(sortedBirthdays);
	return uniqueBirthdays;
}

///////////////////////////////////////////
var birthdays = genBirthdays(1500);
console.log(find(birthdays));
console.log(findSorted(birthdays));
// Do not modify the code below this point--------------------------------
module.exports = {
	genDay: genDay,
	genBirthdays: genBirthdays,
	find: find,
	swap: swap,
	bubbleSort: bubbleSort,
	bubbleSortDays: bubbleSortDays,
	findSorted: findSorted
};
