import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
const rl = readline.createInterface({ input, output });



function checkNum(x) {
	x = Number(x);
	if (isNaN(x) || x < 0 || x > 9) {
		throw EvalError("You have entered an invalid number");
	}
	return x;
}

// Accept and parse command-line inputs
async function takeInput() {
	const inputGoal = await rl.question('Enter goal number ');
	const inputNums = await rl.question('Enter given numbers separated by comma and space ');
	rl.close();
	return [inputGoal, inputNums]
}

function parseInput(value) {
	var inputGoal = value[0];
	var inputNums = value[1];
	var goal = checkNum(inputGoal);
	var numbers = inputNums.split(', ');
	numbers.forEach(function(x, index) {
		checkNum(x);
	});
	// Close interface and call solver
	rl.close();
	console.log(createNumHelper(goal, numbers));
}



var operators = ['*', '+', '-', '/'];

function createNum(goal, expr, remaining) {
	var expr_val = eval(expr);
	var poss_results = [];

	if (remaining.length == 0 && expr_val == goal) {
		poss_results.push(expr);
	}
	
	remaining.forEach(function(x, index) {
		var new_remaining = remaining.toSpliced(index, 1);
		operators.forEach(function(op, index) {
			var new_expr = expr + op + x;
			var result = createNum(goal, new_expr, new_remaining);
			if (result.length > 0) {
				poss_results = poss_results.concat(result);
			}
		});
	});
	
	return poss_results;
}

/** 
 * Called on collected and sanitized user input
 */
function createNumHelper(goal, numbers) {
	var poss_results = [];
	numbers.forEach(function(x, index) {
		var result = createNum(goal, x, numbers.toSpliced(index, 1));
		if (result.length > 0) {
			poss_results = poss_results.concat(result);
		}
	});
	return poss_results;
}

takeInput()
	.then(parseInput)
	.catch((e) => {
		console.error(e.message);
	});
