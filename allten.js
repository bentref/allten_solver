import * as readline from 'node:readline';
import { stdin as input, stdout as output } from 'node:process';
const rl = readline.createInterface({ input, output });

takeInput();

// Accept and parse command-line inputs
function takeInput() {
	var inputNums = [];
	var inputGoal;
	rl.question('Enter goal number ', (answer) => {
		inputGoal = Number(answer);
		rl.question('Enter given numbers separated by comma and space ', (answer) => {
			answer = answer.split(', ');
			answer.forEach(function(x, index) {
				x = Number(x);
				x = '' + x;
				inputNums = inputNums.concat(x);
			});
			// Close interface and call solver
			rl.close();
			console.log(createNumHelper(inputGoal, inputNums));
		});
	});

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
