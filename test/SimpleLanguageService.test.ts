import {IMarshaller} from "@wessberg/marshaller";
import {test} from "ava";
import {Mock} from "typemoq";
import {ArbitraryValueIndexable, ISimpleLanguageService, NullableInitializationValue} from "../src/interface/ISimpleLanguageService";
import {SimpleLanguageService} from "../src/SimpleLanguageService";
import {BindingIdentifier} from "../src/BindingIdentifier";

// Setup
const fileName = "a_file.ts";
let marshaller = Mock.ofType<IMarshaller>();
let service: ISimpleLanguageService;

// Counters
let VARIABLE_ASSIGNMENTS_TEST_COUNT = 0;
let CLASS_DECLARATION_TEST_COUNT = 0;
let INITIALIZATION_VALUE_TEST_COUNT = 0;

// Helpers
const parse = (code: string) => service.addFile(fileName, code);

function setupMock<T> (input?: NullableInitializationValue | ArbitraryValueIndexable, output?: T, treatUndefinedAsExpectedValue: boolean = false): void {
	if (input != null || treatUndefinedAsExpectedValue) {
		let out: T|undefined;
		if (output == null) {
			if (treatUndefinedAsExpectedValue) out = output;
			else out = <T>input;
		} else out = output;
		marshaller.setup(marshaller => marshaller.marshal<NullableInitializationValue | ArbitraryValueIndexable, T|undefined>(input)).returns(() => out);
	}
}

function setup<T> (input?: NullableInitializationValue | ArbitraryValueIndexable, output?: T, treatUndefinedAsExpectedValue: boolean = false): void {
	// Mock the Marshaller behavior.
	marshaller = Mock.ofType<IMarshaller>();
	setupMock<T>(input, output, treatUndefinedAsExpectedValue);
	service = new SimpleLanguageService(marshaller.object);
}

function setupMany (inputOutputs: [NullableInitializationValue | ArbitraryValueIndexable, NullableInitializationValue | ArbitraryValueIndexable][], treatUndefinedAsExpectedValue: boolean = false): void {
	// Mock the Marshaller behavior.
	marshaller = Mock.ofType<IMarshaller>();
	inputOutputs.forEach(pair => setupMock<typeof pair[1]>(pair[0], pair[1], treatUndefinedAsExpectedValue));
	service = new SimpleLanguageService(marshaller.object);
}

// Tests
test(`Detects all variable assignments properly. #${++VARIABLE_ASSIGNMENTS_TEST_COUNT}`, t => {
	setup<number>("0", 0);
	const statements = parse(`
		const foo: number = 0;
	`);
	const assignments = service.getVariableAssignments(statements);
	t.true(assignments["foo"] != null);
});

test(`Detects all variable assignments properly. #${++VARIABLE_ASSIGNMENTS_TEST_COUNT}`, t => {
	setup<boolean>("true", true);
	const statements = parse(`
		let bar = true;
	`);

	const assignments = service.getVariableAssignments(statements);
	t.true(assignments["bar"] != null);
});

test(`Detects all variable assignments properly. #${++VARIABLE_ASSIGNMENTS_TEST_COUNT}`, t => {
	setup<number[]>("[1, 2, 3]", [1, 2, 3]);
	const statements = parse(`
		var baz = [1, 2, 3];
	`);

	const assignments = service.getVariableAssignments(statements);
	t.true(assignments["baz"] != null);
});

test(`Detects all variable assignments properly. #${++VARIABLE_ASSIGNMENTS_TEST_COUNT}`, t => {
	setupMany([["true", true], ["false", false], ["Infinity", Infinity] ]);
	const statements = parse(`
		const a = true, b = false, c = Infinity;
	`);

	const assignments = service.getVariableAssignments(statements);
	t.true(assignments["a"] != null);
	t.true(assignments["b"] != null);
	t.true(assignments["c"] != null);
});

test(`Detects all initialization values correctly. #${++INITIALIZATION_VALUE_TEST_COUNT}`, t => {
	setup<number>("0", 0);

	const statements = parse(`
		const foo: number = 0;
	`);
	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["foo"], [0]);
});

