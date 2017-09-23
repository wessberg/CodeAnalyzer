import "../../src/services";
import {test} from "ava";
import {DIContainer} from "@wessberg/di";
import {IClassService} from "../../src/ast/service/class/i-class-service";
import {ITypescriptLanguageService} from "@wessberg/typescript-language-service";
import {IPrinter} from "../../src/ast/printer/i-printer";
import {ParameterKind} from "../../src/ast/dict/parameter/parameter-kind";
import {BindingNameKind} from "../../src/ast/dict/binding-name/binding-name-kind";
import {DecoratorKind} from "../../src/ast/dict/decorator/decorator-kind";

const classService = DIContainer.get<IClassService>();
const languageService = DIContainer.get<ITypescriptLanguageService>();
const printer = DIContainer.get<IPrinter>();
const sourceFile = languageService.addFile({path: "./test/demo/class/a.ts"});

const [A] = classService.getClasses(sourceFile);
classService.setNameOfClass("HelloWorld", A);
classService.addConstructorToClass({
	body: `console.log(true);`,
	parameters: [{
		kind: ParameterKind.NORMAL,
		name: {
			kind: BindingNameKind.NORMAL,
			name: "arg"
		},
		initializer: null,
		isRestSpread: true,
		isOptional: true,
		decorators: null,
		type: "Promise<void>"
	}]
}, A);

classService.addPropertyToClass({
	name: "foo",
	decorators: [{
		kind: DecoratorKind.EXPRESSION,
		expression: "foo({})"
	}],
	type: "string",
	initializer: "'Hello world!'",
	isAbstract: false,
	isReadonly: true,
	isOptional: false,
	visibility: "private",
	isAsync: false,
	isStatic: false
}, A);

classService.addPropertyToClass({
	name: "bar",
	decorators: [{
		kind: DecoratorKind.EXPRESSION,
		expression: "bar({a: 2, b: 3})"
	}],
	type: "string",
	initializer: "'Goodbye world!'",
	isAbstract: false,
	isReadonly: true,
	isOptional: false,
	visibility: "private",
	isAsync: false,
	isStatic: false
}, A);

classService.implementInterfaceOnClass({
	name: "IFoo",
	typeArguments: ["Foo", "Bar"]
}, A);

classService.extendClassWith({
	name: "FooBar",
	typeArguments: null
}, A);

console.log(printer.stringify(sourceFile));
console.log(printer.print(sourceFile));

test("foo", t => {
	t.true(true);
});