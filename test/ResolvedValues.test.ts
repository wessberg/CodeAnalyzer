import {test} from "ava";
import {parse, service, setupMany} from "./util/Setup";
test(`ValueResolver -> Computes all resolved values correctly. #1`, t => {
	setupMany([
		["2", 2],
		["3", 3]
	]);
	const statements = parse(`
		const val = 2 + 3;
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["val"].value.resolve(), "5");
});

test(`ValueResolver -> Computes all resolved values correctly. #2`, t => {
	setupMany([
		["2", 2],
		["3", 3],
		["5", 5],
		["10", 10]
	]);
	const statements = parse(`
		const val = 2 + 3 * (5 / 10);
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["val"].value.resolve(), "3.5");
});

test(`ValueResolver -> Computes all resolved values correctly. #3`, t => {
	setupMany([
		["2", 2],
		["3", 3],
		["5", 5],
		["10", 10]
	]);
	const statements = parse(`
		const sub = 10;
		const val = 2 + 3 * (5 / sub);
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["val"].value.resolve(), "3.5");
});

test(`ValueResolver -> Computes all resolved values correctly. #4`, t => {
	setupMany([
		["2", 2],
		["3", 3],
		["5", 5],
		["10", 10],
		["MyClass", "MyClass"],
		["foo", "foo"]
	]);
	const statements = parse(`
		class MyClass {
			static foo: number = 10;
		}
		const val = 2 + 3 * (5 / MyClass.foo);
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["val"].value.resolve(), "3.5");
});

test(`ValueResolver -> Computes all resolved values correctly. #5`, t => {
	setupMany([
		["2", 2],
		["3", 3],
		["5", 5],
		["10", 10],
		["50", 50],
		["MyClass", "MyClass"],
		["foo", "foo"],
		["bar", "bar"]
	]);
	const statements = parse(`
		class MyClass {
			static bar: number = 50;
			static foo: number = MyClass.bar;
		}
		const val = 2 + 3 * (5 / MyClass.foo);
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["val"].value.resolve(), "2.3");
});

test(`ValueResolver -> Computes all resolved values correctly. #6`, t => {
	setupMany([
		["2", 2],
		["3", 3],
		["25", 25],
		["20", 20],
		["a", "a"],
		["obj", "obj"],
		["obj2", "obj2"],
		["b", "b"],
		["c", "c"]
	]);
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
	t.deepEqual(assignments["val"].value.resolve(), "1502");
});

test(`ValueResolver -> Computes all resolved values correctly. #7`, t => {
	setupMany([
		["2", 2],
		["3", 3],
		["5", 5],
		["10", 10],
		["50", 50],
		["MyClass", "MyClass"],
		["foo", "foo"],
		["bar", "bar"]
	]);
	const statements = parse(`
		class MyClass {
			foo: number = 50;
			bar = this.foo;
		}
	`);

	const assignments = service.getClassDeclarations(statements);
	t.deepEqual(assignments["MyClass"].props["bar"].value.resolve(), "50");
});

test(`ValueResolver -> Computes all resolved values correctly. #7`, t => {
	setupMany([
		["MyEnum", "MyEnum"],
		["FOO", "FOO"],
		["BAR", "BAR"],
		["10", 10]
	]);
	const statements = parse(`
		enum MyEnum {
			FOO, BAR = 10
		}
		const val = 2 + MyEnum.BAR;
	`);

	const assignments = service.getVariableAssignments(statements);
	t.deepEqual(assignments["val"].value.resolve(), "12");
});

test(`ValueResolver -> Computes all resolved values correctly. #8`, t => {
	setupMany([
		["age", "age"],
		["99", 99],
		["I am 99 years old", "I am 99 years old"],
		["I am ", "I am "],
		[" years old", " years old"],
		["sub", "sub"],
		["val", "val"]
	]);
	const statements = parse(`
		let age = 99;
		
		const sub = \`
			I am \${age} years old
		\`
		const val = sub;
	`);

	const assignments = service.getVariableAssignments(statements);
	const value = assignments["val"].value.resolve();
	t.true(value != null && value.trim() === "I am 99 years old");
});

test(`ValueResolver -> Computes all resolved values correctly. #9`, t => {
	setupMany([
		["age", "age"],
		["99", 99],
		["Hi, I'm Kate, and ", "Hi, I'm Kate, and "],
		["I am 99 years old", "I am 99 years old"],
		["I am ", "I am "],
		[" years old", " years old"],
		["sub", "sub"],
		["val", "val"]
	]);
	const statements = parse(`
		let age = 99;
		
		const sub = \`I am \${age} years old\`;
		const val = "Hi, I'm Kate, and " + sub;
	`);

	const assignments = service.getVariableAssignments(statements);
	const value = assignments["val"].value.resolve();
	t.true(value != null && value.trim() === "Hi, I'm Kate, and I am 99 years old");
});

test(`ValueResolver -> Computes all resolved values correctly. #10`, t => {
	setupMany([
		["age", "age"],
		["99", 99],
		["Hi, I'm Kate, and ", "Hi, I'm Kate, and "],
		["I am 99 years old", "I am 99 years old"],
		["I am ", "I am "],
		[" years old", " years old"],
		["sub", "sub"],
		["val", "val"]
	]);
	const statements = parse(`
		let age = 99;
		
		const sub = \`I am \${age} years old\`;
		const val = \`Hi, I'm Kate, and \${sub}\`;
	`);

	const assignments = service.getVariableAssignments(statements);
	const value = assignments["val"].value.resolve();
	t.true(value != null && value.trim() === "Hi, I'm Kate, and I am 99 years old");
});

test(`ValueResolver -> Computes all resolved values correctly. #11`, t => {
	setupMany([
		["age", "age"],
		["99", 99],
		["Hi, I'm Kate, and ", "Hi, I'm Kate, and "],
		["I am 99 years old", "I am 99 years old"],
		["I am ", "I am "],
		[" years old", " years old"],
		["sub", "sub"],
		["val", "val"]
	]);
	const statements = parse(`
		const val = [1, 2, "foo"];
	`);

	const assignments = service.getVariableAssignments(statements);
	const value = assignments["val"].value.resolve();
	t.true(value != null && value.trim() === "[1,2,\"foo\"]");
});

test(`ValueResolver -> Computes all resolved values correctly. #12`, t => {
	setupMany([
		["foo", "foo"],
		["1", 1],
		["2", 2],
		["val", "val"]
	]);
	const statements = parse(`
		function foo () {
			return 1;
		}
		const val = 2 + foo();
	`);

	const assignments = service.getVariableAssignments(statements);
	const value = assignments["val"].value.resolve();
	t.deepEqual(value, "3");
});

test(`ValueResolver -> Computes all resolved values correctly. #13`, t => {
	setupMany([
		["foo", "foo"],
		["1", 1],
		["2", 2],
		["3", 3],
		["bar", "bar"],
		["val", "val"]
	]);
	const statements = parse(`
	const bar = 3;
		function foo () {
			return bar + 1;
		}
		const val = 2 + foo();
	`);

	const assignments = service.getVariableAssignments(statements);
	const value = assignments["val"].value.resolve();
	t.deepEqual(value, "6");
});

test(`ValueResolver -> Computes all resolved values correctly. #14`, t => {
	setupMany([
		["2", 2],
		["3", 3],
		["bar", "bar"],
		["val", "val"]
	]);
	const statements = parse(`
		const bar = 3;
		const val = 2 + (() => bar)();
	`);

	const assignments = service.getVariableAssignments(statements);
	const value = assignments["val"].value.resolve();
	t.deepEqual(value, "5");
});

test(`ValueResolver -> Computes all resolved values correctly. #15`, t => {
	setupMany([
		["doOtherStuff", "doOtherStuff"],
		["3", 3],
		["val", "val"],
		["val1", "val1"],
		["val2", "val2"],
		["2", 2],
		["1", 1],
		["doStuff", "doStuff"]
	]);
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
	t.deepEqual(value, "5");
});

test(`ValueResolver -> Computes all resolved values correctly. #16`, t => {
	setupMany([
		["A", "A"],
		["foo", "foo"],
		["bar", "bar"],
		["a", "a"],
		["val", "val"]
	]);
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
	setupMany([
		["A", "A"],
		["foo", "foo"],
		["bar", "bar"],
		["a", "a"],
		["val", "val"],
		["foobar", "foobar"],
		["baz", "baz"]
	]);
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
	setupMany([
		["bool", "bool"],
		["2", 2],
		["3", 3],
		["5", 5]
	]);
	const statements = parse(`
		const bool = false;
		const val = (bool ? 2 : 3) + 5;
	`);

	const assignments = service.getVariableAssignments(statements);
	const value = assignments["val"].value.resolve();
	t.deepEqual(value, "8");
});

test(`ValueResolver -> Computes all resolved values correctly. #19`, t => {
	setupMany([
		["Foo", "Foo"],
		["add", "add"],
		["2", 2],
		["3", 3],
		["10", 10],
		["val", "val"],
		["hmm", "hmm"]
	]);
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
	t.deepEqual(value, "5");
});

test(`ValueResolver -> Computes all resolved values correctly. #20`, t => {
	setupMany([
		["a", "a"],
		["b", "b"],
		["1", 1],
		["2", 2],
		["something", "something"]
	]);

	const code = `
	const something = [1, 2];
	const [a, b] = something;
	`;

	const statements = parse(code);
	const assignments = service.getVariableAssignments(statements, true);
	t.deepEqual(assignments["a"].value.resolve(), "1");
	t.deepEqual(assignments["b"].value.resolve(), "2");
});

test(`ValueResolver -> Computes all resolved values correctly. #21`, t => {
	setupMany([
		["a", "a"],
		["b", "b"],
		["1", 1],
		["2", 2],
		["something", "something"]
	]);

	const code = `
	const something = {a: 1, b: 2};
	const {a, b} = something;
	`;

	const statements = parse(code);
	const assignments = service.getVariableAssignments(statements, true);
	t.deepEqual(assignments["a"].value.resolve(), "1");
	t.deepEqual(assignments["b"].value.resolve(), "2");
});

test(`ValueResolver -> Computes all resolved values correctly. #22`, t => {
	setupMany([
		["Foo", "Foo"],
		["add", "add"],
		["2", 2],
		["3", 3],
		["val", "val"]
	]);
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
	t.deepEqual(value, "5");
});

test(`ValueResolver -> Computes all resolved values correctly. #23`, t => {
	setupMany([
		["foo", "foo"],
		["arg1", "arg1"],
		["arg2", "arg2"],
		["1", 1],
		["2", 2],
		["val", "val"]
	]);
	const statements = parse(`
		function foo (arg1, arg2) {
			return arg1 + arg2;
		}
		const val = foo(1, 2);
	`);

	const assignments = service.getVariableAssignments(statements);
	const value = assignments["val"].value.resolve();
	t.deepEqual(value, "3");
});

test(`ValueResolver -> Computes all resolved values correctly. #24`, t => {
	setupMany([
		["hello", "hello"],
		["world", "world"],
		["val", "val"]
	]);
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
	setupMany([
		["fibonacci", "fibonacci"],
		["x", "x"],
		["1", 1],
		["2", 2]
	]);

	const statements = parse(`
		function fibonacci(x) {
    	return x <= 1 ? x : fibonacci(x - 1) + fibonacci(x - 2);
  	}
  	const val = fibonacci(23);
	`);

	const assignments = service.getVariableAssignments(statements);
	const value = assignments["val"].value.resolve();
	t.deepEqual(value, "28657");
});

test(`ValueResolver -> Computes all resolved values correctly. #26`, t => {
	setupMany([
		["fibonacci", "fibonacci"],
		["x", "x"],
		["1", 1],
		["2", 2]
	]);

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
	t.deepEqual(value, "28657");
});