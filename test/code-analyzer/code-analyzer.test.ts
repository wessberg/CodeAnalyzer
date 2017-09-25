import "../../src/services";
import {test} from "ava";
import {DIContainer} from "@wessberg/di";
import {IClassService} from "../../src/ast/service/class/i-class-service";
import {ITypescriptLanguageService} from "@wessberg/typescript-language-service";
import {IPrinter} from "../../src/ast/printer/i-printer";
import {ParameterKind} from "../../src/ast/dict/parameter/parameter-kind";
import {BindingNameKind} from "../../src/ast/dict/binding-name/binding-name-kind";

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
	body: "console.log(true)",
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
			decorators: null
		}
	]
}, A);

console.log(printer.stringify(sourceFile));
console.log(printer.print(sourceFile));

test("foo", t => {
	t.true(true);
});