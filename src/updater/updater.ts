import {IUpdaterBase} from "./i-updater";
import {AsteriskToken, Block, CallExpression, ClassDeclaration, ClassElement, ClassExpression, ConstructorDeclaration, createNodeArray, Decorator, ExportDeclaration, ExportSpecifier, Expression, GetAccessorDeclaration, HeritageClause, Identifier, ImportClause, ImportDeclaration, ImportSpecifier, isClassDeclaration, isClassExpression, isConstructorDeclaration, isExportDeclaration, isGetAccessorDeclaration, isImportDeclaration, isMethodDeclaration, isPropertyDeclaration, isSetAccessorDeclaration, LeftHandSideExpression, MethodDeclaration, ModifiersArray, NamedExports, NamedImports, NamespaceImport, Node, NodeArray, ParameterDeclaration, PropertyDeclaration, PropertyName, QuestionToken, SetAccessorDeclaration, SourceFile, Statement, SyntaxKind, TypeNode, TypeParameterDeclaration, updateCall, updateClassDeclaration, updateClassExpression, updateConstructor, updateExportDeclaration, updateGetAccessor, updateImportDeclaration, updateMethod, updateNamedExports, updateNamedImports, updateNamespaceImport, updateProperty, updateSetAccessor, updateSourceFileNode} from "typescript";
import {ITypescriptLanguageService} from "@wessberg/typescript-language-service";
import {INodeUpdaterUtil} from "@wessberg/typescript-ast-util";

/*tslint:disable:no-any*/

/**
 * A class for updating nodes
 */
export class Updater implements IUpdaterBase {

	constructor (private readonly languageService: ITypescriptLanguageService,
							 private readonly nodeUpdater: INodeUpdaterUtil) {
	}

	/**
	 * Updates the body property of a GetAccessorDeclaration
	 * @param {Block} body
	 * @param {GetAccessorDeclaration} getter
	 * @returns {GetAccessorDeclaration}
	 */
	public updateGetAccessorDeclarationBody (body: Block|undefined, getter: GetAccessorDeclaration): GetAccessorDeclaration {
		return this.updateGetAccessorDeclaration("body", body, getter);
	}

	/**
	 * Updates the name property of a GetAccessorDeclaration
	 * @param {PropertyName} name
	 * @param {GetAccessorDeclaration} getter
	 * @returns {GetAccessorDeclaration}
	 */
	public updateGetAccessorDeclarationName (name: PropertyName, getter: GetAccessorDeclaration): GetAccessorDeclaration {
		return this.updateGetAccessorDeclaration("name", name, getter);
	}

	/**
	 * Updates the parameters property of a GetAccessorDeclaration
	 * @param {NodeArray<ParameterDeclaration>} parameters
	 * @param {GetAccessorDeclaration} getter
	 * @returns {GetAccessorDeclaration}
	 */
	public updateGetAccessorDeclarationParameters (parameters: NodeArray<ParameterDeclaration>, getter: GetAccessorDeclaration): GetAccessorDeclaration {
		return this.updateGetAccessorDeclaration("parameters", parameters, getter);
	}

	/**
	 * Updates the type property of a GetAccessorDeclaration
	 * @param {TypeNode} type
	 * @param {GetAccessorDeclaration} getter
	 * @returns {GetAccessorDeclaration}
	 */
	public updateGetAccessorDeclarationType (type: TypeNode|undefined, getter: GetAccessorDeclaration): GetAccessorDeclaration {
		return this.updateGetAccessorDeclaration("type", type, getter);
	}

	/**
	 * Updates the modifiers property of a GetAccessorDeclaration
	 * @param {ModifiersArray} modifiers
	 * @param {GetAccessorDeclaration} getter
	 * @returns {GetAccessorDeclaration}
	 */
	public updateGetAccessorDeclarationModifiers (modifiers: ModifiersArray|undefined, getter: GetAccessorDeclaration): GetAccessorDeclaration {
		return this.updateGetAccessorDeclaration("modifiers", modifiers, getter);
	}

	/**
	 * Updates the body property of a SetAccessorDeclaration
	 * @param {Block} body
	 * @param {SetAccessorDeclaration} setter
	 * @returns {SetAccessorDeclaration}
	 */
	public updateSetAccessorDeclarationBody (body: Block|undefined, setter: SetAccessorDeclaration): SetAccessorDeclaration {
		return this.updateSetAccessorDeclaration("body", body, setter);
	}

