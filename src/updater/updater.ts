import {IUpdaterBase} from "./i-updater";
import {AsteriskToken, Block, ClassDeclaration, ClassElement, ClassExpression, ConstructorDeclaration, createNodeArray, Decorator, Expression, HeritageClause, Identifier, ImportClause, ImportDeclaration, ImportSpecifier, isClassExpression, MethodDeclaration, ModifiersArray, NamedImports, NamespaceImport, NodeArray, ParameterDeclaration, PropertyName, QuestionToken, SourceFile, Statement, TypeNode, TypeParameterDeclaration, updateClassDeclaration, updateClassExpression, updateConstructor, updateImportDeclaration, updateMethod, updateNamedImports, updateNamespaceImport, updateSourceFileNode} from "typescript";
import {ITypescriptLanguageService} from "@wessberg/typescript-language-service";
import {INodeUpdaterUtil} from "@wessberg/typescript-ast-util";

/**
 * A class for updating nodes
 */
export class Updater implements IUpdaterBase {

	constructor (private languageService: ITypescriptLanguageService,
							 private nodeUpdater: INodeUpdaterUtil) {
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
	 * Updates the decorators property of an ImportDeclaration
	 * @param {NodeArray<Decorator>} decorators
	 * @param {ImportDeclaration} importDeclaration
	 * @returns {ImportDeclaration}
	 */
	public updateImportDeclarationDecorators (decorators: NodeArray<Decorator>|undefined, importDeclaration: ImportDeclaration): ImportDeclaration {
		return this.updateImportDeclaration("decorators", decorators, importDeclaration);
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
	 * @param {ImportClause} importClause
	 * @param {ImportDeclaration} importDeclaration
	 * @returns {ImportDeclaration}
	 */
	public updateImportDeclarationImportClause (importClause: ImportClause, importDeclaration: ImportDeclaration): ImportDeclaration {
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
	 * Updates the decorators property of a MethodDeclaration
	 * @param {NodeArray<Decorator>} decorators
	 * @param {MethodDeclaration} method
	 * @returns {MethodDeclaration}
	 */
	public updateMethodDeclarationDecorators (decorators: NodeArray<Decorator>|undefined, method: MethodDeclaration): MethodDeclaration {
		return this.updateMethodDeclaration("decorators", decorators, method);
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
	 * Updates the decorators property of a ConstructorDeclaration
	 * @param {NodeArray<Decorator>} decorators
	 * @param {ConstructorDeclaration} constructor
	 * @returns {ConstructorDeclaration}
	 */
	public updateConstructorDeclarationDecorators (decorators: NodeArray<Decorator>|undefined, constructor: ConstructorDeclaration): ConstructorDeclaration {
		return this.updateConstructorDeclaration("decorators", decorators, constructor);
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
		return this.updateMethodDeclaration("body", body, method);
	}

	/**
	 * Updates the Body of a ConstructorDeclaration
	 * @param {Block} body
	 * @param {ConstructorDeclaration} constructor
	 * @returns {ConstructorDeclaration}
	 */
	public updateConstructorDeclarationBody (body: Block|undefined, constructor: ConstructorDeclaration): ConstructorDeclaration {
		return this.updateConstructorDeclaration("body", body, constructor);
	}

	/**
	 * Updates the TypeParameters of a class
	 * @param {NodeArray<TypeParameterDeclaration>} typeParameters
	 * @param {T} classDeclaration
	 * @returns {T}
	 */
	public updateClassDeclarationTypeParameters<T extends ClassDeclaration|ClassExpression> (typeParameters: NodeArray<TypeParameterDeclaration>|undefined, classDeclaration: T): T {
		return this.updateClassDeclaration("typeParameters", typeParameters, classDeclaration);
	}

	/**
	 * Updates the Decorators of a class
	 * @param {NodeArray<Decorator>} decorators
	 * @param {T} classDeclaration
	 * @returns {T}
	 */
	public updateClassDeclarationDecorators<T extends ClassDeclaration|ClassExpression> (decorators: NodeArray<Decorator>|undefined, classDeclaration: T): T {
		return this.updateClassDeclaration("decorators", decorators, classDeclaration);
	}

	/**
	 * Updates the ClassMembers of a class
	 * @param {NodeArray<ClassElement>} members
	 * @param {T} classDeclaration
	 * @returns {T}
	 */
	public updateClassDeclarationMembers<T extends ClassDeclaration|ClassExpression> (members: NodeArray<ClassElement>|undefined, classDeclaration: T): T {
		return this.updateClassDeclaration("members", members == null ? createNodeArray() : members, classDeclaration);
	}

	/**
	 * Updates the name of a class
	 * @param {Identifier?} name
	 * @param {T} classDeclaration
	 * @returns {T}
	 */
	public updateClassDeclarationName<T extends ClassDeclaration|ClassExpression> (name: Identifier|undefined, classDeclaration: T): T {
		return this.updateClassDeclaration("name", name, classDeclaration);
	}

	/**
	 * Updates the HeritageClauses of a class
	 * @param {NodeArray<HeritageClause>?} heritageClauses
	 * @param {T} classDeclaration
	 * @returns {T}
	 */
	public updateClassDeclarationHeritageClauses<T extends ClassDeclaration|ClassExpression> (heritageClauses: NodeArray<HeritageClause>|undefined, classDeclaration: T): T {
		return this.updateClassDeclaration("heritageClauses", heritageClauses, classDeclaration);
	}

	/**
	 * Updates the Modifiers of a class
	 * @param {ModifiersArray?} modifiers
	 * @param {T} classDeclaration
	 * @returns {T}
	 */
	public updateClassDeclarationModifiers<T extends ClassDeclaration|ClassExpression> (modifiers: ModifiersArray|undefined, classDeclaration: T): T {
		return this.updateClassDeclaration("modifiers", modifiers, classDeclaration);
	}

	/**
	 * Updates a ClassDeclaration
	 * @param {string} key
	 * @param {*} value
	 * @param {T} classDeclaration
	 * @returns {T}
	 */
	private updateClassDeclaration<T extends ClassDeclaration|ClassExpression> (key: keyof T, value: T[keyof T], classDeclaration: T): T {
		// If we're having to do with an expression
		if (isClassExpression(classDeclaration)) {
			const classExpressionUpdated = updateClassExpression(
				classDeclaration,
				key === "modifiers" ? value : classDeclaration.modifiers,
				key === "name" ? value : classDeclaration.name,
				key === "typeParameters" ? value : classDeclaration.typeParameters,
				key === "heritageClauses" ? value : classDeclaration.heritageClauses,
				key === "members" ? value : classDeclaration.members
			);

			// Force-set heritageClauses to undefined if they have none
			if (classExpressionUpdated.heritageClauses!.length === 0) classExpressionUpdated.heritageClauses = undefined;
			return <T> this.nodeUpdater.updateInPlace(classExpressionUpdated, classDeclaration, this.languageService);
		}

		// If we're having to do with a declaration
		const updated = updateClassDeclaration(
			<ClassDeclaration> classDeclaration,
			key === "decorators" ? value : classDeclaration.decorators,
			key === "modifiers" ? value : classDeclaration.modifiers,
			key === "name" ? value : classDeclaration.name,
			key === "typeParameters" ? value : classDeclaration.typeParameters,
			key === "heritageClauses" ? value : classDeclaration.heritageClauses,
			key === "members" ? value : classDeclaration.members
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
	 * Updates an ImportDeclaration
	 * @param {keyof ImportDeclaration} key
	 * @param {ImportDeclaration[keyof ImportDeclaration]} value
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