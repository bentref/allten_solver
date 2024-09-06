import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

class Expr {
	constructor(expr, remaining) {
		this.expr = expr;
		this.remaining = remaining;
	}
	getValue() {
		return eval(this.expr);
	}
}


function checkNum(x, max) {
	x = Number(x);
	if (isNaN(x) || x < 0 || x > max) {
		throw EvalError("You have entered an invalid number");
	}
	return x;
}

// Accept and parse command-line inputs
async function takeInput() {
	const rl = readline.createInterface({ input, output });
	const inputGoal = await rl.question('Enter goal number ');
	const inputNums = await rl.question('Enter given numbers separated by comma and space ');
	rl.close();
	return [inputGoal, inputNums]
}

function parseInput(value) {
	var inputGoal = value[0];
	var inputNums = value[1];
	var goal = checkNum(inputGoal, 10);
	var numbers = inputNums.split(', ');
	numbers.forEach(function(x, index) {
		checkNum(x, 9);
	});
	// Close interface and call solver
	console.log(createNumHelper(goal, numbers));
}



const operators = ['*', '+', '-', '/'];


function createExprs(goal, expr) {
	var poss_results = [expr]
	
	
	expr.remaining.forEach(function(x, index) {
		var new_remaining = expr.remaining.toSpliced(index, 1);
		
		operators.forEach(function(op, index) {
			// No-parentheses case
			var newExpr = new Expr(expr.expr + op + x, new_remaining);
			poss_results = poss_results.concat(createExprs(goal, newExpr));
			
			// Also handle parentheses
			let inners = createExprs(NaN, new Expr(x, new_remaining));
			inners.forEach(function(inner, index) {
				if (inner.expr.length > 1) {
					newExpr = new Expr(expr.expr + op + '(' + inner.expr + ')', inner.remaining);
				} else {
					newExpr = new Expr(expr.expr + op + inner.expr, inner.remaining);
				}
				poss_results = poss_results.concat(createExprs(goal, newExpr))
			});
			
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
		var results = createExprs(goal, new Expr(x, numbers.toSpliced(index, 1)));
		poss_results = poss_results.concat(results);
	});
	poss_results = poss_results.filter((expr) => expr.getValue() == goal && expr.remaining.length == 0);
	return poss_results[0].expr;
}

function runOnce() {
	takeInput()
		.then(parseInput)
		.catch((e) => {
			console.error(e.message);
			runOnce();
		});
}

runOnce();