	/**
	 * Updates the name property of a SetAccessorDeclaration
	 * @param {PropertyName} name
	 * @param {SetAccessorDeclaration} setter
	 * @returns {SetAccessorDeclaration}
	 */
	public updateSetAccessorDeclarationName (name: PropertyName, setter: SetAccessorDeclaration): SetAccessorDeclaration {
		return this.updateSetAccessorDeclaration("name", name, setter);
	}

	/**
	 * Updates the parameters property of a SetAccessorDeclaration
	 * @param {NodeArray<ParameterDeclaration>} parameters
	 * @param {SetAccessorDeclaration} setter
	 * @returns {SetAccessorDeclaration}
	 */
	public updateSetAccessorDeclarationParameters (parameters: NodeArray<ParameterDeclaration>, setter: SetAccessorDeclaration): SetAccessorDeclaration {
		return this.updateSetAccessorDeclaration("parameters", parameters, setter);
	}

	/**
	 * Updates the modifiers property of a SetAccessorDeclaration
	 * @param {ModifiersArray} modifiers
	 * @param {SetAccessorDeclaration} setter
	 * @returns {SetAccessorDeclaration}
	 */
	public updateSetAccessorDeclarationModifiers (modifiers: ModifiersArray|undefined, setter: SetAccessorDeclaration): SetAccessorDeclaration {
		return this.updateSetAccessorDeclaration("modifiers", modifiers, setter);
	}

	/**
	 * Updates the exportClause property of an ExportDeclaration
	 * @param {NamedExports} exportClause
	 * @param {ExportDeclaration} exportDeclaration
	 * @returns {ExportDeclaration}
	 */
	public updateExportDeclarationExportClause (exportClause: NamedExports|undefined, exportDeclaration: ExportDeclaration): ExportDeclaration {
		return this.updateExportDeclaration("exportClause", exportClause, exportDeclaration);
	}

	/**
	 * Updates the moduleSpecifier property of an ExportDeclaration
	 * @param {Expression} moduleSpecifier
	 * @param {ExportDeclaration} exportDeclaration
	 * @returns {ExportDeclaration}
	 */
	public updateExportDeclarationModuleSpecifier (moduleSpecifier: Expression|undefined, exportDeclaration: ExportDeclaration): ExportDeclaration {
		return this.updateExportDeclaration("moduleSpecifier", moduleSpecifier, exportDeclaration);
	}

	/**
	 * Updates the modifiers property of an ExportDeclaration
	 * @param {ModifiersArray} modifiers
	 * @param {ExportDeclaration} exportDeclaration
	 * @returns {ExportDeclaration}
	 */
	public updateExportDeclarationModifiers (modifiers: ModifiersArray|undefined, exportDeclaration: ExportDeclaration): ExportDeclaration {
		return this.updateExportDeclaration("modifiers", modifiers, exportDeclaration);
	}

	/**
	 * Updates the expression property of a CallExpression
	 * @param {LeftHandSideExpression} expression
	 * @param {CallExpression} callExpression
	 * @returns {CallExpression}
	 */
	public updateCallExpressionExpression (expression: LeftHandSideExpression, callExpression: CallExpression): CallExpression {
		return this.updateCallExpression("expression", expression, callExpression);
	}

	/**
	 * Updates the typeArguments property of a CallExpression
	 * @param {NodeArray<TypeNode>} typeArguments
	 * @param {CallExpression} callExpression
	 * @returns {CallExpression}
	 */
	public updateCallExpressionTypeArguments (typeArguments: NodeArray<TypeNode>|undefined, callExpression: CallExpression): CallExpression {
		return this.updateCallExpression("typeArguments", typeArguments, callExpression);
	}

	/**
	 * Updates the arguments property of a CallExpression
	 * @param {NodeArray<Expression>} args
	 * @param {CallExpression} callExpression
	 * @returns {CallExpression}
	 */
	public updateCallExpressionArguments (args: NodeArray<Expression>, callExpression: CallExpression): CallExpression {
		return this.updateCallExpression("arguments", args, callExpression);
	}

	/**
	 * Updates the questionToken property of a PropertyDeclaration
	 * @param {QuestionToken} questionToken
	 * @param {PropertyDeclaration} property
	 * @returns {PropertyDeclaration}
	 */
	public updatePropertyDeclarationQuestionToken (questionToken: QuestionToken|undefined, property: PropertyDeclaration): PropertyDeclaration {
		return this.updatePropertyDeclaration("questionToken", questionToken, property);
	}

	/**
	 * Updates the name property of a PropertyDeclaration
	 * @param {PropertyName} name
	 * @param {PropertyDeclaration} property
	 * @returns {PropertyDeclaration}
	 */
	public updatePropertyDeclarationName (name: PropertyName, property: PropertyDeclaration): PropertyDeclaration {
		return this.updatePropertyDeclaration("name", name, property);
	}

