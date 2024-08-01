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

function createNumHelper(goal, numbers) {
	var poss_results = []
	numbers.forEach(function(x, index) {
		var result = createNum(goal, x, numbers.toSpliced(index, 1));
		if (result.length > 0) {
			poss_results = poss_results.concat(result);
		}
	});
	return poss_results;
}

var start = ['4', '4', '4', '4'];
console.log(createNumHelper(8, start));
