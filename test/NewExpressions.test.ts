import {test} from "ava";
import {parse, service, setupMany} from "./util/Setup";

test(`getNewExpressions() -> Detects new-statements correctly. #1`, t => {
	setupMany([["HelloWorld", "HelloWorld"]]);
	const code = `
		new HelloWorld();
	`;

	const statements = parse(code);
	const newExpressions = service.getNewExpressions(statements);
	t.true(newExpressions.find(exp => exp.identifier === "HelloWorld") != null);
});

test(`getNewExpressions() -> Detects new-statements correctly. #2`, t => {
	setupMany([["HelloWorld", "HelloWorld"], ["hmm", "hmm"]]);
	const code = `
		new hmm.HelloWorld();
	`;

	const statements = parse(code);
	const newExpressions = service.getNewExpressions(statements);
	t.true(newExpressions.find(exp => exp.identifier === "HelloWorld") != null);
});