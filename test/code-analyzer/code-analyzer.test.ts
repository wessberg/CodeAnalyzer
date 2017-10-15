import "../../src/services";
import {test} from "ava";
import {DIContainer} from "@wessberg/di";
import {ITypescriptLanguageService} from "@wessberg/typescript-language-service";
import {IPrinter} from "@wessberg/typescript-ast-util";
import {IClassService} from "../../src/service/class/i-class-service";
import {IImportService} from "../../src/service/import/i-import-service";
import {IInterfaceDeclarationService} from "../../src/service/interface-declaration/i-interface-declaration-service";

const classService = DIContainer.get<IClassService>();
const importService = DIContainer.get<IImportService>();
const languageService = DIContainer.get<ITypescriptLanguageService>();
const interfaceService = DIContainer.get<IInterfaceDeclarationService>();
const printer = DIContainer.get<IPrinter>();

const sourceFile = languageService.addFile({path: "./test/demo/class/a.ts"});

const [A] = classService.getAll(sourceFile);
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

classService.createAndAddClassDeclarationToSourceFile({
	name: "MyClass",
	members: null,
	decorators: null,
	isAbstract: true,
	extendsClass: null,
	implementsInterfaces: null,
	typeParameters: null
}, sourceFile);

importService.addNamedImportToImportDeclaration({name: "B", propertyName: "Foo"}, importDeclaration);
classService.removePropertyWithName("aMethod", A);
classService.removeDecorator("aDecorator", A);

const [firstInterface] = interfaceService.getAll(sourceFile);
console.log("\nall:\n", interfaceService.getPropertyNamesOfTypeDeclaration(firstInterface));
console.log("\noptional:\n", interfaceService.getOptionalPropertyNamesOfTypeDeclaration(firstInterface));
console.log("\nrequired:\n", interfaceService.getRequiredPropertyNamesOfTypeDeclaration(firstInterface));

console.log(printer.print(sourceFile));

test("foo", t => {
	t.true(true);
});