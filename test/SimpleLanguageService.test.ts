import {IMarshaller} from "@wessberg/marshaller";
import {test} from "ava";
import * as TypeMoq from "typemoq";
import {BindingIdentifier} from "../src/BindingIdentifier";
import {ArbitraryValueIndexable, InitializationValue, ISimpleLanguageService} from "../src/interface/ISimpleLanguageService";
import {SimpleLanguageService} from "../src/SimpleLanguageService";
const Mock = TypeMoq.Mock;
const It = TypeMoq.It;

// Setup
const fileName = "a_file.ts";
let marshaller = Mock.ofType<IMarshaller>();
let service: ISimpleLanguageService;

// Helpers
const parse = (code: string) => service.addFile(fileName, code);

function setupMock<T> (input?: InitializationValue | ArbitraryValueIndexable, output?: T, treatUndefinedAsExpectedValue: boolean = false): void {
	if (input != null || treatUndefinedAsExpectedValue) {
		let out: T | undefined;
		if (output == null) {
			if (treatUndefinedAsExpectedValue) out = output;
			else out = <T>input;
		} else out = output;

		marshaller.setup(marshaller => marshaller.marshal<InitializationValue | ArbitraryValueIndexable, T | undefined>(input)).returns(() => out);
		marshaller.setup(marshaller => marshaller.marshal<InitializationValue | ArbitraryValueIndexable, any>(input, It.isAny())).returns(() => out);
	}
}

function setup<T> (input?: InitializationValue | ArbitraryValueIndexable, output?: T, treatUndefinedAsExpectedValue: boolean = false): void {
	// Mock the Marshaller behavior.
	marshaller = Mock.ofType<IMarshaller>();
	setupMock<T>(input, output, treatUndefinedAsExpectedValue);
	service = new SimpleLanguageService(marshaller.object);
}

function setupMany (inputOutputs: [InitializationValue | ArbitraryValueIndexable, InitializationValue | ArbitraryValueIndexable][], treatUndefinedAsExpectedValue: boolean = false): void {
	// Mock the Marshaller behavior.
	marshaller = Mock.ofType<IMarshaller>();
	inputOutputs.forEach(pair => setupMock<typeof pair[1]>(pair[0], pair[1], treatUndefinedAsExpectedValue));
	service = new SimpleLanguageService(marshaller.object);
}

// Tests
test(`getVariableAssignments() -> Detects all variable assignments properly. #1`, t => {
	setup<number>("0", 0);
	const statements = parse(`
		const foo: number = 0;
	`);
	const assignments = service.getVariableAssignments(statements);
	t.true(assignments["foo"] != null);
});

test(`getVariableAssignments() -> Detects all variable assignments properly. #2`, t => {
	setup<boolean>("true", true);
	const statements = parse(`
		let bar = true;
	`);

	const assignments = service.getVariableAssignments(statements);
	t.true(assignments["bar"] != null);
});

test(`getVariableAssignments() -> Detects all variable assignments properly. #3`, t => {
	setup<number[]>("[1, 2, 3]", [1, 2, 3]);
	const statements = parse(`
		var baz = [1, 2, 3];
	`);

	const assignments = service.getVariableAssignments(statements);
	t.true(assignments["baz"] != null);
});

test(`getVariableAssignments() -> Detects all variable assignments properly. #4`, t => {
	setupMany([["true", true], ["false", false], ["Infinity", Infinity]]);
	const statements = parse(`
		const a = true, b = false, c = Infinity;
	`);

	const assignments = service.getVariableAssignments(statements);
	t.true(assignments["a"] != null);
	t.true(assignments["b"] != null);
	t.true(assignments["c"] != null);
});

test(`getVariableAssignments() -> Detects all valueExpressions correctly. #1`, t => {
	setup<number>("0", 0);

	const statements = parse(`
		const foo: number = 0;
	`);
	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["foo"].valueExpression, [0]);
});