	/**
	 * Updates the type property of a PropertyDeclaration
	 * @param {TypeNode} type
	 * @param {PropertyDeclaration} property
	 * @returns {PropertyDeclaration}
	 */
	public updatePropertyDeclarationType (type: TypeNode|undefined, property: PropertyDeclaration): PropertyDeclaration {
		return this.updatePropertyDeclaration("type", type, property);
	}

	/**
	 * Updates the initializer property of a PropertyDeclaration
	 * @param {Expression} initializer
	 * @param {PropertyDeclaration} property
	 * @returns {PropertyDeclaration}
	 */
	public updatePropertyDeclarationInitializer (initializer: Expression|undefined, property: PropertyDeclaration): PropertyDeclaration {
		return this.updatePropertyDeclaration("initializer", initializer, property);
	}

	/**
	 * Updates the decorators property of the given Node
	 * @param {ts.NodeArray<Decorator>} decorators
	 * @param {T} node
	 * @returns {T}
	 */
	public updateNodeDecorators<T extends Node> (decorators: NodeArray<Decorator>|undefined, node: T): T {

		if (isPropertyDeclaration(node)) {
			return <T><any> this.updatePropertyDeclaration("decorators", decorators, node);
		}

		else if (isMethodDeclaration(node)) {
			return <T><any> this.updateMethodDeclaration("decorators", decorators, node);
		}

		else if (isClassDeclaration(node) || isClassExpression(node)) {
			return <T><any> this.updateClassDeclaration("decorators", <T[keyof T]><any> decorators, node);
		}

		else if (isImportDeclaration(node)) {
			return <T><any> this.updateImportDeclaration("decorators", decorators, node);
		}

		else if (isExportDeclaration(node)) {
			return <T><any> this.updateExportDeclaration("decorators", decorators, node);
		}

		else if (isGetAccessorDeclaration(node)) {
			return <T><any> this.updateGetAccessorDeclaration("decorators", decorators, node);
		}

		else if (isSetAccessorDeclaration(node)) {
			return <T><any> this.updateSetAccessorDeclaration("decorators", decorators, node);
		}

		else if (isConstructorDeclaration(node)) {
			return <T><any> this.updateConstructorDeclaration("decorators", decorators, node);
		}

		throw new TypeError(`${this.constructor.name} could not update decorators on a node of kind: ${SyntaxKind[node.kind]}: It wasn't handled!`);
	}

	/**
	 * Updates the modifiers property of the given Node
	 * @param {ModifiersArray} modifiers
	 * @param {T} node
	 * @returns {T}
	 */
	public updateNodeModifiers<T extends Node> (modifiers: ModifiersArray|undefined, node: T): T {

		if (isPropertyDeclaration(node)) {
			return <T><any> this.updatePropertyDeclarationModifiers(modifiers, node);
		}

		else if (isMethodDeclaration(node)) {
			return <T><any> this.updateMethodDeclarationModifiers(modifiers, node);
		}

		else if (isClassDeclaration(node) || isClassExpression(node)) {
			return <T><any> this.updateClassDeclarationModifiers(modifiers, node);
		}

		else if (isImportDeclaration(node)) {
			return <T><any> this.updateImportDeclarationModifiers(modifiers, node);
		}

		else if (isExportDeclaration(node)) {
			return <T><any> this.updateExportDeclarationModifiers(modifiers, node);
		}

		else if (isGetAccessorDeclaration(node)) {
			return <T><any> this.updateGetAccessorDeclarationModifiers(modifiers, node);
		}

		else if (isSetAccessorDeclaration(node)) {
			return <T><any> this.updateSetAccessorDeclarationModifiers(modifiers, node);
		}

		else if (isConstructorDeclaration(node)) {
			return <T><any> this.updateConstructorDeclarationModifiers(modifiers, node);
		}

		throw new TypeError(`${this.constructor.name} could not update modifiers on a node of kind: ${SyntaxKind[node.kind]}: It wasn't handled!`);
	}

	/**
	 * Updates the modifiers property of a PropertyDeclaration
	 * @param {ModifiersArray} modifiers
	 * @param {PropertyDeclaration} property
	 * @returns {PropertyDeclaration}
	 */
	public updatePropertyDeclarationModifiers (modifiers: ModifiersArray|undefined, property: PropertyDeclaration): PropertyDeclaration {
		return this.updatePropertyDeclaration("modifiers", modifiers, property);
	}

