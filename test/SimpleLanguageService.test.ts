import {IMarshaller, Marshaller} from "@wessberg/marshaller";
import {test} from "ava";
import * as TypeMoq from "typemoq";
import {BindingIdentifier} from "../src/BindingIdentifier";
import {ArbitraryValueIndexable, InitializationValue, ISimpleLanguageService} from "../src/interface/ISimpleLanguageService";
import { SimpleLanguageService } from "../src/SimpleLanguageService";
import { FULL_CODE_EXAMPLE_1, FULL_CODE_EXAMPLE_2, FULL_CODE_EXAMPLE_3, FULL_CODE_EXAMPLE_4, FULL_CODE_EXAMPLE_6 } from "./FullCodeExamples";
import { TypeDetector } from "@wessberg/typedetector";
const Mock = TypeMoq.Mock;
const It = TypeMoq.It;

// Setup
const fileName = "a_file.ts";
const INTEGRATION_TEST = process.env.npm_config_integration === "true";
let marshaller = Mock.ofType<IMarshaller>();
let marshallerIntegrated = new Marshaller(new TypeDetector());
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
	if (INTEGRATION_TEST) {
		service = new SimpleLanguageService(marshallerIntegrated);
	} else {
		marshaller = Mock.ofType<IMarshaller>();
		setupMock<T>(input, output, treatUndefinedAsExpectedValue);
		service = new SimpleLanguageService(marshaller.object);
	}
	
}

