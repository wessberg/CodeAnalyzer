import {test} from "ava";
import {parse, service} from "./util/Setup";

test(`getAllIdentifiers() -> Detects all identifiers correctly. #1`, t => {
	parse("", "bumbum.ts");

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