	/**
	 * Replaces a Node with the new one
	 * @param {T} newNode
	 * @param {T} existing
	 * @returns {T}
	 */
	public replace<T extends Node> (newNode: T, existing: T): T {
		return this.nodeUpdater.updateInPlace(newNode, existing, this.languageService);
	}

	/**
	 * Updates the statements property of a SourceFile
	 * @param {NodeArray<Statement>} statements
	 * @param {SourceFile} sourceFile
	 * @returns {SourceFile}
	 */
	public updateSourceFileStatements (statements: NodeArray<Statement>, sourceFile: SourceFile): SourceFile {
		return this.updateSourceFile("statements", statements, sourceFile);
	}

	/**
	 * Updates the name property of a NamespaceImport
	 * @param {Identifier} name
	 * @param {NamespaceImport} namespaceImport
	 * @returns {NamespaceImport}
	 */
	public updateNamespaceImportName (name: Identifier, namespaceImport: NamespaceImport): NamespaceImport {
		return this.updateNamespaceImport("name", name, namespaceImport);
	}

	/**
	 * Updates the elements property of a NamedImports
	 * @param {NodeArray<ImportSpecifier>} elements
	 * @param {NamedImports} namedImports
	 * @returns {NamedImports}
	 */
	public updateNamedImportsElements (elements: NodeArray<ImportSpecifier>, namedImports: NamedImports): NamedImports {
		return this.updateNamedImports("elements", elements, namedImports);
	}

	/**
	 * Updates the elements property of a NamedExports
	 * @param {NodeArray<ExportSpecifier>} elements
	 * @param {NamedExports} namedExports
	 * @returns {NamedExports}
	 */
	public updateNamedExportsElements (elements: NodeArray<ExportSpecifier>, namedExports: NamedExports): NamedExports {
		return this.updateNamedExports("elements", elements, namedExports);
	}

	/**
	 * Updates the modifiers property of an ImportDeclaration
	 * @param {ModifiersArray} modifiers
	 * @param {ImportDeclaration} importDeclaration
	 * @returns {ImportDeclaration}
	 */
	public updateImportDeclarationModifiers (modifiers: ModifiersArray|undefined, importDeclaration: ImportDeclaration): ImportDeclaration {
		return this.updateImportDeclaration("modifiers", modifiers, importDeclaration);
	}

	/**
	 * Updates the importClause property of an ImportDeclaration
	 * @param {ImportClause?} importClause
	 * @param {ImportDeclaration} importDeclaration
	 * @returns {ImportDeclaration}
	 */
	public updateImportDeclarationImportClause (importClause: ImportClause|undefined, importDeclaration: ImportDeclaration): ImportDeclaration {
		return this.updateImportDeclaration("importClause", importClause, importDeclaration);
	}

	/**
	 * Updates the moduleSpecifier property of an ImportDeclaration
	 * @param {Expression} moduleSpecifier
	 * @param {ImportDeclaration} importDeclaration
	 * @returns {ImportDeclaration}
	 */
	public updateImportDeclarationModuleSpecifier (moduleSpecifier: Expression, importDeclaration: ImportDeclaration): ImportDeclaration {
		return this.updateImportDeclaration("moduleSpecifier", moduleSpecifier, importDeclaration);
	}

	/**
	 * Updates the name property of a MethodDeclaration
	 * @param {PropertyName} name
	 * @param {MethodDeclaration} method
	 * @returns {MethodDeclaration}
	 */
	public updateMethodDeclarationName (name: PropertyName, method: MethodDeclaration): MethodDeclaration {
		return this.updateMethodDeclaration("name", name, method);
	}

	/**
	 * Updates the asteriskToken property of a MethodDeclaration
	 * @param {AsteriskToken} asteriskToken
	 * @param {MethodDeclaration} method
	 * @returns {MethodDeclaration}
	 */
	public updateMethodDeclarationAsteriskToken (asteriskToken: AsteriskToken|undefined, method: MethodDeclaration): MethodDeclaration {
		return this.updateMethodDeclaration("asteriskToken", asteriskToken, method);
	}

	/**
	 * Updates the questionToken property of a MethodDeclaration
	 * @param {QuestionToken} questionToken
	 * @param {MethodDeclaration} method
	 * @returns {MethodDeclaration}
	 */
	public updateMethodDeclarationQuestionToken (questionToken: QuestionToken|undefined, method: MethodDeclaration): MethodDeclaration {
		return this.updateMethodDeclaration("questionToken", questionToken, method);
	}

