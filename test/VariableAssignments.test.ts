import {test} from "ava";
import {BindingIdentifier} from "../src/model/BindingIdentifier";
import {FULL_CODE_EXAMPLE_1, FULL_CODE_EXAMPLE_2, FULL_CODE_EXAMPLE_3, FULL_CODE_EXAMPLE_4, FULL_CODE_EXAMPLE_6} from "./static/FullCodeExamples";
import {parse, service} from "./util/Setup";

test(`getVariableAssignments() -> Detects all variable assignments properly. #1`, t => {
	const statements = parse(`
		const foo: number = 0;
	`);
	const assignments = service.getVariableAssignments(statements);
	t.true(assignments["foo"] != null);
});

test(`getVariableAssignments() -> Detects all variable assignments properly. #2`, t => {
	const statements = parse(`
		let bar = true;
	`);

	const assignments = service.getVariableAssignments(statements);
	t.true(assignments["bar"] != null);
});

test(`getVariableAssignments() -> Detects all variable assignments properly. #3`, t => {
	const statements = parse(`
		var baz = [1, 2, 3];
	`);

	const assignments = service.getVariableAssignments(statements);
	t.true(assignments["baz"] != null);
});

test(`getVariableAssignments() -> Detects all variable assignments properly. #4`, t => {

	const statements = parse(`
		const a = true, b = false, c = Infinity;
	`);

	const assignments = service.getVariableAssignments(statements);
	t.true(assignments["a"] != null);
	t.true(assignments["b"] != null);
	t.true(assignments["c"] != null);
});

test(`getVariableAssignments() -> Detects all variable assignments properly. #5`, t => {

	const statements = parse(`
		var tween,
			collection = (Animation.tweeners[prop] || []).concat(Animation.tweeners["*"]),
	`);

	const assignments = service.getVariableAssignments(statements);
	t.true(assignments["tween"] != null);
	t.true(assignments["collection"] != null);
});

// Tests
test(`getVariableAssignments() -> Detects all variable assignments recursively if deep is true. #1`, t => {


	const statements = parse(`
		if (true) {
			const bar: number = 1;
		}
	`);
	const assignments = service.getVariableAssignments(statements, true);
	t.true(assignments["bar"] != null);
});

test(`getVariableAssignments() -> Detects all variable assignments recursively if deep is true. #2`, t => {


	const statements = parse(`

		function test () {
			const baz: string = "hehe";
		}

	`);
	const assignments = service.getVariableAssignments(statements, true);
	t.true(assignments["baz"] != null);
});

test(`getVariableAssignments() -> Detects all variable assignments recursively if deep is true. #3`, t => {


	const statements = parse(`

		() => {
			const foo: string = "hehe";
		}

	`);
	const assignments = service.getVariableAssignments(statements, true);
	t.true(assignments["foo"] != null);
});

test(`getVariableAssignments() -> Detects all variable assignments recursively if deep is true. #4`, t => {


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


	const statements = parse(`

		const foo = bar = () => {const baz = Symbol("hello");};

	`);
	const assignments = service.getVariableAssignments(statements, true);
	t.true(assignments["foo"] != null);
});

test(`getVariableAssignments() -> Detects all variable assignments recursively if deep is true. #9`, t => {


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


	const code = `

		const val = matches[foo.length - 1];
	
	`;
	const statements = parse(code);
	const assignments = service.getVariableAssignments(statements, true);
	t.deepEqual(assignments["val"].value.expression, [new BindingIdentifier("matches"), "[", new BindingIdentifier("foo"), "[\"length\"]", "-", 1, "]"]);
});

test(`getVariableAssignments() -> Detects all types correctly. #1`, t => {


	const statements = parse(`
		const a = "hello";
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"].type.flattened, null);
});

test(`getVariableAssignments() -> Detects all types correctly. #2`, t => {


	const statements = parse(`
		const a: string = "hello";
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"].type.flattened, "string");
});

test(`getVariableAssignments() -> Detects all types correctly. #3`, t => {


	const statements = parse(`
		const a: string|symbol = "hello";
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"].type.flattened, "string|symbol");
});

test(`getVariableAssignments() -> Detects all types correctly. #4`, t => {


	const statements = parse(`
		const a: Foo[] = "hello";
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"].type.flattened, "Foo[]");
});

test(`getVariableAssignments() -> Detects all types correctly. #5`, t => {


	const statements = parse(`
		const a: {[key: string]: any} = "hello";
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"].type.flattened, "{[key: string]: any}");
});

test(`getVariableAssignments() -> Detects all types correctly. #6`, t => {


	const statements = parse(`
		const a: {[key: string]: any, foo: number} = "hello";
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"].type.flattened, "{[key: string]: any, foo: number}");
});

test(`getVariableAssignments() -> Detects all types correctly. #7`, t => {


	const statements = parse(`
		const a: {foo?: number} = "hello";
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"].type.flattened, "{foo?: number}");
});

test(`getVariableAssignments() -> Detects all types correctly. #8`, t => {


	const statements = parse(`
		const a: {foo?: number} & {bar: boolean} = "hello";
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"].type.flattened, "{foo?: number} & {bar: boolean}");
});

test(`getVariableAssignments() -> Detects all types correctly. #9`, t => {


	const statements = parse(`
		const a: Foobar = Foobar.HELLO;
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["a"].type.flattened, "Foobar");
});