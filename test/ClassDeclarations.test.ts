import {test} from "ava";
import {parse, service} from "./util/Setup";
import {IConstructorDeclaration} from "../src/service/interface/ICodeAnalyzer";

test(`getClassDeclarations() -> Detects all class declarations properly. #1`, t => {

	const code = `
		class MyClass {}
	`;

	const statements = parse(code);
	const assignments = service.getClassDeclarations(statements);
	t.true(Object.keys(assignments).length === 1);
});

test(`getClassDeclarations() -> Detects all class declarations properly. #2`, t => {

	const code = `
		class MyClass {}
		class MyOtherClass {}
	`;

	const statements = parse(code);
	const assignments = service.getClassDeclarations(statements);
	t.true(Object.keys(assignments).length === 2);
});

test(`getClassDeclarations() -> Detects all class decorators properly. #1`, t => {

	const code = `
		@MyDecorator
		class MyClass {}
	`;

	const statements = parse(code);
	const assignments = service.getClassDeclarations(statements);
	t.true(assignments["MyClass"].decorators["MyDecorator"] != null);
});

test(`getClassDeclarations() -> Constructor -> Detects types of constructor arguments correctly. #1`, t => {

	const code = `
		class MyClass {
			constructor (arg1: string, arg2: number, arg3: Foo) {}
		}
	`;

	const statements = parse(code);
	const assignments = service.getClassDeclarations(statements);
	const classDeclaration = assignments["MyClass"];
	t.true(classDeclaration.constructor != null && classDeclaration.constructor.parameters.parametersList[0].type.flattened === "string");
	t.true(classDeclaration.constructor != null && classDeclaration.constructor.parameters.parametersList[1].type.flattened === "number");
	t.true(classDeclaration.constructor != null && classDeclaration.constructor.parameters.parametersList[2].type.flattened === "Foo");
});

test(`getClassDeclarations() -> Fields -> Detects all class fields. #1`, t => {

	const code = `
		class MyClass {
			field1;
			field2 = 2;
			field3;
		}
	`;

	const statements = parse(code);
	const assignments = service.getClassDeclarations(statements);
	const classDeclaration = assignments["MyClass"];
	t.true(classDeclaration.props["field1"] != null);
	t.true(classDeclaration.props["field2"] != null);
	t.true(classDeclaration.props["field3"] != null);
});

test(`getClassDeclarations() -> Fields -> Detects the valueExpressions of class fields. #1`, t => {

	const code = `
		class MyClass {
			field1 = () => true;
		}
	`;

	const statements = parse(code);
	const assignments = service.getClassDeclarations(statements);
	const classDeclaration = assignments["MyClass"];
	t.deepEqual(classDeclaration.props["field1"].value.expression, ["(", ")", "=>", true]);
});

test(`getClassDeclarations() -> Fields -> Detects the types of all class fields correctly. #1`, t => {

	const code = `
		class MyClass {
			field1: string;
			field2: number = 2;
			field3: Foo;
		}
	`;

	const statements = parse(code);
	const assignments = service.getClassDeclarations(statements);
	const classDeclaration = assignments["MyClass"];
	t.true(classDeclaration.props["field1"].type.flattened === "string");
	t.true(classDeclaration.props["field2"].type.flattened === "number");
	t.true(classDeclaration.props["field3"].type.flattened === "Foo");
});

test(`getClassDeclarations() -> Fields -> Detects the types of all class fields correctly. #2`, t => {

	const code = `
		class MyClass {
			field1: Foo<Foo>;
		}
	`;

	const statements = parse(code);
	const assignments = service.getClassDeclarations(statements);
	const classDeclaration = assignments["MyClass"];
	t.true(classDeclaration.props["field1"].type.flattened === "Foo<Foo>");
});

test(`getClassDeclarations() -> Fields -> Detects the types of all class fields correctly. #3`, t => {

	const code = `
		class MyClass {
			field1: Foo<Bar, Baz>;
		}
	`;

	const statements = parse(code);
	const assignments = service.getClassDeclarations(statements);
	const classDeclaration = assignments["MyClass"];
	t.true(classDeclaration.props["field1"].type.flattened === "Foo<Bar, Baz>");
});

test(`getClassDeclarations() -> Fields -> Detects the decorators of class fields correctly. #1`, t => {

	const code = `
		class MyClass {
			@prop field1: string;
			field2: number = 2;
			field3: Foo;
		}
	`;

	const statements = parse(code);
	const assignments = service.getClassDeclarations(statements);
	const classDeclaration = assignments["MyClass"];
	t.true(Object.keys(classDeclaration.props["field1"].decorators).length === 1);
	t.true(Object.keys(classDeclaration.props["field2"].decorators).length === 0);
	t.true(Object.keys(classDeclaration.props["field3"].decorators).length === 0);
});

test(`getClassDeclarations() -> Fields -> Detects the decorators of class fields correctly. #2`, t => {

	const code = `
		class MyClass {
			@prop field1: string;
			@setOnHost @blabla field2: number = 2;
		}
	`;

	const statements = parse(code);
	const assignments = service.getClassDeclarations(statements);
	const classDeclaration = assignments["MyClass"];
	t.true(classDeclaration.props["field1"].decorators["prop"] != null);
	t.true(classDeclaration.props["field2"].decorators["setOnHost"] != null);
	t.true(classDeclaration.props["field2"].decorators["blabla"] != null);
});

test(`getClassDeclarations() -> Fields -> Detects the decorators of class fields correctly. #3`, t => {

	const code = `
		class MyClass {
			@prop() field1: string;
		}
	`;

	const statements = parse(code);
	const assignments = service.getClassDeclarations(statements);
	const classDeclaration = assignments["MyClass"];
	t.true(classDeclaration.props["field1"].decorators["prop"] != null);
});

test(`getClassDeclarations() -> Methods -> Detects method declarations correctly. #1`, t => {

	const code = `
		class MyClass {
			public myMethod () {
				return true;
			}
		}
	`;

	const statements = parse(code);
	const assignments = service.getClassDeclarations(statements);
	const classDeclaration = assignments["MyClass"];
	t.true(classDeclaration.methods["myMethod"] != null);
});

test(`getClassDeclarations() -> Methods -> Detects method declarations correctly. #2`, t => {

	const code = `
		class MyClass {
			public myMethod () {
				return \`<hello></hello><goodbye><\${Hello}></for-now></goodbye>\`;
			}
		}
	`;

	const statements = parse(code);
	const assignments = service.getClassDeclarations(statements);
	const classDeclaration = assignments["MyClass"];
	t.true(classDeclaration.methods["myMethod"] != null);
});

test(`getClassDeclarations() -> Extends -> Supports derived classes. #1`, t => {

	const code = `
		class A {}
		class B extends A {}
	`;

	const statements = parse(code);
	const assignments = service.getClassDeclarations(statements);
	const classDeclaration = assignments["B"];
	t.true(classDeclaration.heritage != null && classDeclaration.heritage.extendsClass != null && classDeclaration.heritage.extendsClass.name === "A");
});

test(`getClassDeclarations() -> Extends -> Supports derived classes. #2`, t => {

	const code = `
		class A {}
		class B extends A {
			constructor () {
				super();
			}
		}
	`;

	const statements = parse(code);
	const assignments = service.getClassDeclarations(statements);
	const classDeclaration = assignments["B"];
	const ctor = <IConstructorDeclaration>classDeclaration.constructor;
	t.notThrows(ctor.value.resolve);
});