test(`Detects all initialization values correctly. #${++INITIALIZATION_VALUE_TEST_COUNT}`, t => {
	setup<number>("Infinity", Infinity);

	const statements = parse(`
		const foo: number = Infinity;
	`);
	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["foo"], [Infinity]);
});

test(`Detects all initialization values correctly. #${++INITIALIZATION_VALUE_TEST_COUNT}`, t => {
	setup<number>("NaN", NaN);

	const statements = parse(`
		const foo: number = NaN;
	`);
	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["foo"], [NaN]);
});

test(`Detects all initialization values correctly. #${++INITIALIZATION_VALUE_TEST_COUNT}`, t => {
	setup();

	const statements = parse(`
		const substitution = 2;
		const foo: string = \`this has the substitution \${substitution}\`;
	`);
	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["foo"], ["`", "this has the substitution ", new BindingIdentifier("substitution"), "`"]);
});

test(`Detects all initialization values correctly. #${++INITIALIZATION_VALUE_TEST_COUNT}`, t => {
	setupMany([ ["this has the substitution ", "this has the substitution "], [ "2", "2" ] ]);

	const statements = parse(`
		const substitution = 2;
		const foo: string = \`this has the substitution \${2}\`;
	`);
	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["foo"], ["`", "this has the substitution ", "2", "`"]);
});

test(`Detects all initialization values correctly. #${++INITIALIZATION_VALUE_TEST_COUNT}`, t => {
	setup<boolean>("true", true);
	const statements = parse(`
		let bar = true;
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["bar"], [true]);
});

test(`Detects all initialization values correctly. #${++INITIALIZATION_VALUE_TEST_COUNT}`, t => {
	setupMany([ ["[1, 2, 3]", [1, 2, 3]], ["1", 1], ["2", 2], ["3", 3]  ]);

	const statements = parse(`
		var baz = [1, 2, 3];
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["baz"], [[1, 2, 3]]);
});

test(`Detects all initialization values correctly. #${++INITIALIZATION_VALUE_TEST_COUNT}`, t => {
	setupMany([["true", true], ["false", false], ["Infinity", Infinity] ]);
	const statements = parse(`
		const a = true, b = false, c = Infinity;
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"], [true]);
	t.deepEqual(assignments["b"], [false]);
	t.deepEqual(assignments["c"], [Infinity]);
});

test(`Detects all initialization values correctly. #${++INITIALIZATION_VALUE_TEST_COUNT}`, t => {
	setup<string>("this is a template string");

	const statements = parse(`
		const a = \`this is a ${"template string"}\`;
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"], ["this is a template string"]);
});

test(`Detects all class declarations properly. #${++CLASS_DECLARATION_TEST_COUNT}`, t => {
	setup();
	const code = `
		class MyClass {}
	`;

	const statements = parse(code);
	const assignments = service.getClassDeclarations(statements, fileName, code);
	t.true(assignments.length === 1);
});

test(`Detects all class declarations properly. #${++CLASS_DECLARATION_TEST_COUNT}`, t => {
	setup();
	const code = `
		class MyClass {}
		class MyOtherClass {}
	`;

	const statements = parse(code);
	const assignments = service.getClassDeclarations(statements, fileName, code);
	t.true(assignments.length === 2);
});

test(`Detects all class declarations properly. #${++CLASS_DECLARATION_TEST_COUNT}`, t => {
	setup();
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
	setup();
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
	setup();
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
	setup();
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
	setup();
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

test(`Detects all class declarations properly. #${++CLASS_DECLARATION_TEST_COUNT}`, t => {
	setup();
	const code = `
		class MyClass {
			@prop() field1: string;
		}
	`;

	const statements = parse(code);
	const assignments = service.getClassDeclarations(statements, fileName, code);
	const [classDeclaration] = assignments;
	t.true(classDeclaration.props["field1"].decorators.includes("prop"));
});