	/**
	 * Updates the typeParameters property of a MethodDeclaration
	 * @param {NodeArray<TypeParameterDeclaration>} typeParameters
	 * @param {MethodDeclaration} method
	 * @returns {MethodDeclaration}
	 */
	public updateMethodDeclarationTypeParameters (typeParameters: NodeArray<TypeParameterDeclaration>|undefined, method: MethodDeclaration): MethodDeclaration {
		return this.updateMethodDeclaration("typeParameters", typeParameters, method);
	}

	/**
	 * Updates the parameters property of a MethodDeclaration
	 * @param {NodeArray<ParameterDeclaration>} parameters
	 * @param {MethodDeclaration} method
	 * @returns {MethodDeclaration}
	 */
	public updateMethodDeclarationParameters (parameters: NodeArray<ParameterDeclaration>, method: MethodDeclaration): MethodDeclaration {
		return this.updateMethodDeclaration("parameters", parameters, method);
	}

	/**
	 * Updates the type property of a MethodDeclaration
	 * @param {TypeNode} type
	 * @param {MethodDeclaration} method
	 * @returns {MethodDeclaration}
	 */
	public updateMethodDeclarationType (type: TypeNode|undefined, method: MethodDeclaration): MethodDeclaration {
		return this.updateMethodDeclaration("type", type, method);
	}

	/**
	 * Updates the modifiers property of a MethodDeclaration
	 * @param {ModifiersArray} modifiers
	 * @param {MethodDeclaration} method
	 * @returns {MethodDeclaration}
	 */
	public updateMethodDeclarationModifiers (modifiers: ModifiersArray|undefined, method: MethodDeclaration): MethodDeclaration {
		return this.updateMethodDeclaration("modifiers", modifiers, method);
	}

	/**
	 * Updates the asteriskToken property of a ConstructorDeclaration
	 * @param {AsteriskToken} asteriskToken
	 * @param {ConstructorDeclaration} constructor
	 * @returns {ConstructorDeclaration}
	 */
	public updateConstructorDeclarationAsteriskToken (asteriskToken: AsteriskToken|undefined, constructor: ConstructorDeclaration): ConstructorDeclaration {
		return this.updateConstructorDeclaration("asteriskToken", asteriskToken, constructor);
	}

	/**
	 * Updates the questionToken property of a ConstructorDeclaration
	 * @param {QuestionToken} questionToken
	 * @param {ConstructorDeclaration} constructor
	 * @returns {ConstructorDeclaration}
	 */
	public updateConstructorDeclarationQuestionToken (questionToken: QuestionToken|undefined, constructor: ConstructorDeclaration): ConstructorDeclaration {
		return this.updateConstructorDeclaration("questionToken", questionToken, constructor);
	}

	/**
	 * Updates the typeParameters property of a ConstructorDeclaration
	 * @param {NodeArray<TypeParameterDeclaration>} typeParameters
	 * @param {ConstructorDeclaration} constructor
	 * @returns {ConstructorDeclaration}
	 */
	public updateConstructorDeclarationTypeParameters (typeParameters: NodeArray<TypeParameterDeclaration>|undefined, constructor: ConstructorDeclaration): ConstructorDeclaration {
		return this.updateConstructorDeclaration("typeParameters", typeParameters, constructor);
	}

	/**
	 * Updates the parameters property of a ConstructorDeclaration
	 * @param {NodeArray<ParameterDeclaration>} parameters
	 * @param {ConstructorDeclaration} constructor
	 * @returns {ConstructorDeclaration}
	 */
	public updateConstructorDeclarationParameters (parameters: NodeArray<ParameterDeclaration>, constructor: ConstructorDeclaration): ConstructorDeclaration {
		return this.updateConstructorDeclaration("parameters", parameters, constructor);
	}

	/**
	 * Updates the type property of a ConstructorDeclaration
	 * @param {TypeNode} type
	 * @param {ConstructorDeclaration} constructor
	 * @returns {ConstructorDeclaration}
	 */
	public updateConstructorDeclarationType (type: TypeNode|undefined, constructor: ConstructorDeclaration): ConstructorDeclaration {
		return this.updateConstructorDeclaration("type", type, constructor);
	}

	/**
	 * Updates the modifiers property of a ConstructorDeclaration
	 * @param {ModifiersArray} modifiers
	 * @param {ConstructorDeclaration} constructor
	 * @returns {ConstructorDeclaration}
	 */
	public updateConstructorDeclarationModifiers (modifiers: ModifiersArray|undefined, constructor: ConstructorDeclaration): ConstructorDeclaration {
		return this.updateConstructorDeclaration("modifiers", modifiers, constructor);
	}

