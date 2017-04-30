import {IMarshaller} from "@wessberg/marshaller";
import {test} from "ava";
import * as TypeMoq from "typemoq";
import {BindingIdentifier} from "../src/BindingIdentifier";
import {ArbitraryValueIndexable, InitializationValue, ISimpleLanguageService} from "../src/interface/ISimpleLanguageService";
import { SimpleLanguageService } from "../src/SimpleLanguageService";
import { FULL_CODE_EXAMPLE_1, FULL_CODE_EXAMPLE_2, FULL_CODE_EXAMPLE_3 } from "./FullCodeExamples";
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

// Tests
test(`getVariableAssignments() -> Detects all variable assignments recursively if deep is true. #1`, t => {
	setupMany([["0", 0], ["1", 1]]);
	
	const statements = parse(`
		if (true) {
			const bar: number = 1;
		}
	`);
	const assignments = service.getVariableAssignments(statements, true);
	t.true(assignments["bar"] != null);
});

test(`getVariableAssignments() -> Detects all variable assignments recursively if deep is true. #2`, t => {
	setupMany([ ["baz", "baz"], ["hehe", "hehe"] ]);
	
	const statements = parse(`

		function test () {
			const baz: string = "hehe";
		}

	`);
	const assignments = service.getVariableAssignments(statements, true);
	t.true(assignments["baz"] != null);
});

test(`getVariableAssignments() -> Detects all variable assignments recursively if deep is true. #3`, t => {
	setupMany([ ["foo", "foo"], ["hehe", "hehe"] ]);
	
	const statements = parse(`

		() => {
			const foo: string = "hehe";
		}

	`);
	const assignments = service.getVariableAssignments(statements, true);
	t.true(assignments["foo"] != null);
});

test(`getVariableAssignments() -> Detects all variable assignments recursively if deep is true. #4`, t => {
	setupMany([ ["foo", "foo"], ["hehe", "hehe"], ["a", "a"] ]);
	
	const statements = parse(`

		{
			a: () => {
				const foo: string = "hehe";
			}
		}

	`);
	const assignments = service.getVariableAssignments(statements, true);
	t.true(assignments["foo"] != null);
});

test(`getVariableAssignments() -> Detects all variable assignments recursively if deep is true. #5`, t => {
	setupMany([ ["foo", "foo"], ["hehe", "hehe"], ["a", "a"] ]);
	
	const statements = parse(`

		const foo = {
			a: () => {
				const bar: number = 2;
			}
		}

	`);
	const assignments = service.getVariableAssignments(statements, true);
	t.true(assignments["bar"] != null);
});

test(`getVariableAssignments() -> Detects all variable assignments recursively if deep is true. #6`, t => {
	setupMany([ ["foo", "foo"], ["bar", "bar"], ["b", "b"] ]);
	
	const statements = parse(`

		const foo = {
			a: () => {
				const bar = { b: () => {} };
			}
		}

	`);
	const assignments = service.getVariableAssignments(statements, true);
	t.true(assignments["bar"] != null);
});

test(`getVariableAssignments() -> Detects all variable assignments recursively if deep is true. #7`, t => {
	setupMany([ ["foo", "foo"], ["bar", "bar"], ["omg", "omg"], ["baz", "baz"], ["wow", "wow"], ["localVar", "localVar"], ["MyClass", "MyClass"], ["1", 1] ]);
	
	const statements = parse(`

		const foo = () => {
			const bar = function omg () {
				const baz = () => {
					const wow = class MyClass {
						constructor () {
							const localVar = [1];
						}
					};
				}
			};
		}

	`);
	const assignments = service.getVariableAssignments(statements, true);
	t.true(assignments["bar"] != null);
});

test(`getVariableAssignments() -> Detects all variable assignments recursively if deep is true. #8`, t => {
	setupMany([ ["foo", "foo"], ["bar", "bar"], ["baz", "baz"], ["Symbol", "Symbol"], ["hello", "hello"] ]);
	
	const statements = parse(`

		const foo = bar = () => {const baz = Symbol("hello");};

	`);
	const assignments = service.getVariableAssignments(statements, true);
	t.true(assignments["foo"] != null);
});

test(`getVariableAssignments() -> Detects all variable assignments recursively if deep is true. #9`, t => {
	setupMany([
		["documentElement", "documentElement"],
		["getElementsByTagName", "getElementsByTagName"],
		["length", "length"],
		["parseXML", "parseXML"],
		["e", "e"],
		["xml", "xml"],
		["ActiveXObject", "ActiveXObject"],
		["Microsoft.XMLDOM", "Microsoft.XMLDOM"],
		["parsererror", "parsererror"],
		["loadXML", "loadXML"],
		["tmp", "tmp"],
		["args", "args"],
		["proxy", "proxy"],
		["parseFromString", "parseFromString"],
		["data", "data"],
		["text/xml", "text/xml"],
		["parser", "parser"],
		["window", "window"],
		["DOMParser", "DOMParser"]
	]);
	
	const statements = parse(FULL_CODE_EXAMPLE_1);
	const assignments = service.getVariableAssignments(statements, true);
	t.true(assignments["args"] != null);
	t.true(assignments["parseXML"] != null);
	t.true(assignments["parser"] != null);
	t.true(assignments["proxy"] != null);
	t.true(assignments["tmp"] != null);
	t.true(assignments["xml"] != null);
});

