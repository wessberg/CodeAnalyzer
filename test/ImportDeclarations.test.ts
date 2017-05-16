import {test} from "ava";
import {join} from "path";
import {fileName, parse, service} from "./util/Setup";

test(`getImportDeclarations() -> Detects import declarations correctly. #1`, t => {

	const code = `
		import "./ImportDeclarations.test";
	`;

	const statements = parse(code);
	const importDeclarations = service.getImportDeclarations(statements);
	t.true(importDeclarations.length === 1);
});

test(`getImportDeclarations() -> Detects import declarations correctly. #2`, t => {

	const code = `
		import {FileLoader} from "@wessberg/fileloader";
	`;

	const statements = parse(code);
	const importDeclarations = service.getImportDeclarations(statements);
	t.true(importDeclarations.length === 1);
});

test(`getImportDeclarations() -> Detects import declarations correctly. #3`, t => {

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

	const code = `
		import Foo = require("static/ImportExamples");
	`;

	const statements = parse(code);
	const importDeclarations = service.getImportDeclarations(statements);
	t.true(importDeclarations.length === 1);
});

test(`getImportDeclarations() -> Detects import declarations correctly. #6`, t => {

	const code = `
		const lol = "static";
		import Foo = require(lol + "/ImportExamples");
	`;

	const statements = parse(code);
	const importDeclarations = service.getImportDeclarations(statements);
	t.true(importDeclarations.length === 1);
});

test(`getImportDeclarations() -> Detects import declarations correctly. #7`, t => {

	const code = `
		import Foo = Bar;
	`;

	const statements = parse(code);
	const importDeclarations = service.getImportDeclarations(statements);
	t.true(importDeclarations.length === 1);
});

test(`getImportDeclarations() -> Detects import declarations correctly. #8`, t => {

	const code = `
		const foo = require("static/ImportExamples");
	`;

	const statements = parse(code);
	const importDeclarations = service.getImportDeclarations(statements);
	t.true(importDeclarations.length === 1);
});

test(`getImportDeclarations() -> Detects import declarations correctly. #9`, t => {

	const code = `
		require("static/ImportExamples");
	`;

	const statements = parse(code);
	const importDeclarations = service.getImportDeclarations(statements);
	t.true(importDeclarations.length === 1);
});

test(`getImportDeclarations() -> Detects import declarations correctly. #10`, t => {

	const code = `
		const foo = "./static";
		require(foo + "/ImportExamples");
	`;

	const statements = parse(code);
	const importDeclarations = service.getImportDeclarations(statements);
	t.true(importDeclarations.length === 1);
});

test(`getImportDeclarations() -> Detects import declarations correctly. #11`, t => {


	const path = join(__dirname, "../../", "test/ImportDeclarations.test.ts");

	const code = `
		import * from "./ImportDeclarations.test"
	`;

	const statements = parse(code, path);
	const importDeclarations = service.getImportDeclarations(statements);
	t.true(importDeclarations.length === 1);
});

test(`getImportDeclarations() -> Throws exceptions for empty import paths. #1`, t => {

	const code = `
		require("");
	`;

	const statements = parse(code);
	t.throws(service.getImportDeclarations.bind(null, statements));
});

test(`getImportDeclarations() -> Throws exceptions for empty import paths. #2`, t => {

	const code = `
		import "";
	`;

	const statements = parse(code);
	t.throws(service.getImportDeclarations.bind(null, statements));
});

test(`getImportDeclarations() -> Throws exceptions for empty import paths. #3`, t => {

	const code = `
		import Foo from "";
	`;

	const statements = parse(code);
	t.throws(service.getImportDeclarations.bind(null, statements));
});

test(`getImportDeclarations() -> Throws exceptions for empty import paths. #4`, t => {

	const code = `
		import * as Lol from "";
	`;

	const statements = parse(code);
	t.throws(service.getImportDeclarations.bind(null, statements));
});