	/**
	 * Updates the Body of a MethodDeclaration
	 * @param {Block} body
	 * @param {MethodDeclaration} method
	 * @returns {MethodDeclaration}
	 */
	public updateMethodDeclarationBody (body: Block|undefined, method: MethodDeclaration): MethodDeclaration {
		if (body == null || method.body == null) {
			this.updateMethodDeclaration("body", body, method);
		} else {
			this.replace(body, method.body);
		}
		return method;
	}

	/**
	 * Updates the Body of a ConstructorDeclaration
	 * @param {Block} body
	 * @param {ConstructorDeclaration} constructor
	 * @returns {ConstructorDeclaration}
	 */
	public updateConstructorDeclarationBody (body: Block|undefined, constructor: ConstructorDeclaration): ConstructorDeclaration {
		if (body == null || constructor.body == null) {
			this.updateConstructorDeclaration("body", body, constructor);
		} else {
			this.replace(body, constructor.body);
		}
		return constructor;
	}

	/**
	 * Updates the TypeParameters of a class
	 * @param {NodeArray<TypeParameterDeclaration>} typeParameters
	 * @param {T} classDeclaration
	 * @returns {T}
	 */
	public updateClassDeclarationTypeParameters<T extends ClassDeclaration|ClassExpression> (typeParameters: NodeArray<TypeParameterDeclaration>|undefined, classDeclaration: T): T {
		return this.updateClassDeclaration("typeParameters", <T[keyof T]><any> typeParameters, classDeclaration);
	}

	/**
	 * Updates the ClassMembers of a class
	 * @param {NodeArray<ClassElement>} members
	 * @param {T} classDeclaration
	 * @returns {T}
	 */
	public updateClassDeclarationMembers<T extends ClassDeclaration|ClassExpression> (members: NodeArray<ClassElement>|undefined, classDeclaration: T): T {
		return this.updateClassDeclaration("members", <T[keyof T]><any> (members == null ? createNodeArray<ClassElement>() : members), classDeclaration);
	}

	/**
	 * Updates the name of a class
	 * @param {Identifier?} name
	 * @param {T} classDeclaration
	 * @returns {T}
	 */
	public updateClassDeclarationName<T extends ClassDeclaration|ClassExpression> (name: Identifier|undefined, classDeclaration: T): T {
		return this.updateClassDeclaration("name", <T[keyof T]><any> name, classDeclaration);
	}

	/**
	 * Updates the HeritageClauses of a class
	 * @param {NodeArray<HeritageClause>?} heritageClauses
	 * @param {T} classDeclaration
	 * @returns {T}
	 */
	public updateClassDeclarationHeritageClauses<T extends ClassDeclaration|ClassExpression> (heritageClauses: NodeArray<HeritageClause>|undefined, classDeclaration: T): T {
		return this.updateClassDeclaration("heritageClauses", <T[keyof T]><any> heritageClauses, classDeclaration);
	}

	/**
	 * Updates the Modifiers of a class
	 * @param {ModifiersArray?} modifiers
	 * @param {T} classDeclaration
	 * @returns {T}
	 */
	public updateClassDeclarationModifiers<T extends ClassDeclaration|ClassExpression> (modifiers: ModifiersArray|undefined, classDeclaration: T): T {
		return this.updateClassDeclaration("modifiers", <T[keyof T]><any> modifiers, classDeclaration);
	}

	/**
	 * Updates a ClassDeclaration
	 * @param {string} key
	 * @param {*} value
	 * @param {T} classDeclaration
	 * @returns {T}
	 */
	private updateClassDeclaration<T extends ClassDeclaration|ClassExpression> (key: keyof T, value: T[keyof T]|undefined, classDeclaration: T): T {
		// If we're having to do with an expression
		if (isClassExpression(classDeclaration)) {
			const classExpressionUpdated = updateClassExpression(
				classDeclaration,
				key === "modifiers" ? <any>value : classDeclaration.modifiers,
				key === "name" ? <any> value : classDeclaration.name,
				key === "typeParameters" ? <any> value : classDeclaration.typeParameters,
				key === "heritageClauses" ? <any> value : classDeclaration.heritageClauses,
				key === "members" ? <any> value : classDeclaration.members
			);

			// Force-set heritageClauses to undefined if they have none
			if (classExpressionUpdated.heritageClauses!.length === 0) classExpressionUpdated.heritageClauses = undefined;
			return <T> this.nodeUpdater.updateInPlace(classExpressionUpdated, classDeclaration, this.languageService);
		}

		// If we're having to do with a declaration
		const updated = updateClassDeclaration(
			<ClassDeclaration> classDeclaration,
			key === "decorators" ? <any> value : classDeclaration.decorators,
			key === "modifiers" ? <any> value : classDeclaration.modifiers,
			key === "name" ? <any> value : classDeclaration.name,
			key === "typeParameters" ? <any> value : classDeclaration.typeParameters,
			key === "heritageClauses" ? <any> value : classDeclaration.heritageClauses,
			key === "members" ? <any> value : classDeclaration.members
		);

		// Force-set heritageClauses to undefined if they have none
		if (updated.heritageClauses!.length === 0) updated.heritageClauses = undefined;
		return <T> this.nodeUpdater.updateInPlace(updated, <ClassDeclaration> classDeclaration, this.languageService);
	}

