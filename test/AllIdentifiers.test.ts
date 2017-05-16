import {test} from "ava";
import {parse, service} from "./util/Setup";

test(`getAllIdentifiers() -> Detects all identifiers correctly. #1`, t => {

	const statements = parse(`
		import {bar} from "static/ImportExamples";
		enum Foo {
		}

		function bar () {
		}

		class MyClass {
		}

		doStuff();
	`);
	const assignments = service.getAllIdentifiers(statements, true);
	t.true(assignments.classes["MyClass"] != null);
	t.true(assignments.functions["bar"] != null);
	t.true(assignments.enums["Foo"] != null);
	t.true(assignments.imports.find(declaration => declaration.bindings["bar"] != null) != null);
	t.true(assignments.callExpressions.find(exp => exp.identifier != null && exp.identifier.toString() === "doStuff") != null);
});