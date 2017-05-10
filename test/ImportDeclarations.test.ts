import {test} from "ava";
import {fileName, parse, service, setupMany} from "./util/Setup";

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
	setupMany([
		["Foo", "Foo"],
		["hello", "hello"],
		["Bar", "Bar"],
		["2", 2]
	]);
	const code = `
		export const Foo = "hello";
		export const Bar = 2;
		import * as Bar from "${fileName}";
	`;

	const statements = parse(code);
	const importDeclarations = service.getImportDeclarations(statements);
	t.true(importDeclarations.length === 1);
});

test(`getImportDeclarations() -> Detects import declarations correctly. #4`, t => {
	setupMany([
		["Bar", "Bar"],
		["hello", "hello"]
	]);
	const code = `
		const Bar = "hello";
		export default Bar;
		import Bar from "${fileName}";
	`;

	const statements = parse(code);
	const importDeclarations = service.getImportDeclarations(statements);
	t.true(importDeclarations.length === 1);
});

test(`getImportDeclarations() -> Detects import declarations correctly. #5`, t => {
	setupMany([
		["Foo", "Foo"],
		["foo", "foo"]
	]);
	parse(`export default function foo () {}`, "bar.ts");
	const code = `
		import Foo = require("./bar.ts");
	`;

	const statements = parse(code);
	const importDeclarations = service.getImportDeclarations(statements);
	t.true(importDeclarations.length === 1);
});

test(`getImportDeclarations() -> Detects import declarations correctly. #6`, t => {
	setupMany([
		["Foo", "Foo"],
		["foo", "foo"]
	]);
	parse(`export default function foo () {}`, "bar.ts");
	const code = `
		import Foo = require("./bar.ts");
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
		["foo", "foo"],
		["bar", "bar"],
		["require", "require"]
	]);
	parse(`
		export default function bar () {}
	`, "bar.ts");
	const code = `
		const foo = require("./bar.ts");
	`;

	const statements = parse(code);
	const importDeclarations = service.getImportDeclarations(statements);
	t.true(importDeclarations.length === 1);
});

test(`getImportDeclarations() -> Detects import declarations correctly. #9`, t => {
	setupMany([
		["require", "require"]
	]);
	parse(``, "bar.ts");
	const code = `
		require("./bar.ts");
	`;

	const statements = parse(code);
	const importDeclarations = service.getImportDeclarations(statements);
	t.true(importDeclarations.length === 1);
});

test(`getImportDeclarations() -> Detects import declarations correctly. #10`, t => {
	setupMany([
		["require", "require"],
		["foo", "foo"],
		["./bar", "./bar"],
		["/baz", "/baz"]
	]);

	parse(``, "bar/baz.ts");

	const code = `
		const foo = "./bar";
		require(foo + "/baz.ts");
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