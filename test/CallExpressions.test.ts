import {test} from "ava";
import {parse, service} from "./util/Setup";

/*tslint:disable*/

test(`getCallExpressions() -> Detects call expressions correctly. #1`, t => {
	const code = `
		service.registerTransient[0].helloWorld<Foo, Bar>("Hello world!");
	`;

	const statements = parse(code);
	const callExpressions = service.getCallExpressions(statements, true);
	const expression = callExpressions.find(exp => exp.identifier === "helloWorld");
	t.true(expression != null);
});

test(`getCallExpressions() -> Detects call expressions correctly. #2`, t => {
	const code = `
		helloWorld<Foo, Bar>("Hello world!");
	`;

	const statements = parse(code);
	const callExpressions = service.getCallExpressions(statements, true);
	const expression = callExpressions.find(exp => exp.identifier === "helloWorld");
	t.true(expression != null);
});

test(`getCallExpressions() -> Detects call expressions correctly. #3`, t => {

	const code = `
		helloWorld<Foo, Bar>("Hello world!");
	`;

	const statements = parse(code);
	const callExpressions = service.getCallExpressions(statements, true);
	const expression = callExpressions.find(exp => exp.property == null);
	t.true(expression != null);
});

test(`getCallExpressions() -> Detects call expressions correctly. #4`, t => {

	const code = `
		service.helloWorld<Foo, Bar>("Hello world!");
	`;

	const statements = parse(code);
	const callExpressions = service.getCallExpressions(statements, true);
	const expression = callExpressions.find(exp => exp.identifier === "helloWorld");
	t.true(expression != null);
});

test(`getCallExpressions() -> Detects call expressions correctly. #5`, t => {

	const code = `
		if (!service.helloWorld<IFoo>("Foo!")) {
		}
	`;

	const statements = parse(code);
	const callExpressions = service.getCallExpressions(statements, true);
	const expression = callExpressions.find(exp => exp.identifier === "helloWorld");
	t.true(expression != null);
});

test(`getCallExpressions() -> Detects call expressions correctly. #6`, t => {

	const code = `
		class Foo {
			constructor (foo = service.helloWorld<IFoo>("Foo!"))
		}
	`;

	const statements = parse(code);
	const callExpressions = service.getCallExpressions(statements, true);
	const expression = callExpressions.find(exp => exp.identifier === "helloWorld");
	t.true(expression != null);
});

test(`getCallExpressions() -> Detects call expressions correctly. #7`, t => {

	const code = `
		(0, () => {})();
	`;

	const statements = parse(code);
	const callExpressions = service.getCallExpressions(statements, true);
	t.true(callExpressions[0].identifier != null);
});

test(`getCallExpressions() -> Detects call expressions correctly. #8`, t => {

	const code = `
		(async () => {
			DIContainer.foo();
		})();
	`;

	const statements = parse(code);
	const callExpressions = service.getCallExpressions(statements, true);
	t.true(callExpressions.find(exp => exp.identifier === "foo") != null);
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

/*tslint:enable*/