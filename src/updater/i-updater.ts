import {AsteriskToken, Block, ClassDeclaration, ClassElement, ClassExpression, ConstructorDeclaration, Decorator, Expression, HeritageClause, Identifier, ImportClause, ImportDeclaration, ImportSpecifier, MethodDeclaration, ModifiersArray, NamedImports, NamespaceImport, NodeArray, ParameterDeclaration, PropertyName, QuestionToken, SourceFile, Statement, TypeNode, TypeParameterDeclaration} from "typescript";

export interface IUpdaterBase {
	updateClassDeclarationName <T extends ClassDeclaration|ClassExpression> (name: Identifier|undefined, classDeclaration: T): T;
	updateClassDeclarationHeritageClauses <T extends ClassDeclaration|ClassExpression> (heritageClauses: NodeArray<HeritageClause>|undefined, classDeclaration: T): T;
	updateClassDeclarationModifiers <T extends ClassDeclaration|ClassExpression> (modifiers: ModifiersArray|undefined, classDeclaration: T): T;
	updateClassDeclarationTypeParameters <T extends ClassDeclaration|ClassExpression> (typeParameters: NodeArray<TypeParameterDeclaration>|undefined, classDeclaration: T): T;
	updateClassDeclarationMembers <T extends ClassDeclaration|ClassExpression> (members: NodeArray<ClassElement>|undefined, classDeclaration: T): T;
	updateClassDeclarationDecorators <T extends ClassDeclaration|ClassExpression> (decorators: NodeArray<Decorator>|undefined, classDeclaration: T): T;

	updateMethodDeclarationBody (body: Block|undefined, method: MethodDeclaration): MethodDeclaration;
	updateMethodDeclarationName (name: PropertyName, method: MethodDeclaration): MethodDeclaration;
	updateMethodDeclarationAsteriskToken (asteriskToken: AsteriskToken|undefined, method: MethodDeclaration): MethodDeclaration;
	updateMethodDeclarationQuestionToken (questionToken: QuestionToken|undefined, method: MethodDeclaration): MethodDeclaration;
	updateMethodDeclarationTypeParameters (typeParameters: NodeArray<TypeParameterDeclaration>|undefined, method: MethodDeclaration): MethodDeclaration;
	updateMethodDeclarationParameters (parameters: NodeArray<ParameterDeclaration>, method: MethodDeclaration): MethodDeclaration;
	updateMethodDeclarationType (type: TypeNode|undefined, method: MethodDeclaration): MethodDeclaration;
	updateMethodDeclarationDecorators (decorators: NodeArray<Decorator>|undefined, method: MethodDeclaration): MethodDeclaration;
	updateMethodDeclarationModifiers (modifiers: ModifiersArray|undefined, method: MethodDeclaration): MethodDeclaration;

	updateConstructorDeclarationBody (body: Block|undefined, constructor: ConstructorDeclaration): ConstructorDeclaration;
	updateConstructorDeclarationAsteriskToken (asteriskToken: AsteriskToken|undefined, constructor: ConstructorDeclaration): ConstructorDeclaration;
	updateConstructorDeclarationQuestionToken (questionToken: QuestionToken|undefined, constructor: ConstructorDeclaration): ConstructorDeclaration;
	updateConstructorDeclarationTypeParameters (typeParameters: NodeArray<TypeParameterDeclaration>|undefined, constructor: ConstructorDeclaration): ConstructorDeclaration;
	updateConstructorDeclarationParameters (parameters: NodeArray<ParameterDeclaration>, constructor: ConstructorDeclaration): ConstructorDeclaration;
	updateConstructorDeclarationType (type: TypeNode|undefined, constructor: ConstructorDeclaration): ConstructorDeclaration;
	updateConstructorDeclarationDecorators (decorators: NodeArray<Decorator>|undefined, constructor: ConstructorDeclaration): ConstructorDeclaration;
	updateConstructorDeclarationModifiers (modifiers: ModifiersArray|undefined, constructor: ConstructorDeclaration): ConstructorDeclaration;

	updateImportDeclarationImportClause (importClause: ImportClause, importDeclaration: ImportDeclaration): ImportDeclaration;
	updateImportDeclarationModuleSpecifier (moduleSpecifier: Expression, importDeclaration: ImportDeclaration): ImportDeclaration;
	updateImportDeclarationDecorators (decorators: NodeArray<Decorator>|undefined, importDeclaration: ImportDeclaration): ImportDeclaration;
	updateImportDeclarationModifiers (modifiers: ModifiersArray|undefined, importDeclaration: ImportDeclaration): ImportDeclaration;

	updateNamedImportsElements (elements: NodeArray<ImportSpecifier>, namedImports: NamedImports): NamedImports;
	updateNamespaceImportName (name: Identifier, namespaceImport: NamespaceImport): NamespaceImport;

	updateSourceFileStatements (statements: NodeArray<Statement>, sourceFile: SourceFile): SourceFile;

}