import {test} from "ava";
import {fileName, parse, service, setupMany} from "./util/Setup";
import {ImportExportKind} from "../src/service/interface/ISimpleLanguageService";

test(`getExportDeclarations() -> Detects export declarations correctly. #1`, t => {
	setupMany([
		["Foo", "Foo"]
	]);
	const code = `
		export {Foo} from "${fileName}";
	`;

	const statements = parse(code);
	const exportDeclarations = service.getExportDeclarations(statements);
	t.true(exportDeclarations.length === 1);
});

test(`getExportDeclarations() -> Detects export declarations correctly. #2`, t => {
	setupMany([
		["Foo", "Foo"],
		["Bar", "Bar"],
		["hello", "hello"],
		["2", 2]
	]);
	const code = `
		const Foo = "hello";
		const Bar = 2;
		export {Foo, Bar} from "${fileName}";
	`;

	const statements = parse(code);
	const exportDeclarations = service.getExportDeclarations(statements);
	t.true(Object.keys(exportDeclarations[0].bindings).length === 2);
});

test(`getExportDeclarations() -> Detects export declarations correctly. #3`, t => {
	setupMany([
		["Foo", "Foo"],
		["hello", "hello"]
	]);
	const code = `
		export const Foo = "hello";
	`;

	const statements = parse(code);
	const exportDeclarations = service.getExportDeclarations(statements);
	t.true(exportDeclarations.length === 1);
});

test(`getExportDeclarations() -> Detects export declarations correctly. #4`, t => {
	setupMany([
		["Foo", "Foo"],
		["hello", "hello"]
	]);
	const code = `
		const Foo = "hello";
		export default Foo;
	`;

	const statements = parse(code);
	const exportDeclarations = service.getExportDeclarations(statements);
	t.true(exportDeclarations.length === 1 && exportDeclarations[0].bindings["default"].kind === ImportExportKind.DEFAULT);
});

test(`getExportDeclarations() -> Detects export declarations correctly. #5`, t => {
	setupMany([
		["*", "*"],
		["hello", "hello"],
		["2", 2],
		["./Foo", "./Foo"]
	]);
	const code = `
		export const foo = "hello";
		export const bar = 2;
		export * from "${fileName}";
	`;

	const statements = parse(code);
	const exportDeclarations = service.getExportDeclarations(statements);
	t.true(exportDeclarations[2] != null && Object.keys(exportDeclarations[2].bindings["*"].payload).length === 2);
});

test(`getExportDeclarations() -> Detects export declarations correctly. #6`, t => {
	setupMany([
		["foo", "foo"]
	]);
	const code = `
		export default function foo () {};
	`;

	const statements = parse(code);
	const exportDeclarations = service.getExportDeclarations(statements);
	t.true(exportDeclarations.length === 1 && exportDeclarations[0].bindings["default"].kind === ImportExportKind.DEFAULT);
});

test(`getExportDeclarations() -> Detects export declarations correctly. #7`, t => {
	setupMany([
		["Foo", "Foo"]
	]);
	const code = `
		export default class Foo () {};
	`;

	const statements = parse(code);
	const exportDeclarations = service.getExportDeclarations(statements);
	t.true(exportDeclarations.length === 1 && exportDeclarations[0].bindings["default"].kind === ImportExportKind.DEFAULT);
});

test(`getExportDeclarations() -> Detects export declarations correctly. #8`, t => {
	setupMany([
		["2", 2]
	]);
	const code = `
		export default 2;
	`;

	const statements = parse(code);
	const exportDeclarations = service.getExportDeclarations(statements);
	t.true(exportDeclarations.length === 1 && exportDeclarations[0].bindings["default"].kind === ImportExportKind.DEFAULT);
});