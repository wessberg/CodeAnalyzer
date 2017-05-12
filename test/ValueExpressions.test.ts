import {test} from "ava";
import {BindingIdentifier} from "../src/model/BindingIdentifier";
import {parse, service} from "./util/Setup";
import {GlobalObjectIdentifier} from "@wessberg/globalobject";
test(`ValueExpressions -> Detects all valueExpressions correctly. #1`, t => {

	const statements = parse(`
		const foo: number = 0;
	`);
	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["foo"].value.expression, [0]);
});

test(`ValueExpressions -> Detects all valueExpressions correctly. #2`, t => {

	const statements = parse(`
		const foo: number = Infinity;
	`);
	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["foo"].value.expression, [Infinity]);
});

test(`ValueExpressions -> Detects all valueExpressions correctly. #3`, t => {

	const statements = parse(`
		const foo: number = NaN;
	`);
	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["foo"].value.expression, [NaN]);
});

test(`ValueExpressions -> Detects all valueExpressions correctly. #4`, t => {

	const statements = parse(`
		const substitution = 2;
		const foo: string = \`this has the substitution \${substitution}\`;
	`);
	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["foo"].value.expression, ["`", "this has the substitution ", "${", new BindingIdentifier("substitution"), "}", "`"]);
});

test(`ValueExpressions -> Detects all valueExpressions correctly. #5`, t => {
	

	const statements = parse(`
		const substitution = 2;
		const foo: string = \`this has the substitution \${2}\`;
	`);
	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["foo"].value.expression, ["`", "this has the substitution ", 2, "`"]);
});

