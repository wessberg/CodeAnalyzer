import {IMarshaller} from "@wessberg/marshaller";
import {test} from "ava";
import * as TypeMoq from "typemoq";
import {BindingIdentifier} from "../src/BindingIdentifier";
import {ArbitraryValueIndexable, ISimpleLanguageService, NullableInitializationValue} from "../src/interface/ISimpleLanguageService";
import {SimpleLanguageService} from "../src/SimpleLanguageService";
const Mock = TypeMoq.Mock;
const It = TypeMoq.It;

// Setup
const fileName = "a_file.ts";
let marshaller = Mock.ofType<IMarshaller>();
let service: ISimpleLanguageService;

// Helpers
const parse = (code: string) => service.addFile(fileName, code);

function setupMock<T> (input?: NullableInitializationValue | ArbitraryValueIndexable, output?: T, treatUndefinedAsExpectedValue: boolean = false): void {
	if (input != null || treatUndefinedAsExpectedValue) {
		let out: T | undefined;
		if (output == null) {
			if (treatUndefinedAsExpectedValue) out = output;
			else out = <T>input;
		} else out = output;

		marshaller.setup(marshaller => marshaller.marshal<NullableInitializationValue | ArbitraryValueIndexable, T | undefined>(input)).returns(() => out);
		marshaller.setup(marshaller => marshaller.marshal<NullableInitializationValue | ArbitraryValueIndexable, any>(input, It.isAny())).returns(() => out);
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
test(`Detects all variable assignments properly. #1`, t => {
	setup<number>("0", 0);
	const statements = parse(`
		const foo: number = 0;
	`);
	const assignments = service.getVariableAssignments(statements);
	t.true(assignments["foo"] != null);
});

test(`Detects all variable assignments properly. #2`, t => {
	setup<boolean>("true", true);
	const statements = parse(`
		let bar = true;
	`);

	const assignments = service.getVariableAssignments(statements);
	t.true(assignments["bar"] != null);
});

test(`Detects all variable assignments properly. #3`, t => {
	setup<number[]>("[1, 2, 3]", [1, 2, 3]);
	const statements = parse(`
		var baz = [1, 2, 3];
	`);

	const assignments = service.getVariableAssignments(statements);
	t.true(assignments["baz"] != null);
});

test(`Detects all variable assignments properly. #4`, t => {
	setupMany([["true", true], ["false", false], ["Infinity", Infinity]]);
	const statements = parse(`
		const a = true, b = false, c = Infinity;
	`);

	const assignments = service.getVariableAssignments(statements);
	t.true(assignments["a"] != null);
	t.true(assignments["b"] != null);
	t.true(assignments["c"] != null);
});

test(`Detects all initialization values correctly. #1`, t => {
	setup<number>("0", 0);

	const statements = parse(`
		const foo: number = 0;
	`);
	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["foo"], [0]);
});

test(`Detects all initialization values correctly. #2`, t => {
	setup<number>("Infinity", Infinity);

	const statements = parse(`
		const foo: number = Infinity;
	`);
	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["foo"], [Infinity]);
});

test(`Detects all initialization values correctly. #3`, t => {
	setup<number>("NaN", NaN);

	const statements = parse(`
		const foo: number = NaN;
	`);
	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["foo"], [NaN]);
});

test(`Detects all initialization values correctly. #4`, t => {
	setupMany([ ["this has the substitution ", "this has the substitution "], ["substitution", "substitution"], ["", ""]  ]);

	const statements = parse(`
		const substitution = 2;
		const foo: string = \`this has the substitution \${substitution}\`;
	`);
	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["foo"], ["`", "this has the substitution ", new BindingIdentifier("substitution"), "`"]);
});

test(`Detects all initialization values correctly. #5`, t => {
	setupMany([["this has the substitution ", "this has the substitution "], ["2", "2"], ["", ""]]);

	const statements = parse(`
		const substitution = 2;
		const foo: string = \`this has the substitution \${2}\`;
	`);
	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["foo"], ["`", "this has the substitution ", "2", "`"]);
});

