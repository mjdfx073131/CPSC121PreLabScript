var csidArray;
var gradesMap;

function populateDropdown() {
	var sectionSelector = document.getElementById("sectionSelector");
	for (var i = 0; i < 26; i++) {
		var newOption = document.createElement("option");
		newOption.text = String.fromCharCode(65 + i);
		sectionSelector.add(newOption);
	}
}

function submitForm() {
	var csidFile = document.getElementById('CSIDs').files[0];
	Papa.parse(csidFile, {
		header: true,
		complete: function(results) {
			console.log(results.data)
			csidArray = results.data;
			filterBySection();
			parseGrades();
		}
	});
}

function filterBySection() {
	for (var i = 0; i < csidArray.length; i++) {
		if (csidArray[i]["Lab"] != ("L2" + document.getElementById("sectionSelector").value)) {
			csidArray.splice(i, 1);
			i--;
		}
	}
	
	csidArray.sort(function(a,b) {
		var nameA = a["Legal Name"].toUpperCase();
		var nameB = b["Legal Name"].toUpperCase();
		if (nameA < nameB) {
			return -1;
		}
		if (nameA > nameB) {
			return 1;
		}
		return 0;
	});
	console.log(csidArray)
}

function parseGrades() {
	var gradesFile = document.getElementById('grades').files[0];
	Papa.parse(gradesFile, {
		header: true,
		complete: function(results) {
			mapGradeData(results.data);
		}
	});
}

function mapGradeData(gradesArray) {
	gradesMap = new Map();
	for (var i = 0; i < gradesArray.length; i++) {
		if (gradesArray[i]["Status"] == "Graded") {
			gradesMap.set(gradesArray[i]["Name"], gradesArray[i]["Total Score"]);
		}
	}

	outputResult();
}

function outputResult() {
	var table = document.getElementById("result");
	
	var tableHeight = document.getElementById("result").rows.length;
	for (var i = 0; i < tableHeight - 1; i++) {
		document.getElementById("result").deleteRow(-1);
	}
	
	for (var i = 0; i < csidArray.length; i++) {
		var row = table.insertRow(-1);
		row.insertCell(-1).innerHTML = csidArray[i]["Legal Name"];
		if (gradesMap.get(csidArray[i]["CS ID"]) == undefined) {
			row.insertCell(-1).innerHTML = "no submission";
		} else {
			row.insertCell(-1).innerHTML = gradesMap.get(csidArray[i]["CS ID"]);
		}
		// row.insertCell(-1).innerHTML = csidArray[i]["Student Number"];
		row.insertCell(-1).innerHTML = csidArray[i]["CS ID"];
	}
}


