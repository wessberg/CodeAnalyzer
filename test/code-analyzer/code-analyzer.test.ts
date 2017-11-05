import "../../src/services";
import {test} from "ava";
import {DIContainer} from "@wessberg/di";
import {IPrinter} from "@wessberg/typescript-ast-util";
import {CodeAnalyzer} from "../../src/code-analyzer/code-analyzer";

const {classService, importService, interfaceDeclarationService, callExpressionService, constructorService, languageService, methodService} = new CodeAnalyzer();
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
	decorators: [
		{
			expression: "foobar"
		}
	],
	isAbstract: true,
	extendsClass: null,
	implementsInterfaces: null,
	typeParameters: null
}, sourceFile);

importService.addNamedImportToImportDeclaration({name: "B", propertyName: "Foo"}, importDeclaration);
classService.removePropertyWithName("aMethod", A);
classService.removeDecorator("aDecorator", A);

const [firstInterface] = interfaceDeclarationService.getAll(sourceFile);
console.log("\nall:\n", interfaceDeclarationService.getPropertyNamesOfTypeDeclaration(firstInterface));
console.log("\noptional:\n", interfaceDeclarationService.getOptionalPropertyNamesOfTypeDeclaration(firstInterface));
console.log("\nrequired:\n", interfaceDeclarationService.getRequiredPropertyNamesOfTypeDeclaration(firstInterface));

const [foo] = callExpressionService.getCallExpressionsMatching(/foo/, sourceFile);
const [type, impl] = callExpressionService.getTypeArgumentNames(foo);
callExpressionService.setArgumentExpressionOnArgumentIndex(3, `{type: "${type}", impl: "${impl}"}`, foo);

classService.addMethodToClass({
	name: "aNewMethod",
	isAbstract: false,
	isAsync: false,
	isStatic: true,
	isOptional: false,
	visibility: "private",
	parameters: null,
	typeParameters: null,
	decorators: null,
	type: "void",
	body: ""
}, A);

const ctor = classService.getConstructor(A);
console.log("all constructor parameter type names:");
console.log(constructorService.getParameterTypeNames(ctor!));
console.log("all non-initialized constructor parameter type names:");
console.log(constructorService.getNonInitializedTypeNames(ctor!));

methodService.appendInstructions(`console.log("foo"); console.log("bar"); return true;`, classService.getStaticMethodWithName("aNewMethod", A)!);

callExpressionService.createAndAddCallExpression({
	expression: "customElements.define",
	typeArguments: null,
	arguments: ["'foo'", "'bar'"]
}, sourceFile, {node: firstInterface, position: "BEFORE"});

methodService.changeVisibility("public", classService.getStaticMethodWithName("aNewMethod", A)!);

console.log(printer.print(sourceFile));

test("foo", t => {
	t.true(true);
});