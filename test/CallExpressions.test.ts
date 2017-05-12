import {test} from "ava";
import {parse, service} from "./util/Setup";
test(`getCallExpressions() -> Detects methods correctly. #1`, t => {
	const code = `
		service.registerTransient[0].helloWorld<Foo, Bar>("Hello world!");
	`;

	const statements = parse(code);
	const callExpressions = service.getCallExpressions(statements, true);
	const expression = callExpressions.find(exp => exp.identifier === "helloWorld");
	t.true(expression != null);
});

test(`getCallExpressions() -> Detects methods correctly. #2`, t => {
	const code = `
		helloWorld<Foo, Bar>("Hello world!");
	`;

	const statements = parse(code);
	const callExpressions = service.getCallExpressions(statements, true);
	const expression = callExpressions.find(exp => exp.identifier === "helloWorld");
	t.true(expression != null);
});

test(`getCallExpressions() -> Detects methods correctly. #3`, t => {
	
	const code = `
		helloWorld<Foo, Bar>("Hello world!");
	`;

	const statements = parse(code);
	const callExpressions = service.getCallExpressions(statements, true);
	const expression = callExpressions.find(exp => exp.property == null);
	t.true(expression != null);
});

test(`getCallExpressions() -> Detects methods correctly. #4`, t => {
	
	const code = `
		service.helloWorld<Foo, Bar>("Hello world!");
	`;

	const statements = parse(code);
	const callExpressions = service.getCallExpressions(statements, true);
	const expression = callExpressions.find(exp => exp.identifier === "helloWorld");
	t.true(expression != null);
});

test(`getCallExpressions() -> Detects typeArguments correctly. #1`, t => {
	
	const code = `
		service.helloWorld<Foo, Bar>("Hello world!");
	`;

	const statements = parse(code);
	const callExpressions = service.getCallExpressions(statements);
	const expression = callExpressions
		.find(exp => exp.type != null && exp.type.bindings != null && exp.type.bindings.length === 2);
	t.true(expression != null);
});

test(`getCallExpressions() -> Detects typeArguments correctly. #2`, t => {
	
	const code = `
		service.helloWorld<Foo, Bar>("Hello world!");
	`;

	const statements = parse(code);
	const callExpressions = service.getCallExpressions(statements);
	const expression = callExpressions
		.find(exp => exp.type != null && exp.type.bindings != null && exp.type.bindings
			.some(binding => binding.name === "Foo") && exp.type.bindings
			.some(binding => binding.name === "Bar"));
	t.true(expression != null);
});

test(`getCallExpressions() -> Detects typeArguments correctly. #3`, t => {
	
	const code = `
		service.helloWorld<Foo>("Hello world!");
	`;

	const statements = parse(code);
	const callExpressions = service.getCallExpressions(statements);
	const expression = callExpressions
		.find(exp => exp.type != null && exp.type.bindings != null && exp.type.bindings.length === 1);
	t.true(expression != null);
});

test(`getCallExpressions() -> Detects typeArguments correctly. #4`, t => {
	
	const code = `
		service.helloWorld<Foo>("Hello world!");
	`;

	const statements = parse(code);
	const callExpressions = service.getCallExpressions(statements);
	const expression = callExpressions
		.find(exp => exp.type != null && exp.type.bindings != null && exp.type.bindings
			.some(binding => binding.name === "Foo"));
	t.true(expression != null);
});

test(`getCallExpressions() -> Detects arguments correctly. #1`, t => {
	
	const code = `
		service.helloWorld<Foo>("Hello world!");
	`;

	const statements = parse(code);
	const callExpressions = service.getCallExpressions(statements);
	const expression = callExpressions
		.find(exp => exp.arguments.argumentsList.length === 1);
	t.true(expression != null);
});

test(`getCallExpressions() -> Detects arguments correctly. #2`, t => {
	
	const code = `
		service.helloWorld<Foo>("Hello world!");
	`;

	const statements = parse(code);
	const callExpressions = service.getCallExpressions(statements);
	const expression = callExpressions
		.find(exp => exp.arguments.argumentsList.find(arg => arg.value.expression != null && arg.value.expression.includes("`Hello world!`")) != null);
	t.true(expression != null);
});