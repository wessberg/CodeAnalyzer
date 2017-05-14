# CodeAnalyzer [![NPM version][npm-image]][npm-url]
> A service that can analyze your code in great detail ahead of time.

## Installation
Simply do: `npm install @wessberg/codeanalyzer`.

## Description
The service is a very flexible and powerful tool for extracting metadata and state snapshots of your code and the identifiers that lives within it.

It builds upon the Typescript AST and understands the entirety of the Typescript syntax.

Here's *some* of what SimpleLanguageService does:

- It computes the initialization values of variables and return values of function calls - ahead of time.
- It tracks the types of class fields, function/method/constructor parameters, generic call- or new expression arguments and similar.
- It breaks code up into expressions that can be resolved at any time.

For example,
consider the following code:
```typescript
const analyzer = new CodeAnalyzer();
const fileName = "a_file.ts";
analyzer.addFile(fileName, `
  function foo () {
  		let arr = [];
  		for (let i = 1; i <= 5; i++) {
  			arr.push(i);
  		}
  		return arr;
  	}
  	const aVariable: number[] = foo();
`);

const variables = analyzer.getVariableAssignmentsForFile(fileName);
const variable = variables["aVariable"];
console.log(variable.value.resolve()); // [1,2,3,4,5]
console.log(variable.name); // aVariable
console.log(variable.type.flattened); // number[]
console.log(variable.value.expression); // [ Identifier {name: "foo"}, "(", ")"]
```



This is useful if you want to reduce complexity by replacing heavy function calls with values.

But more than that, it can

## Usage
```typescript
// A path to a file.
const filePath = "my_file.ts";

// The code contents of a file.
const fileContents = "const foo = 'bar'";

// Add a file to the LanguageService so it can construct an AST from the contents of it.
const statements = simpleLanguageService.addFile(filePath, fileContents);

// Now we can play around with it:
simpleLanguageService.getClassDeclarations(statements, filePath, fileContents);
simpleLanguageService.getImportDeclarations(statements, filePath);
simpleLanguageService.getVariableAssignments(statements);
// And so on...
```

The Typescript LanguageService is an extremely flexible and powerful tool for static code analysis.
This is a simple LanguageService provider that boils the complex information down to
more easily digestible metadata such as class props, methods, constructor arguments, imports
and exports and other stuff.

## Differences from [Prepack](https://prepack.io/)

The `SimpleLanguageService` can resolve identifiers **to the value they are initialized to**, but it
**doesn't track mutations**.

This means that if your code gradually builds up a variable, say, an ObjectLiteral, the resolved value
will be the one it is initialized to.

Consider the following two examples:
```typescript
function foo () {
		let arr = [];
		for (let i = 1; i <= 5; i++) {
			arr.push(i);
		}
		return arr;
	}
	const val = foo();
```
The value of the variable `val` will be `[1,2,3,4,5]` since this is the return value
of the function `foo`.

But:
```typescript
const val = {};
  ['A', 'B', 42].forEach(function(x) {
    var name = '_' + x.toString()[0].toLowerCase();
    var y = parseInt(x);
    val[name] = y ? y : x;
  });
```
Here, the value of the variable `val` will be `{}` since this is the value it is initialized to.
The LanguageService will not track any mutations for already-initialized variables.

## Changelog:

**v1.0.8**:

- Bug fixes, more tests.

**v1.0.0**:

- First release.

[npm-url]: https://npmjs.org/package/@wessberg/codeanalyzer
[npm-image]: https://badge.fury.io/js/@wessberg/codeanalyzer.svg