test(`getVariableAssignments() -> Detects all variable assignments recursively if deep is true. #10`, t => {
	setupMany([
	["assert", "assert"],
	["types", "types"],
	["forVar", "forVar"],
	["util", "util"],
	["n", "n"],
	["isArray", "isArray"],
	["isNumber", "isNumber"],
	["copy", "copy"],
	["stack", "stack"],
	["s", "s"],
	["len", "len"],
	["value", "value"],
	["idx", "idx"],
	["isTsNode", "isTsNode"],
	["origLen", "origLen"],
	["argc", "argc"],
	["name", "name"],
	["result", "result"],
	["node", "node"],
	["length", "length"],
	["2", 2],
	["i", "i"],
	["0", 0],
	["10", 10],
	["doStuff", "doStuff"],
	["switchVar", "switchVar"],
	["true", true],
	["false", false],
	["lol", "lol"]
]);
	
	const statements = parse(FULL_CODE_EXAMPLE_2);
	const assignments = service.getVariableAssignments(statements, true);
	t.true(assignments["i"] != null);
	t.true(assignments["node"] != null);
	t.true(assignments["forVar"] != null);
	t.true(assignments["result"] != null);
	t.true(assignments["name"] != null);
	t.true(assignments["argc"] != null);
	t.true(assignments["origLen"] != null);
	t.true(assignments["isTsNode"] != null);
	t.true(assignments["idx"] != null);
	t.true(assignments["value"] != null);
	t.true(assignments["len"] != null);
	t.true(assignments["s"] != null);
	t.true(assignments["stack"] != null);
	t.true(assignments["copy"] != null);
	t.true(assignments["isNumber"] != null);
	t.true(assignments["isArray"] != null);
	t.true(assignments["n"] != null);
	t.true(assignments["util"] != null);
	t.true(assignments["types"] != null);
	t.true(assignments["assert"] != null);
});

test(`getVariableAssignments() -> Detects all variable assignments recursively if deep is true. #11`, t => {
	setupMany([
		["rawContent", "rawContent"],
		["match", "match"],
		["preferred", "preferred"],
		["regex", "regex"],
		["length", "length"],
		["node", "node"],
		["extra", "extra"],
		["alternate", "alternate"],
		["raw", "raw"],
		["/(^[A-Z])|^[_$]+$/", /(^[A-Z])|^[_$]+$/]
]);
	
	const statements = parse(FULL_CODE_EXAMPLE_3);
	const assignments = service.getVariableAssignments(statements, true);
	t.true(assignments["i"] != null);
});

test(`getVariableAssignments() -> Detects all valueExpressions correctly. #1`, t => {
	setup<number>("0", 0);

	const statements = parse(`
		const foo: number = 0;
	`);
	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["foo"].value.expression, [0]);
});

test(`getVariableAssignments() -> Detects all valueExpressions correctly. #2`, t => {
	setup<number>("Infinity", Infinity);

	const statements = parse(`
		const foo: number = Infinity;
	`);
	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["foo"].value.expression, [Infinity]);
});

test(`getVariableAssignments() -> Detects all valueExpressions correctly. #3`, t => {
	setup<number>("NaN", NaN);

	const statements = parse(`
		const foo: number = NaN;
	`);
	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["foo"].value.expression, [NaN]);
});

test(`getVariableAssignments() -> Detects all valueExpressions correctly. #4`, t => {
	setupMany([ ["this has the substitution ", "this has the substitution "], ["substitution", "substitution"], ["", ""]  ]);

	const statements = parse(`
		const substitution = 2;
		const foo: string = \`this has the substitution \${substitution}\`;
	`);
	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["foo"].value.expression, ["`", "this has the substitution ", "${", new BindingIdentifier("substitution", null), "}", "`"]);
});

test(`getVariableAssignments() -> Detects all valueExpressions correctly. #5`, t => {
	setupMany([["this has the substitution ", "this has the substitution "], ["2", "2"], ["", ""]]);

	const statements = parse(`
		const substitution = 2;
		const foo: string = \`this has the substitution \${2}\`;
	`);
	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["foo"].value.expression, ["`", "this has the substitution ", "2", "`"]);
});

