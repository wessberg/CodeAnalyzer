import {test} from "ava";
import {parse, service} from "./util/Setup";

test(`getFunctionDeclarations() -> Detects all function declarations properly. #1`, t => {

	const statements = parse(`
		function foo () {}
	`);
	const assignments = service.getFunctionDeclarations(statements);
	t.true(assignments["foo"] != null);
});

test(`getFunctionDeclarations() -> Detects all function declarations properly. #2`, t => {

	const statements = parse(`
		function foo () {
			function bar () {

			}
		}
	`);
	const assignments = service.getFunctionDeclarations(statements, true);
	t.true(assignments["bar"] != null);
});

test(`getFunctionDeclarations() -> Detects all function decorators properly. #1`, t => {

	const statements = parse(`
		@MyDecorator
		function foo () {
		}
	`);
	const assignments = service.getFunctionDeclarations(statements, true);
	t.true(assignments["foo"].decorators["MyDecorator"] != null);
});

test(`getFunctionDeclarations() -> Detects all function decorators properly. #2`, t => {

	const statements = parse(`
		@MyDecorator
		function foo () {
			@MyOtherDecorator
			function bar () {

			}
		}
	`);
	const assignments = service.getFunctionDeclarations(statements, true);
	t.true(assignments["bar"].decorators["MyOtherDecorator"] != null);
});

test(`getFunctionDeclarations() -> Detects all function arguments properly #1`, t => {

	const statements = parse(`

		function foo (arg1, arg2, arg3) {
		}
	`);
	const assignments = service.getFunctionDeclarations(statements, true);
	t.true(assignments["foo"].parameters.parametersList[0].name[0] === "arg1");
	t.true(assignments["foo"].parameters.parametersList[1].name[0] === "arg2");
	t.true(assignments["foo"].parameters.parametersList[2].name[0] === "arg3");
});

test(`getFunctionDeclarations() -> Detects all function arguments properly #2`, t => {

	const statements = parse(`

		function foo (arg1: string, arg2: number, arg3: boolean[]) {
		}
	`);
	const assignments = service.getFunctionDeclarations(statements, true);
	t.true(assignments["foo"].parameters.parametersList[0].type.flattened === "string");
	t.true(assignments["foo"].parameters.parametersList[1].type.flattened === "number");
	t.true(assignments["foo"].parameters.parametersList[2].type.flattened === "boolean[]");
});

test(`getFunctionDeclarations() -> Detects all function arguments initialization values properly #1`, t => {

	const statements = parse(`

		function foo (arg1: string = ("hello" + "goodbye")) {
		}
	`);
	const assignments = service.getFunctionDeclarations(statements, true);
	t.deepEqual(assignments["foo"].parameters.parametersList[0].value.expression, ["(", "`hello`", " ", "+", " ", "`goodbye`", ")"]);
});

test(`getFunctionDeclarations() -> Detects all enum declarations properly. #1`, t => {

	const statements = parse(`
		enum Foo {
			A, B, C
		}
	`);
	const assignments = service.getEnumDeclarations(statements);
	t.true(assignments["Foo"] != null);
});

test(`getFunctionDeclarations() -> Detects all enum declarations properly. #2`, t => {

	const statements = parse(`
		enum Foo {
			A = <any>"hello"
		}
	`);
	const assignments = service.getEnumDeclarations(statements);
	t.true(assignments["Foo"] != null);
});

test(`getFunctionDeclarations() -> Detects all enum ordinal values correctly. #1`, t => {

	const statements = parse(`
		enum Foo {
			A = 2, B = 1, C = 10
		}
	`);
	const assignments = service.getEnumDeclarations(statements);
	t.true(assignments["Foo"].members["A"] === 2);
	t.true(assignments["Foo"].members["B"] === 1);
	t.true(assignments["Foo"].members["C"] === 10);
	t.true(assignments["Foo"] != null);
});

test(`getFunctionDeclarations() -> Detects all enum ordinal values correctly. #2`, t => {

	const statements = parse(`
		enum Foo {
			A = 2, B = 1, C
		}
	`);
	const assignments = service.getEnumDeclarations(statements);
	t.true(assignments["Foo"].members["A"] === 2);
	t.true(assignments["Foo"].members["B"] === 1);
	t.true(assignments["Foo"].members["C"] === 0);
	t.true(assignments["Foo"] != null);
});