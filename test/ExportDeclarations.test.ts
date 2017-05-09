import {test} from "ava";
import {parse, service, setupMany} from "./util/Setup";
import {ImportExportKind} from "../src/interface/ISimpleLanguageService";

test(`getExportDeclarations() -> Detects export declarations correctly. #1`, t => {
	setupMany([]);
	const code = `
		export {Foo} from "./test";
	`;

	const statements = parse(code);
	const exportDeclarations = service.getExportDeclarations(statements);
	t.true(exportDeclarations.length === 1);
});

test(`getExportDeclarations() -> Detects export declarations correctly. #2`, t => {
	setupMany([]);
	const code = `
		export {Foo, Bar} from "./test";
	`;

	const statements = parse(code);
	const exportDeclarations = service.getExportDeclarations(statements);
	t.true(Object.keys(exportDeclarations[0].bindings).length === 2);
});

test(`getExportDeclarations() -> Detects export declarations correctly. #3`, t => {
	setupMany([]);
	const code = `
		export const Foo = "hello";
	`;

	const statements = parse(code);
	const exportDeclarations = service.getExportDeclarations(statements);
	t.true(exportDeclarations.length === 1);
});

test(`getExportDeclarations() -> Detects export declarations correctly. #4`, t => {
	setupMany([]);
	const code = `
		const Foo = "hello";
		export default Foo;
	`;

	const statements = parse(code);
	const exportDeclarations = service.getExportDeclarations(statements);
	console.log(exportDeclarations);
	t.true(exportDeclarations.length === 1 && exportDeclarations[0].bindings["default"].kind === ImportExportKind.DEFAULT);
});

test(`getExportDeclarations() -> Detects export declarations correctly. #5`, t => {
	setupMany([]);
	const code = `
		export * from "./Foo";
	`;

	const statements = parse(code);
	const exportDeclarations = service.getExportDeclarations(statements);
	t.true(exportDeclarations.length === 1);
});