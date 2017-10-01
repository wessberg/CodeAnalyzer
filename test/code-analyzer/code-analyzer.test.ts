import "../../src/services";
import {test} from "ava";
import {DIContainer} from "@wessberg/di";
import {ITypescriptLanguageService} from "@wessberg/typescript-language-service";
import {IPrinter} from "@wessberg/typescript-ast-util";
import {IClassService} from "../../src/service/class/i-class-service";
import {IImportService} from "../../src/service/import/i-import-service";

const classService = DIContainer.get<IClassService>();
const importService = DIContainer.get<IImportService>();
const languageService = DIContainer.get<ITypescriptLanguageService>();
const printer = DIContainer.get<IPrinter>();

const sourceFile = languageService.addFile({path: "./test/demo/class/a.ts"});

const [A] = classService.getClasses(sourceFile);
classService.extendClassWith({
	name: "MyFirstClassExample",
	typeArguments: null
}, A);

const importDeclaration = importService.createAndAddImportDeclarationToSourceFile({
	path: "foo",
	namedImports: [{
		name: "A",
		propertyName: null
	}],
	namespace: null,
	defaultName: "FooBar"
}, sourceFile);

importService.addNamespaceImportToImportDeclaration("MyNamespace", importDeclaration);

console.log(printer.print(sourceFile));

test("foo", t => {
	t.true(true);
});