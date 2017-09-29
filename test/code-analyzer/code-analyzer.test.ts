import "../../src/services";
import {test} from "ava";
import {DIContainer} from "@wessberg/di";
import {IPrinter} from "../../src/ast/printer/i-printer";
import {IClassService} from "../../src/ast/service/class/i-class-service";
import {ITypescriptLanguageService} from "@wessberg/typescript-language-service";
import {ParameterKind} from "../../src/ast/dict/parameter/parameter-kind";
import {BindingNameKind} from "../../src/ast/dict/binding-name/binding-name-kind";
import {DecoratorKind} from "../../src/ast/dict/decorator/decorator-kind";

const classService = DIContainer.get<IClassService>();
const languageService = DIContainer.get<ITypescriptLanguageService>();
const printer = DIContainer.get<IPrinter>();

const sourceFile = languageService.addFile({path: "./test/demo/class/a.ts"});

const [A] = classService.getClasses(sourceFile);

classService.setNameOfClass("HelloWorld", A);

classService.extendClassWith({
	name: "Foo",
	typeArguments: null
}, A);

classService.implementInterfaceOnClass({
	name: "IFoo",
	typeArguments: ["bar"]
}, A);

classService.addConstructorToClass({
	body: `
		console.log(true);
		let a = 2 + (a > b ? true : false);
	`,
	parameters: [
		{
			kind: ParameterKind.NORMAL,
			name: {
				kind: BindingNameKind.NORMAL,
				name: "foo"
			},
			type: "() => Promise<void>",
			initializer: null,
			isRestSpread: false,
			isOptional: false,
			decorators: [
				{
					kind: DecoratorKind.EXPRESSION,
					expression: "foo({})"
				}
			]
		}
	]
}, A);

classService.addMethodToClass({
	name: "myMethod",
	isAbstract: false,
	isOptional: false,
	isStatic: true,
	visibility: "protected",
	isAsync: true,
	parameters: null,
	typeParameters: ["A"],
	decorators: null,
	type: "Promise<void>",
	body: `
		console.log(''.repeat(10));
		console.log(false);
	`
}, A);

classService.implementInterfaceOnClass({
	name: "IBar",
	typeArguments: ["baz"]
}, A);

classService.addMethodToClass({
	name: "myMethod",
	isAbstract: false,
	isOptional: false,
	isStatic: false,
	visibility: "public",
	isAsync: true,
	parameters: null,
	typeParameters: ["A"],
	decorators: null,
	type: "Promise<void>",
	body: `
		console.log(''.repeat(10));
		console.log(false);
	`
}, A);

console.log(printer.print(sourceFile));

test("foo", t => {
	t.true(true);
});