test(`getVariableAssignments() -> Detects all valueExpressions correctly. #2`, t => {
	setup<number>("Infinity", Infinity);

	const statements = parse(`
		const foo: number = Infinity;
	`);
	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["foo"].valueExpression, [Infinity]);
});

test(`getVariableAssignments() -> Detects all valueExpressions correctly. #3`, t => {
	setup<number>("NaN", NaN);

	const statements = parse(`
		const foo: number = NaN;
	`);
	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["foo"].valueExpression, [NaN]);
});

test(`getVariableAssignments() -> Detects all valueExpressions correctly. #4`, t => {
	setupMany([ ["this has the substitution ", "this has the substitution "], ["substitution", "substitution"], ["", ""]  ]);

	const statements = parse(`
		const substitution = 2;
		const foo: string = \`this has the substitution \${substitution}\`;
	`);
	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["foo"].valueExpression, ["`", "this has the substitution ", "${", new BindingIdentifier("substitution"), "}", "`"]);
});

test(`getVariableAssignments() -> Detects all valueExpressions correctly. #5`, t => {
	setupMany([["this has the substitution ", "this has the substitution "], ["2", "2"], ["", ""]]);

	const statements = parse(`
		const substitution = 2;
		const foo: string = \`this has the substitution \${2}\`;
	`);
	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["foo"].valueExpression, ["`", "this has the substitution ", "2", "`"]);
});

