$(function() {
	let matrixSize = 6;

	let style = document.createElement("style");
	document.head.appendChild(style);
	style.sheet.insertRule(".colSize { grid-template-columns: repeat(" + (matrixSize+1) + ", min-content); }", style.sheet.cssRules.length);
	$("#stage").addClass("colSize");

	//console.log(`.colStart { grid-column-start: ${matrixSize}; }`);

	let selected = "0"; // stores selected (last clicked) element
	// click and swap function
	let clicked = function(targetID) {
		//console.log($("#"+targetID).html());
		if (selected !== "0") {
			if (selected === targetID) {
				$("#"+targetID).removeClass("selected");
			} else {
				let tmp1 = $("#"+selected).html();
				let tmp2 = $("#"+targetID).html();
				$("#"+selected).html(tmp2).removeClass("selected");
				$("#"+targetID).html(tmp1);
				calcSums();
			}
			selected = "0";
		} else {
			selected = targetID;
			$("#"+targetID).addClass("selected");
		}
	}

	let calcSums = function() {
		let rowSumIndex = []; // horizontal sum fields
		let colSumIndex = []; // vertical sum fields
		let diaSumIndex = []; // diagonal sum fields
		let rowCount = 0; // counting number of fields until it reaches column sum field (last column item)

		// determining the sum fields
		for (i = 1; i < Math.pow(matrixSize + 1, 2); i++) {
			rowCount++;
			if (i > Math.pow(matrixSize + 1, 2) - matrixSize - 1) {
				colSumIndex.push(i);
			} else if (rowCount > matrixSize) {
				rowSumIndex.push(i);
				rowCount = 0;
			}
		}
		diaSumIndex.push(0);
		diaSumIndex.push(Math.pow(matrixSize + 1, 2));
		/*console.log("rowSumIndex: ");
		console.log(rowSumIndex);
		console.log("colSumIndex: ");
		console.log(colSumIndex);
		console.log("diaSumIndex: ");
		console.log(diaSumIndex);*/

		rowSumIndex.forEach(function(i) {
			//console.log(">row > " + i);
			let sumi = 0;
			for (j = i - matrixSize; j < i; j++) {
				sumi += parseInt($("#"+j).html());
				//console.log ($("#"+j).html());
			}
			//console.log(sumi);
			$("#"+i).html(sumi); // update sums for horizontal lines
		});

		colSumIndex.forEach(function(i, k) {
			// i is value, k is index
			//console.log(">col > " + i + " : " + k);
			let sumi = 0;
			rowSumIndex.forEach(function(j) {
				sumi += parseInt($("#" + (j - (matrixSize - k))).html());
			});
			//console.log(sumi);
			$("#"+i).html(sumi); // update sums for vertical lines
		});

		let sum0 = 0; // diagonal sum from top/right to bottom/left
		let sumn = 0; // diagonal sum from top/left to bottom/right
		for(i = 1; i <= matrixSize; i++) {
			// logic for calculating diagonal sums
			sum0 += parseInt($("#" + (rowSumIndex[i-1] - i)).html());
			sumn += parseInt($("#" + (rowSumIndex[i-1] - matrixSize + i - 1)).html());
		}
		//console.log(sum0);
		//console.log(sumn);
		$("#"+diaSumIndex[0]).html(sum0);
		$("#"+diaSumIndex[1]).html(sumn);

		// check sums if equal
		let isEqual = true;
		[].concat(rowSumIndex, colSumIndex, diaSumIndex).forEach(function(i, k) {
			//console.log(`${i} : ${k}`);
			if ($("#0").html() !== $("#"+i).html()) {
				//console.log("sums not equal");
				isEqual = false;
			}
		});
		if (isEqual) {
			console.log("All sums equal.");
		} else {
			console.log("Sums are not equal.");
		}
	}

	$("#stage").append(`<div id="0">0</div>`);
	style.sheet.insertRule(`.gridStart { grid-column-start: ${matrixSize+1}; }`, style.sheet.cssRules.length);
	$("#0").addClass("gridStart num sum");

	let rowSumIndex = [];
	let numIndex = []; // index of play-area nums (playable fields, not sum fields)
	let rowCount = 0;
	for (i = 1; i <= Math.pow(matrixSize + 1, 2); i++) {
		rowCount++;
		$("#stage").append(`<div id="${i}" class="num">${i}</div>`);

		// add sum style if field is for sum
		if (rowCount > matrixSize || i > Math.pow(matrixSize + 1, 2) - matrixSize - 1) {
			rowCount = 0;
			console.log(i);
			$("#"+i).addClass("sum");
		} else {
			numIndex.push(i); // collecting playable fields
			$("#"+i).click(function(i) {
				// use i.target.innerHTML to get its value
				// use i.target.id to get its element id
				//console.log(i.target.innerHTML);
				clicked(i.target.id);
			});
		}
	}
	// re-init playable fields
	for (i = 1; i <= Math.pow(matrixSize, 2); i++) {
		$("#"+numIndex[i]).html(i+1);
	}
	calcSums();
});