test(`Detects all initialization values correctly. #6`, t => {
	setup<boolean>("true", true);
	const statements = parse(`
		let bar = true;
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["bar"], [true]);
});

test(`Detects all initialization values correctly. #7`, t => {
	setupMany([ ["1", 1], ["2", 2], ["3", 3] ]);

	const statements = parse(`
		var baz = [1, 2, 3];
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["baz"], ["[", 1, ",", 2, ",", 3, "]"]);
});

test(`Detects all initialization values correctly. #8`, t => {
	setupMany([["true", true], ["false", false], ["Infinity", Infinity]]);
	const statements = parse(`
		const a = true, b = false, c = Infinity;
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"], [true]);
	t.deepEqual(assignments["b"], [false]);
	t.deepEqual(assignments["c"], [Infinity]);
});

test(`Detects all initialization values correctly. #9`, t => {
	setup<string>("this is a template string");

	const statements = parse(`
		const a = \`this is a ${"template string"}\`;
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"], ["this is a template string"]);
});

test(`Detects all initialization values correctly. #10`, t => {
	setupMany([["1", 1], ["2", 2], ["3", 3], ["foo", "foo"], ["false", false] ]);

	const statements = parse(`
		const a = [1, "foo", false, [1, 2, 3]]
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"], ["[", 1, ",", "foo", ",", false, ",", "[", 1, ",", 2, ",", 3, "]", "]",]);
});

test(`Detects all initialization values correctly. #11`, t => {
	setupMany([[ "1", 1], ["a", "a"] ]);

	const statements = parse(`
		const a = {a: 1};
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"], ["{", "a", ":", 1, "}"]);
});

test(`Detects all initialization values correctly. #12`, t => {
	setupMany([ ["1", 1], ["key", "key"] ]);

	const statements = parse(`
		const key = "foo";
		const a = {[key]: 1};
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"], ["{", "[", new BindingIdentifier("key"), "]", ":", 1, "}"]);
});

test(`Detects all initialization values correctly. #13`, t => {
	setupMany([["1", 1], ["0", 0]]);

	const statements = parse(`
		const key = 0;
		const a = {0: 1};
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"], ["{", 0, ":", 1, "}"]);
});

test(`Detects all initialization values correctly. #14`, t => {
	setupMany([["1", 1], ["123", 123]]);

	const statements = parse(`
		const key = 0;
		const a = {123: 1};
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"], ["{", 123, ":", 1, "}"]);
});

test(`Detects all initialization values correctly. #15`, t => {
	setupMany([["Hello world!", "Hello world!"], ["Symbol", "Symbol"] ]);

	const statements = parse(`
		const key = 0;
		const a = Symbol("Hello world!");
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"], [new BindingIdentifier("Symbol"), "(", "Hello world!", ")"]);
});

test(`Detects all initialization values correctly. #16`, t => {
	setupMany([["a", "a"], ["1", 1] ]);

	const statements = parse(`
		const a = {"a": 1};
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"], ["{", "a", ":", 1, "}"]);
});

test(`Detects all initialization values correctly. #17`, t => {
	setupMany([["a", "a"], ["0", "0"], ["1", 1] ]);

	const statements = parse(`
		const a = {"0": 1};
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"], ["{", "0", ":", 1, "}"]);
});

test(`Detects all initialization values correctly. #18`, t => {
	setupMany([["a", "a"], ["getKey", "getKey"], ["test", "test"], ["1", 1] ]);

	const statements = parse(`
		function getKey () {return "test";}
		const a = {[getKey()]: 1};
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"], ["{", "[", new BindingIdentifier("getKey"), "(", ")", "]", ":", 1, "}"]);
});

test(`Detects all initialization values correctly. #19`, t => {
	setupMany([["a", "a"], ["getKey", "getKey"], ["test", "test"], ["1", "1"], ["Infinity", Infinity], ["false", false], ["123", 123] ]);

	const statements = parse(`
		function getKey (num: number, bool: boolean, arr: number[]) {return "test";}
		const a = {[getKey("1", false, [123])]: Infinity};
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"], ["{", "[", new BindingIdentifier("getKey"), "(", "1", ",", false, ",", "[",123, "]", ")", "]", ":", Infinity, "}"]);
});

test(`Detects all initialization values correctly. #20`, t => {
	setupMany([ ["foo", "foo"], ["bar", "bar"], ["baz", "baz"], ["Foo", "Foo"], ["true", true], ["false", false] ]);

	const statements = parse(`
		const a = {foo: {bar: {baz: new Foo(true, false)}}};
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"], ["{", "foo", ":", "{", "bar", ":", "{", "baz", ":", "new ", new BindingIdentifier("Foo"), "(", true, ",", false, ")", "}", "}", "}" ]);
});

test(`Detects all initialization values correctly. #21`, t => {
	setupMany([["1", 1], ["0", 0] ]);

	const statements = parse(`
		const a = true ? 1 : 0;
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"], [true, "?", 1, ":", 0]);
});

test(`Detects all initialization values correctly. #22`, t => {
	setupMany([["1", 1], ["0", 0], ["sub", "sub"] ]);

	const statements = parse(`
		const sub = true;
		const a = sub ? 1 : 0;
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"], [new BindingIdentifier("sub"), "?", 1, ":", 0]);
});

test(`Detects all initialization values correctly. #23`, t => {
	setupMany([["1", 1], ["null", null], ["sub", "sub"], ["false", false], ["true", true] ]);

	const statements = parse(`
		const sub = true;
		const a = sub && true ? false && 1 ? false : null : null;
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"], [new BindingIdentifier("sub"), "&&", true, "?", false, "&&", 1, "?", false, ":", null, ":", null]);
});

test(`Detects all initialization values correctly. #24`, t => {
	setupMany([ ["new ", "new "], ["Foo", "Foo"], ["true", true] ]);

	const statements = parse(`
		const a = new Foo(true)
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"], ["new ", new BindingIdentifier("Foo"), "(", true, ")"]);
});

test(`Detects all initialization values correctly. #25`, t => {
	setupMany([ ["Foo", "Foo"], ["A", "A"] ]);

	const statements = parse(`
		const a = Foo.A;
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"], [new BindingIdentifier("Foo.A")]);
});

test(`Detects all initialization values correctly. #26`, t => {
	setupMany([ ["Foo", "Foo"], ["A", "A"], ["B", "B"], ["C", "C"], ["D", "D"] ]);

	const statements = parse(`
		const a = Foo.A.B.C.D;
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"], [new BindingIdentifier("Foo.A.B.C.D")]);
});

test(`Detects all initialization values correctly. #27`, t => {
	setupMany([ ["true", true] ]);

	const statements = parse(`
		const a = () => true;
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"], ["(", ")", "=>", true]);
});

test(`Detects all initialization values correctly. #28`, t => {
	setupMany([ [ "foo", "foo" ], ["true", true] ]);

	const statements = parse(`
		const a = (foo: string) => true;
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"], ["(", "foo", ")", "=>", true]);
});

test(`Detects all initialization values correctly. #29`, t => {
	setupMany([ [ "foo", "foo" ], ["true", true], ["return", "return"] ]);

	const statements = parse(`
		const a = (foo: string) => function () {return true;};
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"], ["(", "foo", ")", "=>", "function", "(", ")", "{", "return", true, "}"]);
});

test(`Detects all initialization values correctly. #30`, t => {
	setupMany([ [ "Something", "Something" ], ["Other", "Other"], ["Than", "Than"], ["OtherThing", "OtherThing"], ["baz", "baz"] ]);

	const statements = parse(`
		const a = Something.Other.Than<OtherThing>("baz");
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"], [new BindingIdentifier("Something.Other.Than"), "(", "baz", ")"]);
});

test(`Detects all initialization values correctly. #31`, t => {
	setupMany([ [ "Something", "Something" ], ["2", 2], ["Other", "Other"], ["Than", "Than"], ["OtherThing", "OtherThing"], ["baz", "baz"] ]);

	const statements = parse(`
		const a = Something[2].Other.Than<OtherThing>("baz");
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"], [new BindingIdentifier("Something[2].Other.Than"), "(", "baz", ")"]);
});

test(`Detects all initialization values correctly. #32`, t => {
	setupMany([ ["test", "test"], ["false", false], ["foobar", "foobar"] ]);

	const statements = parse(`
		const a = test((foobar: number) => false);
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"], [new BindingIdentifier("test"), "(", "(", "foobar", ")", "=>", false, ")"]);
});

test(`Detects all initialization values correctly. #33`, t => {
	setupMany([ ["2", 2], ["3", 3] ]);

	const statements = parse(`
		const a = 2 + 3;
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"], [2, "+", 3]);
});

test(`Detects all initialization values correctly. #34`, t => {
	setupMany([ ["2", 2], ["3", 3], ["10", 10], ["5", 5] ]);

	const statements = parse(`
		const a = 2 + 3 * (10 * 5);
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"], [2, "+", 3, "*", "(", 10, "*", 5, ")"]);
});

test(`Detects all initialization values correctly. #35`, t => {
	setupMany([ ["foo", "foo"], ["bar", "bar"] ]);

	const statements = parse(`
		const a = {...foo, ...bar};
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"], ["{", "...", new BindingIdentifier("foo"), ",", "...", new BindingIdentifier("bar"), "}"]);
});

test(`Detects all initialization values correctly. #36`, t => {
	setupMany([ ["foo", "foo"], ["bar", "bar"], ["1", 1] ]);

	const statements = parse(`
		const a = {...{foo: 1}, ...bar};
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"], ["{", "...", "{", "foo", ":", 1, "}", ",", "...", new BindingIdentifier("bar"), "}"]);
});

test(`Detects all initialization values correctly. #37`, t => {
	setupMany([ ["foo", "foo"], ["bar", "bar"] ]);

	const statements = parse(`
		const a = [...foo, ...bar];
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"], [ "[", "...", new BindingIdentifier("foo"), ",", "...", new BindingIdentifier("bar"), "]" ]);
});

test(`Detects all initialization values correctly. #38`, t => {
	setupMany([ ["AssignmentMap", "AssignmentMap"], ["statement", "statement"], ["declarationList", "declarationList"], ["declarations", "declarations"], ["declaration", "declaration"], ["name", "name"], ["text", "text"], ["initializer", "initializer"], ["getInitializedValue", "getInitializedValue"], ["this", "this"] ]);

	const statements = parse(`
		const assignmentMap: AssignmentMap = {};
		const declarations = statement.declarationList.declarations;
		const boundName = declaration.name.text;
		const value = this.getInitializedValue(declaration.initializer);
	`);

	const assignments = service.getVariableAssignments(statements);

	t.deepEqual(assignments["assignmentMap"], [ "{", "}"  ]);
	t.deepEqual(assignments["declarations"], [ new BindingIdentifier("statement.declarationList.declarations") ]);
	t.deepEqual(assignments["boundName"], [ new BindingIdentifier("declaration.name.text") ]);
	t.deepEqual(assignments["value"], [ new BindingIdentifier("this.getInitializedValue"), "(", new BindingIdentifier("declaration.initializer"), ")" ]);
});

test(`Detects all class declarations properly. #1`, t => {
	setup();
	const code = `
		class MyClass {}
	`;

	const statements = parse(code);
	const assignments = service.getClassDeclarations(statements, fileName, code);
	t.true(assignments.length === 1);
});

test(`Detects all class declarations properly. #2`, t => {
	setup();
	const code = `
		class MyClass {}
		class MyOtherClass {}
	`;

	const statements = parse(code);
	const assignments = service.getClassDeclarations(statements, fileName, code);
	t.true(assignments.length === 2);
});

test(`Detects all class declarations properly. #3`, t => {
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

test(`Detects all class declarations properly. #4`, t => {
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

test(`Detects all class declarations properly. #5`, t => {
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

test(`Detects all class declarations properly. #6`, t => {
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

test(`Detects all class declarations properly. #7`, t => {
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

test(`Detects all class declarations properly. #8`, t => {
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