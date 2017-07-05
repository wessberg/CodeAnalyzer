import {test} from "ava";
import {parse, service} from "./util/Setup";
import {ParameterKind} from "../src/service/interface/ICodeAnalyzer";

test(`ValueResolver -> Computes all resolved values correctly. #1`, t => {

	const statements = parse(`
		const val = 2 + 3;
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["val"].value.resolve(), 5);
});

test(`ValueResolver -> Computes all resolved values correctly. #2`, t => {

	const statements = parse(`
		const val = 2 + 3 * (5 / 10);
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["val"].value.resolve(), 3.5);
});

test(`ValueResolver -> Computes all resolved values correctly. #3`, t => {

	const statements = parse(`
		const sub = 10;
		const val = 2 + 3 * (5 / sub);
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["val"].value.resolve(), 3.5);
});

test(`ValueResolver -> Computes all resolved values correctly. #4`, t => {

	const statements = parse(`
		class MyClass {
			static foo: number = 10;
		}
		const val = 2 + 3 * (5 / MyClass.foo);
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["val"].value.resolve(), 3.5);
});

test(`ValueResolver -> Computes all resolved values correctly. #5`, t => {

	const statements = parse(`
		class MyClass {
			static bar: number = 50;
			static foo: number = MyClass.bar;
		}
		const val = 2 + 3 * (5 / MyClass.foo);
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["val"].value.resolve(), 2.3);
});

test(`ValueResolver -> Computes all resolved values correctly. #6`, t => {

	const statements = parse(`
		const obj = {
			a: 25
		};
		
		const obj2 = {
			b: {
				c: 20
			}
		};
		const val = 2 + 3 * obj.a * obj2.b.c;
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["val"].value.resolve(), 1502);
});

test(`ValueResolver -> Computes all resolved values correctly. #7`, t => {

	const statements = parse(`
		class MyClass {
			foo: number = 50;
			bar = this.foo;
		}
		const val = new MyClass().foo;
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["val"].value.resolve(), 50);
});

test(`ValueResolver -> Computes all resolved values correctly. #7`, t => {

	const statements = parse(`
		enum MyEnum {
			FOO, BAR = 10
		}
		const val = 2 + MyEnum.BAR;
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["val"].value.resolve(), 12);
});

test(`ValueResolver -> Computes all resolved values correctly. #8`, t => {

	const statements = parse(`
		let age = 99;
		
		const sub = \`
			I am \${age} years old
		\`
		const val = sub;
	`);

	const assignments = service.getVariableAssignments(statements);
	const value = assignments["val"].value.resolve();
	t.true(value != null && typeof value === "string" && value.trim() === "I am 99 years old");
});

test(`ValueResolver -> Computes all resolved values correctly. #9`, t => {

	const statements = parse(`
		let age = 99;
		
		const sub = \`I am \${age} years old\`;
		const val = "Hi, I'm Kate, and " + sub;
	`);

	const assignments = service.getVariableAssignments(statements);
	const value = assignments["val"].value.resolve();
	t.true(value != null && typeof value === "string" && value.trim() === "Hi, I'm Kate, and I am 99 years old");
});

test(`ValueResolver -> Computes all resolved values correctly. #10`, t => {

	const statements = parse(`
		let age = 99;
		
		const sub = \`I am \${age} years old\`;
		const val = \`Hi, I'm Kate, and \${sub}\`;
	`);

	const assignments = service.getVariableAssignments(statements);
	const value = assignments["val"].value.resolve();
	t.true(value != null && typeof value === "string" && value.trim() === "Hi, I'm Kate, and I am 99 years old");
});

test(`ValueResolver -> Computes all resolved values correctly. #11`, t => {

	const statements = parse(`
		const val = [1, 2, "foo"];
	`);

	const assignments = service.getVariableAssignments(statements);
	const value = assignments["val"].value.resolve();
	t.deepEqual(value, [1, 2, "foo"]);
});

test(`ValueResolver -> Computes all resolved values correctly. #12`, t => {

	const statements = parse(`
		function foo () {
			return 1;
		}
		const val = 2 + foo();
	`);

	const assignments = service.getVariableAssignments(statements);
	const value = assignments["val"].value.resolve();
	t.deepEqual(value, 3);
});

test(`ValueResolver -> Computes all resolved values correctly. #13`, t => {

	const statements = parse(`
	const bar = 3;
		function foo () {
			return bar + 1;
		}
		const val = 2 + foo();
	`);

	const assignments = service.getVariableAssignments(statements);
	const value = assignments["val"].value.resolve();
	t.deepEqual(value, 6);
});

test(`ValueResolver -> Computes all resolved values correctly. #14`, t => {

	const statements = parse(`
		const bar = 3;
		const val = 2 + (() => bar)();
	`);

	const assignments = service.getVariableAssignments(statements);
	const value = assignments["val"].value.resolve();
	t.deepEqual(value, 5);
});

test(`ValueResolver -> Computes all resolved values correctly. #15`, t => {

	const statements = parse(`
		function doOtherStuff () {
			return 3;
		}
		function doStuff () {
			let val1 = 1;
			let val2 = val1 * 2;
			return val2 + doOtherStuff();
		}
		const val = doStuff();
	`);

	const assignments = service.getVariableAssignments(statements);
	const value = assignments["val"].value.resolve();
	t.deepEqual(value, 5);
});

test(`ValueResolver -> Computes all resolved values correctly. #16`, t => {

	const statements = parse(`
		class A {
			foo: string = "bar";
		}
		
		const a = new A();
		const val = a.foo;
	`);

	const assignments = service.getVariableAssignments(statements);
	const value = assignments["val"].value.resolve();
	t.deepEqual(value, "bar");
});

test(`ValueResolver -> Computes all resolved values correctly. #17`, t => {

	const statements = parse(`
		class A {
			foo: string = "bar";
			static foobar: string = "baz";
		}
		
		const a = new A();
		const val = A.foobar;
	`);

	const assignments = service.getVariableAssignments(statements);
	const value = assignments["val"].value.resolve();
	t.deepEqual(value, "baz");
});

test(`ValueResolver -> Computes all resolved values correctly. #18`, t => {

	const statements = parse(`
		const bool = false;
		const val = (bool ? 2 : 3) + 5;
	`);

	const assignments = service.getVariableAssignments(statements);
	const value = assignments["val"].value.resolve();
	t.deepEqual(value, 8);
});

test(`ValueResolver -> Computes all resolved values correctly. #19`, t => {

	const statements = parse(`
		class Foo {
			static hmm (arg: number) {
				return arg + 10;
			}
			
			static add (arg: number) {
				return arg + 3;
			}
		}
		const val = Foo.add(2);
	`);

	const assignments = service.getVariableAssignments(statements);
	const value = assignments["val"].value.resolve();
	t.deepEqual(value, 5);
});

test(`ValueResolver -> Computes all resolved values correctly. #20`, t => {

	const code = `
	const something = [1, 2];
	const [a, b] = something;
	`;

	const statements = parse(code);
	const assignments = service.getVariableAssignments(statements, true);
	t.deepEqual(assignments["a"].value.resolve(), 1);
	t.deepEqual(assignments["b"].value.resolve(), 2);
});

test(`ValueResolver -> Computes all resolved values correctly. #21`, t => {

	const code = `
	const something = {a: 1, b: 2};
	const {a, b} = something;
	`;

	const statements = parse(code);
	const assignments = service.getVariableAssignments(statements, true);
	t.deepEqual(assignments["a"].value.resolve(), 1);
	t.deepEqual(assignments["b"].value.resolve(), 2);
});

test(`ValueResolver -> Computes all resolved values correctly. #22`, t => {

	const statements = parse(`
		class Foo {
			
			static add () {
				return 2 + 3;
			}
		}
		const val = Foo.add();
	`);

	const assignments = service.getVariableAssignments(statements);
	const value = assignments["val"].value.resolve();
	t.deepEqual(value, 5);
});

test(`ValueResolver -> Computes all resolved values correctly. #23`, t => {

	const statements = parse(`
		function foo (arg1, arg2) {
			return arg1 + arg2;
		}
		const val = foo(1, 2);
	`);

	const assignments = service.getVariableAssignments(statements);
	const value = assignments["val"].value.resolve();
	t.deepEqual(value, 3);
});

test(`ValueResolver -> Computes all resolved values correctly. #24`, t => {

	const statements = parse(`
		function hello() { return 'hello' + ','; }
  	function world() { return 'world'; }
  	const val = hello() + ' ' + world();
	`);

	const assignments = service.getVariableAssignments(statements);
	const value = assignments["val"].value.resolve();
	t.deepEqual(value, "hello, world");
});

test(`ValueResolver -> Computes all resolved values correctly. #25`, t => {

	const statements = parse(`
		function fibonacci(x) {
    	return x <= 1 ? x : fibonacci(x - 1) + fibonacci(x - 2);
  	}
  	const val = fibonacci(23);
	`);

	const assignments = service.getVariableAssignments(statements);
	const value = assignments["val"].value.resolve();
	t.deepEqual(value, 28657);
});

test(`ValueResolver -> Computes all resolved values correctly. #26`, t => {

	const statements = parse(`
	class Foo {
		fibonacci(x) {
    	return x <= 1 ? x : this.fibonacci(x - 1) + this.fibonacci(x - 2);
  	}
	}
		const foo = new Foo();
  	const val = foo.fibonacci(23);
	`);

	const assignments = service.getVariableAssignments(statements);
	const value = assignments["val"].value.resolve();
	t.deepEqual(value, 28657);
});

test(`ValueResolver -> Computes all resolved values correctly. #27`, t => {

	const statements = parse(`
	function foo () {
		let arr = [];
		for (let i = 1; i <= 5; i++) {
			arr.push(i);
		}
		return arr;
	}
	const val = foo();
	`);

	const assignments = service.getVariableAssignments(statements);
	const value = assignments["val"].value.resolve();
	t.deepEqual(value, [1, 2, 3, 4, 5]);
});

test(`ValueResolver -> Computes all resolved values correctly. #28`, t => {

	const statements = parse(`
	function fib(x) { return x <= 1 ? x : fib(x - 1) + fib(x - 2); }
  let x = Date.now();
  if (x === 0) x = fib(10);
  const val = x;
	`);

	const assignments = service.getVariableAssignments(statements);
	const value = assignments["val"].value.resolve();
	t.true(value != null && !isNaN(parseInt(`${value}`)));
});

test(`ValueResolver -> Computes all resolved values correctly. #29`, t => {

	const code = `
	import {foo} from "static/ImportExamples";
	const something = foo;
	`;

	const statements = parse(code);
	const assignments = service.getVariableAssignments(statements, true);
	const resolved = assignments["something"].value.resolve();
	t.true(resolved === "hello");
});

test(`ValueResolver -> Computes all resolved values correctly. #30`, t => {

	const code = `
	import {foo} from "static/ImportExamples";
	const something = foo;
	`;

	const statements = parse(code);
	const assignments = service.getVariableAssignments(statements, true);
	const resolved = assignments["something"].value.resolve();
	t.true(resolved === "hello");
});

test(`ValueResolver -> Computes all resolved values correctly. #31`, t => {

	const code = `
	import {bar} from "static/ImportExamples";
	const something = bar;
	`;

	const statements = parse(code);
	const assignments = service.getVariableAssignments(statements, true);
	const resolved = assignments["something"].value.resolve();
	t.true(resolved === 2);
});

test(`ValueResolver -> Computes all resolved values correctly. #32`, t => {

	const code = `

	import {bar} from "static/ImportExamples";

	class Foo {
		public styles () {
			return \`:host {font-size: \${bar}px;}\`;
		}
	}
	`;

	const statements = parse(code);
	const assignments = service.getClassDeclarations(statements, true);
	const method = assignments["Foo"].methods["styles"];
	const resolved = method.value.resolve();

	t.true(resolved != null && typeof resolved === "string" && resolved.includes(`:host {font-size: 2px;}`));
});

test(`ValueResolver -> Computes all resolved values correctly. #33`, t => {

	const code = `

	import {bar} from "static/ImportExamples";

	class Foo {
		public foo () {
			return \`:host {font-size: \${bar}px;}\`;
		}
		public styles () {
			return this.foo();
		}
	}
	`;

	const statements = parse(code);
	const assignments = service.getClassDeclarations(statements, true);
	const method = assignments["Foo"].methods["styles"];
	const resolved = method.value.resolve();

	t.true(resolved != null && typeof resolved === "string" && resolved.includes(`:host {font-size: 2px;}`));
});

test.skip(`ValueResolver -> Computes all resolved values correctly. #34`, t => {

	const statements = parse(`
		import * as Foo from "static/ReExportExamples";
		const val = Foo.foo;
	`);

	const assignments = service.getVariableAssignments(statements, true);
	const resolved = assignments["val"].value.resolve();

	t.true(resolved === "hello");
});

test(`ValueResolver -> Computes all resolved values correctly. #35`, t => {

	const statements = parse(`
	function foo ({test}) {
		return test;
	}

	`);

	const assignments = service.getFunctionDeclarations(statements, true);
	t.true(assignments["foo"].parameters.parametersList[0].parameterKind === ParameterKind.OBJECT_BINDING);
});

test(`ValueResolver -> Computes all resolved values correctly. #36`, t => {

	const statements = parse(`
	function foo ([test]) {
		return test;
	}

	`);

	const assignments = service.getFunctionDeclarations(statements, true);
	t.true(assignments["foo"].parameters.parametersList[0].parameterKind === ParameterKind.ARRAY_BINDING);
});

test(`ValueResolver -> Computes all resolved values correctly. #37`, t => {

	const statements = parse(`
	function foo ({a, b}) {
		return a * b;
	}
	const a = 2;
	const b = 2;
	const val = foo({a, b});
	`);

	const assignments = service.getVariableAssignments(statements, true);
	const resolved = assignments["val"].value.resolve();
	t.true(resolved === 4);
});

test(`ValueResolver -> Computes all resolved values correctly. #38`, t => {
	const statements = parse(`
import {DIContainer} from "static/DIContainerExample";


export interface IFoo \{
	a: boolean;
}
export interface IBar \{
	b: boolean;
}

export class Foo implements IFoo \{
	a = true;
}

export class Bar implements IBar \{
	b = true;
	constructor (foo: IFoo) \{
		console.log(foo.toString());
	}
}

DIContainer.registerSingleton<IFoo, Foo>();
DIContainer.registerSingleton<IBar, Bar>();
DIContainer.get<IBar>();

	`);

	const assignments = service.getAllIdentifiers(statements, true);
	const getCalls = assignments.callExpressions.filter(exp => exp.identifier === "get");
	const registerCalls = assignments.callExpressions.filter(exp => exp.identifier === "registerSingleton");
	t.true(getCalls.length === 1);
	t.true(registerCalls.length === 2);
	t.true(Object.keys(assignments.classes).length === 2);
});

test(`ValueResolver -> Computes all resolved values correctly. #39`, t => {

	const statements = parse(`
		class A {
			foo: number = 0;
			constructor (foo) {
				this.foo = foo;
			}
		}
		const val = new A(10).foo;
	`);

	const assignments = service.getVariableAssignments(statements, true);
	const resolved = assignments["val"].value.resolve();
	t.true(resolved === 10);
});

test(`ValueResolver -> Computes all resolved values correctly. #40`, t => {

	const statements = parse(`
		class A {
			private static readonly map: Map<string, string> = new Map();
			
			foo () {
				A.map.set("foo", "bar");
				return A.map.get("foo");		
			}
		}
		const val = new A().foo();
	`);

	const assignments = service.getVariableAssignments(statements, true);
	const resolved = assignments["val"].value.resolve();
	t.true(resolved === "bar");
});

test(`ValueResolver -> Computes all resolved values correctly. #41`, t => {

	const statements = parse(`
		import {Color} from "static/ColorExample";
		const val = Color.primary100;
	`);

	const vars = service.getVariableAssignments(statements, true);
	const res = vars["val"].value.resolve();
	t.true(res != null);
});

/*
test(`ValueResolver -> Computes all resolved values correctly. #42`, t => {

	const statements = parse(`
		import {Class2} from "static/inheritance1/Class2";

		export class Class3 extends Class2 {
			markup () {
				return super.markup();
			}
		}
	`);

	const classes = service.getClassDeclarations(statements, true);
	const method = classes["Class3"].methods["markup"];
	const class3 = method.value.resolve();
	console.log(class3);
	t.true(true);
});
*/