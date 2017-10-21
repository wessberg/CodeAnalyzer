import "../../src/services";
import {test} from "ava";
import {DIContainer} from "@wessberg/di";
import {IPrinter} from "@wessberg/typescript-ast-util";
import {CodeAnalyzer} from "../../src/code-analyzer/code-analyzer";

const {classService, importService, interfaceDeclarationService, callExpressionService, constructorService, languageService} = new CodeAnalyzer();
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
	isStatic: false,
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

console.log(printer.print(sourceFile));

console.log(JSON.stringify(interfaceDeclarationService.toLightAST(firstInterface), null, "  "));

test("foo", t => {
	t.true(true);
});