	/**
	 * Updates a MethodDeclaration
	 * @param {string} key
	 * @param {*} value
	 * @param {MethodDeclaration} method
	 * @returns {MethodDeclaration}
	 */
	private updateMethodDeclaration (key: keyof MethodDeclaration, value: MethodDeclaration[keyof MethodDeclaration], method: MethodDeclaration): MethodDeclaration {

		return this.nodeUpdater.updateInPlace(
			updateMethod(
				method,
				key === "decorators" ? value : method.decorators,
				key === "modifiers" ? value : method.modifiers,
				key === "asteriskToken" ? value : method.asteriskToken,
				key === "name" ? value : method.name,
				key === "questionToken" ? value : method.questionToken,
				key === "typeParameters" ? value : method.typeParameters,
				key === "parameters" ? value : method.parameters,
				key === "type" ? value : method.type,
				key === "body" ? value : method.body
			), method, this.languageService);
	}

	/**
	 * Updates a GetAccessorDeclaration
	 * @param {string} key
	 * @param {*} value
	 * @param {GetAccessorDeclaration} getter
	 * @returns {GetAccessorDeclaration}
	 */
	private updateGetAccessorDeclaration (key: keyof GetAccessorDeclaration, value: GetAccessorDeclaration[keyof GetAccessorDeclaration], getter: GetAccessorDeclaration): GetAccessorDeclaration {

		return this.nodeUpdater.updateInPlace(
			updateGetAccessor(
				getter,
				key === "decorators" ? value : getter.decorators,
				key === "modifiers" ? value : getter.modifiers,
				key === "name" ? value : getter.name,
				key === "parameters" ? value : getter.parameters,
				key === "type" ? value : getter.type,
				key === "body" ? value : getter.body
			), getter, this.languageService);
	}

	/**
	 * Updates a SetAccessorDeclaration
	 * @param {string} key
	 * @param {*} value
	 * @param {SetAccessorDeclaration} setter
	 * @returns {SetAccessorDeclaration}
	 */
	private updateSetAccessorDeclaration (key: keyof SetAccessorDeclaration, value: SetAccessorDeclaration[keyof SetAccessorDeclaration], setter: SetAccessorDeclaration): SetAccessorDeclaration {

		return this.nodeUpdater.updateInPlace(
			updateSetAccessor(
				setter,
				key === "decorators" ? value : setter.decorators,
				key === "modifiers" ? value : setter.modifiers,
				key === "name" ? value : setter.name,
				key === "parameters" ? value : setter.parameters,
				key === "body" ? value : setter.body
			), setter, this.languageService);
	}

	/**
	 * Updates a PropertyDeclaration
	 * @param {string} key
	 * @param {*} value
	 * @param {PropertyDeclaration} property
	 * @returns {PropertyDeclaration}
	 */
	private updatePropertyDeclaration (key: keyof PropertyDeclaration, value: PropertyDeclaration[keyof PropertyDeclaration], property: PropertyDeclaration): PropertyDeclaration {

		return this.nodeUpdater.updateInPlace(
			updateProperty(
				property,
				key === "decorators" ? value : property.decorators,
				key === "modifiers" ? value : property.modifiers,
				key === "name" ? value : property.name,
				key === "questionToken" ? value : property.questionToken,
				key === "type" ? value : property.type,
				key === "initializer" ? value : property.initializer
			), property, this.languageService);
	}

	/**
	 * Updates a ConstructorDeclaration
	 * @param {string} key
	 * @param {*} value
	 * @param {ConstructorDeclaration} constructor
	 * @returns {ConstructorDeclaration}
	 */
	private updateConstructorDeclaration (key: keyof ConstructorDeclaration, value: ConstructorDeclaration[keyof ConstructorDeclaration], constructor: ConstructorDeclaration): ConstructorDeclaration {

		return this.nodeUpdater.updateInPlace(
			updateConstructor(
				constructor,
				key === "decorators" ? value : constructor.decorators,
				key === "modifiers" ? value : constructor.modifiers,
				key === "parameters" ? value : constructor.parameters,
				key === "body" ? value : constructor.body
			), constructor, this.languageService);
	}

