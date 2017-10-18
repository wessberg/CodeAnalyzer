import {AsteriskToken, Block, CallExpression, ClassDeclaration, ClassElement, ClassExpression, ConstructorDeclaration, Decorator, ExportDeclaration, ExportSpecifier, Expression, HeritageClause, Identifier, ImportClause, ImportDeclaration, ImportSpecifier, LeftHandSideExpression, MethodDeclaration, ModifiersArray, NamedExports, NamedImports, NamespaceImport, Node, NodeArray, ParameterDeclaration, PropertyDeclaration, PropertyName, QuestionToken, SourceFile, Statement, TypeNode, TypeParameterDeclaration} from "typescript";

export interface IUpdaterBase {
	updateNodeDecorators<T extends Node> (decorators: NodeArray<Decorator>|undefined, node: T): T;
	updateClassDeclarationName <T extends ClassDeclaration|ClassExpression> (name: Identifier|undefined, classDeclaration: T): T;
	updateClassDeclarationHeritageClauses <T extends ClassDeclaration|ClassExpression> (heritageClauses: NodeArray<HeritageClause>|undefined, classDeclaration: T): T;
	updateClassDeclarationModifiers <T extends ClassDeclaration|ClassExpression> (modifiers: ModifiersArray|undefined, classDeclaration: T): T;
	updateClassDeclarationTypeParameters <T extends ClassDeclaration|ClassExpression> (typeParameters: NodeArray<TypeParameterDeclaration>|undefined, classDeclaration: T): T;
	updateClassDeclarationMembers <T extends ClassDeclaration|ClassExpression> (members: NodeArray<ClassElement>|undefined, classDeclaration: T): T;

	updateCallExpressionExpression (expression: LeftHandSideExpression, callExpression: CallExpression): CallExpression;
	updateCallExpressionTypeArguments (typeArguments: NodeArray<TypeNode>|undefined, callExpression: CallExpression): CallExpression;
	updateCallExpressionArguments (args: NodeArray<Expression>, callExpression: CallExpression): CallExpression;

	updateMethodDeclarationBody (body: Block|undefined, method: MethodDeclaration): MethodDeclaration;
	updateMethodDeclarationName (name: PropertyName, method: MethodDeclaration): MethodDeclaration;
	updateMethodDeclarationAsteriskToken (asteriskToken: AsteriskToken|undefined, method: MethodDeclaration): MethodDeclaration;
	updateMethodDeclarationQuestionToken (questionToken: QuestionToken|undefined, method: MethodDeclaration): MethodDeclaration;
	updateMethodDeclarationTypeParameters (typeParameters: NodeArray<TypeParameterDeclaration>|undefined, method: MethodDeclaration): MethodDeclaration;
	updateMethodDeclarationParameters (parameters: NodeArray<ParameterDeclaration>, method: MethodDeclaration): MethodDeclaration;
	updateMethodDeclarationType (type: TypeNode|undefined, method: MethodDeclaration): MethodDeclaration;
	updateMethodDeclarationModifiers (modifiers: ModifiersArray|undefined, method: MethodDeclaration): MethodDeclaration;

	updatePropertyDeclarationQuestionToken (questionToken: QuestionToken|undefined, property: PropertyDeclaration): PropertyDeclaration;
	updatePropertyDeclarationName (name: PropertyName, property: PropertyDeclaration): PropertyDeclaration;
	updatePropertyDeclarationType (type: TypeNode|undefined, property: PropertyDeclaration): PropertyDeclaration;
	updatePropertyDeclarationInitializer (initializer: Expression|undefined, property: PropertyDeclaration): PropertyDeclaration;
	updatePropertyDeclarationModifiers (modifiers: ModifiersArray|undefined, property: PropertyDeclaration): PropertyDeclaration;

	updateConstructorDeclarationBody (body: Block|undefined, constructor: ConstructorDeclaration): ConstructorDeclaration;
	updateConstructorDeclarationAsteriskToken (asteriskToken: AsteriskToken|undefined, constructor: ConstructorDeclaration): ConstructorDeclaration;
	updateConstructorDeclarationQuestionToken (questionToken: QuestionToken|undefined, constructor: ConstructorDeclaration): ConstructorDeclaration;
	updateConstructorDeclarationTypeParameters (typeParameters: NodeArray<TypeParameterDeclaration>|undefined, constructor: ConstructorDeclaration): ConstructorDeclaration;
	updateConstructorDeclarationParameters (parameters: NodeArray<ParameterDeclaration>, constructor: ConstructorDeclaration): ConstructorDeclaration;
	updateConstructorDeclarationType (type: TypeNode|undefined, constructor: ConstructorDeclaration): ConstructorDeclaration;
	updateConstructorDeclarationModifiers (modifiers: ModifiersArray|undefined, constructor: ConstructorDeclaration): ConstructorDeclaration;

	updateImportDeclarationImportClause (importClause: ImportClause|undefined, importDeclaration: ImportDeclaration): ImportDeclaration;
	updateImportDeclarationModuleSpecifier (moduleSpecifier: Expression|undefined, importDeclaration: ImportDeclaration): ImportDeclaration;
	updateImportDeclarationModifiers (modifiers: ModifiersArray|undefined, importDeclaration: ImportDeclaration): ImportDeclaration;

	updateExportDeclarationExportClause (exportClause: NamedExports|undefined, exportDeclaration: ExportDeclaration): ExportDeclaration;
	updateExportDeclarationModuleSpecifier (moduleSpecifier: Expression, exportDeclaration: ExportDeclaration): ExportDeclaration;
	updateExportDeclarationModifiers (modifiers: ModifiersArray|undefined, exportDeclaration: ExportDeclaration): ExportDeclaration;

	updateNamedImportsElements (elements: NodeArray<ImportSpecifier>, namedImports: NamedImports): NamedImports;

	updateNamedExportsElements (elements: NodeArray<ExportSpecifier>, namedExports: NamedExports): NamedExports;

	updateNamespaceImportName (name: Identifier, namespaceImport: NamespaceImport): NamespaceImport;

	updateSourceFileStatements (statements: NodeArray<Statement>, sourceFile: SourceFile): SourceFile;
	replace <T extends Node> (newNode: T, existing: T): T;

}