import "../../src/services";
import {test} from "ava";
import {DIContainer} from "@wessberg/di";
import {ITypescriptLanguageService} from "@wessberg/typescript-language-service";
import {IPrinter} from "@wessberg/typescript-ast-util";
import {IClassService} from "../../src/service/class/i-class-service";
import {IImportService} from "../../src/service/import/i-import-service";
import {ICallExpressionService} from "../../src/service/call-expression/i-call-expression-service";

const classService = DIContainer.get<IClassService>();
const importService = DIContainer.get<IImportService>();
const languageService = DIContainer.get<ITypescriptLanguageService>();
const callExpressionService = DIContainer.get<ICallExpressionService>();
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

classService.createAndAddClassDeclarationToSourceFile({
	name: "MyClass",
	members: null,
	decorators: null,
	isAbstract: true,
	extendsClass: null,
	implementsInterfaces: null,
	typeParameters: null
}, sourceFile);

classService.addMethodToClass({
	name: "foo",
	isAbstract: false,
	isAsync: false,
	isOptional: false,
	isStatic: false,
	visibility: "public",
	parameters: null,
	typeParameters: null,
	decorators: null,
	type: "Promise<boolean>",
	body: ""
}, A);

classService.appendInstructionsToMethod("foo", "doStuff()", A);
classService.appendInstructionsToConstructor("console.log('bar')", A);

console.log(printer.print(sourceFile));

const allCallExpressions = callExpressionService.getCallExpressions(sourceFile, false);
const matchingCallExpressions = callExpressionService.getCallExpressionsOnPropertyAccessExpressionMatching("Math", undefined, sourceFile, false);
console.log(allCallExpressions.length, matchingCallExpressions.length);

test("foo", t => {
	t.true(true);
});