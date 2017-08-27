# CodeAnalyzer
[![NPM version][npm-version-image]][npm-version-url]
[![License-mit][license-mit-image]][license-mit-url]

[license-mit-url]: https://opensource.org/licenses/MIT

[license-mit-image]: https://img.shields.io/badge/License-MIT-yellow.svg

[npm-version-url]: https://www.npmjs.com/package/@wessberg/codeanalyzer

[npm-version-image]: https://badge.fury.io/js/%40wessberg%2Fcodeanalyzer.svg

> A service that can analyze your code in great detail ahead of time.

## Installation
Simply do: `npm install @wessberg/codeanalyzer`.

## DISCLAIMER

This a very early alpha version. Do not expect it to compute proper values for all kinds of expressions.


## Description
The service is a very flexible and powerful tool for extracting metadata and state snapshots of your code and the identifiers that lives within it.

It builds upon the Typescript AST and understands the entirety of the Typescript syntax.

Here's *some* of what CodeAnalyzer does:

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

If you want to reduce the runtime cost of your code, you can replace function calls and variable initialization statements
with the result of computing them ahead of time using the CodeAnalyzer.

But more than that, it can also help you with doing a lot of the work that is usually performed at runtime (or requires some kind of runtime backing).
For example, by extracting metadata such as type information ahead of time, there is no need for runtime reflection for many use cases (like dependency injection).

The CodeAnalyzer can extract information from your code through a simple, but robust API.
Here is the base interface, though more methods exists in the actual interface:
```typescript
interface CodeAnalyzer {
	addFile (fileName: string, content: string, version?: number): NodeArray<Statement>;
	getClassDeclarationsForFile(fileName: string, deep?: boolean): ClassIndexer;
	getAllIdentifiersForFile(fileName: string, deep?: boolean): IIdentifierMap;
	getVariableAssignmentsForFile(fileName: string, deep?: boolean): VariableIndexer;
	getEnumDeclarationsForFile(fileName: string, deep?: boolean): EnumIndexer;
	getFunctionDeclarationsForFile(fileName: string, deep?: boolean): FunctionIndexer;
	getImportDeclarationsForFile (fileName: string, deep?: boolean): IImportDeclaration[];
	getExportDeclarationsForFile (fileName: string, deep?: boolean): IExportDeclaration[];
	getCallExpressionsForFile(fileName: string, deep?: boolean): ICallExpression[];
	getNewExpressionsForFile(fileName: string, deep?: boolean): INewExpression[];
}
```

For full documentation, consult [the full interface](src/analyzer/interface/ICodeAnalyzer.ts) or [the implementation](src/analyzer/CodeAnalyzer.ts)

## Usage

The most likely use case will be to add a file and its raw contents to the CodeAnalyzer:

```typescript
const analyzer = new CodeAnalyzer();
const fileName = "a_file.ts";
const contents = readFileSync(fileName).toString();
analyzer.addFile(fileName, contents);
```

The file and its dependencies are traversed and cached.

But, you can also just analyze a chunk of code:

```typescript
const analyzer = new CodeAnalyzer();
const variables = analyzer.getVariableDeclarations("const var = 2");
```

Be aware that while this is perfectly fine, the chunk of code won't be cached for later lookups and cannot be used by other chunks of code to understand their context.

## Differences from [Prepack](https://prepack.io/)

The `CodeAnalyzer` can resolve identifiers **to the value they are initialized to**, but it
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