	/**
	 * Updates a CallExpression
	 * @param {string} key
	 * @param {*} value
	 * @param {CallExpression} callExpression
	 * @returns {CallExpression}
	 */
	private updateCallExpression (key: keyof CallExpression, value: CallExpression[keyof CallExpression], callExpression: CallExpression): CallExpression {

		return this.nodeUpdater.updateInPlace(
			updateCall(
				callExpression,
				key === "expression" ? value : callExpression.expression,
				key === "typeArguments" ? value : callExpression.typeArguments,
				key === "arguments" ? value : callExpression.arguments
			), callExpression, this.languageService);
	}

	/**
	 * Updates an ImportDeclaration
	 * @param {string} key
	 * @param {*} value
	 * @param {ImportDeclaration} importDeclaration
	 * @returns {ImportDeclaration}
	 */
	private updateImportDeclaration (key: keyof ImportDeclaration, value: ImportDeclaration[keyof ImportDeclaration], importDeclaration: ImportDeclaration): ImportDeclaration {

		return this.nodeUpdater.updateInPlace(
			updateImportDeclaration(
				importDeclaration,
				key === "decorators" ? value : importDeclaration.decorators,
				key === "modifiers" ? value : importDeclaration.modifiers,
				key === "importClause" ? value : importDeclaration.importClause,
				key === "moduleSpecifier" ? value : importDeclaration.moduleSpecifier
			), importDeclaration, this.languageService);
	}

	/**
	 * Updates an ExportDeclaration
	 * @param {string} key
	 * @param {*} value
	 * @param {ExportDeclaration} exportDeclaration
	 * @returns {ExportDeclaration}
	 */
	private updateExportDeclaration (key: keyof ExportDeclaration, value: ExportDeclaration[keyof ExportDeclaration], exportDeclaration: ExportDeclaration): ExportDeclaration {

		return this.nodeUpdater.updateInPlace(
			updateExportDeclaration(
				exportDeclaration,
				key === "decorators" ? value : exportDeclaration.decorators,
				key === "modifiers" ? value : exportDeclaration.modifiers,
				key === "exportClause" ? value : exportDeclaration.exportClause,
				key === "moduleSpecifier" ? value : exportDeclaration.moduleSpecifier
			), exportDeclaration, this.languageService);
	}

	/**
	 * Updates a NamedImports
	 * @param {string} key
	 * @param {*} value
	 * @param {NamedImports} namedImports
	 * @returns {NamedImports}
	 */
	private updateNamedImports (key: keyof NamedImports, value: NamedImports[keyof NamedImports], namedImports: NamedImports): NamedImports {

		return this.nodeUpdater.updateInPlace(
			updateNamedImports(
				namedImports,
				key === "elements" ? <NodeArray<ImportSpecifier>> value : namedImports.elements
			), namedImports, this.languageService);
	}

	/**
	 * Updates a NamedExports
	 * @param {string} key
	 * @param {*} value
	 * @param {NamedExports} namedExports
	 * @returns {NamedExports}
	 */
	private updateNamedExports (key: keyof NamedExports, value: NamedExports[keyof NamedExports], namedExports: NamedExports): NamedExports {

		return this.nodeUpdater.updateInPlace(
			updateNamedExports(
				namedExports,
				key === "elements" ? <NodeArray<ExportSpecifier>> value : namedExports.elements
			), namedExports, this.languageService);
	}

	/**
	 * Updates a NamespaceImport
	 * @param {string} key
	 * @param {*} value
	 * @param {NamespaceImport} namespaceImport
	 * @returns {NamespaceImport}
	 */
	private updateNamespaceImport (key: keyof NamespaceImport, value: NamespaceImport[keyof NamespaceImport], namespaceImport: NamespaceImport): NamespaceImport {

		return this.nodeUpdater.updateInPlace(
			updateNamespaceImport(
				namespaceImport,
				key === "name" ? value : namespaceImport.name
			), namespaceImport, this.languageService);
	}

	/**
	 * Updates a SourceFile
	 * @param {string} key
	 * @param {*} value
	 * @param {SourceFile} sourceFile
	 * @returns {SourceFile}
	 */
	private updateSourceFile (key: keyof SourceFile, value: SourceFile[keyof SourceFile], sourceFile: SourceFile): SourceFile {

		return this.nodeUpdater.updateInPlace(
			updateSourceFileNode(
				sourceFile,
				key === "statements" ? value : sourceFile.statements
			), sourceFile, this.languageService);
	}
}