test(`getVariableAssignments() -> Detects all valueExpressions correctly. #6`, t => {
	setup<boolean>("true", true);
	const statements = parse(`
		let bar = true;
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["bar"].value.expression, [true]);
});

test(`getVariableAssignments() -> Detects all valueExpressions correctly. #7`, t => {
	setupMany([ ["1", 1], ["2", 2], ["3", 3] ]);

	const statements = parse(`
		var baz = [1, 2, 3];
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["baz"].value.expression, ["[", 1, ",", 2, ",", 3, "]"]);
});

test(`getVariableAssignments() -> Detects all valueExpressions correctly. #8`, t => {
	setupMany([["true", true], ["false", false], ["Infinity", Infinity]]);
	const statements = parse(`
		const a = true, b = false, c = Infinity;
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"].value.expression, [true]);
	t.deepEqual(assignments["b"].value.expression, [false]);
	t.deepEqual(assignments["c"].value.expression, [Infinity]);
});

test(`getVariableAssignments() -> Detects all valueExpressions correctly. #9`, t => {
	setup<string>("this is a template string");

	const statements = parse(`
		const a = \`this is a ${"template string"}\`;
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"].value.expression, ["this is a template string"]);
});

test(`getVariableAssignments() -> Detects all valueExpressions correctly. #10`, t => {
	setupMany([["1", 1], ["2", 2], ["3", 3], ["foo", "foo"], ["false", false] ]);

	const statements = parse(`
		const a = [1, "foo", false, [1, 2, 3]]
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"].value.expression, ["[", 1, ",", "foo", ",", false, ",", "[", 1, ",", 2, ",", 3, "]", "]",]);
});

test(`getVariableAssignments() -> Detects all valueExpressions correctly. #11`, t => {
	setupMany([[ "1", 1], ["a", "a"] ]);

	const statements = parse(`
		const a = {a: 1};
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"].value.expression, ["{", "a", ":", 1, "}"]);
});

test(`getVariableAssignments() -> Detects all valueExpressions correctly. #12`, t => {
	setupMany([ ["1", 1], ["key", "key"] ]);

	const statements = parse(`
		const key = "foo";
		const a = {[key]: 1};
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"].value.expression, ["{", "[", new BindingIdentifier("key", null), "]", ":", 1, "}"]);
});

test(`getVariableAssignments() -> Detects all valueExpressions correctly. #13`, t => {
	setupMany([["1", 1], ["0", 0]]);

	const statements = parse(`
		const key = 0;
		const a = {0: 1};
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"].value.expression, ["{", 0, ":", 1, "}"]);
});

test(`getVariableAssignments() -> Detects all valueExpressions correctly. #14`, t => {
	setupMany([["1", 1], ["123", 123]]);

	const statements = parse(`
		const key = 0;
		const a = {123: 1};
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"].value.expression, ["{", 123, ":", 1, "}"]);
});

test(`getVariableAssignments() -> Detects all valueExpressions correctly. #15`, t => {
	setupMany([["Hello world!", "Hello world!"], ["Symbol", "Symbol"] ]);

	const statements = parse(`
		const key = 0;
		const a = Symbol("Hello world!");
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"].value.expression, [new BindingIdentifier("Symbol", null), "(", "Hello world!", ")"]);
});

test(`getVariableAssignments() -> Detects all valueExpressions correctly. #16`, t => {
	setupMany([["a", "a"], ["1", 1] ]);

	const statements = parse(`
		const a = {"a": 1};
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"].value.expression, ["{", "a", ":", 1, "}"]);
});

test(`getVariableAssignments() -> Detects all valueExpressions correctly. #17`, t => {
	setupMany([["a", "a"], ["0", "0"], ["1", 1] ]);

	const statements = parse(`
		const a = {"0": 1};
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"].value.expression, ["{", "0", ":", 1, "}"]);
});

test(`getVariableAssignments() -> Detects all valueExpressions correctly. #18`, t => {
	setupMany([["a", "a"], ["getKey", "getKey"], ["test", "test"], ["1", 1] ]);

	const statements = parse(`
		function getKey () {return "test";}
		const a = {[getKey()]: 1};
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"].value.expression, ["{", "[", new BindingIdentifier("getKey", null), "(", ")", "]", ":", 1, "}"]);
});

test(`getVariableAssignments() -> Detects all valueExpressions correctly. #19`, t => {
	setupMany([["a", "a"], ["getKey", "getKey"], ["test", "test"], ["1", "1"], ["Infinity", Infinity], ["false", false], ["123", 123] ]);

	const statements = parse(`
		function getKey (num: number, bool: boolean, arr: number[]) {return "test";}
		const a = {[getKey("1", false, [123])]: Infinity};
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"].value.expression, ["{", "[", new BindingIdentifier("getKey", null), "(", "1", ",", false, ",", "[",123, "]", ")", "]", ":", Infinity, "}"]);
});

test(`getVariableAssignments() -> Detects all valueExpressions correctly. #20`, t => {
	setupMany([ ["foo", "foo"], ["bar", "bar"], ["baz", "baz"], ["Foo", "Foo"], ["true", true], ["false", false] ]);

	const statements = parse(`
		const a = {foo: {bar: {baz: new Foo(true, false)}}};
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"].value.expression, ["{", "foo", ":", "{", "bar", ":", "{", "baz", ":", "new", " ", new BindingIdentifier("Foo", null), "(", true, ",", false, ")", "}", "}", "}" ]);
});

test(`getVariableAssignments() -> Detects all valueExpressions correctly. #21`, t => {
	setupMany([["1", 1], ["0", 0] ]);

	const statements = parse(`
		const a = true ? 1 : 0;
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"].value.expression, [true, "?", 1, ":", 0]);
});

test(`getVariableAssignments() -> Detects all valueExpressions correctly. #22`, t => {
	setupMany([["1", 1], ["0", 0], ["sub", "sub"] ]);

	const statements = parse(`
		const sub = true;
		const a = sub ? 1 : 0;
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"].value.expression, [new BindingIdentifier("sub", null), "?", 1, ":", 0]);
});

test(`getVariableAssignments() -> Detects all valueExpressions correctly. #23`, t => {
	setupMany([["1", 1], ["null", null], ["sub", "sub"], ["false", false], ["true", true] ]);

	const statements = parse(`
		const sub = true;
		const a = sub && true ? false && 1 ? false : null : null;
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"].value.expression, [new BindingIdentifier("sub", null), "&&", true, "?", false, "&&", 1, "?", false, ":", null, ":", null]);
});

test(`getVariableAssignments() -> Detects all valueExpressions correctly. #24`, t => {
	setupMany([ ["new ", "new "], ["Foo", "Foo"], ["true", true] ]);

	const statements = parse(`
		const a = new Foo(true)
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"].value.expression, ["new", " ", new BindingIdentifier("Foo", null), "(", true, ")"]);
});

test(`getVariableAssignments() -> Detects all valueExpressions correctly. #25`, t => {
	setupMany([ ["Foo", "Foo"], ["A", "A"] ]);

	const statements = parse(`
		const a = Foo.A;
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"].value.expression, [new BindingIdentifier("Foo", ["A"])]);
});

test(`getVariableAssignments() -> Detects all valueExpressions correctly. #26`, t => {
	setupMany([ ["Foo", "Foo"], ["A", "A"], ["B", "B"], ["C", "C"], ["D", "D"] ]);

	const statements = parse(`
		const a = Foo.A.B.C.D;
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"].value.expression, [new BindingIdentifier("Foo", ["A", "B", "C", "D"])]);
});

test(`getVariableAssignments() -> Detects all valueExpressions correctly. #27`, t => {
	setupMany([ ["true", true] ]);

	const statements = parse(`
		const a = () => true;
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"].value.expression, ["(", ")", "=>", true]);
});

test(`getVariableAssignments() -> Detects all valueExpressions correctly. #28`, t => {
	setupMany([ [ "foo", "foo" ], ["true", true] ]);

	const statements = parse(`
		const a = (foo: string) => true;
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"].value.expression, ["(", "foo", ")", "=>", true]);
});

test(`getVariableAssignments() -> Detects all valueExpressions correctly. #29`, t => {
	setupMany([ [ "foo", "foo" ], ["true", true], ["return", "return"] ]);

	const statements = parse(`
		const a = (foo: string) => function () {return true;};
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"].value.expression, ["(", "foo", ")", "=>", "function", " ", "(", ")", "{", "return", " ", true, "}"]);
});

test(`getVariableAssignments() -> Detects all valueExpressions correctly. #30`, t => {
	setupMany([ [ "Something", "Something" ], ["Other", "Other"], ["Than", "Than"], ["OtherThing", "OtherThing"], ["baz", "baz"] ]);

	const statements = parse(`
		const a = Something.Other.Than<OtherThing>("baz");
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"].value.expression, [new BindingIdentifier("Something", ["Other", "Than"]), "(", "baz", ")"]);
});

test(`getVariableAssignments() -> Detects all valueExpressions correctly. #31`, t => {
	setupMany([ [ "Something", "Something" ], ["2", 2], ["Other", "Other"], ["Than", "Than"], ["OtherThing", "OtherThing"], ["baz", "baz"] ]);

	const statements = parse(`
		const a = Something[2].Other.Than<OtherThing>("baz");
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"].value.expression, [new BindingIdentifier("Something", [2, "Other", "Than"]), "(", "baz", ")"]);
});

test(`getVariableAssignments() -> Detects all valueExpressions correctly. #32`, t => {
	setupMany([ ["test", "test"], ["false", false], ["foobar", "foobar"] ]);

	const statements = parse(`
		const a = test((foobar: number) => false);
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"].value.expression, [new BindingIdentifier("test", null), "(", "(", "foobar", ")", "=>", false, ")"]);
});

test(`getVariableAssignments() -> Detects all valueExpressions correctly. #33`, t => {
	setupMany([ ["2", 2], ["3", 3] ]);

	const statements = parse(`
		const a = 2 + 3;
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"].value.expression, [2, "+", 3]);
});

test(`getVariableAssignments() -> Detects all valueExpressions correctly. #34`, t => {
	setupMany([ ["2", 2], ["3", 3], ["10", 10], ["5", 5] ]);

	const statements = parse(`
		const a = 2 + 3 * (10 * 5);
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"].value.expression, [2, "+", 3, "*", "(", 10, "*", 5, ")"]);
});

test(`getVariableAssignments() -> Detects all valueExpressions correctly. #35`, t => {
	setupMany([ ["foo", "foo"], ["bar", "bar"] ]);

	const statements = parse(`
		const a = {...foo, ...bar};
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"].value.expression, ["{", "...", new BindingIdentifier("foo", null), ",", "...", new BindingIdentifier("bar", null), "}"]);
});

test(`getVariableAssignments() -> Detects all valueExpressions correctly. #36`, t => {
	setupMany([ ["foo", "foo"], ["bar", "bar"], ["1", 1] ]);

	const statements = parse(`
		const a = {...{foo: 1}, ...bar};
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"].value.expression, ["{", "...", "{", "foo", ":", 1, "}", ",", "...", new BindingIdentifier("bar", null), "}"]);
});

test(`getVariableAssignments() -> Detects all valueExpressions correctly. #37`, t => {
	setupMany([ ["foo", "foo"], ["bar", "bar"] ]);

	const statements = parse(`
		const a = [...foo, ...bar];
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"].value.expression, [ "[", "...", new BindingIdentifier("foo", null), ",", "...", new BindingIdentifier("bar", null), "]" ]);
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

	t.deepEqual(assignments["assignmentMap"].value.expression, [ "{", "}"  ]);
	t.deepEqual(assignments["declarations"].value.expression, [ new BindingIdentifier("statement", ["declarationList", "declarations"]) ]);
	t.deepEqual(assignments["boundName"].value.expression, [ new BindingIdentifier("declaration", ["name", "text"]) ]);
	t.deepEqual(assignments["value"].value.expression, [ new BindingIdentifier("this", ["getInitializedValue"]), "(", new BindingIdentifier("declaration", ["initializer"]), ")" ]);
});

test(`getVariableAssignments() -> Detects all valueExpressions correctly. #39`, t => {
	setupMany([ ["foo", "foo"], ["bar", "bar"] ]);

	const statements = parse(`
		const a;
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"].value.expression, null);
});

test(`getVariableAssignments() -> Detects all valueExpressions correctly. #40`, t => {
	setupMany([ ["foo", "foo"], ["bar", "bar"], ["hehe", "hehe"], ["a", "a"] ]);
	
	const statements = parse(`

		const foo = {
			a: () => {
				const bar: string = "hehe";
			}
		}

	`);
	const assignments = service.getVariableAssignments(statements, true);
	t.deepEqual(assignments["foo"].value.expression, ["{", "a", ":", "(", ")", "=>", "{", "const", " ", "bar", ":", "string", "=", "hehe", "}", "}"]);
});

test(`getVariableAssignments() -> Detects all valueExpressions correctly. #41`, t => {
	setupMany([ ["foo", "foo"], ["bar", "bar"], ["hehe", "hehe"], ["a", "a"] ]);
	
	const statements = parse(`

		const foo = {
			a () {
				let bar: string = "hehe";
			}
		}

	`);
	const assignments = service.getVariableAssignments(statements, true);
	t.deepEqual(assignments["foo"].value.expression, ["{", "a", "(", ")", "{", "let", " ", "bar", ":", "string", "=", "hehe", "}", "}"]);
});

test(`getVariableAssignments() -> Detects all valueExpressions correctly. #42`, t => {
	setupMany([ ["wow", "wow"], ["MyClass", "MyClass"], ["localVar", "localVar"], ["1", 1] ]);
	
	const statements = parse(`

	const wow = class MyClass {
						constructor () {
							const localVar = [1];
						}
					};

	`);
	const assignments = service.getVariableAssignments(statements, true);
	t.deepEqual(assignments["wow"].value.expression, [ "class", " ", "MyClass", "{", "constructor", "(", ")", "{", "const", " ", "localVar", "=", "[", 1, "]", "}", "}" ]);
});

test(`getVariableAssignments() -> Detects all valueExpressions correctly. #43`, t => {
	setupMany([ ["wow", "wow"], ["MyClass", "MyClass"], ["MyOtherClass", "MyOtherClass"] ]);
	
	const statements = parse(`

	const wow = class MyClass extends MyOtherClass<Lol> {};

	`);
	const assignments = service.getVariableAssignments(statements, true);
	t.deepEqual(assignments["wow"].value.expression, [ "class", " ", "MyClass", " ", "extends", " ", {name: "MyOtherClass", typeArguments: [{name: "Lol", typeArguments: null}]}, "{", "}" ]);
});

test(`getVariableAssignments() -> Detects all types correctly. #1`, t => {
	setupMany([ ["hello", "hello"] ]);

	const statements = parse(`
		const a = "hello";
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"].type.flattened, null);
});

test(`getVariableAssignments() -> Detects all types correctly. #2`, t => {
	setupMany([ ["hello", "hello"] ]);

	const statements = parse(`
		const a: string = "hello";
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"].type.flattened, "string");
});

test(`getVariableAssignments() -> Detects all types correctly. #3`, t => {
	setupMany([ ["hello", "hello"] ]);

	const statements = parse(`
		const a: string|symbol = "hello";
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"].type.flattened, "string|symbol");
});

test(`getVariableAssignments() -> Detects all types correctly. #4`, t => {
	setupMany([ ["hello", "hello"] ]);

	const statements = parse(`
		const a: Foo[] = "hello";
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"].type.flattened, "Foo[]");
});

test(`getVariableAssignments() -> Detects all types correctly. #5`, t => {
	setupMany([ ["key", "key"] ]);

	const statements = parse(`
		const a: {[key: string]: any} = "hello";
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"].type.flattened, "{[key: string]: any}");
});

test(`getVariableAssignments() -> Detects all types correctly. #6`, t => {
	setupMany([ ["key", "key"], ["foo", "foo"] ]);

	const statements = parse(`
		const a: {[key: string]: any, foo: number} = "hello";
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"].type.flattened, "{[key: string]: any, foo: number}");
});

test(`getVariableAssignments() -> Detects all types correctly. #7`, t => {
	setupMany([ ["foo", "foo"] ]);

	const statements = parse(`
		const a: {foo?: number} = "hello";
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"].type.flattened, "{foo?: number}");
});

test(`getVariableAssignments() -> Detects all types correctly. #8`, t => {
	setupMany([ ["foo", "foo"], ["bar", "bar"] ]);

	const statements = parse(`
		const a: {foo?: number} & {bar: boolean} = "hello";
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"].type.flattened, "{foo?: number} & {bar: boolean}");
});

test(`getVariableAssignments() -> Detects all types correctly. #9`, t => {
	setupMany([ ["Foobar", "Foobar"] ]);

	const statements = parse(`
		const a: Foobar = Foobar.HELLO;
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"].type.flattened, "Foobar");
});

test(`getClassDeclarations() -> Detects all class declarations properly. #1`, t => {
	setup();
	const code = `
		class MyClass {}
	`;

	const statements = parse(code);
	const assignments = service.getClassDeclarations(statements);
	t.true(Object.keys(assignments).length === 1);
});

test(`getClassDeclarations() -> Detects all class declarations properly. #2`, t => {
	setup();
	const code = `
		class MyClass {}
		class MyOtherClass {}
	`;

	const statements = parse(code);
	const assignments = service.getClassDeclarations(statements);
	t.true(Object.keys(assignments).length === 2);
});

test(`getClassDeclarations() -> Detects all class decorators properly. #1`, t => {
	setupMany([ ["MyDecorator", "MyDecorator"] ]);
	const code = `
		@MyDecorator
		class MyClass {}
	`;

	const statements = parse(code);
	const assignments = service.getClassDeclarations(statements);
	t.true(assignments["MyClass"].decorators["MyDecorator"] != null);
});

test(`getClassDeclarations() -> Constructor -> Detects types of constructor arguments correctly. #1`, t => {
	setupMany([ ["arg1", "arg1"], ["arg2", "arg2"], ["arg3", "arg3"] ]);
	const code = `
		class MyClass {
			constructor (arg1: string, arg2: number, arg3: Foo) {}
		}
	`;

	const statements = parse(code);
	const assignments = service.getClassDeclarations(statements);
	const classDeclaration = assignments["MyClass"];
	t.true(classDeclaration.constructor != null && classDeclaration.constructor.parameters.parametersList[0].type.flattened === "string");
	t.true(classDeclaration.constructor != null && classDeclaration.constructor.parameters.parametersList[1].type.flattened === "number");
	t.true(classDeclaration.constructor != null && classDeclaration.constructor.parameters.parametersList[2].type.flattened === "Foo");
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
	const assignments = service.getClassDeclarations(statements);
	const classDeclaration = assignments["MyClass"];
	t.true(classDeclaration.props["field1"] != null);
	t.true(classDeclaration.props["field2"] != null);
	t.true(classDeclaration.props["field3"] != null);
});

test(`getClassDeclarations() -> Fields -> Detects the valueExpressions of class fields. #1`, t => {
	setupMany([ ["field1", "field1"], ["true", true] ]);
	const code = `
		class MyClass {
			field1 = () => true;
		}
	`;

	const statements = parse(code);
	const assignments = service.getClassDeclarations(statements);
	const classDeclaration = assignments["MyClass"];
	t.deepEqual(classDeclaration.props["field1"].value.expression, ["(", ")", "=>", true]);
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
	const assignments = service.getClassDeclarations(statements);
	const classDeclaration = assignments["MyClass"];
	t.true(classDeclaration.props["field1"].type.flattened === "string");
	t.true(classDeclaration.props["field2"].type.flattened === "number");
	t.true(classDeclaration.props["field3"].type.flattened === "Foo");
});

test(`getClassDeclarations() -> Fields -> Detects the types of all class fields correctly. #2`, t => {
	setupMany([ ["field1", "field1"], ["Foo", "Foo"] ]);
	const code = `
		class MyClass {
			field1: Foo<Foo>;
		}
	`;

	const statements = parse(code);
	const assignments = service.getClassDeclarations(statements);
	const classDeclaration = assignments["MyClass"];
	t.true(classDeclaration.props["field1"].type.flattened === "Foo<Foo>");
});

test(`getClassDeclarations() -> Fields -> Detects the types of all class fields correctly. #3`, t => {
	setupMany([ ["field1", "field1"], ["Foo", "Foo"], ["Bar", "Bar"], ["Baz", "Baz"] ]);
	const code = `
		class MyClass {
			field1: Foo<Bar, Baz>;
		}
	`;

	const statements = parse(code);
	const assignments = service.getClassDeclarations(statements);
	const classDeclaration = assignments["MyClass"];
	t.true(classDeclaration.props["field1"].type.flattened === "Foo<Bar, Baz>");
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
	const assignments = service.getClassDeclarations(statements);
	const classDeclaration = assignments["MyClass"];
	t.true(Object.keys(classDeclaration.props["field1"].decorators).length === 1);
	t.true(Object.keys(classDeclaration.props["field2"].decorators).length === 0);
	t.true(Object.keys(classDeclaration.props["field3"].decorators).length === 0);
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
	const assignments = service.getClassDeclarations(statements);
	const classDeclaration = assignments["MyClass"];
	t.true(classDeclaration.props["field1"].decorators["prop"] != null);
	t.true(classDeclaration.props["field2"].decorators["setOnHost"] != null);
	t.true(classDeclaration.props["field2"].decorators["blabla"] != null);
});

test(`getClassDeclarations() -> Fields -> Detects the decorators of class fields correctly. #3`, t => {
	setupMany([ ["field1", "field1"], ["prop", "prop"] ]);
	const code = `
		class MyClass {
			@prop() field1: string;
		}
	`;

	const statements = parse(code);
	const assignments = service.getClassDeclarations(statements);
	const classDeclaration = assignments["MyClass"];
	t.true(classDeclaration.props["field1"].decorators["prop"] != null);
});

test(`getClassDeclarations() -> Methods -> Detects method declarations correctly. #1`, t => {
	setupMany([ ["myMethod", "myMethod"], ["true", true] ]);
	const code = `
		class MyClass {
			public myMethod () {
				return true;
			}
		}
	`;

	const statements = parse(code);
	const assignments = service.getClassDeclarations(statements);
	const classDeclaration = assignments["MyClass"];
	t.true(classDeclaration.methods["myMethod"] != null);
});

test(`getClassDeclarations() -> Methods -> Detects method declarations correctly. #2`, t => {
	setupMany([ ["myMethod", "myMethod"], ["Hello", "Hello"], ["<hello></hello><goodbye><", "<hello></hello><goodbye><"], ["></for-now></goodbye>", "></for-now></goodbye>"] ]);
	const code = `
		class MyClass {
			public myMethod () {
				return \`<hello></hello><goodbye><\${Hello}></for-now></goodbye>\`;
			}
		}
	`;

	const statements = parse(code);
	const assignments = service.getClassDeclarations(statements);
	const classDeclaration = assignments["MyClass"];
	t.true(classDeclaration.methods["myMethod"] != null);
});

test(`getCallExpressions() -> Detects methods correctly. #1`, t => {
	setupMany([ ["0", 0], ["Foo", "Foo"], ["Bar", "Bar"], ["Hello world!", "Hello world!"], ["service", "service"], ["registerTransient", "registerTransient"], ["helloWorld", "helloWorld"] ]);
	const code = `
		service.registerTransient[0].helloWorld<Foo, Bar>("Hello world!");
	`;

	const statements = parse(code);
	const callExpressions = service.getCallExpressions(statements);
	const expression = callExpressions.find(exp => exp.identifier === "helloWorld");
	t.true(expression != null);
});

test(`getCallExpressions() -> Detects methods correctly. #2`, t => {
	setupMany([ ["Foo", "Foo"], ["Bar", "Bar"], ["Hello world!", "Hello world!"], ["helloWorld", "helloWorld"] ]);
	const code = `
		helloWorld<Foo, Bar>("Hello world!");
	`;

	const statements = parse(code);
	const callExpressions = service.getCallExpressions(statements);
	const expression = callExpressions.find(exp => exp.identifier === "helloWorld");
	t.true(expression != null);
});

test(`getCallExpressions() -> Detects methods correctly. #3`, t => {
	setupMany([ ["Foo", "Foo"], ["Bar", "Bar"], ["Hello world!", "Hello world!"], ["helloWorld", "helloWorld"] ]);
	const code = `
		helloWorld<Foo, Bar>("Hello world!");
	`;

	const statements = parse(code);
	const callExpressions = service.getCallExpressions(statements);
	const expression = callExpressions.find(exp => exp.property == null);
	t.true(expression != null);
});

test(`getCallExpressions() -> Detects methods correctly. #3`, t => {
	setupMany([ ["Foo", "Foo"], ["Bar", "Bar"], ["Hello world!", "Hello world!"], ["helloWorld", "helloWorld"], ["service", "service"] ]);
	const code = `
		service.helloWorld<Foo, Bar>("Hello world!");
	`;

	const statements = parse(code);
	const callExpressions = service.getCallExpressions(statements);
	const expression = callExpressions.find(exp => exp.identifier === "helloWorld");
	t.true(expression != null);
});

test(`getCallExpressions() -> Detects typeArguments correctly. #1`, t => {
	setupMany([ ["Foo", "Foo"], ["Bar", "Bar"], ["Hello world!", "Hello world!"], ["helloWorld", "helloWorld"], ["service", "service"] ]);
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
	setupMany([ ["Foo", "Foo"], ["Bar", "Bar"], ["Hello world!", "Hello world!"], ["helloWorld", "helloWorld"], ["service", "service"] ]);
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
	setupMany([ ["Foo", "Foo"], ["Bar", "Bar"], ["Hello world!", "Hello world!"], ["helloWorld", "helloWorld"], ["service", "service"] ]);
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
	setupMany([ ["Foo", "Foo"], ["Bar", "Bar"], ["Hello world!", "Hello world!"], ["helloWorld", "helloWorld"], ["service", "service"] ]);
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
	setupMany([ ["Foo", "Foo"], ["Bar", "Bar"], ["Hello world!", "Hello world!"], ["helloWorld", "helloWorld"], ["service", "service"] ]);
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
	setupMany([ ["Foo", "Foo"], ["Bar", "Bar"], ["Hello world!", "Hello world!"], ["helloWorld", "helloWorld"], ["service", "service"] ]);
	const code = `
		service.helloWorld<Foo>("Hello world!");
	`;

	const statements = parse(code);
	const callExpressions = service.getCallExpressions(statements);
	const expression = callExpressions
		.find(exp => exp.arguments.argumentsList.find(arg => arg.value.expression != null && arg.value.expression.includes("Hello world!")) != null);
	t.true(expression != null);
});

test(`getCallExpressions() -> Flattens property paths correctly. #1`, t => {
	setupMany([ ["0", 0], ["Foo", "Foo"], ["Bar", "Bar"], ["Hello world!", "Hello world!"], ["service", "service"], ["registerTransient", "registerTransient"], ["helloWorld", "helloWorld"] ]);
	const code = `
		service.registerTransient[0].helloWorld<Foo, Bar>("Hello world!");
	`;

	const statements = parse(code);
	const callExpressions = service.getCallExpressions(statements);
	t.true(callExpressions.some(callExpression => callExpression.property instanceof BindingIdentifier && callExpression.property.toString() === 'service["registerTransient"][0]'));
});

test(`getCallExpressions() -> Flattens property paths correctly. #2`, t => {
	setupMany([ ["service", "service"], ["registerTransient", "registerTransient"], ["helloWorld", "helloWorld"] ]);
	const code = `
		service.registerTransient.helloWorld());
	`;

	const statements = parse(code);
	const callExpressions = service.getCallExpressions(statements);
	t.true(callExpressions.some(callExpression => callExpression.property instanceof BindingIdentifier && callExpression.property.toString() === 'service["registerTransient"]'));
});

test(`getCallExpressions() -> Flattens property paths correctly. #3`, t => {
	setupMany([ ["service", "service"], ["registerTransient", "registerTransient"], ["helloWorld", "helloWorld"] ]);
	const code = `
		service.helloWorld());
	`;

	const statements = parse(code);
	const callExpressions = service.getCallExpressions(statements);
	t.true(callExpressions.some(callExpression => callExpression.property != null && callExpression.property.toString() === "service"));
});

test(`getNewExpressions() -> Detects new-statements correctly. #1`, t => {
	setupMany([ ["HelloWorld", "HelloWorld"] ]);
	const code = `
		new HelloWorld();
	`;

	const statements = parse(code);
	const newExpressions = service.getNewExpressions(statements);
	t.true(newExpressions.find(exp => exp.identifier === "HelloWorld") != null);
});

test(`getNewExpressions() -> Detects new-statements correctly. #2`, t => {
	setupMany([ ["HelloWorld", "HelloWorld"], ["hmm", "hmm"] ]);
	const code = `
		new hmm.HelloWorld();
	`;

	const statements = parse(code);
	const newExpressions = service.getNewExpressions(statements);
	t.true(newExpressions.find(exp => exp.identifier === "HelloWorld") != null);
});