# CodeAnalyzer [![NPM version][npm-image]][npm-url]
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

## Changelog:

**v1.0.40**:

- Fixed some tslint errors.
- Made Typescript a dependency rather than a devDependency since it actually relies on it.
- Updated interface signatures to be consistently named.

**v1.0.39**:

- Fixed a bug where TemplateHeads, TemplateMiddles or TemplateTails would be unmarshalled incorrectly.

**v1.0.38**:

- Added the possibility of setting excluded files lazily.

**v1.0.37**:

- Added the possibility of adding one or more regular expressions that matches filepaths that should be skipped in the constructor of the CodeAnalyzer.

**v1.0.36**:

- Refactoring.
- Renamed `getVariableAssignments` and `getVariableAssignmentsForFile` to `getVariableDeclarations` and `getVariableDeclarationsForFile` respectively.

**v1.0.35**:

- Better resolving of files in node_modules.
- Bumped dependencies and refactored.

**v1.0.34**:

- Identifiers for CallExpressions are now arrays of tokens.

**v1.0.33**:

- Added support for CallExpressions that are BinaryExpressions.

**v1.0.32**:

- Parsing package.json files will now skip browser fields if it contains multiple paths.

**v1.0.31**:

- Fixed a bug with the previous version.

**v1.0.30**:

- Fixed a bug with the previous version.

**v1.0.29**:

- Added a fallback path to modules with `package.json` files without any value for the "main" field.

**v1.0.28**:

- Added a disclaimer to the README.

**v1.0.28**:

- Added handling for evaluating declarations of kind `FirstNode`.

**v1.0.27**:

- Added handling for evaluating declarations of kinds `GetAccessorDeclaration` and `SetAccessorDeclaration`.
- Code formatting.

**v1.0.26**:

- Added handling for finding ValueExpressions of `VoidExpression`s.

**v1.0.25**:

- Added handling for finding child statements of `VoidExpression`s.

**v1.0.24**:

- Bumped dependency on *@wessberg/GlobalObject* to v1.0.5.

**v1.0.23**:

- Added handling for formatting type expressions of kind `ThisType`.

**v1.0.22**:

- Added handling for finding child statements of `TypeAliasDeclaration`s.

**v1.0.21**:

- Parsing for expressions with "deep" wouldn't find all expressions.
- Fixed bugs.

**v1.0.20**:

- Moved some logic into a separate module ('compiler-common') to instead depend on that one.

**v1.0.19**:

- Fixed bugs.

**v1.0.18**:

- Fixed an issue where getting names of anonymous functions would sometimes crash.

**v1.0.17**:

- Added lots of more interfaces to the exports of the module.

**v1.0.16**:

- Removed Typescript as a constructor argument to instead use the one that is located in node_modules.

**v1.0.15**:

- Added a blacklist filter for specific file names (such as tslib.ts or rollup plugins.)

**v1.0.14**:

- You can now retrieve all arrow functions with the `getArrowFunctionsForFile` and `getArrowFunctions` methods.
- Performance improvements by extensive use of caching.
- Bug fixes all across the board.
- Important browser API's will be shimmed so that node understands stuff like `HTMLElement` when resolving values.

**v1.0.13**:

- Derived classes can now inherit methods, props and constructors from their parents up through the inheritance chain by calling the `mergeWithParent` method on an `IClassDeclaration`.

**v1.0.12**:

- The `ArbitraryValue`, `IValueable` and `INonNullableValueable` interfaces are now exported for public consumption.

**v1.0.11**:

- Major overhaul in regards to serialization and value resolving.

**v1.0.10**:

- Return statements of methods and functions can now also be broken up into expressions and resolved individually. A bit of refactoring.

**v1.0.9**:

- Added support for getting all identifiers and the values that they are initialized to in a map.

**v1.0.8**:

- Added support for 'super()' expressions from class methods.

**v1.0.7**:

- More caching, better performance, better resolving of values, other bug fixes.

**v1.0.6**:

- Added a blacklist filter for specific statement kinds that doesn't live on runtime (such as namespace declarations and interface declarations).

**v1.0.5**:

- Fixed bugs with infinite recursion and optimized performance.

**v1.0.4**:

- More resolved values can now be correctly computed.

**v1.0.3**:

- Much work on resolving values.

**v1.0.2**:

- Object-/Array destructuring now also works for function/method parameters and arguments.

**v1.0.1**:

- Support for commonjs and stability improvements.

**v1.0.0**:

- First release.

[npm-url]: https://npmjs.org/package/@wessberg/codeanalyzer
[npm-image]: https://badge.fury.io/js/@wessberg/codeanalyzer.svg