function setupMany (inputOutputs: [InitializationValue | ArbitraryValueIndexable, InitializationValue | ArbitraryValueIndexable][], treatUndefinedAsExpectedValue: boolean = false): void {
	// Mock the Marshaller behavior.
	if (INTEGRATION_TEST) {
		service = new SimpleLanguageService(marshallerIntegrated);
	} else {
		marshaller = Mock.ofType<IMarshaller>();
		inputOutputs.forEach(pair => setupMock<typeof pair[1]>(pair[0], pair[1], treatUndefinedAsExpectedValue));
		service = new SimpleLanguageService(marshaller.object);
	}
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

test(`getVariableAssignments() -> Detects all variable assignments properly. #5`, t => {
	setupMany([ 
		["tween", "tween"],
		["collection", "collection"],
		["Animation", "Animation"],
		["tweeners", "tweeners"],
		["prop", "prop"],
		["concat", "concat"],
		["*", "*"]
	]);
	const statements = parse(`
		var tween,
			collection = (Animation.tweeners[prop] || []).concat(Animation.tweeners["*"]),
	`);

	const assignments = service.getVariableAssignments(statements);
	t.true(assignments["tween"] != null);
	t.true(assignments["collection"] != null);
});

test(`getVariableAssignments() -> Computes all resolved values correctly. #1`, t => {
	setupMany([
		["2", 2],
		["3", 3]
	]);
	const statements = parse(`
		const val = 2 + 3;
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["val"].value.resolve(), "5");
});

test(`getVariableAssignments() -> Computes all resolved values correctly. #2`, t => {
	setupMany([
		["2", 2],
		["3", 3],
		["5", 5],
		["10", 10]
	]);
	const statements = parse(`
		const val = 2 + 3 * (5 / 10);
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["val"].value.resolve(), "3.5");
});

test(`getVariableAssignments() -> Computes all resolved values correctly. #3`, t => {
	setupMany([
		["2", 2],
		["3", 3],
		["5", 5],
		["10", 10]
	]);
	const statements = parse(`
		const sub = 10;
		const val = 2 + 3 * (5 / sub);
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["val"].value.resolve(), "3.5");
});

test(`getVariableAssignments() -> Computes all resolved values correctly. #4`, t => {
	setupMany([
		["2", 2],
		["3", 3],
		["5", 5],
		["10", 10],
		["MyClass", "MyClass"],
		["foo", "foo"]
	]);
	const statements = parse(`
		class MyClass {
			static foo: number = 10;
		}
		const val = 2 + 3 * (5 / MyClass.foo);
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["val"].value.resolve(), "3.5");
});

test(`getVariableAssignments() -> Computes all resolved values correctly. #5`, t => {
	setupMany([
		["2", 2],
		["3", 3],
		["5", 5],
		["10", 10],
		["50", 50],
		["MyClass", "MyClass"],
		["foo", "foo"],
		["bar", "bar"]
	]);
	const statements = parse(`
		class MyClass {
			static bar: number = 50;
			static foo: number = MyClass.bar;
		}
		const val = 2 + 3 * (5 / MyClass.foo);
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["val"].value.resolve(), "2.3");
});

test(`getVariableAssignments() -> Computes all resolved values correctly. #6`, t => {
	setupMany([
		["2", 2],
		["3", 3],
		["25", 25],
		["20", 20],
		["a", "a"],
		["obj", "obj"],
		["obj2", "obj2"],
		["b", "b"],
		["c", "c"]
	]);
	const statements = parse(`
		const obj = {
			a: 25
		};
		
		const obj2 = {
			b: {
				c: 20
			}
		};
		const val = 2 + 3 * obj.a * obj2.b.c;
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["val"].value.resolve(), "1502");
});

test(`getVariableAssignments() -> Computes all resolved values correctly. #7`, t => {
	setupMany([
		["2", 2],
		["3", 3],
		["5", 5],
		["10", 10],
		["50", 50],
		["MyClass", "MyClass"],
		["foo", "foo"],
		["bar", "bar"]
	]);
	const statements = parse(`
		class MyClass {
			foo: number = 50;
			bar = this.foo;
		}
	`);

	const assignments = service.getClassDeclarations(statements);
	t.deepEqual(assignments["MyClass"].props["bar"].value.resolve(), "50");
});

test(`getVariableAssignments() -> Computes all resolved values correctly. #7`, t => {
	setupMany([
		["MyEnum", "MyEnum"],
		["FOO", "FOO"],
		["BAR", "BAR"],
		["10", 10]
	]);
	const statements = parse(`
		enum MyEnum {
			FOO, BAR = 10
		}
		const val = 2 + MyEnum.BAR;
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["val"].value.resolve(), "12");
});

test(`getVariableAssignments() -> Computes all resolved values correctly. #8`, t => {
	setupMany([
		["age", "age"],
		["99", 99],
		["I am 99 years old", "I am 99 years old"],
		["I am ", "I am "],
		[" years old", " years old"],
		["sub", "sub"],
		["val", "val"]
	]);
	const statements = parse(`
		let age = 99;
		
		const sub = \`
			I am \${age} years old
		\`
		const val = sub;
	`);

	const assignments = service.getVariableAssignments(statements);
	const value = assignments["val"].value.resolve();
	t.true(value != null && value.trim() === "I am 99 years old");
});

test(`getVariableAssignments() -> Computes all resolved values correctly. #9`, t => {
	setupMany([
		["age", "age"],
		["99", 99],
		["Hi, I'm Kate, and ", "Hi, I'm Kate, and "],
		["I am 99 years old", "I am 99 years old"],
		["I am ", "I am "],
		[" years old", " years old"],
		["sub", "sub"],
		["val", "val"]
	]);
	const statements = parse(`
		let age = 99;
		
		const sub = \`I am \${age} years old\`;
		const val = "Hi, I'm Kate, and " + sub;
	`);

	const assignments = service.getVariableAssignments(statements);
	const value = assignments["val"].value.resolve();
	t.true(value != null && value.trim() === "Hi, I'm Kate, and I am 99 years old");
});

test(`getVariableAssignments() -> Computes all resolved values correctly. #10`, t => {
	setupMany([
		["age", "age"],
		["99", 99],
		["Hi, I'm Kate, and ", "Hi, I'm Kate, and "],
		["I am 99 years old", "I am 99 years old"],
		["I am ", "I am "],
		[" years old", " years old"],
		["sub", "sub"],
		["val", "val"]
	]);
	const statements = parse(`
		let age = 99;
		
		const sub = \`I am \${age} years old\`;
		const val = \`Hi, I'm Kate, and \${sub}\`;
	`);

	const assignments = service.getVariableAssignments(statements);
	const value = assignments["val"].value.resolve();
	t.true(value != null && value.trim() === "Hi, I'm Kate, and I am 99 years old");
});

test(`getVariableAssignments() -> Computes all resolved values correctly. #11`, t => {
	setupMany([
		["age", "age"],
		["99", 99],
		["Hi, I'm Kate, and ", "Hi, I'm Kate, and "],
		["I am 99 years old", "I am 99 years old"],
		["I am ", "I am "],
		[" years old", " years old"],
		["sub", "sub"],
		["val", "val"]
	]);
	const statements = parse(`
		const val = [1, 2, "foo"];
	`);

	const assignments = service.getVariableAssignments(statements);
	const value = assignments["val"].value.resolve();
	t.true(value != null && value.trim() === '[1,2,"foo"]');
});

test(`getVariableAssignments() -> Computes all resolved values correctly. #12`, t => {
	setupMany([
		["foo", "foo"],
		["1", 1],
		["2", 2],
		["val", "val"]
	]);
	const statements = parse(`
		function foo () {
			return 1;
		}
		const val = 2 + foo();
	`);

	const assignments = service.getVariableAssignments(statements);
	const value = assignments["val"].value.resolve();
	t.deepEqual(value, "3");
});

test(`getVariableAssignments() -> Computes all resolved values correctly. #13`, t => {
	setupMany([
		["foo", "foo"],
		["1", 1],
		["2", 2],
		["3", 3],
		["bar", "bar"],
		["val", "val"]
	]);
	const statements = parse(`
	const bar = 3;
		function foo () {
			return bar + 1;
		}
		const val = 2 + foo();
	`);

	const assignments = service.getVariableAssignments(statements);
	const value = assignments["val"].value.resolve();
	t.deepEqual(value, "6");
});

test(`getVariableAssignments() -> Computes all resolved values correctly. #14`, t => {
	setupMany([
		["2", 2],
		["3", 3],
		["bar", "bar"],
		["val", "val"]
	]);
	const statements = parse(`
		const bar = 3;
		const val = 2 + (() => bar)();
	`);

	const assignments = service.getVariableAssignments(statements);
	const value = assignments["val"].value.resolve();
	t.deepEqual(value, "5");
});

test(`getVariableAssignments() -> Computes all resolved values correctly. #15`, t => {
	setupMany([
		["doOtherStuff", "doOtherStuff"],
		["3", 3],
		["val", "val"],
		["val1", "val1"],
		["val2", "val2"],
		["2", 2],
		["1", 1],
		["doStuff", "doStuff"]
	]);
	const statements = parse(`
		function doOtherStuff () {
			return 3;
		}
		function doStuff () {
			let val1 = 1;
			let val2 = val1 * 2;
			return val2 + doOtherStuff();
		}
		const val = doStuff();
	`);

	const assignments = service.getVariableAssignments(statements);
	const value = assignments["val"].value.resolve();
	t.deepEqual(value, "5");
});

test(`getVariableAssignments() -> Computes all resolved values correctly. #16`, t => {
	setupMany([
		["A", "A"],
		["foo", "foo"],
		["bar", "bar"],
		["a", "a"],
		["val", "val"]
	]);
	const statements = parse(`
		class A {
			foo: string = "bar";
		}
		
		const a = new A();
		const val = a.foo;
	`);

	const assignments = service.getVariableAssignments(statements);
	const value = assignments["val"].value.resolve();
	t.deepEqual(value, "bar");
});

test(`getVariableAssignments() -> Computes all resolved values correctly. #17`, t => {
	setupMany([
		["A", "A"],
		["foo", "foo"],
		["bar", "bar"],
		["a", "a"],
		["val", "val"],
		["foobar", "foobar"],
		["baz", "baz"]
	]);
	const statements = parse(`
		class A {
			foo: string = "bar";
			static foobar: string = "baz";
		}
		
		const a = new A();
		const val = A.foobar;
	`);

	const assignments = service.getVariableAssignments(statements);
	const value = assignments["val"].value.resolve();
	t.deepEqual(value, "baz");
});

test(`getVariableAssignments() -> Computes all resolved values correctly. #18`, t => {
	setupMany([
		["bool", "bool"],
		["2", 2],
		["3", 3],
		["5", 5]
	]);
	const statements = parse(`
		const bool = false;
		const val = (bool ? 2 : 3) + 5;
	`);

	const assignments = service.getVariableAssignments(statements);
	const value = assignments["val"].value.resolve();
	t.deepEqual(value, "8");
});

test.skip(`getVariableAssignments() -> Computes all resolved values correctly. #19`, t => {
	setupMany([
		["Foo", "Foo"],
		["add", "add"],
		["2", 2],
		["3", 3],
		["val", "val"]
	]);
	const statements = parse(`
		class Foo {
			static add (arg: number) {
				return arg + 3;
			}
		}
		const val = Foo.add(2);
	`);

	const assignments = service.getVariableAssignments(statements);
	const value = assignments["val"].value.resolve();
	t.deepEqual(value, "5");
});

test(`getVariableAssignments() -> Computes all resolved values correctly. #20`, t => {
	setupMany([
		["a", "a"],
		["b", "b"],
		["1", 1],
		["2", 2],
		["something", "something"]
	]);

	const code = `
	const something = [1, 2];
	const [a, b] = something;
	`;

	const statements = parse(code);
	const assignments = service.getVariableAssignments(statements, true);
	t.deepEqual(assignments["a"].value.resolve(), "1" );
	t.deepEqual(assignments["b"].value.resolve(), "2" );
});

test(`getVariableAssignments() -> Computes all resolved values correctly. #21`, t => {
	setupMany([
		["a", "a"],
		["b", "b"],
		["1", 1],
		["2", 2],
		["something", "something"]
	]);

	const code = `
	const something = {a: 1, b: 2};
	const {a, b} = something;
	`;

	const statements = parse(code);
	const assignments = service.getVariableAssignments(statements, true);
	t.deepEqual(assignments["a"].value.resolve(), "1" );
	t.deepEqual(assignments["b"].value.resolve(), "2" );
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
	t.true(assignments["isAsync"] != null);
	t.true(assignments["name"] != null);
	t.true(assignments["maybeASIProblem"] != null);
	t.true(assignments["flags"] != null);
	t.true(assignments["regex"] != null);
	t.true(assignments["otherQuote"] != null);
	t.true(assignments["enclosingQuote"] != null);
	t.true(assignments["numAlternateQuotes"] != null);
	t.true(assignments["numPreferredQuotes"] != null);
	t.true(assignments["shouldUseAlternateQuote"] != null);
	t.true(assignments["alternate"] != null);
	t.true(assignments["preferred"] != null);
	t.true(assignments["single"] != null);
	t.true(assignments["double"] != null);
	t.true(assignments["rawContent"] != null);
	t.true(assignments["raw"] != null);
	t.true(assignments["str"] != null);
	t.true(assignments["shouldGroup"] != null);
	t.true(assignments["right"] != null);
	t.true(assignments["NO_WRAP_PARENTS"] != null);
	t.true(assignments["multiLineElem"] != null);
	t.true(assignments["childrenGroupedByLine"] != null);
	t.true(assignments["numLeadingHard"] != null);
	t.true(assignments["numTrailingHard"] != null);
	t.true(assignments["jsxWhitespace"] != null);
	t.true(assignments["forcedBreak"] != null);
	t.true(assignments["closingLines"] != null);
	t.true(assignments["openingLines"] != null);
	t.true(assignments["next"] != null);
	t.true(assignments["children"] != null);
	t.true(assignments["expanded"] != null);
	t.true(assignments["hasComment"] != null);
	t.true(assignments["oneLine"] != null);
	t.true(assignments["printedGroups"] != null);
	t.true(assignments["shouldMerge"] != null);
	t.true(assignments["hasSeenCallExpression"] != null);
	t.true(assignments["currentGroup"] != null);
	t.true(assignments["groups"] != null);
	t.true(assignments["printedNodes"] != null);
	t.true(assignments["property"] != null);
	t.true(assignments["partsGroup"] != null);
	t.true(assignments["variance"] != null);
	t.true(assignments["parentExportDecl"] != null);
	t.true(assignments["decl"] != null);
	t.true(assignments["objMethod"] != null);
	t.true(assignments["canHaveTrailingComma"] != null);
	t.true(assignments["isFlowShorthandWithOneArg"] != null);
	t.true(assignments["flowTypeAnnotations"] != null);
	t.true(assignments["lastParam"] != null);
	t.true(assignments["paramsField"] != null);
	t.true(assignments["fun"] != null);
	t.true(assignments["printedExpanded"] != null);
	t.true(assignments["shouldBreak"] != null);
});

test(`getVariableAssignments() -> Detects all variable assignments recursively if deep is true. #12`, t => {
	setupMany([]);
	
	const statements = parse(FULL_CODE_EXAMPLE_4);
	const assignments = service.getVariableAssignments(statements, true);
	t.true(assignments["myVar"] != null);
	t.true(assignments["version"] != null);
	t.true(assignments["pathWithExtension"] != null);
	t.true(assignments["versionWithExtension"] != null);
	t.true(assignments["normalizedPath"] != null);
	t.true(assignments["source"] != null);
	t.true(assignments["resolvedMap"] != null);
	t.true(assignments["stringified"] != null);
	t.true(assignments["statements"] != null);
	t.true(assignments["match"] != null);
	t.true(assignments["path"] != null);
	t.true(assignments["snapshot"] != null);
	t.true(assignments["obj"] != null);
	t.true(assignments["substitutions"] != null);
	t.true(assignments["newIdentifier"] != null);
});

test(`getVariableAssignments() -> Detects all variable assignments recursively if deep is true. #13`, t => {
	setupMany([]);
	
	const statements = parse(FULL_CODE_EXAMPLE_6);
	const assignments = service.getVariableAssignments(statements, true);
	t.true(assignments["isFunction"] != null);
	t.true(assignments["rmargin"] != null);
	t.true(assignments["node"] != null);
	t.true(assignments["hasScripts"] != null);
	t.true(assignments["scripts"] != null);
	t.true(assignments["udataCur"] != null);
	t.true(assignments["first"] != null);
	t.true(assignments["pdataOld"] != null);
});

test(`getVariableAssignments() -> Detects all variable assignments recursively if deep is true. #14`, t => {
	setupMany([
		["matches", "matches"],
		["foo", "foo"],
		["length", "length"],
		["1", 1]
	]);
	
	const code = `

		const val = matches[foo.length - 1];
	
	`;
	const statements = parse(code);
	const assignments = service.getVariableAssignments(statements, true);
	t.deepEqual(assignments["val"].value.expression, [new BindingIdentifier("matches"), "[", new BindingIdentifier("foo"), '["length"]', "-", 1, "]" ] );
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
	t.deepEqual(assignments["foo"].value.expression, ["`", "this has the substitution ", "${", new BindingIdentifier("substitution"), "}", "`"]);
});

test(`getVariableAssignments() -> Detects all valueExpressions correctly. #5`, t => {
	setupMany([["this has the substitution ", "this has the substitution "], ["2", 2], ["", ""]]);

	const statements = parse(`
		const substitution = 2;
		const foo: string = \`this has the substitution \${2}\`;
	`);
	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["foo"].value.expression, ["`", "this has the substitution ", 2, "`"]);
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
	t.deepEqual(assignments["a"].value.expression, ["`this is a template string`"]);
});

test(`getVariableAssignments() -> Detects all valueExpressions correctly. #10`, t => {
	setupMany([["1", 1], ["2", 2], ["3", 3], ["foo", "foo"], ["false", false] ]);

	const statements = parse(`
		const a = [1, "foo", false, [1, 2, 3]]
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"].value.expression, ["[", 1, ",", "`foo`", ",", false, ",", "[", 1, ",", 2, ",", 3, "]", "]",]);
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
	t.deepEqual(assignments["a"].value.expression, ["{", "[", new BindingIdentifier("key"), "]", ":", 1, "}"]);
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
	t.deepEqual(assignments["a"].value.expression, [new BindingIdentifier("Symbol"), "(", "`Hello world!`", ")"]);
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
	t.deepEqual(assignments["a"].value.expression, ["{", "[", new BindingIdentifier("getKey"), "(", ")", "]", ":", 1, "}"]);
});

test(`getVariableAssignments() -> Detects all valueExpressions correctly. #19`, t => {
	setupMany([
			["a", "a"],
			["getKey", "getKey"],
			["test", "test"],
			["1", "1"],
			["Infinity", Infinity],
			["false", false],
			["123", 123]
	]);

	const statements = parse(`
		function getKey (num: number, bool: boolean, arr: number[]) {return "test";}
		const a = {[getKey("1", false, [123])]: Infinity};
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"].value.expression, ["{", "[", new BindingIdentifier("getKey"), "(", "`1`", ",", false, ",", "[",123, "]", ")", "]", ":", Infinity, "}"]);
});

test(`getVariableAssignments() -> Detects all valueExpressions correctly. #20`, t => {
	setupMany([ ["foo", "foo"], ["bar", "bar"], ["baz", "baz"], ["Foo", "Foo"], ["true", true], ["false", false] ]);

	const statements = parse(`
		const a = {foo: {bar: {baz: new Foo(true, false)}}};
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"].value.expression, ["{", "foo", ":", "{", "bar", ":", "{", "baz", ":", "new", " ", new BindingIdentifier("Foo"), "(", true, ",", false, ")", "}", "}", "}" ]);
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
	t.deepEqual(assignments["a"].value.expression, [new BindingIdentifier("sub"), "?", 1, ":", 0]);
});

test(`getVariableAssignments() -> Detects all valueExpressions correctly. #23`, t => {
	setupMany([["1", 1], ["null", null], ["sub", "sub"], ["false", false], ["true", true] ]);

	const statements = parse(`
		const sub = true;
		const a = sub && true ? false && 1 ? false : null : null;
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"].value.expression, [new BindingIdentifier("sub"), "&&", true, "?", false, "&&", 1, "?", false, ":", null, ":", null]);
});

test(`getVariableAssignments() -> Detects all valueExpressions correctly. #24`, t => {
	setupMany([ ["new ", "new "], ["Foo", "Foo"], ["true", true] ]);

	const statements = parse(`
		const a = new Foo(true)
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"].value.expression, ["new", " ", new BindingIdentifier("Foo"), "(", true, ")"]);
});

test(`getVariableAssignments() -> Detects all valueExpressions correctly. #25`, t => {
	setupMany([ ["Foo", "Foo"], ["A", "A"] ]);

	const statements = parse(`
		const a = Foo.A;
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"].value.expression, [new BindingIdentifier("Foo"), '["A"]']);
});

test(`getVariableAssignments() -> Detects all valueExpressions correctly. #26`, t => {
	setupMany([ ["Foo", "Foo"], ["A", "A"], ["B", "B"], ["C", "C"], ["D", "D"] ]);

	const statements = parse(`
		const a = Foo.A.B.C.D;
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"].value.expression, [new BindingIdentifier("Foo"), '["A"]', '["B"]', '["C"]', '["D"]' ]);
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
	t.deepEqual(assignments["a"].value.expression, ["(", "foo", ")", "=>", "function", " ", "(", ")", "{", "return", " ", true, ";", "}"]);
});

test(`getVariableAssignments() -> Detects all valueExpressions correctly. #30`, t => {
	setupMany([ [ "Something", "Something" ], ["Other", "Other"], ["Than", "Than"], ["OtherThing", "OtherThing"], ["baz", "baz"] ]);

	const statements = parse(`
		const a = Something.Other.Than<OtherThing>("baz");
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"].value.expression, [new BindingIdentifier("Something"), '["Other"]', '["Than"]', "(", "`baz`", ")"]);
});

test(`getVariableAssignments() -> Detects all valueExpressions correctly. #31`, t => {
	setupMany([ [ "Something", "Something" ], ["2", 2], ["Other", "Other"], ["Than", "Than"], ["OtherThing", "OtherThing"], ["baz", "baz"] ]);

	const statements = parse(`
		const a = Something[2].Other.Than<OtherThing>("baz");
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"].value.expression, [new BindingIdentifier("Something"), "[", 2, "]", '["Other"]', '["Than"]', "(", "`baz`", ")"]);
});

test(`getVariableAssignments() -> Detects all valueExpressions correctly. #32`, t => {
	setupMany([ ["test", "test"], ["false", false], ["foobar", "foobar"] ]);

	const statements = parse(`
		const a = test((foobar: number) => false);
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"].value.expression, [new BindingIdentifier("test"), "(", "(", "foobar", ")", "=>", false, ")"]);
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
	t.deepEqual(assignments["a"].value.expression, ["{", "...", new BindingIdentifier("foo"), ",", "...", new BindingIdentifier("bar"), "}"]);
});

test(`getVariableAssignments() -> Detects all valueExpressions correctly. #36`, t => {
	setupMany([ ["foo", "foo"], ["bar", "bar"], ["1", 1] ]);

	const statements = parse(`
		const a = {...{foo: 1}, ...bar};
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"].value.expression, ["{", "...", "{", "foo", ":", 1, "}", ",", "...", new BindingIdentifier("bar"), "}"]);
});

test(`getVariableAssignments() -> Detects all valueExpressions correctly. #37`, t => {
	setupMany([ ["foo", "foo"], ["bar", "bar"] ]);

	const statements = parse(`
		const a = [...foo, ...bar];
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"].value.expression, [ "[", "...", new BindingIdentifier("foo"), ",", "...", new BindingIdentifier("bar"), "]" ]);
});

test(`getVariableAssignments() -> Detects all valueExpressions correctly. #38`, t => {
	setupMany([ ["AssignmentMap", "AssignmentMap"], ["foo", "foo"], ["statement", "statement"], ["declarationList", "declarationList"], ["declarations", "declarations"], ["declaration", "declaration"], ["name", "name"], ["text", "text"], ["initializer", "initializer"], ["getInitializedValue", "getInitializedValue"], ["this", "this"] ]);

	const statements = parse(`
		const assignmentMap: AssignmentMap = {};
		const declarations = statement.declarationList.declarations;
		const boundName = declaration.name.text;
		const value = this.getInitializedValue(foo.initializer);
	`);

	const assignments = service.getVariableAssignments(statements);

	t.deepEqual(assignments["assignmentMap"].value.expression, [ "{", "}"  ]);
	t.deepEqual(assignments["declarations"].value.expression, [ new BindingIdentifier("statement"), '["declarationList"]', '["declarations"]' ]);
	t.deepEqual(assignments["boundName"].value.expression, [ new BindingIdentifier("declaration"), '["name"]', '["text"]' ]);
	t.deepEqual(assignments["value"].value.expression, [ new BindingIdentifier("this"), '["getInitializedValue"]', "(", new BindingIdentifier("foo"), '["initializer"]', ")" ]);
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
	t.deepEqual(assignments["foo"].value.expression, ["{", "a", ":", "(", ")", "=>", "{", "const", " ", "bar", ":", "string", "=", "`hehe`", ";", "}", "}"]);
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
	t.deepEqual(assignments["foo"].value.expression, ["{", "a", "(", ")", "{", "let", " ", "bar", ":", "string", "=", "`hehe`", ";", "}", "}"]);
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
	t.deepEqual(assignments["wow"].value.expression, [ "class", " ", "MyClass", "{", "constructor", "(", ")", "{", "const", " ", "localVar", "=", "[", 1, "]", ";", "}", "}" ]);
});

test(`getVariableAssignments() -> Detects all valueExpressions correctly. #43`, t => {
	setupMany([ ["wow", "wow"], ["MyClass", "MyClass"], ["MyOtherClass", "MyOtherClass"] ]);
	
	const statements = parse(`

	const wow = class MyClass extends MyOtherClass<Lol> {};

	`);
	const assignments = service.getVariableAssignments(statements, true);
	t.deepEqual(assignments["wow"].value.expression, [ "class", " ", "MyClass", " ", "extends", " ", {name: "MyOtherClass", typeArguments: [{name: "Lol", typeArguments: null}]}, "{", "}" ]);
});

test(`getVariableAssignments() -> Detects all valueExpressions correctly. #44`, t => {
	setupMany([
		["monday", "monday"],
		["tuesday", "tuesday"],
		["0", 0]
	]);

	const code = `
	
	const val = ["monday", "tuesday"][0];
	`;
	
	const statements = parse(code);
	const assignments = service.getVariableAssignments(statements, true);
	t.deepEqual(assignments["val"].value.expression, [ "[", "`monday`", ",", "`tuesday`", "]", "[", 0, "]" ]);
});

test(`getVariableAssignments() -> Detects all valueExpressions correctly. #45`, t => {
	setupMany([
		["slice", "slice"],
		["call", "call"]
	]);

	const code = `
	
	const val = [].slice.call;
	`;
	
	const statements = parse(code);
	const assignments = service.getVariableAssignments(statements, true);
	t.deepEqual(assignments["val"].value.expression, [ "[", "]", '["slice"]', '["call"]'  ]);
});

test(`getVariableAssignments() -> Detects all valueExpressions correctly. #46`, t => {
	setupMany([
		["foo", "foo"],
		["something", "something"],
		["concat", "concat"],
		["otherthing", "otherthing"]
	]);

	const code = `
	
	const val = (foo.something || []).concat(otherthing);
	`;
	
	const statements = parse(code);
	const assignments = service.getVariableAssignments(statements, true);
	t.deepEqual(assignments["val"].value.expression, [ "(", new BindingIdentifier("foo"), '["something"]', "||", "[", "]", ")", '["concat"]', "(", new BindingIdentifier("otherthing"), ")"  ]);
});

test(`getVariableAssignments() -> Detects all valueExpressions correctly. #47`, t => {
	setupMany([
		["a", "a"],
		["b", "b"],
		["something", "something"]
	]);

	const code = `
	const something = [1, 2];
	const [a, b] = something;
	`;

	const statements = parse(code);
	const assignments = service.getVariableAssignments(statements, true);
	t.deepEqual(assignments["a"].value.expression, [ new BindingIdentifier("something") ]);
	t.deepEqual(assignments["b"].value.expression, [ new BindingIdentifier("something") ]);
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
	const callExpressions = service.getCallExpressions(statements, true);
	const expression = callExpressions.find(exp => exp.identifier === "helloWorld");
	t.true(expression != null);
});

test(`getCallExpressions() -> Detects methods correctly. #2`, t => {
	setupMany([ ["Foo", "Foo"], ["Bar", "Bar"], ["Hello world!", "Hello world!"], ["helloWorld", "helloWorld"] ]);
	const code = `
		helloWorld<Foo, Bar>("Hello world!");
	`;

	const statements = parse(code);
	const callExpressions = service.getCallExpressions(statements, true);
	const expression = callExpressions.find(exp => exp.identifier === "helloWorld");
	t.true(expression != null);
});

test(`getCallExpressions() -> Detects methods correctly. #3`, t => {
	setupMany([ ["Foo", "Foo"], ["Bar", "Bar"], ["Hello world!", "Hello world!"], ["helloWorld", "helloWorld"] ]);
	const code = `
		helloWorld<Foo, Bar>("Hello world!");
	`;

	const statements = parse(code);
	const callExpressions = service.getCallExpressions(statements, true);
	const expression = callExpressions.find(exp => exp.property == null);
	t.true(expression != null);
});

test(`getCallExpressions() -> Detects methods correctly. #4`, t => {
	setupMany([ ["Foo", "Foo"], ["Bar", "Bar"], ["Hello world!", "Hello world!"], ["helloWorld", "helloWorld"], ["service", "service"] ]);
	const code = `
		service.helloWorld<Foo, Bar>("Hello world!");
	`;

	const statements = parse(code);
	const callExpressions = service.getCallExpressions(statements, true);
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
		.find(exp => exp.arguments.argumentsList.find(arg => arg.value.expression != null && arg.value.expression.includes("`Hello world!`")) != null);
	t.true(expression != null);
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

test(`getImportDeclarations() -> Detects import declarations correctly. #1`, t => {
	setupMany([]);
	const code = `
		import "./test";
	`;

	const statements = parse(code);
	const importDeclarations = service.getImportDeclarations(statements);
	t.true(importDeclarations.length === 1);
});

test(`getImportDeclarations() -> Detects import declarations correctly. #2`, t => {
	setupMany([]);
	const code = `
		import {Foo} from "./test/hello";
	`;

	const statements = parse(code);
	const importDeclarations = service.getImportDeclarations(statements);
	t.true(importDeclarations.length === 1);
});

test(`getImportDeclarations() -> Detects import declarations correctly. #3`, t => {
	setupMany([]);
	const code = `
		import * as Bar from "../Bar";
	`;

	const statements = parse(code);
	const importDeclarations = service.getImportDeclarations(statements);
	t.true(importDeclarations.length === 1);
});

test(`getImportDeclarations() -> Detects import declarations correctly. #4`, t => {
	setupMany([]);
	const code = `
		import Bar from "../Bar/foo.ts";
	`;

	const statements = parse(code);
	const importDeclarations = service.getImportDeclarations(statements);
	t.true(importDeclarations.length === 1);
});

test(`getImportDeclarations() -> Detects import declarations correctly. #5`, t => {
	setupMany([]);
	const code = `
		import Foo = require("./bar");
	`;

	const statements = parse(code);
	const importDeclarations = service.getImportDeclarations(statements);
	t.true(importDeclarations.length === 1);
});

test(`getImportDeclarations() -> Detects import declarations correctly. #6`, t => {
	setupMany([]);
	const code = `
		import Foo = require("./bar");
	`;

	const statements = parse(code);
	const importDeclarations = service.getImportDeclarations(statements);
	t.true(importDeclarations.length === 1);
});

test(`getImportDeclarations() -> Detects import declarations correctly. #7`, t => {
	setupMany([
		["Bar", "Bar"]
	]);
	const code = `
		import Foo = Bar;
	`;

	const statements = parse(code);
	const importDeclarations = service.getImportDeclarations(statements);
	t.true(importDeclarations.length === 1);
});

test(`getImportDeclarations() -> Detects import declarations correctly. #8`, t => {
	setupMany([
		["require", "require"]
	]);
	const code = `
		const foo = require("./bar");
	`;

	const statements = parse(code);
	const importDeclarations = service.getImportDeclarations(statements);
	t.true(importDeclarations.length === 1);
});

test.skip(`getImportDeclarations() -> Detects import declarations correctly. #8`, t => {
	setupMany([
		["require", "require"]
	]);
	const code = `
		require("./bar");
	`;

	const statements = parse(code);
	const importDeclarations = service.getImportDeclarations(statements);
	t.true(importDeclarations.length === 1);
});

test(`getImportDeclarations() -> Throws exceptions for empty import paths. #1`, t => {
	setupMany([
		["require", "require"]
	]);
	const code = `
		require("");
	`;

	const statements = parse(code);
	t.throws(service.getImportDeclarations.bind(null, statements));
});

test(`getImportDeclarations() -> Throws exceptions for empty import paths. #2`, t => {
	setupMany([
		["require", "require"]
	]);
	const code = `
		import "";
	`;

	const statements = parse(code);
	t.throws(service.getImportDeclarations.bind(null, statements));
});

test(`getImportDeclarations() -> Throws exceptions for empty import paths. #3`, t => {
	setupMany([
		["require", "require"]
	]);
	const code = `
		import Foo from "";
	`;

	const statements = parse(code);
	t.throws(service.getImportDeclarations.bind(null, statements));
});

test(`getImportDeclarations() -> Throws exceptions for empty import paths. #4`, t => {
	setupMany([
		["require", "require"]
	]);
	const code = `
		import * as Lol from "";
	`;

	const statements = parse(code);
	t.throws(service.getImportDeclarations.bind(null, statements));
});

test(`getFunctionDeclarations() -> Detects all function declarations properly. #1`, t => {
	setupMany([
		["foo", "foo"]
	]);
	const statements = parse(`
		function foo () {}
	`);
	const assignments = service.getFunctionDeclarations(statements);
	t.true(assignments["foo"] != null);
});

test(`getFunctionDeclarations() -> Detects all function declarations properly. #2`, t => {
	setupMany([
		["foo", "foo"],
		["bar", "bar"]
	]);
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
	setupMany([
		["foo", "foo"],
		["bar", "bar"],
		["MyDecorator", "MyDecorator"]
	]);
	const statements = parse(`
		@MyDecorator
		function foo () {
		}
	`);
	const assignments = service.getFunctionDeclarations(statements, true);
	t.true(assignments["foo"].decorators["MyDecorator"] != null);
});

test(`getFunctionDeclarations() -> Detects all function decorators properly. #2`, t => {
	setupMany([
		["foo", "foo"],
		["bar", "bar"],
		["MyDecorator", "MyDecorator"],
		["MyOtherDecorator", "MyOtherDecorator"]
	]);
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
	setupMany([
		["foo", "foo"],
		["arg1", "arg1"],
		["arg2", "arg2"],
		["arg3", "arg3"]
	]);
	const statements = parse(`

		function foo (arg1, arg2, arg3) {
		}
	`);
	const assignments = service.getFunctionDeclarations(statements, true);
	t.true(assignments["foo"].parameters.parametersList[0].name === "arg1");
	t.true(assignments["foo"].parameters.parametersList[1].name === "arg2");
	t.true(assignments["foo"].parameters.parametersList[2].name === "arg3");
});

test(`getFunctionDeclarations() -> Detects all function arguments properly #2`, t => {
	setupMany([
		["foo", "foo"],
		["arg1", "arg1"],
		["arg2", "arg2"],
		["arg3", "arg3"]
	]);
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
	setupMany([
		["foo", "foo"],
		["arg1", "arg1"],
		["hello", "hello"],
		["goodbye", "goodbye"]
	]);
	const statements = parse(`

		function foo (arg1: string = ("hello" + "goodbye")) {
		}
	`);
	const assignments = service.getFunctionDeclarations(statements, true);
	t.deepEqual(assignments["foo"].parameters.parametersList[0].value.expression, [ "(", "`hello`", "+", "`goodbye`", ")" ]);
});

test(`getFunctionDeclarations() -> Detects all enum declarations properly. #1`, t => {
	setupMany([
		["Foo", "Foo"],
		["A", "A"],
		["B", "B"],
		["C", "C"]
	]);
	const statements = parse(`
		enum Foo {
			A, B, C
		}
	`);
	const assignments = service.getEnumDeclarations(statements);
	t.true(assignments["Foo"] != null);
});

test(`getFunctionDeclarations() -> Detects all enum declarations properly. #2`, t => {
	setupMany([
		["Foo", "Foo"],
		["A", "A"],
		["hello", "hello"]
	]);
	const statements = parse(`
		enum Foo {
			A = <any>"hello"
		}
	`);
	const assignments = service.getEnumDeclarations(statements);
	t.true(assignments["Foo"] != null);
});

test(`getFunctionDeclarations() -> Detects all enum ordinal values correctly. #1`, t => {
	setupMany([
		["Foo", "Foo"],
		["A", "A"],
		["B", "B"],
		["C", "C"],
		["2", 2],
		["1", 1],
		["10", 10]
	]);
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
	setupMany([
		["Foo", "Foo"],
		["A", "A"],
		["B", "B"],
		["C", "C"],
		["2", 2],
		["1", 1],
		["3", 3]
	]);
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

test(`getAllIdentifiers() -> Detects all identifiers correctly. #1`, t => {
	setupMany([
		["Foo", "Foo"],
		["A", "A"],
		["Baz", "Baz"],
		["bar", "bar"],
		["MyClass", "MyClass"],
		["doStuff", "doStuff"]
	]);

	const statements = parse(`
		import {Baz} from "./bumbum";

		enum Foo {
		}

		function bar () {
		}

		class MyClass {
		}

		doStuff();
	`);
	const assignments = service.getAllIdentifiers(statements);
	t.true(assignments.classes["MyClass"] != null);
	t.true(assignments.functions["bar"] != null);
	t.true(assignments.enums["Foo"] != null);
	t.true(assignments.imports.find(declaration => declaration.bindings["Baz"] != null) != null);
	t.true(assignments.callExpressions.find(exp => exp.identifier.toString() === "doStuff") != null);
});