test(`getVariableAssignments() -> Detects all valueExpressions correctly. #6`, t => {
	setup<boolean>("true", true);
	const statements = parse(`
		let bar = true;
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["bar"].valueExpression, [true]);
});

test(`getVariableAssignments() -> Detects all valueExpressions correctly. #7`, t => {
	setupMany([ ["1", 1], ["2", 2], ["3", 3] ]);

	const statements = parse(`
		var baz = [1, 2, 3];
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["baz"].valueExpression, ["[", 1, ",", 2, ",", 3, "]"]);
});

test(`getVariableAssignments() -> Detects all valueExpressions correctly. #8`, t => {
	setupMany([["true", true], ["false", false], ["Infinity", Infinity]]);
	const statements = parse(`
		const a = true, b = false, c = Infinity;
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"].valueExpression, [true]);
	t.deepEqual(assignments["b"].valueExpression, [false]);
	t.deepEqual(assignments["c"].valueExpression, [Infinity]);
});

test(`getVariableAssignments() -> Detects all valueExpressions correctly. #9`, t => {
	setup<string>("this is a template string");

	const statements = parse(`
		const a = \`this is a ${"template string"}\`;
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"].valueExpression, ["this is a template string"]);
});

test(`getVariableAssignments() -> Detects all valueExpressions correctly. #10`, t => {
	setupMany([["1", 1], ["2", 2], ["3", 3], ["foo", "foo"], ["false", false] ]);

	const statements = parse(`
		const a = [1, "foo", false, [1, 2, 3]]
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"].valueExpression, ["[", 1, ",", "foo", ",", false, ",", "[", 1, ",", 2, ",", 3, "]", "]",]);
});

test(`getVariableAssignments() -> Detects all valueExpressions correctly. #11`, t => {
	setupMany([[ "1", 1], ["a", "a"] ]);

	const statements = parse(`
		const a = {a: 1};
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"].valueExpression, ["{", "a", ":", 1, "}"]);
});

test(`getVariableAssignments() -> Detects all valueExpressions correctly. #12`, t => {
	setupMany([ ["1", 1], ["key", "key"] ]);

	const statements = parse(`
		const key = "foo";
		const a = {[key]: 1};
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"].valueExpression, ["{", "[", new BindingIdentifier("key"), "]", ":", 1, "}"]);
});

test(`getVariableAssignments() -> Detects all valueExpressions correctly. #13`, t => {
	setupMany([["1", 1], ["0", 0]]);

	const statements = parse(`
		const key = 0;
		const a = {0: 1};
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"].valueExpression, ["{", 0, ":", 1, "}"]);
});

test(`getVariableAssignments() -> Detects all valueExpressions correctly. #14`, t => {
	setupMany([["1", 1], ["123", 123]]);

	const statements = parse(`
		const key = 0;
		const a = {123: 1};
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"].valueExpression, ["{", 123, ":", 1, "}"]);
});

test(`getVariableAssignments() -> Detects all valueExpressions correctly. #15`, t => {
	setupMany([["Hello world!", "Hello world!"], ["Symbol", "Symbol"] ]);

	const statements = parse(`
		const key = 0;
		const a = Symbol("Hello world!");
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"].valueExpression, [new BindingIdentifier("Symbol"), "(", "Hello world!", ")"]);
});

test(`getVariableAssignments() -> Detects all valueExpressions correctly. #16`, t => {
	setupMany([["a", "a"], ["1", 1] ]);

	const statements = parse(`
		const a = {"a": 1};
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"].valueExpression, ["{", "a", ":", 1, "}"]);
});

test(`getVariableAssignments() -> Detects all valueExpressions correctly. #17`, t => {
	setupMany([["a", "a"], ["0", "0"], ["1", 1] ]);

	const statements = parse(`
		const a = {"0": 1};
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"].valueExpression, ["{", "0", ":", 1, "}"]);
});

test(`getVariableAssignments() -> Detects all valueExpressions correctly. #18`, t => {
	setupMany([["a", "a"], ["getKey", "getKey"], ["test", "test"], ["1", 1] ]);

	const statements = parse(`
		function getKey () {return "test";}
		const a = {[getKey()]: 1};
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"].valueExpression, ["{", "[", new BindingIdentifier("getKey"), "(", ")", "]", ":", 1, "}"]);
});

test(`getVariableAssignments() -> Detects all valueExpressions correctly. #19`, t => {
	setupMany([["a", "a"], ["getKey", "getKey"], ["test", "test"], ["1", "1"], ["Infinity", Infinity], ["false", false], ["123", 123] ]);

	const statements = parse(`
		function getKey (num: number, bool: boolean, arr: number[]) {return "test";}
		const a = {[getKey("1", false, [123])]: Infinity};
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"].valueExpression, ["{", "[", new BindingIdentifier("getKey"), "(", "1", ",", false, ",", "[",123, "]", ")", "]", ":", Infinity, "}"]);
});

test(`getVariableAssignments() -> Detects all valueExpressions correctly. #20`, t => {
	setupMany([ ["foo", "foo"], ["bar", "bar"], ["baz", "baz"], ["Foo", "Foo"], ["true", true], ["false", false] ]);

	const statements = parse(`
		const a = {foo: {bar: {baz: new Foo(true, false)}}};
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"].valueExpression, ["{", "foo", ":", "{", "bar", ":", "{", "baz", ":", "new ", new BindingIdentifier("Foo"), "(", true, ",", false, ")", "}", "}", "}" ]);
});

test(`getVariableAssignments() -> Detects all valueExpressions correctly. #21`, t => {
	setupMany([["1", 1], ["0", 0] ]);

	const statements = parse(`
		const a = true ? 1 : 0;
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"].valueExpression, [true, "?", 1, ":", 0]);
});

test(`getVariableAssignments() -> Detects all valueExpressions correctly. #22`, t => {
	setupMany([["1", 1], ["0", 0], ["sub", "sub"] ]);

	const statements = parse(`
		const sub = true;
		const a = sub ? 1 : 0;
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"].valueExpression, [new BindingIdentifier("sub"), "?", 1, ":", 0]);
});

test(`getVariableAssignments() -> Detects all valueExpressions correctly. #23`, t => {
	setupMany([["1", 1], ["null", null], ["sub", "sub"], ["false", false], ["true", true] ]);

	const statements = parse(`
		const sub = true;
		const a = sub && true ? false && 1 ? false : null : null;
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"].valueExpression, [new BindingIdentifier("sub"), "&&", true, "?", false, "&&", 1, "?", false, ":", null, ":", null]);
});

test(`getVariableAssignments() -> Detects all valueExpressions correctly. #24`, t => {
	setupMany([ ["new ", "new "], ["Foo", "Foo"], ["true", true] ]);

	const statements = parse(`
		const a = new Foo(true)
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"].valueExpression, ["new ", new BindingIdentifier("Foo"), "(", true, ")"]);
});

test(`getVariableAssignments() -> Detects all valueExpressions correctly. #25`, t => {
	setupMany([ ["Foo", "Foo"], ["A", "A"] ]);

	const statements = parse(`
		const a = Foo.A;
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"].valueExpression, [new BindingIdentifier("Foo.A")]);
});

test(`getVariableAssignments() -> Detects all valueExpressions correctly. #26`, t => {
	setupMany([ ["Foo", "Foo"], ["A", "A"], ["B", "B"], ["C", "C"], ["D", "D"] ]);

	const statements = parse(`
		const a = Foo.A.B.C.D;
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"].valueExpression, [new BindingIdentifier("Foo.A.B.C.D")]);
});

test(`getVariableAssignments() -> Detects all valueExpressions correctly. #27`, t => {
	setupMany([ ["true", true] ]);

	const statements = parse(`
		const a = () => true;
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"].valueExpression, ["(", ")", "=>", true]);
});

test(`getVariableAssignments() -> Detects all valueExpressions correctly. #28`, t => {
	setupMany([ [ "foo", "foo" ], ["true", true] ]);

	const statements = parse(`
		const a = (foo: string) => true;
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"].valueExpression, ["(", "foo", ")", "=>", true]);
});

test(`getVariableAssignments() -> Detects all valueExpressions correctly. #29`, t => {
	setupMany([ [ "foo", "foo" ], ["true", true], ["return", "return"] ]);

	const statements = parse(`
		const a = (foo: string) => function () {return true;};
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"].valueExpression, ["(", "foo", ")", "=>", "function", "(", ")", "{", "return", true, "}"]);
});

test(`getVariableAssignments() -> Detects all valueExpressions correctly. #30`, t => {
	setupMany([ [ "Something", "Something" ], ["Other", "Other"], ["Than", "Than"], ["OtherThing", "OtherThing"], ["baz", "baz"] ]);

	const statements = parse(`
		const a = Something.Other.Than<OtherThing>("baz");
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"].valueExpression, [new BindingIdentifier("Something.Other.Than"), "(", "baz", ")"]);
});

test(`getVariableAssignments() -> Detects all valueExpressions correctly. #31`, t => {
	setupMany([ [ "Something", "Something" ], ["2", 2], ["Other", "Other"], ["Than", "Than"], ["OtherThing", "OtherThing"], ["baz", "baz"] ]);

	const statements = parse(`
		const a = Something[2].Other.Than<OtherThing>("baz");
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"].valueExpression, [new BindingIdentifier("Something[2].Other.Than"), "(", "baz", ")"]);
});

test(`getVariableAssignments() -> Detects all valueExpressions correctly. #32`, t => {
	setupMany([ ["test", "test"], ["false", false], ["foobar", "foobar"] ]);

	const statements = parse(`
		const a = test((foobar: number) => false);
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"].valueExpression, [new BindingIdentifier("test"), "(", "(", "foobar", ")", "=>", false, ")"]);
});

test(`getVariableAssignments() -> Detects all valueExpressions correctly. #33`, t => {
	setupMany([ ["2", 2], ["3", 3] ]);

	const statements = parse(`
		const a = 2 + 3;
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"].valueExpression, [2, "+", 3]);
});

test(`getVariableAssignments() -> Detects all valueExpressions correctly. #34`, t => {
	setupMany([ ["2", 2], ["3", 3], ["10", 10], ["5", 5] ]);

	const statements = parse(`
		const a = 2 + 3 * (10 * 5);
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"].valueExpression, [2, "+", 3, "*", "(", 10, "*", 5, ")"]);
});

test(`getVariableAssignments() -> Detects all valueExpressions correctly. #35`, t => {
	setupMany([ ["foo", "foo"], ["bar", "bar"] ]);

	const statements = parse(`
		const a = {...foo, ...bar};
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"].valueExpression, ["{", "...", new BindingIdentifier("foo"), ",", "...", new BindingIdentifier("bar"), "}"]);
});

test(`getVariableAssignments() -> Detects all valueExpressions correctly. #36`, t => {
	setupMany([ ["foo", "foo"], ["bar", "bar"], ["1", 1] ]);

	const statements = parse(`
		const a = {...{foo: 1}, ...bar};
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"].valueExpression, ["{", "...", "{", "foo", ":", 1, "}", ",", "...", new BindingIdentifier("bar"), "}"]);
});

test(`getVariableAssignments() -> Detects all valueExpressions correctly. #37`, t => {
	setupMany([ ["foo", "foo"], ["bar", "bar"] ]);

	const statements = parse(`
		const a = [...foo, ...bar];
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"].valueExpression, [ "[", "...", new BindingIdentifier("foo"), ",", "...", new BindingIdentifier("bar"), "]" ]);
});

test(`getVariableAssignments() -> Detects all valueExpressions correctly. #38`, t => {
	setupMany([ ["AssignmentMap", "AssignmentMap"], ["statement", "statement"], ["declarationList", "declarationList"], ["declarations", "declarations"], ["declaration", "declaration"], ["name", "name"], ["text", "text"], ["initializer", "initializer"], ["getInitializedValue", "getInitializedValue"], ["this", "this"] ]);

	const statements = parse(`
		const assignmentMap: AssignmentMap = {};
		const declarations = statement.declarationList.declarations;
		const boundName = declaration.name.text;
		const value = this.getInitializedValue(declaration.initializer);
	`);

	const assignments = service.getVariableAssignments(statements);

	t.deepEqual(assignments["assignmentMap"].valueExpression, [ "{", "}"  ]);
	t.deepEqual(assignments["declarations"].valueExpression, [ new BindingIdentifier("statement.declarationList.declarations") ]);
	t.deepEqual(assignments["boundName"].valueExpression, [ new BindingIdentifier("declaration.name.text") ]);
	t.deepEqual(assignments["value"].valueExpression, [ new BindingIdentifier("this.getInitializedValue"), "(", new BindingIdentifier("declaration.initializer"), ")" ]);
});

test(`getVariableAssignments() -> Detects all valueExpressions correctly. #39`, t => {
	setupMany([ ["foo", "foo"], ["bar", "bar"] ]);

	const statements = parse(`
		const a;
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"].valueExpression, null);
});

test(`getVariableAssignments() -> Detects all types correctly. #1`, t => {
	setupMany([ ["hello", "hello"] ]);

	const statements = parse(`
		const a = "hello";
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"].type, null);
});

test(`getVariableAssignments() -> Detects all types correctly. #2`, t => {
	setupMany([ ["hello", "hello"] ]);

	const statements = parse(`
		const a: string = "hello";
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"].type, "string");
});

test(`getVariableAssignments() -> Detects all types correctly. #3`, t => {
	setupMany([ ["hello", "hello"] ]);

	const statements = parse(`
		const a: string|symbol = "hello";
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"].type, "string|symbol");
});

test(`getVariableAssignments() -> Detects all types correctly. #4`, t => {
	setupMany([ ["hello", "hello"] ]);

	const statements = parse(`
		const a: Foo[] = "hello";
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"].type, "Foo[]");
});

test(`getVariableAssignments() -> Detects all types correctly. #5`, t => {
	setupMany([ ["key", "key"] ]);

	const statements = parse(`
		const a: {[key: string]: any} = "hello";
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"].type, "{[key: string]: any}");
});

test(`getVariableAssignments() -> Detects all types correctly. #6`, t => {
	setupMany([ ["key", "key"], ["foo", "foo"] ]);

	const statements = parse(`
		const a: {[key: string]: any, foo: number} = "hello";
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"].type, "{[key: string]: any, foo: number}");
});

test(`getVariableAssignments() -> Detects all types correctly. #7`, t => {
	setupMany([ ["foo", "foo"] ]);

	const statements = parse(`
		const a: {foo?: number} = "hello";
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"].type, "{foo?: number}");
});

test(`getVariableAssignments() -> Detects all types correctly. #8`, t => {
	setupMany([ ["foo", "foo"], ["bar", "bar"] ]);

	const statements = parse(`
		const a: {foo?: number} & {bar: boolean} = "hello";
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"].type, "{foo?: number} & {bar: boolean}");
});

test(`getVariableAssignments() -> Detects all types correctly. #9`, t => {
	setupMany([ ["Foobar", "Foobar"] ]);

	const statements = parse(`
		const a: Foobar = Foobar.HELLO;
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"].type, "Foobar");
});

test(`getClassDeclarations() -> Detects all class declarations properly. #1`, t => {
	setup();
	const code = `
		class MyClass {}
	`;

	const statements = parse(code);
	const assignments = service.getClassDeclarations(statements, fileName, code);
	t.true(assignments.length === 1);
});

test(`getClassDeclarations() -> Detects all class declarations properly. #2`, t => {
	setup();
	const code = `
		class MyClass {}
		class MyOtherClass {}
	`;

	const statements = parse(code);
	const assignments = service.getClassDeclarations(statements, fileName, code);
	t.true(assignments.length === 2);
});

test(`getClassDeclarations() -> Constructor -> Detects types of constructor arguments correctly. #1`, t => {
	setupMany([ ["arg1", "arg1"], ["arg2", "arg2"], ["arg3", "arg3"] ]);
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

test(`getClassDeclarations() -> Fields -> Detects all class fields. #1`, t => {
	setupMany([ ["field1", "field1"], ["field2", "field2"], ["field3", "field3"] ]);
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

test(`getClassDeclarations() -> Fields -> Detects the types of all class fields correctly. #1`, t => {
	setupMany([ ["field1", "field1"], ["field2", "field2"], ["field3", "field3"] ]);
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

test(`getClassDeclarations() -> Fields -> Detects the decorators of class fields correctly. #1`, t => {
	setupMany([ ["prop", "prop"], ["field1", "field1"], ["field2", "field2"], ["field3", "field3"] ]);
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

test(`getClassDeclarations() -> Fields -> Detects the decorators of class fields correctly. #2`, t => {
	setupMany([ ["field1", "field1"], ["field2", "field2"], ["setOnHost", "setOnHost"], ["prop", "prop"], ["blabla", "blabla"] ]);
	const code = `
		class MyClass {
			@prop field1: string;
			@setOnHost @blabla field2: number = 2;
		}
	`;

	const statements = parse(code);
	const assignments = service.getClassDeclarations(statements, fileName, code);
	const [classDeclaration] = assignments;
	t.true(classDeclaration.props["field1"].decorators.includes("prop"));
	t.true(classDeclaration.props["field2"].decorators.includes("setOnHost"));
	t.true(classDeclaration.props["field2"].decorators.includes("blabla"));
});

test(`getClassDeclarations() -> Fields -> Detects the decorators of class fields correctly. #3`, t => {
	setupMany([ ["field1", "field1"], ["prop", "prop"] ]);
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

test(`getClassDeclarations() -> Methods -> Detects method declarations correctly. #1`, t => {
	setupMany([ ["myMethod", "myMethod"], ["Hello", "Hello"], ["<hello></hello><goodbye><", "<hello></hello><goodbye><"], ["></for-now></goodbye>", "></for-now></goodbye>"] ]);
	const code = `
		class MyClass {
			public myMethod () {
				return \`<hello></hello><goodbye><\${Hello}></for-now></goodbye>\`;
			}
		}
	`;

	const statements = parse(code);
	const assignments = service.getClassDeclarations(statements, fileName, code);
	const [classDeclaration] = assignments;
	t.true(classDeclaration.methods["myMethod"] != null);
});