import {test} from "ava";
import {parse, service, setupMany} from "./util/Setup";

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

test.skip(`getImportDeclarations() -> Detects import declarations correctly. #9`, t => {
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