import {test} from "ava";
import {Mock} from "typemoq";
import {SimpleLanguageService} from "../src/SimpleLanguageService";
import * as ts from "typescript";
import {IMarshaller} from "@wessberg/marshaller";
import {ISimpleLanguageService} from "../src/interface/ISimpleLanguageService";

// Setup
const fileName = "a_file.ts";
const marshaller = Mock.ofType<IMarshaller>();
let service: ISimpleLanguageService;
test.beforeEach(() => {
	service = new SimpleLanguageService(ts, {}, marshaller.object);
});

// Counters
let VARIABLE_ASSIGNMENTS_TEST_COUNT = 0;
let CLASS_DECLARATION_TEST_COUNT = 0;

// Helpers
const parse = (code: string) => service.addFile(fileName, code);

// Tests
test(`Detects all variable assignments properly. #${++VARIABLE_ASSIGNMENTS_TEST_COUNT}`, t => {
	const statements = parse(`
		const foo: number = 0;
	`);
	const assignments = service.getVariableAssignments(statements);
	t.true(assignments["foo"] === "0");
});

test(`Detects all variable assignments properly. #${++VARIABLE_ASSIGNMENTS_TEST_COUNT}`, t => {
	const statements = parse(`
		let bar = true;
	`);

	const assignments = service.getVariableAssignments(statements);
	t.true(assignments["bar"] === "true");
});

test(`Detects all variable assignments properly. #${++VARIABLE_ASSIGNMENTS_TEST_COUNT}`, t => {
	const statements = parse(`
		var baz = [1, 2, 3];
	`);

	const assignments = service.getVariableAssignments(statements);
	t.true(assignments["baz"] === "[1,2,3]");
});

test(`Detects all variable assignments properly. #${++VARIABLE_ASSIGNMENTS_TEST_COUNT}`, t => {
	const statements = parse(`
		const a = true, b = false, c = Infinity;
	`);

	const assignments = service.getVariableAssignments(statements);
	t.true(assignments["a"] === "true");
	t.true(assignments["b"] === "false");
	t.true(assignments["c"] === "Infinity");
});

test(`Detects all class declarations properly. #${++CLASS_DECLARATION_TEST_COUNT}`, t => {
	const code = `
		class MyClass {}
	`;

	const statements = parse(code);
	const assignments = service.getClassDeclarations(statements, fileName, code);
	t.true(assignments.length === 1);
});

test(`Detects all class declarations properly. #${++CLASS_DECLARATION_TEST_COUNT}`, t => {
	const code = `
		class MyClass {}
		class MyOtherClass {}
	`;

	const statements = parse(code);
	const assignments = service.getClassDeclarations(statements, fileName, code);
	t.true(assignments.length === 2);
});

test(`Detects all class declarations properly. #${++CLASS_DECLARATION_TEST_COUNT}`, t => {
	const code = `
		class MyClass {
			constructor (arg1: string, arg2: number, arg3: Foo) {}
		}
	`;

	const statements = parse(code);
	const assignments = service.getClassDeclarations(statements, fileName, code);
	const [classDeclaration] = assignments;
	t.true(classDeclaration.constructorArguments[0].type === "string");
	t.true(classDeclaration.constructorArguments[1].type === "number");
	t.true(classDeclaration.constructorArguments[2].type === "Foo");
});

test(`Detects all class declarations properly. #${++CLASS_DECLARATION_TEST_COUNT}`, t => {
	const code = `
		class MyClass {
			field1;
			field2 = 2;
			field3;
		}
	`;

	const statements = parse(code);
	const assignments = service.getClassDeclarations(statements, fileName, code);
	const [classDeclaration] = assignments;
	t.true(classDeclaration.props["field1"] != null);
	t.true(classDeclaration.props["field2"] != null);
	t.true(classDeclaration.props["field3"] != null);
});

test(`Detects all class declarations properly. #${++CLASS_DECLARATION_TEST_COUNT}`, t => {
	const code = `
		class MyClass {
			field1: string;
			field2: number = 2;
			field3: Foo;
		}
	`;

	const statements = parse(code);
	const assignments = service.getClassDeclarations(statements, fileName, code);
	const [classDeclaration] = assignments;
	t.true(classDeclaration.props["field1"].type === "string");
	t.true(classDeclaration.props["field2"].type === "number");
	t.true(classDeclaration.props["field3"].type === "Foo");
});

test(`Detects all class declarations properly. #${++CLASS_DECLARATION_TEST_COUNT}`, t => {
	const code = `
		class MyClass {
			@prop field1: string;
			field2: number = 2;
			field3: Foo;
		}
	`;

	const statements = parse(code);
	const assignments = service.getClassDeclarations(statements, fileName, code);
	const [classDeclaration] = assignments;
	t.true(classDeclaration.props["field1"].decorators.length === 1);
	t.true(classDeclaration.props["field2"].decorators.length === 0);
	t.true(classDeclaration.props["field3"].decorators.length === 0);
});

test(`Detects all class declarations properly. #${++CLASS_DECLARATION_TEST_COUNT}`, t => {
	const code = `
		class MyClass {
			@prop field1: string;
			@setOnHost @prop field2: number = 2;
			field3: Foo;
		}
	`;

	const statements = parse(code);
	const assignments = service.getClassDeclarations(statements, fileName, code);
	const [classDeclaration] = assignments;
	t.true(classDeclaration.props["field1"].decorators.includes("prop"));
	t.true(classDeclaration.props["field2"].decorators.includes("setOnHost"));
	t.true(classDeclaration.props["field2"].decorators.includes("prop"));
});