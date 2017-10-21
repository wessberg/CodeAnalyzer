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

This is an early version. More services and manipulators will be added as time passes.
Feel free to submit an issue or a PR if CodeAnalyzer doesn't cover one or more of your use cases.

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
console.log(classService.isImplementingInterfaceWithName("AnInterface", myClass));

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

## Mapping a Typescript AST to a lighter AST representation

CodeAnalyzer also comes with the possibility of transforming a Typescript AST into something
we've called a Light AST. This is one that is easily readable and less detailed. This can be useful, for example for extracting
type information from type declarations to have them live on runtime. In that case, the output should be as clean and tiny as possible.
In fact, you can transform any Typescript node into its light-ast equivalent.

For example, say you want to generate runtime typings from this interface declaration:

```typescript
// Inside an_interface.ts
interface IFoo {
	prop1: boolean;
	readonly prop2: string;
	prop3?: string|null;
	method1 (arg1: string): boolean;
	method2 (): Promise<void>;
}
```

You can then use CodeAnalyzer to extract a light-AST from it and save it, for example as a JSON file, so it can be retrieved on runtime.
Here's how you would get a light-AST representation of the interface with CodeAnalyzer:

```typescript
const {interfaceDeclarationService, languageService} = new CodeAnalyzer();

// Generate a SourceFile
const sourceFile = languageService.getFile({path: "an_interface.ts"});

// Let's get the InterfaceDeclaration
const iFoo = interfaceDeclarationService.getInterfaceWithName("IFoo", sourceFile);

// Transform it into a light-AST
const lightAst = interfaceDeclarationService.toLightAST(iFoo);
```
Here's how the generated light-AST would look for the above interface:

```json
{
  "members": [
    {
      "name": "prop1",
      "isOptional": false,
      "type": "boolean",
      "initializer": null,
      "isReadonly": false,
      "nodeKind": "PROPERTY_SIGNATURE"
    },
    {
      "name": "prop2",
      "isOptional": false,
      "type": "string",
      "initializer": null,
      "isReadonly": true,
      "nodeKind": "PROPERTY_SIGNATURE"
    },
    {
      "name": "prop3",
      "isOptional": true,
      "type": "string | null",
      "initializer": null,
      "isReadonly": false,
      "nodeKind": "PROPERTY_SIGNATURE"
    },
    {
      "name": "method1",
      "isOptional": false,
      "type": "boolean",
      "parameters": [
        {
          "type": "string",
          "initializer": null,
          "isRestSpread": false,
          "isOptional": false,
          "isReadonly": false,
          "decorators": null,
          "name": {
            "kind": "NORMAL",
            "name": "arg1",
            "nodeKind": "BINDING_NAME"
          },
          "nodeKind": "PARAMETER"
        }
      ],
      "typeParameters": null,
      "nodeKind": "METHOD_SIGNATURE"
    },
    {
      "name": "method2",
      "isOptional": false,
      "type": "Promise<void>",
      "parameters": [],
      "typeParameters": null,
      "nodeKind": "METHOD_SIGNATURE"
    }
  ],
  "name": "IFoo",
  "extends": null,
  "typeParameters": null,
  "nodeKind": "INTERFACE"
}
```