test(`ValueExpressions -> Detects all valueExpressions correctly. #6`, t => {

	const statements = parse(`
		let bar = true;
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["bar"].value.expression, [true]);
});

test(`ValueExpressions -> Detects all valueExpressions correctly. #7`, t => {
	

	const statements = parse(`
		var baz = [1, 2, 3];
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["baz"].value.expression, ["[", 1, ",", 2, ",", 3, "]"]);
});

test(`ValueExpressions -> Detects all valueExpressions correctly. #8`, t => {
	
	const statements = parse(`
		const a = true, b = false, c = Infinity;
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"].value.expression, [true]);
	t.deepEqual(assignments["b"].value.expression, [false]);
	t.deepEqual(assignments["c"].value.expression, [Infinity]);
});

test(`ValueExpressions -> Detects all valueExpressions correctly. #9`, t => {

	const statements = parse(`
		const a = \`this is a ${"template string"}\`;
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"].value.expression, ["`this is a template string`"]);
});

test(`ValueExpressions -> Detects all valueExpressions correctly. #10`, t => {
	

	const statements = parse(`
		const a = [1, "foo", false, [1, 2, 3]]
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"].value.expression, ["[", 1, ",", "`foo`", ",", false, ",", "[", 1, ",", 2, ",", 3, "]", "]",]);
});

test(`ValueExpressions -> Detects all valueExpressions correctly. #11`, t => {
	

	const statements = parse(`
		const a = {a: 1};
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"].value.expression, ["{", "a", ":", 1, "}"]);
});

test(`ValueExpressions -> Detects all valueExpressions correctly. #12`, t => {
	

	const statements = parse(`
		const key = "foo";
		const a = {[key]: 1};
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"].value.expression, ["{", "[", new BindingIdentifier("key"), "]", ":", 1, "}"]);
});

test(`ValueExpressions -> Detects all valueExpressions correctly. #13`, t => {
	

	const statements = parse(`
		const key = 0;
		const a = {0: 1};
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"].value.expression, ["{", 0, ":", 1, "}"]);
});

test(`ValueExpressions -> Detects all valueExpressions correctly. #14`, t => {
	

	const statements = parse(`
		const key = 0;
		const a = {123: 1};
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"].value.expression, ["{", 123, ":", 1, "}"]);
});

test(`ValueExpressions -> Detects all valueExpressions correctly. #15`, t => {
	

	const statements = parse(`
		const key = 0;
		const a = Symbol("Hello world!");
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"].value.expression, [new BindingIdentifier("Symbol"), "(", "`Hello world!`", ")"]);
});

test(`ValueExpressions -> Detects all valueExpressions correctly. #16`, t => {
	

	const statements = parse(`
		const a = {"a": 1};
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"].value.expression, ["{", "a", ":", 1, "}"]);
});

test(`ValueExpressions -> Detects all valueExpressions correctly. #17`, t => {
	

	const statements = parse(`
		const a = {"0": 1};
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"].value.expression, ["{", "0", ":", 1, "}"]);
});

test(`ValueExpressions -> Detects all valueExpressions correctly. #18`, t => {
	

	const statements = parse(`
		function getKey () {return "test";}
		const a = {[getKey()]: 1};
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"].value.expression, ["{", "[", new BindingIdentifier("getKey"), "(", ")", "]", ":", 1, "}"]);
});

test(`ValueExpressions -> Detects all valueExpressions correctly. #19`, t => {
	

	const statements = parse(`
		function getKey (num: number, bool: boolean, arr: number[]) {return "test";}
		const a = {[getKey("1", false, [123])]: Infinity};
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"].value.expression, ["{", "[", new BindingIdentifier("getKey"), "(", "`1`", ",", false, ",", "[", 123, "]", ")", "]", ":", Infinity, "}"]);
});

test(`ValueExpressions -> Detects all valueExpressions correctly. #20`, t => {
	

	const statements = parse(`
		const a = {foo: {bar: {baz: new Foo(true, false)}}};
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"].value.expression, ["{", "foo", ":", "{", "bar", ":", "{", "baz", ":", "new", " ", new BindingIdentifier("Foo"), "(", true, ",", false, ")", "}", "}", "}"]);
});

test(`ValueExpressions -> Detects all valueExpressions correctly. #21`, t => {
	

	const statements = parse(`
		const a = true ? 1 : 0;
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"].value.expression, [true, "?", 1, ":", 0]);
});

test(`ValueExpressions -> Detects all valueExpressions correctly. #22`, t => {
	

	const statements = parse(`
		const sub = true;
		const a = sub ? 1 : 0;
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"].value.expression, [new BindingIdentifier("sub"), "?", 1, ":", 0]);
});

test(`ValueExpressions -> Detects all valueExpressions correctly. #23`, t => {
	

	const statements = parse(`
		const sub = true;
		const a = sub && true ? false && 1 ? false : null : null;
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"].value.expression, [new BindingIdentifier("sub"), "&&", true, "?", false, "&&", 1, "?", false, ":", null, ":", null]);
});

test(`ValueExpressions -> Detects all valueExpressions correctly. #24`, t => {
	

	const statements = parse(`
		const a = new Foo(true)
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"].value.expression, ["new", " ", new BindingIdentifier("Foo"), "(", true, ")"]);
});

test(`ValueExpressions -> Detects all valueExpressions correctly. #25`, t => {
	

	const statements = parse(`
		const a = Foo.A;
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"].value.expression, [new BindingIdentifier("Foo"), "[\"A\"]"]);
});

test(`ValueExpressions -> Detects all valueExpressions correctly. #26`, t => {
	

	const statements = parse(`
		const a = Foo.A.B.C.D;
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"].value.expression, [new BindingIdentifier("Foo"), "[\"A\"]", "[\"B\"]", "[\"C\"]", "[\"D\"]"]);
});

test(`ValueExpressions -> Detects all valueExpressions correctly. #27`, t => {
	

	const statements = parse(`
		const a = () => true;
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"].value.expression, ["(", ")", "=>", true]);
});

test(`ValueExpressions -> Detects all valueExpressions correctly. #28`, t => {
	

	const statements = parse(`
		const a = (foo: string) => true;
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"].value.expression, ["(", "foo", ")", "=>", true]);
});

test(`ValueExpressions -> Detects all valueExpressions correctly. #29`, t => {
	

	const statements = parse(`
		const a = (foo: string) => function () {return true;};
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"].value.expression, ["(", "foo", ")", "=>", "function", " ", "(", ")", "{", "return", " ", true, ";", "}"]);
});

test(`ValueExpressions -> Detects all valueExpressions correctly. #30`, t => {
	

	const statements = parse(`
		const a = Something.Other.Than<OtherThing>("baz");
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"].value.expression, [new BindingIdentifier("Something"), "[\"Other\"]", "[\"Than\"]", "(", "`baz`", ")"]);
});

test(`ValueExpressions -> Detects all valueExpressions correctly. #31`, t => {
	

	const statements = parse(`
		const a = Something[2].Other.Than<OtherThing>("baz");
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"].value.expression, [new BindingIdentifier("Something"), "[", 2, "]", "[\"Other\"]", "[\"Than\"]", "(", "`baz`", ")"]);
});

test(`ValueExpressions -> Detects all valueExpressions correctly. #32`, t => {
	

	const statements = parse(`
		const a = test((foobar: number) => false);
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"].value.expression, [new BindingIdentifier("test"), "(", "(", "foobar", ")", "=>", false, ")"]);
});

test(`ValueExpressions -> Detects all valueExpressions correctly. #33`, t => {
	

	const statements = parse(`
		const a = 2 + 3;
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"].value.expression, [2, "+", 3]);
});

test(`ValueExpressions -> Detects all valueExpressions correctly. #34`, t => {
	

	const statements = parse(`
		const a = 2 + 3 * (10 * 5);
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"].value.expression, [2, "+", 3, "*", "(", 10, "*", 5, ")"]);
});

test(`ValueExpressions -> Detects all valueExpressions correctly. #35`, t => {
	

	const statements = parse(`
		const a = {...foo, ...bar};
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"].value.expression, ["{", "...", new BindingIdentifier("foo"), ",", "...", new BindingIdentifier("bar"), "}"]);
});

test(`ValueExpressions -> Detects all valueExpressions correctly. #36`, t => {
	

	const statements = parse(`
		const a = {...{foo: 1}, ...bar};
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"].value.expression, ["{", "...", "{", "foo", ":", 1, "}", ",", "...", new BindingIdentifier("bar"), "}"]);
});

test(`ValueExpressions -> Detects all valueExpressions correctly. #37`, t => {
	

	const statements = parse(`
		const a = [...foo, ...bar];
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"].value.expression, ["[", "...", new BindingIdentifier("foo"), ",", "...", new BindingIdentifier("bar"), "]"]);
});

test(`ValueExpressions -> Detects all valueExpressions correctly. #38`, t => {
	

	const statements = parse(`
		const assignmentMap: AssignmentMap = {};
		const declarations = statement.declarationList.declarations;
		const boundName = declaration.name.text;
		const value = this.getInitializedValue(foo.initializer);
	`);

	const assignments = service.getVariableAssignments(statements);

	t.deepEqual(assignments["assignmentMap"].value.expression, ["{", "}"]);
	t.deepEqual(assignments["declarations"].value.expression, [new BindingIdentifier("statement"), "[\"declarationList\"]", "[\"declarations\"]"]);
	t.deepEqual(assignments["boundName"].value.expression, [new BindingIdentifier("declaration"), "[\"name\"]", "[\"text\"]"]);
	t.deepEqual(assignments["value"].value.expression, [new BindingIdentifier("this"), "[\"getInitializedValue\"]", "(", new BindingIdentifier("foo"), "[\"initializer\"]", ")"]);
});

test(`ValueExpressions -> Detects all valueExpressions correctly. #39`, t => {
	

	const statements = parse(`
		const a;
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"].value.expression, null);
});

test(`ValueExpressions -> Detects all valueExpressions correctly. #40`, t => {
	

	const statements = parse(`

		const foo = {
			a: () => {
				const bar: string = "hehe";
			}
		}

	`);
	const assignments = service.getVariableAssignments(statements, true);
	t.deepEqual(assignments["foo"].value.expression, ["{", "a", ":", "(", ")", "=>", "{", GlobalObjectIdentifier, ".", "bar", ":", "string", "=", "`hehe`", ";", "}", "}"]);
});

test(`ValueExpressions -> Detects all valueExpressions correctly. #41`, t => {
	

	const statements = parse(`

		const foo = {
			a () {
				let bar: string = "hehe";
			}
		}

	`);
	const assignments = service.getVariableAssignments(statements, true);
	t.deepEqual(assignments["foo"].value.expression, ["{", "a", "(", ")", "{", GlobalObjectIdentifier, ".", "bar", ":", "string", "=", "`hehe`", ";", "}", "}"]);
});

test(`ValueExpressions -> Detects all valueExpressions correctly. #42`, t => {
	

	const statements = parse(`

	const wow = class MyClass {
						constructor () {
							const localVar = [1];
						}
					};

	`);
	const assignments = service.getVariableAssignments(statements, true);
	t.deepEqual(assignments["wow"].value.expression, ["class", " ", "MyClass", "{", "constructor", "(", ")", "{", GlobalObjectIdentifier, ".", "localVar", "=", "[", 1, "]", ";", "}", "}"]);
});

test(`ValueExpressions -> Detects all valueExpressions correctly. #43`, t => {
	

	const statements = parse(`

	const wow = class MyClass extends MyOtherClass<Lol> {};

	`);
	const assignments = service.getVariableAssignments(statements, true);
	t.deepEqual(assignments["wow"].value.expression, ["class", " ", "MyClass", " ", "extends", " ", {name: "MyOtherClass", typeArguments: [{name: "Lol", typeArguments: null}]}, "{", "}"]);
});

test(`ValueExpressions -> Detects all valueExpressions correctly. #44`, t => {
	

	const code = `
	
	const val = ["monday", "tuesday"][0];
	`;

	const statements = parse(code);
	const assignments = service.getVariableAssignments(statements, true);
	t.deepEqual(assignments["val"].value.expression, ["[", "`monday`", ",", "`tuesday`", "]", "[", 0, "]"]);
});

test(`ValueExpressions -> Detects all valueExpressions correctly. #45`, t => {
	

	const code = `
	
	const val = [].slice.call;
	`;

	const statements = parse(code);
	const assignments = service.getVariableAssignments(statements, true);
	t.deepEqual(assignments["val"].value.expression, ["[", "]", "[\"slice\"]", "[\"call\"]"]);
});

test(`ValueExpressions -> Detects all valueExpressions correctly. #46`, t => {
	

	const code = `
	
	const val = (foo.something || []).concat(otherthing);
	`;

	const statements = parse(code);
	const assignments = service.getVariableAssignments(statements, true);
	t.deepEqual(assignments["val"].value.expression, ["(", new BindingIdentifier("foo"), "[\"something\"]", "||", "[", "]", ")", "[\"concat\"]", "(", new BindingIdentifier("otherthing"), ")"]);
});

test(`ValueExpressions -> Detects all valueExpressions correctly. #47`, t => {
	

	const code = `
	const something = [1, 2];
	const [a, b] = something;
	`;

	const statements = parse(code);
	const assignments = service.getVariableAssignments(statements, true);
	t.deepEqual(assignments["a"].value.expression, [new BindingIdentifier("something")]);
	t.deepEqual(assignments["b"].value.expression, [new BindingIdentifier("something")]);
});