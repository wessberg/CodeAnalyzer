# CodeAnalyzer
[![NPM version][npm-version-image]][npm-version-url]
[![License-mit][license-mit-image]][license-mit-url]

[license-mit-url]: https://opensource.org/licenses/MIT

[license-mit-image]: https://img.shields.io/badge/License-MIT-yellow.svg

[npm-version-url]: https://www.npmjs.com/package/@wessberg/codeanalyzer

[npm-version-image]: https://badge.fury.io/js/%40wessberg%2Fcodeanalyzer.svg

> A service that can analyze and manipulate your code in great detail ahead of time.

## Installation
Simply do: `npm install @wessberg/codeanalyzer`.

## DISCLAIMER

This a very early alpha version. Do not expect it to compute proper values for all kinds of expressions.


## Description

The service is a very flexible and powerful tool for working with a Typescript AST.
You can extract useful information from your sourcecode as well as manipulate it in-place.

## Extracting information

Typescript generates a really powerful AST, but it can be somewhat difficult to extract information from it.
CodeAnalyzer provides services that makes it a lot easier. For example, let's say we have this class:

```typescript
// Inside a_class.ts:
class MyClass extends AClass implements AnInterface {
	foo: boolean = true;

	@foobar
	private static bar: Set<string> = new Set();
	
	aMethod (): void {
		
	}
	
	constructor (arg1: number, arg2: string) {
		super();
	}
}
```

Let's see how we can use CodeAnalyzer to extract information from it:

```typescript
const {languageService, classService} = new CodeAnalyzer();

// Generate a SourceFile
const sourceFile = languageService.getFile({path: "a_class.ts"});

// Let's get the ClassDeclaration
const myClass = classService.getClassWithName("MyClass", sourceFile);

// Prints 'AClass' to the console
console.log(classService.getNameOfExtendedClass(myClass));

// Prints 'true' to the console
console.log(classService.doesImplementInterfaceWithName("AnInterface", myClass));

// Gets the MethodDeclaration with the name 'aMethod'
classService.getMethodWithName("aMethod", myClass);

// Gets all static PropertyDeclarations that is decorated with a decorator matching the expression "foobar"
classService.getStaticPropertiesWithDecorator("foobar", myClass);
```

There are many, many more things you can extract with CodeAnalyzer, but this was just a simple example.

## Manipulation

Typescript itself provides useful `update` methods for all nodes, but they return new Nodes, rather than updating the tree in-place.
With CodeAnalyzer, you can mutate the tree while keeping all references. It works by generating a new AST and then recursively merging the new tree with the existing one
to replace primitive values through the tree.

For example, consider this example.
Say you have a class declared in the file: `a_class.ts`:

```typescript
// Inside a_class.ts:
class MyClass {
}
```

Now we can manipulate it with the CodeAnalyzer:

```typescript
const {languageService, classService, printer} = new CodeAnalyzer();

// Generate a SourceFile
const sourceFile = languageService.getFile({path: "a_class.ts"});

// Let's get the ClassDeclaration
const myClass = classService.getClassWithName("MyClass", sourceFile);

// Add a property to the class
classService.addPropertyToClass({
	decorators: null,
  type: "boolean",
  initializer: "true",
  isAbstract: false,
  isReadonly: true,
  isOptional: false,
  isAsync: false,
  isStatic: false,
  visibility: "public",
  name: "aProp"
}, myClass);

// Let's print the SourceFile and see how it looks now:
console.log(printer.print(sourceFile));

// This is what gets printed:
/*
 * class MyClass {
 * 	public readonly aProp: boolean = true;
 * }
 */
```