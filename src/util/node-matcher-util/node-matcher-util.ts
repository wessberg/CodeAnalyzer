import {INodeMatcherUtil} from "./i-node-matcher-util";
import {AccessorDeclaration, ArrayBindingElement, ArrayBindingPattern, ArrayLiteralExpression, ArrayTypeNode, ArrowFunction, AsExpression, AwaitExpression, BinaryExpression, BindingElement, BindingName, BindingPattern, Block, BooleanLiteral, BreakStatement, CallExpression, CallSignatureDeclaration, CaseBlock, CaseClause, CaseOrDefaultClause, CatchClause, ClassDeclaration, ClassExpression, ComputedPropertyName, ConditionalExpression, ConstructorDeclaration, ConstructorTypeNode, ConstructSignatureDeclaration, ContinueStatement, DebuggerStatement, DeclarationName, Decorator, DefaultClause, DeleteExpression, DoStatement, ElementAccessExpression, EmptyStatement, EntityName, EnumDeclaration, EnumMember, ExpressionStatement, ExpressionWithTypeArguments, ExternalModuleReference, ForInitializer, ForInStatement, ForOfStatement, ForStatement, FunctionDeclaration, FunctionExpression, FunctionOrConstructorTypeNode, FunctionTypeNode, GetAccessorDeclaration, HeritageClause, Identifier, IfStatement, ImportClause, ImportDeclaration, ImportEqualsDeclaration, ImportExpression, IndexedAccessTypeNode, IndexSignatureDeclaration, InterfaceDeclaration, IntersectionTypeNode, isAccessor, isArrayBindingPattern, isArrayLiteralExpression, isArrayTypeNode, isArrowFunction, isAsExpression, isAwaitExpression, isBinaryExpression, isBindingElement, isBindingName, isBlock, isBreakStatement, isCallExpression, isCallSignatureDeclaration, isCaseBlock, isCaseClause, isCaseOrDefaultClause, isCatchClause, isClassDeclaration, isClassExpression, isComputedPropertyName, isConditionalExpression, isConstructorDeclaration, isConstructorTypeNode, isConstructSignatureDeclaration, isContinueStatement, isDebuggerStatement, isDecorator, isDefaultClause, isDeleteExpression, isDoStatement, isElementAccessExpression, isEmptyStatement, isEntityName, isEnumDeclaration, isEnumMember, isExpressionStatement, isExpressionWithTypeArguments, isExternalModuleReference, isForInStatement, isForOfStatement, isForStatement, isFunctionDeclaration, isFunctionExpression, isFunctionOrConstructorTypeNode, isFunctionTypeNode, isGetAccessorDeclaration, isHeritageClause, isIdentifier, isIfStatement, isImportClause, isImportDeclaration, isImportEqualsDeclaration, isIndexedAccessTypeNode, isIndexSignatureDeclaration, isInterfaceDeclaration, isIntersectionTypeNode, isJsxAttribute, isJsxAttributes, isJsxClosingElement, isJsxElement, isJsxExpression, isJsxOpeningElement, isJsxSelfClosingElement, isJsxSpreadAttribute, isJsxText, isLabeledStatement, isLiteralTypeNode, isMappedTypeNode, isMetaProperty, isMethodDeclaration, isMethodSignature, isMissingDeclaration, isModuleBlock, isModuleDeclaration, isNewExpression, isNonNullExpression, isNoSubstitutionTemplateLiteral, isNumericLiteral, isObjectBindingPattern, isObjectLiteralElementLike, isObjectLiteralExpression, isOmittedExpression, isParameter, isParenthesizedExpression, isParenthesizedTypeNode, isPropertyAccessExpression, isPropertyAssignment, isPropertyDeclaration, isPropertyName, isPropertySignature, isQualifiedName, isRegularExpressionLiteral, isReturnStatement, isSemicolonClassElement, isSetAccessorDeclaration, isShorthandPropertyAssignment, isSpreadAssignment, isSpreadElement, isStringLiteral, isSwitchStatement, isTaggedTemplateExpression, isTemplateExpression, isTemplateHead, isTemplateMiddle, isTemplateSpan, isTemplateTail, isThisTypeNode, isThrowStatement, isToken, isTryStatement, isTupleTypeNode, isTypeAliasDeclaration, isTypeAssertion, isTypeElement, isTypeLiteralNode, isTypeOfExpression, isTypeOperatorNode, isTypeParameterDeclaration, isTypePredicateNode, isTypeQueryNode, isTypeReferenceNode, isUnionTypeNode, isVariableDeclaration, isVariableDeclarationList, isVariableStatement, isVoidExpression, isWhileStatement, isWithStatement, isYieldExpression, JSDocNamespaceBody, JSDocNamespaceDeclaration, JsxAttribute, JsxAttributeLike, JsxAttributes, JsxClosingElement, JsxElement, JsxExpression, JsxOpeningElement, JsxSelfClosingElement, JsxSpreadAttribute, JsxTagNameExpression, JsxText, KeywordTypeNode, LabeledStatement, LiteralTypeNode, MappedTypeNode, MetaProperty, MethodDeclaration, MethodSignature, MissingDeclaration, ModuleBlock, ModuleBody, ModuleDeclaration, ModuleName, ModuleReference, NamespaceBody, NamespaceDeclaration, NewExpression, Node, NodeArray, NonNullExpression, NoSubstitutionTemplateLiteral, NullLiteral, NumericLiteral, ObjectBindingPattern, ObjectLiteralElementLike, ObjectLiteralExpression, OmittedExpression, ParameterDeclaration, ParenthesizedExpression, ParenthesizedTypeNode, PartiallyEmittedExpression, PostfixUnaryExpression, PrefixUnaryExpression, PropertyAccessExpression, PropertyAssignment, PropertyDeclaration, PropertyName, PropertySignature, QualifiedName, RegularExpressionLiteral, ReturnStatement, SemicolonClassElement, SetAccessorDeclaration, ShorthandPropertyAssignment, SpreadAssignment, SpreadElement, Statement, StringLiteral, SuperExpression, SwitchStatement, SyntaxKind, TaggedTemplateExpression, TemplateExpression, TemplateHead, TemplateMiddle, TemplateSpan, TemplateTail, ThisExpression, ThisTypeNode, ThrowStatement, Token, TryStatement, TupleTypeNode, TypeAliasDeclaration, TypeAssertion, TypeElement, TypeLiteralNode, TypeOfExpression, TypeOperatorNode, TypeParameterDeclaration, TypePredicateNode, TypeQueryNode, TypeReferenceNode, UnionTypeNode, VariableDeclaration, VariableDeclarationList, VariableStatement, VoidExpression, WhileStatement, WithStatement, YieldExpression, NamespaceImport, isNamespaceImport, NamedImports, isNamedImports, ImportSpecifier, isImportSpecifier, NamedImportBindings, NamespaceExportDeclaration, isNamespaceExportDeclaration, ExportDeclaration, isExportDeclaration, NamedExports, isNamedExports, ExportSpecifier, isExportSpecifier, ExportAssignment, isExportAssignment} from "typescript";
import {isBooleanLiteral} from "@wessberg/typescript-ast-util";

/**
 * A class that helps with matching nodes
 */
export class NodeMatcherUtil implements INodeMatcherUtil {

	/**
	 * Matches the provided node with any of the nodes within the provided Array
	 * @param {Node} node
	 * @param {Node[]} matchWithin
	 * @returns {Node?}
	 */
	public match (node: Node, matchWithin: Node[]): Node|undefined {
		// If the array already includes the node, return it
		if (matchWithin.includes(node)) return node;

		// Find the closest match
		return matchWithin.find(matchNode => this.matchNodeWithNode(node, matchNode));
	}

	/**
	 * Matches the provided node with any of the nodes within the provided Array and return its' index
	 * @param {Node} node
	 * @param {Node[]} matchWithin
	 * @returns {number}
	 */
	public matchIndex (node: Node, matchWithin: Node[]): number {
		// If the array already includes the node, return its index
		const existingIndex = matchWithin.indexOf(node);
		if (existingIndex >= 0) return existingIndex;

		// Find the closest match
		return matchWithin.findIndex(matchNode => this.matchNodeWithNode(node, matchNode));
	}

	/**
	 * Matches the provided node with the provided Node
	 * @param {T} node
	 * @param {Node} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithNode<T extends Node> (node: T, matchNode: Node): boolean {
		if (isIdentifier(matchNode)) {
			return this.matchNodeWithIdentifier(node, matchNode);
		}
		else if (isQualifiedName(matchNode)) {
			return this.matchNodeWithQualifiedName(node, matchNode);
		}

		else if (isEntityName(matchNode)) {
			return this.matchNodeWithEntityName(node, matchNode);
		}

		else if (isPropertyName(matchNode)) {
			return this.matchNodeWithPropertyName(node, matchNode);
		}

		else if (isStringLiteral(matchNode)) {
			return this.matchNodeWithStringLiteral(node, matchNode);
		}

		else if (isNumericLiteral(matchNode)) {
			return this.matchNodeWithNumericLiteral(node, matchNode);
		}

		else if (isComputedPropertyName(matchNode)) {
			return this.matchNodeWithComputedPropertyName(node, matchNode);
		}

		else if (this.isDeclarationName(matchNode)) {
			return this.matchNodeWithDeclarationName(node, matchNode);
		}

		else if (this.isBindingPattern(matchNode)) {
			return this.matchNodeWithBindingPattern(node, matchNode);
		}

		else if (isArrayBindingPattern(matchNode)) {
			return this.matchNodeWithArrayBindingPattern(node, matchNode);
		}

		else if (isObjectBindingPattern(matchNode)) {
			return this.matchNodeWithObjectBindingPattern(node, matchNode);
		}

		else if (this.isArrayBindingElement(matchNode)) {
			return this.matchNodeWithArrayBindingElement(node, matchNode);
		}

		else if (isBindingElement(matchNode)) {
			return this.matchNodeWithBindingElement(node, matchNode);
		}

		else if (isOmittedExpression(matchNode)) {
			return this.matchNodeWithOmittedExpression(node, matchNode);
		}

		else if (isBindingName(matchNode)) {
			return this.matchNodeWithBindingName(node, matchNode);
		}

		else if (isDecorator(matchNode)) {
			return this.matchNodeWithDecorator(node, matchNode);
		}

		else if (this.isKeywordTypeNode(matchNode)) {
			return this.matchNodeWithKeywordTypeNode(node, matchNode);
		}

		else if (isThisTypeNode(matchNode)) {
			return this.matchNodeWithThisTypeNode(node, matchNode);
		}

		else if (isFunctionOrConstructorTypeNode(matchNode)) {
			return this.matchNodeWithFunctionOrConstructorTypeNode(node, matchNode);
		}

		else if (isFunctionTypeNode(matchNode)) {
			return this.matchNodeWithFunctionTypeNode(node, matchNode);
		}

		else if (isConstructorTypeNode(matchNode)) {
			return this.matchNodeWithConstructorTypeNode(node, matchNode);
		}

		else if (isParameter(matchNode)) {
			return this.matchNodeWithParameterDeclaration(node, matchNode);
		}

		else if (isTypeParameterDeclaration(matchNode)) {
			return this.matchNodeWithTypeParameterDeclaration(node, matchNode);
		}

		else if (isToken(matchNode)) {
			return this.matchNodeWithToken(node, matchNode);
		}

		else if (isCallSignatureDeclaration(matchNode)) {
			return this.matchNodeWithCallSignatureDeclaration(node, matchNode);
		}

		else if (isConstructSignatureDeclaration(matchNode)) {
			return this.matchNodeWithConstructSignatureDeclaration(node, matchNode);
		}

		else if (isVariableDeclaration(matchNode)) {
			return this.matchNodeWithVariableDeclaration(node, matchNode);
		}

		else if (isVariableDeclarationList(matchNode)) {
			return this.matchNodeWithVariableDeclarationList(node, matchNode);
		}

		else if (isPropertySignature(matchNode)) {
			return this.matchNodeWithPropertySignature(node, matchNode);
		}

		else if (isPropertyDeclaration(matchNode)) {
			return this.matchNodeWithPropertyDeclaration(node, matchNode);
		}

		else if (isPropertyAssignment(matchNode)) {
			return this.matchNodeWithPropertyAssignment(node, matchNode);
		}

		else if (isShorthandPropertyAssignment(matchNode)) {
			return this.matchNodeWithShorthandPropertyAssignment(node, matchNode);
		}

		else if (isSpreadAssignment(matchNode)) {
			return this.matchNodeWithSpreadAssignment(node, matchNode);
		}

		else if (isFunctionDeclaration(matchNode)) {
			return this.matchNodeWithFunctionDeclaration(node, matchNode);
		}

		else if (isBlock(matchNode)) {
			return this.matchNodeWithBlock(node, matchNode);
		}

		else if (isMethodSignature(matchNode)) {
			return this.matchNodeWithMethodSignature(node, matchNode);
		}

		else if (isMethodDeclaration(matchNode)) {
			return this.matchNodeWithMethodDeclaration(node, matchNode);
		}

		else if (isConstructorDeclaration(matchNode)) {
			return this.matchNodeWithConstructorDeclaration(node, matchNode);
		}

		else if (isSemicolonClassElement(matchNode)) {
			return this.matchNodeWithSemiColonClassElement(node, matchNode);
		}

		else if (isGetAccessorDeclaration(matchNode)) {
			return this.matchNodeWithGetAccessorDeclaration(node, matchNode);
		}

		else if (isSetAccessorDeclaration(matchNode)) {
			return this.matchNodeWithSetAccessorDeclaration(node, matchNode);
		}

		else if (isAccessor(matchNode)) {
			return this.matchNodeWithAccessorDeclaration(node, matchNode);
		}

		else if (isIndexSignatureDeclaration(matchNode)) {
			return this.matchNodeWithIndexSignatureDeclaration(node, matchNode);
		}

		else if (isTypeReferenceNode(matchNode)) {
			return this.matchNodeWithTypeReferenceNode(node, matchNode);
		}

		else if (isTypePredicateNode(matchNode)) {
			return this.matchNodeWithTypePredicateNode(node, matchNode);
		}

		else if (isTypeQueryNode(matchNode)) {
			return this.matchNodeWithTypeQueryNode(node, matchNode);
		}

		else if (isTypeElement(matchNode)) {
			return this.matchNodeWithTypeElement(node, matchNode);
		}

		else if (isTypeLiteralNode(matchNode)) {
			return this.matchNodeWithTypeLiteralNode(node, matchNode);
		}

		else if (isArrayTypeNode(matchNode)) {
			return this.matchNodeWithArrayTypeNode(node, matchNode);
		}

		else if (isTupleTypeNode(matchNode)) {
			return this.matchNodeWithTupleTypeNode(node, matchNode);
		}

		else if (isUnionTypeNode(matchNode)) {
			return this.matchNodeWithUnionTypeNode(node, matchNode);
		}

		else if (isIntersectionTypeNode(matchNode)) {
			return this.matchNodeWithIntersectionTypeNode(node, matchNode);
		}

		else if (isParenthesizedTypeNode(matchNode)) {
			return this.matchNodeWithParenthesizedTypeNode(node, matchNode);
		}

		else if (isTypeOperatorNode(matchNode)) {
			return this.matchNodeWithTypeOperatorNode(node, matchNode);
		}

		else if (isIndexedAccessTypeNode(matchNode)) {
			return this.matchNodeWithIndexedAccessTypeNode(node, matchNode);
		}

		else if (isMappedTypeNode(matchNode)) {
			return this.matchNodeWithMappedTypeNode(node, matchNode);
		}

		else if (isLiteralTypeNode(matchNode)) {
			return this.matchNodeWithLiteralTypeNode(node, matchNode);
		}

		else if (this.isPartiallyEmittedExpression(matchNode)) {
			return this.matchNodeWithPartiallyEmittedExpression(node, matchNode);
		}

		else if (this.isPrefixUnaryExpression(matchNode)) {
			return this.matchNodeWithPrefixUnaryExpression(node, matchNode);
		}

		else if (this.isPostfixUnaryExpression(matchNode)) {
			return this.matchNodeWithPostfixUnaryExpression(node, matchNode);
		}

		else if (this.isNullLiteral(matchNode)) {
			return this.matchNodeWithNullLiteral(node, matchNode);
		}

		else if (isBooleanLiteral(matchNode)) {
			return this.matchNodeWithBooleanLiteral(node, matchNode);
		}

		else if (this.isThisExpression(matchNode)) {
			return this.matchNodeWithThisExpression(node, matchNode);
		}

		else if (this.isSuperExpression(matchNode)) {
			return this.matchNodeWithSuperExpression(node, matchNode);
		}

		else if (this.isImportExpression(matchNode)) {
			return this.matchNodeWithImportExpression(node, matchNode);
		}

		else if (isDeleteExpression(matchNode)) {
			return this.matchNodeWithDeleteExpression(node, matchNode);
		}

		else if (isTypeOfExpression(matchNode)) {
			return this.matchNodeWithTypeOfExpression(node, matchNode);
		}

		else if (isVoidExpression(matchNode)) {
			return this.matchNodeWithVoidExpression(node, matchNode);
		}

		else if (isAwaitExpression(matchNode)) {
			return this.matchNodeWithAwaitExpression(node, matchNode);
		}

		else if (isYieldExpression(matchNode)) {
			return this.matchNodeWithYieldExpression(node, matchNode);
		}

		else if (isBinaryExpression(matchNode)) {
			return this.matchNodeWithBinaryExpression(node, matchNode);
		}

		else if (isConditionalExpression(matchNode)) {
			return this.matchNodeWithConditionalExpression(node, matchNode);
		}

		else if (isFunctionExpression(matchNode)) {
			return this.matchNodeWithFunctionExpression(node, matchNode);
		}

		else if (isArrowFunction(matchNode)) {
			return this.matchNodeWithArrowFunction(node, matchNode);
		}

		else if (isRegularExpressionLiteral(matchNode)) {
			return this.matchNodeWithRegularExpressionLiteral(node, matchNode);
		}

		else if (isNoSubstitutionTemplateLiteral(matchNode)) {
			return this.matchNodeWithNoSubstitutionTemplateLiteral(node, <NoSubstitutionTemplateLiteral> matchNode);
		}

		else if (isTemplateHead(matchNode)) {
			return this.matchNodeWithTemplateHead(node, matchNode);
		}

		else if (isTemplateMiddle(matchNode)) {
			return this.matchNodeWithTemplateMiddle(node, matchNode);
		}

		else if (isTemplateTail(matchNode)) {
			return this.matchNodeWithTemplateTail(node, matchNode);
		}

		else if (isTemplateExpression(matchNode)) {
			return this.matchNodeWithTemplateExpression(node, matchNode);
		}

		else if (isTemplateSpan(matchNode)) {
			return this.matchNodeWithTemplateSpan(node, matchNode);
		}

		else if (isParenthesizedExpression(matchNode)) {
			return this.matchNodeWithParenthesizedExpression(node, matchNode);
		}

		else if (isArrayLiteralExpression(matchNode)) {
			return this.matchNodeWithArrayLiteralExpression(node, matchNode);
		}

		else if (isSpreadElement(matchNode)) {
			return this.matchNodeWithSpreadElement(node, matchNode);
		}

		else if (isObjectLiteralExpression(matchNode)) {
			return this.matchNodeWithObjectLiteralExpression(node, matchNode);
		}

		else if (isObjectLiteralElementLike(matchNode)) {
			return this.matchNodeWithObjectLiteralElementLike(node, matchNode);
		}

		else if (isPropertyAccessExpression(matchNode)) {
			return this.matchNodeWithPropertyAccessExpression(node, matchNode);
		}

		else if (isElementAccessExpression(matchNode)) {
			return this.matchNodeWithElementAccessExpression(node, matchNode);
		}

		else if (isCallExpression(matchNode)) {
			return this.matchNodeWithCallExpression(node, matchNode);
		}

		else if (isExpressionWithTypeArguments(matchNode)) {
			return this.matchNodeWithExpressionWithTypeArguments(node, matchNode);
		}

		else if (isNewExpression(matchNode)) {
			return this.matchNodeWithNewExpression(node, matchNode);
		}

		else if (isTaggedTemplateExpression(matchNode)) {
			return this.matchNodeWithTaggedTemplateExpression(node, matchNode);
		}

		else if (isAsExpression(matchNode)) {
			return this.matchNodeWithAsExpression(node, matchNode);
		}

		else if (isTypeAssertion(matchNode)) {
			return this.matchNodeWithTypeAssertion(node, matchNode);
		}

		else if (isNonNullExpression(matchNode)) {
			return this.matchNodeWithNonNullExpression(node, matchNode);
		}

		else if (isMetaProperty(matchNode)) {
			return this.matchNodeWithMetaProperty(node, matchNode);
		}

		else if (isJsxElement(matchNode)) {
			return this.matchNodeWithJsxElement(node, matchNode);
		}

		else if (isJsxOpeningElement(matchNode)) {
			return this.matchNodeWithJsxOpeningElement(node, matchNode);
		}

		else if (isJsxClosingElement(matchNode)) {
			return this.matchNodeWithJsxClosingElement(node, matchNode);
		}

		else if (isJsxAttributes(matchNode)) {
			return this.matchNodeWithJsxAttributes(node, matchNode);
		}

		else if (isJsxAttribute(matchNode)) {
			return this.matchNodeWithJsxAttribute(node, matchNode);
		}

		else if (isJsxSpreadAttribute(matchNode)) {
			return this.matchNodeWithJsxSpreadAttribute(node, matchNode);
		}

		else if (isJsxExpression(matchNode)) {
			return this.matchNodeWithJsxExpression(node, matchNode);
		}

		else if (isJsxSelfClosingElement(matchNode)) {
			return this.matchNodeWithJsxSelfClosingElement(node, matchNode);
		}

		else if (isJsxText(matchNode)) {
			return this.matchNodeWithJsxText(node, matchNode);
		}

		else if (isEmptyStatement(matchNode)) {
			return this.matchNodeWithEmptyStatement(node, matchNode);
		}

		else if (isDebuggerStatement(matchNode)) {
			return this.matchNodeWithDebuggerStatement(node, matchNode);
		}

		else if (isMissingDeclaration(matchNode)) {
			return this.matchNodeWithMissingDeclaration(node, matchNode);
		}

		else if (isVariableStatement(matchNode)) {
			return this.matchNodeWithVariableStatement(node, matchNode);
		}

		else if (isExpressionStatement(matchNode)) {
			return this.matchNodeWithExpressionStatement(node, matchNode);
		}

		else if (isIfStatement(matchNode)) {
			return this.matchNodeWithIfStatement(node, matchNode);
		}

		else if (isDoStatement(matchNode)) {
			return this.matchNodeWithDoStatement(node, matchNode);
		}

		else if (isWhileStatement(matchNode)) {
			return this.matchNodeWithWhileStatement(node, matchNode);
		}

		else if (isForStatement(matchNode)) {
			return this.matchNodeWithForStatement(node, matchNode);
		}

		else if (isForInStatement(matchNode)) {
			return this.matchNodeWithForInStatement(node, matchNode);
		}

		else if (isForOfStatement(matchNode)) {
			return this.matchNodeWithForOfStatement(node, matchNode);
		}

		else if (isBreakStatement(matchNode)) {
			return this.matchNodeWithBreakStatement(node, matchNode);
		}

		else if (isContinueStatement(matchNode)) {
			return this.matchNodeWithContinueStatement(node, matchNode);
		}

		else if (isReturnStatement(matchNode)) {
			return this.matchNodeWithReturnStatement(node, matchNode);
		}

		else if (isWithStatement(matchNode)) {
			return this.matchNodeWithWithStatement(node, matchNode);
		}

		else if (isSwitchStatement(matchNode)) {
			return this.matchNodeWithSwitchStatement(node, matchNode);
		}

		else if (isCaseBlock(matchNode)) {
			return this.matchNodeWithCaseBlock(node, matchNode);
		}

		else if (isCaseClause(matchNode)) {
			return this.matchNodeWithCaseClause(node, matchNode);
		}

		else if (isDefaultClause(matchNode)) {
			return this.matchNodeWithDefaultClause(node, matchNode);
		}

		else if (isLabeledStatement(matchNode)) {
			return this.matchNodeWithLabeledStatement(node, matchNode);
		}

		else if (isThrowStatement(matchNode)) {
			return this.matchNodeWithThrowStatement(node, matchNode);
		}

		else if (isTryStatement(matchNode)) {
			return this.matchNodeWithTryStatement(node, matchNode);
		}

		else if (isCatchClause(matchNode)) {
			return this.matchNodeWithCatchClause(node, matchNode);
		}

		else if (isClassDeclaration(matchNode)) {
			return this.matchNodeWithClassDeclaration(node, matchNode);
		}

		else if (isHeritageClause(matchNode)) {
			return this.matchNodeWithHeritageClause(node, matchNode);
		}

		else if (isClassExpression(matchNode)) {
			return this.matchNodeWithClassExpression(node, matchNode);
		}

		else if (isInterfaceDeclaration(matchNode)) {
			return this.matchNodeWithInterfaceDeclaration(node, matchNode);
		}

		else if (isTypeAliasDeclaration(matchNode)) {
			return this.matchNodeWithTypeAliasDeclaration(node, matchNode);
		}

		else if (isEnumMember(matchNode)) {
			return this.matchNodeWithEnumMember(node, matchNode);
		}

		else if (isEnumDeclaration(matchNode)) {
			return this.matchNodeWithEnumDeclaration(node, matchNode);
		}

		else if (isModuleBlock(matchNode)) {
			return this.matchNodeWithModuleBlock(node, matchNode);
		}

		else if (isModuleDeclaration(matchNode)) {
			return this.matchNodeWithModuleDeclaration(node, matchNode);
		}

		else if (this.isNamespaceDeclaration(matchNode)) {
			return this.matchNodeWithNamespaceDeclaration(node, matchNode);
		}

		else if (this.isJSDocNamespaceDeclaration(matchNode)) {
			return this.matchNodeWithJSDocNamespaceDeclaration(node, matchNode);
		}

		else if (isExternalModuleReference(matchNode)) {
			return this.matchNodeWithExternalModuleReference(node, matchNode);
		}

		else if (isImportEqualsDeclaration(matchNode)) {
			return this.matchNodeWithImportEqualsDeclaration(node, matchNode);
		}

		else if (isImportDeclaration(matchNode)) {
			return this.matchNodeWithImportDeclaration(node, matchNode);
		}

		else if (isImportClause(matchNode)) {
			return this.matchNodeWithImportClause(node, matchNode);
		}

		else if (isNamespaceImport(matchNode)) {
			return this.matchNodeWithNamespaceImport(node, matchNode);
		}

		else if (isNamedImports(matchNode)) {
			return this.matchNodeWithNamedImports(node, matchNode);
		}

		else if (isImportSpecifier(matchNode)) {
			return this.matchNodeWithImportSpecifier(node, matchNode);
		}

		else if (isNamespaceExportDeclaration(matchNode)) {
			return this.matchNodeWithNamespaceExportDeclaration(node, matchNode);
		}

		else if (isExportDeclaration(matchNode)) {
			return this.matchNodeWithExportDeclaration(node, matchNode);
		}

		else if (isNamedExports(matchNode)) {
			return this.matchNodeWithNamedExports(node, matchNode);
		}

		else if (isExportSpecifier(matchNode)) {
			return this.matchNodeWithExportSpecifier(node, matchNode);
		}

		else if (isExportAssignment(matchNode)) {
			return this.matchNodeWithExportAssignment(node, matchNode);
		}

		return false;
	}

	/**
	 * Matches the provided node with the provided Decorator
	 * @param {Node} node
	 * @param {Decorator} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithDecorator (node: Node, matchNode: Decorator): boolean {
		// If the node is not a Decorator, return false
		if (!isDecorator(node)) return false;

		return this.matchNodeWithNode(node.expression, matchNode.expression);
	}

	/**
	 * Returns true if a node a KeywordTypeNode
	 * @param {Node} node
	 * @returns {boolean}
	 */
	private isKeywordTypeNode (node: Node): node is KeywordTypeNode {
		const {kind} = node;
		switch (kind) {
			case SyntaxKind.AnyKeyword:
			case SyntaxKind.NumberKeyword:
			case SyntaxKind.ObjectKeyword:
			case SyntaxKind.BooleanKeyword:
			case SyntaxKind.StringKeyword:
			case SyntaxKind.SymbolKeyword:
			case SyntaxKind.ThisKeyword:
			case SyntaxKind.VoidKeyword:
			case SyntaxKind.UndefinedKeyword:
			case SyntaxKind.NullKeyword:
			case SyntaxKind.NeverKeyword:
				return true;
			default:
				return false;
		}
	}

	/**
	 * Matches the provided node with the provided KeywordTypeNode
	 * @param {Node} node
	 * @param {KeywordTypeNode} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithKeywordTypeNode (node: Node, matchNode: KeywordTypeNode): boolean {
		// If the node is not a KeywordTypeNode, return false
		if (!(this.isKeywordTypeNode(node))) return false;
		return node.kind === matchNode.kind;
	}

	/**
	 * Matches the provided node with the provided ThisTypeNode
	 * @param {Node} node
	 * @param {ThisTypeNode} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithThisTypeNode (node: Node, matchNode: ThisTypeNode): boolean {
		// If the node is not a ThisTypeNode, return false
		if (!(isThisTypeNode(node))) return false;
		return node.kind === matchNode.kind;
	}

	/**
	 * Matches the provided node with the provided CallSignatureDeclaration
	 * @param {Node} node
	 * @param {CallSignatureDeclaration} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithCallSignatureDeclaration (node: Node, matchNode: CallSignatureDeclaration): boolean {
		// If the node is not a CallSignatureDeclaration, return false
		if (!(isCallSignatureDeclaration(node))) return false;

		const nameMatch = this.propIsNotGiven(node, matchNode, "name") || (this.propIsGiven(node, matchNode, "name") && this.matchNodeWithPropertyName(node.name!, matchNode.name!));
		const typeParametersMatch = this.propIsNotGiven(node, matchNode, "typeParameters") || (this.propIsGiven(node, matchNode, "typeParameters") && this.matchNodeWithTypeParameterDeclarations(node.typeParameters!, matchNode.typeParameters!));
		const parametersMatch = this.matchNodeWithParameterDeclarations(node.parameters, matchNode.parameters);
		const typeMatch = this.propIsNotGiven(node, matchNode, "type") || (this.propIsGiven(node, matchNode, "type") && this.matchNodeWithNode(node.type!, matchNode.type!));
		const questionTokenMatch = this.propIsNotGiven(node, matchNode, "questionToken") || (this.propIsGiven(node, matchNode, "questionToken") && this.matchNodeWithToken(node.questionToken!, matchNode.questionToken!));

		return nameMatch && typeParametersMatch && parametersMatch && typeMatch && questionTokenMatch;
	}

	/**
	 * Matches the provided node with the provided ConstructSignatureDeclaration
	 * @param {Node} node
	 * @param {ConstructSignatureDeclaration} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithConstructSignatureDeclaration (node: Node, matchNode: ConstructSignatureDeclaration): boolean {
		// If the node is not a ConstructSignatureDeclaration, return false
		if (!(isConstructSignatureDeclaration(node))) return false;

		const nameMatch = this.propIsNotGiven(node, matchNode, "name") || (this.propIsGiven(node, matchNode, "name") && this.matchNodeWithPropertyName(node.name!, matchNode.name!));
		const typeParametersMatch = this.propIsNotGiven(node, matchNode, "typeParameters") || (this.propIsGiven(node, matchNode, "typeParameters") && this.matchNodeWithTypeParameterDeclarations(node.typeParameters!, matchNode.typeParameters!));
		const parametersMatch = this.matchNodeWithParameterDeclarations(node.parameters, matchNode.parameters);
		const typeMatch = this.propIsNotGiven(node, matchNode, "type") || (this.propIsGiven(node, matchNode, "type") && this.matchNodeWithNode(node.type!, matchNode.type!));
		const questionTokenMatch = this.propIsNotGiven(node, matchNode, "questionToken") || (this.propIsGiven(node, matchNode, "questionToken") && this.matchNodeWithToken(node.questionToken!, matchNode.questionToken!));

		return nameMatch && typeParametersMatch && parametersMatch && typeMatch && questionTokenMatch;
	}

	/**
	 * Matches the provided node with the provided ClassDeclaration
	 * @param {Node} node
	 * @param {ClassDeclaration} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithClassDeclaration (node: Node, matchNode: ClassDeclaration): boolean {
		// If the node is not a ClassDeclaration, return false
		if (!(isClassDeclaration(node))) return false;

		const nameMatch = this.propIsNotGiven(node, matchNode, "name") || (this.propIsGiven(node, matchNode, "name") && this.matchNodeWithIdentifier(node.name!, matchNode.name!));
		const typeParametersMatch = this.propIsNotGiven(node, matchNode, "typeParameters") || (this.propIsGiven(node, matchNode, "typeParameters") && this.matchNodeWithTypeParameterDeclarations(node.typeParameters!, matchNode.typeParameters!));
		const heritageClausesMatch = this.propIsNotGiven(node, matchNode, "heritageClauses") || (this.propIsGiven(node, matchNode, "heritageClauses") && this.matchNodeWithHeritageClauses(node.heritageClauses!, matchNode.heritageClauses!));
		const membersMatch = this.matchNodeWithNodes(node.members, matchNode.members);

		return nameMatch && typeParametersMatch && heritageClausesMatch && membersMatch;
	}

	/**
	 * Matches the provided node with the provided ClassExpression
	 * @param {Node} node
	 * @param {ClassExpression} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithClassExpression (node: Node, matchNode: ClassExpression): boolean {
		// If the node is not a ClassExpression, return false
		if (!(isClassExpression(node))) return false;

		const typeParametersMatch = this.propIsNotGiven(node, matchNode, "typeParameters") || (this.propIsGiven(node, matchNode, "typeParameters") && this.matchNodeWithTypeParameterDeclarations(node.typeParameters!, matchNode.typeParameters!));
		const heritageClausesMatch = this.propIsNotGiven(node, matchNode, "heritageClauses") || (this.propIsGiven(node, matchNode, "heritageClauses") && this.matchNodeWithHeritageClauses(node.heritageClauses!, matchNode.heritageClauses!));
		const membersMatch = this.matchNodeWithNodes(node.members, matchNode.members);

		return typeParametersMatch && heritageClausesMatch && membersMatch;
	}

	/**
	 * Matches the provided node with the provided ExternalModuleReference
	 * @param {Node} node
	 * @param {ExternalModuleReference} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithExternalModuleReference (node: Node, matchNode: ExternalModuleReference): boolean {
		// If the node is not a ExternalModuleReference, return false
		if (!(isExternalModuleReference(node))) return false;

		return this.propIsNotGiven(node, matchNode, "expression") || (this.propIsGiven(node, matchNode, "expression") && this.matchNodeWithNode(node.expression!, matchNode.expression!));
	}

	/**
	 * Matches the provided node with the provided InterfaceDeclaration
	 * @param {Node} node
	 * @param {InterfaceDeclaration} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithInterfaceDeclaration (node: Node, matchNode: InterfaceDeclaration): boolean {
		// If the node is not a InterfaceDeclaration, return false
		if (!(isInterfaceDeclaration(node))) return false;

		const nameMatch = this.matchNodeWithIdentifier(node.name, matchNode.name);
		const typeParametersMatch = this.propIsNotGiven(node, matchNode, "typeParameters") || (this.propIsGiven(node, matchNode, "typeParameters") && this.matchNodeWithTypeParameterDeclarations(node.typeParameters!, matchNode.typeParameters!));
		const heritageClausesMatch = this.propIsNotGiven(node, matchNode, "heritageClauses") || (this.propIsGiven(node, matchNode, "heritageClauses") && this.matchNodeWithHeritageClauses(node.heritageClauses!, matchNode.heritageClauses!));
		const membersMatch = this.matchNodeWithNodes(node.members, matchNode.members);

		return nameMatch && typeParametersMatch && heritageClausesMatch && membersMatch;
	}

	/**
	 * Matches the provided node with the provided TypeAliasDeclaration
	 * @param {Node} node
	 * @param {TypeAliasDeclaration} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithTypeAliasDeclaration (node: Node, matchNode: TypeAliasDeclaration): boolean {
		// If the node is not a TypeAliasDeclaration, return false
		if (!(isTypeAliasDeclaration(node))) return false;

		const nameMatch = this.matchNodeWithIdentifier(node.name, matchNode.name);
		const typeParametersMatch = this.propIsNotGiven(node, matchNode, "typeParameters") || (this.propIsGiven(node, matchNode, "typeParameters") && this.matchNodeWithTypeParameterDeclarations(node.typeParameters!, matchNode.typeParameters!));
		const typeMatch = this.matchNodeWithNode(node.type, matchNode.type);

		return nameMatch && typeParametersMatch && typeMatch;
	}

	/**
	 * Matches the provided node with the provided EnumMember
	 * @param {Node} node
	 * @param {EnumMember} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithEnumMember (node: Node, matchNode: EnumMember): boolean {
		// If the node is not a EnumMember, return false
		if (!(isEnumMember(node))) return false;

		const nameMatch = this.matchNodeWithPropertyName(node.name, matchNode.name);
		const initializerMatch = this.propIsNotGiven(node, matchNode, "initializer") || (this.propIsGiven(node, matchNode, "initializer") && this.matchNodeWithNode(node.initializer!, matchNode.initializer!));

		return nameMatch && initializerMatch;
	}

	/**
	 * Matches the provided node with the provided EnumDeclaration
	 * @param {Node} node
	 * @param {EnumDeclaration} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithEnumDeclaration (node: Node, matchNode: EnumDeclaration): boolean {
		// If the node is not a EnumDeclaration, return false
		if (!(isEnumDeclaration(node))) return false;

		const nameMatch = this.matchNodeWithIdentifier(node.name, matchNode.name);
		const membersMatch = this.matchNodeWithEnumMembers(node.members, matchNode.members);

		return nameMatch && membersMatch;
	}

	/**
	 * Matches the provided node with the provided ModuleDeclaration
	 * @param {Node} node
	 * @param {ModuleDeclaration} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithModuleDeclaration (node: Node, matchNode: ModuleDeclaration): boolean {
		// If the node is not a ModuleDeclaration, return false
		if (!(isModuleDeclaration(node))) return false;

		const nameMatch = this.matchNodeWithModuleName(node.name, matchNode.name);
		const bodyMatch = this.propIsNotGiven(node, matchNode, "body") || (this.propIsGiven(node, matchNode, "body") && this.matchNodeWithModuleBodyOrJSDocNamespaceDeclaration(node.body!, matchNode.body!));

		return nameMatch && bodyMatch;
	}

	/**
	 * Matches the provided node with the provided ModuleBlock
	 * @param {Node} node
	 * @param {ModuleBlock} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithModuleBlock (node: Node, matchNode: ModuleBlock): boolean {
		// If the node is not a ModuleBlock, return false
		if (!(isModuleBlock(node))) return false;

		return this.matchNodeWithNodes(node.statements, matchNode.statements);
	}

	/**
	 * Matches the provided node with the provided MappedTypeNode
	 * @param {Node} node
	 * @param {MappedTypeNode} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithMappedTypeNode (node: Node, matchNode: MappedTypeNode): boolean {
		// If the node is not a v, return false
		if (!(isMappedTypeNode(node))) return false;

		const typeParameterMatch = this.propIsNotGiven(node, matchNode, "typeParameter") || (this.propIsGiven(node, matchNode, "typeParameter") && this.matchNodeWithTypeParameterDeclaration(node.typeParameter!, matchNode.typeParameter!));
		const typeMatch = this.propIsNotGiven(node, matchNode, "type") || (this.propIsGiven(node, matchNode, "type") && this.matchNodeWithNode(node.type!, matchNode.type!));
		const questionTokenMatch = this.propIsNotGiven(node, matchNode, "questionToken") || (this.propIsGiven(node, matchNode, "questionToken") && this.matchNodeWithToken(node.questionToken!, matchNode.questionToken!));
		const readonlyTokenMatch = this.propIsNotGiven(node, matchNode, "readonlyToken") || (this.propIsGiven(node, matchNode, "readonlyToken") && this.matchNodeWithToken(node.readonlyToken!, matchNode.readonlyToken!));

		return typeParameterMatch && typeMatch && readonlyTokenMatch && questionTokenMatch;
	}

	/**
	 * Matches the provided node with the provided FunctionOrConstructorTypeNode
	 * @param {Node} node
	 * @param {FunctionOrConstructorTypeNode} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithFunctionOrConstructorTypeNode (node: Node, matchNode: FunctionOrConstructorTypeNode): boolean {
		// If the node is not a FunctionOrConstructorTypeNode, return false
		if (!(isFunctionOrConstructorTypeNode(node))) return false;

		if (isFunctionTypeNode(matchNode)) return this.matchNodeWithFunctionTypeNode(node, matchNode);
		else if (isConstructorTypeNode(matchNode)) return this.matchNodeWithConstructorTypeNode(node, matchNode);

		return false;
	}

	/**
	 * Matches the provided node with the provided ParenthesizedTypeNode
	 * @param {Node} node
	 * @param {ParenthesizedTypeNode} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithParenthesizedTypeNode (node: Node, matchNode: ParenthesizedTypeNode): boolean {
		// If the node is not a ParenthesizedTypeNode, return false
		if (!(isParenthesizedTypeNode(node))) return false;

		return this.matchNodeWithNode(node.type, matchNode.type);
	}

	/**
	 * Matches the provided node with the provided TypeOperatorNode
	 * @param {Node} node
	 * @param {TypeOperatorNode} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithTypeOperatorNode (node: Node, matchNode: TypeOperatorNode): boolean {
		// If the node is not a TypeOperatorNode, return false
		if (!(isTypeOperatorNode(node))) return false;
		const operatorMatch = node.operator === matchNode.operator;
		const typeMatch = this.matchNodeWithNode(node.type, matchNode.type);

		return operatorMatch && typeMatch;
	}

	/**
	 * Matches the provided node with the provided IndexedAccessTypeNode
	 * @param {Node} node
	 * @param {IndexedAccessTypeNode} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithIndexedAccessTypeNode (node: Node, matchNode: IndexedAccessTypeNode): boolean {
		// If the node is not a IndexedAccessTypeNode, return false
		if (!(isIndexedAccessTypeNode(node))) return false;
		const objectTypeMatch = this.matchNodeWithNode(node.objectType, matchNode.objectType);
		const indexTypeMatch = this.matchNodeWithNode(node.indexType, matchNode.indexType);
		return objectTypeMatch && indexTypeMatch;
	}

	/**
	 * Matches the provided node with the provided BooleanLiteral
	 * @param {Node} node
	 * @param {BooleanLiteral} _matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithBooleanLiteral (node: Node, _matchNode: BooleanLiteral): boolean {
		return isBooleanLiteral(node);
	}

	/**
	 * Matches the provided node with the provided ThisExpression
	 * @param {Node} node
	 * @param {ThisExpression} _matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithThisExpression (node: Node, _matchNode: ThisExpression): boolean {
		return this.isThisExpression(node);
	}

	/**
	 * Matches the provided node with the provided SuperExpression
	 * @param {Node} node
	 * @param {SuperExpression} _matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithSuperExpression (node: Node, _matchNode: SuperExpression): boolean {
		return this.isSuperExpression(node);
	}

	/**
	 * Matches the provided node with the provided ImportExpression
	 * @param {Node} node
	 * @param {ImportExpression} _matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithImportExpression (node: Node, _matchNode: ImportExpression): boolean {
		return this.isImportExpression(node);
	}

	/**
	 * Matches the provided node with the provided NullLiteral
	 * @param {Node} node
	 * @param {NullLiteral} _matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithNullLiteral (node: Node, _matchNode: NullLiteral): boolean {
		return this.isNullLiteral(node);
	}

	/**
	 * Returns true if the provided Node is a NullLiteral
	 * @param {Node} node
	 * @returns {boolean}
	 */
	private isNullLiteral (node: Node): node is NullLiteral {
		return node != null && node.kind === SyntaxKind.NullKeyword;
	}

	/**
	 * Matches the provided node with the provided LiteralTypeNode
	 * @param {Node} node
	 * @param {LiteralTypeNode} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithLiteralTypeNode (node: Node, matchNode: LiteralTypeNode): boolean {
		// If the node is not a LiteralTypeNode, return false
		if (!(isLiteralTypeNode(node))) return false;
		return this.matchNodeWithNode(node.literal, matchNode.literal);
	}

	/**
	 * Returns true if the provided Node is a ThisExpression
	 * @param {Node} node
	 * @returns {boolean}
	 */
	private isThisExpression (node: Node): node is ThisExpression {
		return node != null && node.kind === SyntaxKind.ThisKeyword;
	}

	/**
	 * Returns true if the provided Node is a SuperExpression
	 * @param {Node} node
	 * @returns {boolean}
	 */
	private isSuperExpression (node: Node): node is SuperExpression {
		return node != null && node.kind === SyntaxKind.SuperKeyword;
	}

	/**
	 * Returns true if the provided Node is a ImportExpression
	 * @param {Node} node
	 * @returns {boolean}
	 */
	private isImportExpression (node: Node): node is ImportExpression {
		return node != null && node.kind === SyntaxKind.ImportKeyword;
	}

	/**
	 * Returns true if the provided Node is a PartiallyEmittedExpression
	 * @param {Node} node
	 * @returns {boolean}
	 */
	private isPartiallyEmittedExpression (node: Node): node is PartiallyEmittedExpression {
		return node != null && node.kind === SyntaxKind.PartiallyEmittedExpression;
	}

	/**
	 * Returns true if the provided Node is a PrefixUnaryExpression
	 * @param {Node} node
	 * @returns {boolean}
	 */
	private isPrefixUnaryExpression (node: Node): node is PrefixUnaryExpression {
		return node != null && node.kind === SyntaxKind.PrefixUnaryExpression;
	}

	/**
	 * Returns true if the provided Node is a PostfixUnaryExpression
	 * @param {Node} node
	 * @returns {boolean}
	 */
	private isPostfixUnaryExpression (node: Node): node is PostfixUnaryExpression {
		return node != null && node.kind === SyntaxKind.PostfixUnaryExpression;
	}

	/**
	 * Matches the provided node with the provided PartiallyEmittedExpression
	 * @param {Node} node
	 * @param {PartiallyEmittedExpression} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithPartiallyEmittedExpression (node: Node, matchNode: PartiallyEmittedExpression): boolean {
		// If the node is not a PartiallyEmittedExpression, return false
		if (!(this.isPartiallyEmittedExpression(node))) return false;
		return this.matchNodeWithNode(node.expression, matchNode.expression);
	}

	/**
	 * Matches the provided node with the provided DeleteExpression
	 * @param {Node} node
	 * @param {DeleteExpression} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithDeleteExpression (node: Node, matchNode: DeleteExpression): boolean {
		// If the node is not a DeleteExpression, return false
		if (!(isDeleteExpression(node))) return false;
		return this.matchNodeWithNode(node.expression, matchNode.expression);
	}

	/**
	 * Matches the provided node with the provided TypeOfExpression
	 * @param {Node} node
	 * @param {TypeOfExpression} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithTypeOfExpression (node: Node, matchNode: TypeOfExpression): boolean {
		// If the node is not a TypeOfExpression, return false
		if (!(isTypeOfExpression(node))) return false;
		return this.matchNodeWithNode(node.expression, matchNode.expression);
	}

	/**
	 * Matches the provided node with the provided VoidExpression
	 * @param {Node} node
	 * @param {VoidExpression} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithVoidExpression (node: Node, matchNode: VoidExpression): boolean {
		// If the node is not a VoidExpression, return false
		if (!(isVoidExpression(node))) return false;
		return this.matchNodeWithNode(node.expression, matchNode.expression);
	}

	/**
	 * Matches the provided node with the provided AwaitExpression
	 * @param {Node} node
	 * @param {AwaitExpression} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithAwaitExpression (node: Node, matchNode: AwaitExpression): boolean {
		// If the node is not a AwaitExpression, return false
		if (!(isAwaitExpression(node))) return false;
		return this.matchNodeWithNode(node.expression, matchNode.expression);
	}

	/**
	 * Matches the provided node with the provided YieldExpression
	 * @param {Node} node
	 * @param {YieldExpression} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithYieldExpression (node: Node, matchNode: YieldExpression): boolean {
		// If the node is not a YieldExpression, return false
		if (!(isYieldExpression(node))) return false;
		const asteriskTokenMatch = this.propIsNotGiven(node, matchNode, "asteriskToken") || (this.propIsGiven(node, matchNode, "asteriskToken") && this.matchNodeWithToken(node.asteriskToken!, matchNode.asteriskToken!));
		const expressionMatch = this.propIsNotGiven(node, matchNode, "expression") || (this.propIsGiven(node, matchNode, "expression") && this.matchNodeWithNode(node.expression!, matchNode.expression!));

		return asteriskTokenMatch && expressionMatch;
	}

	/**
	 * Matches the provided node with the provided BinaryExpression
	 * @param {Node} node
	 * @param {BinaryExpression} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithBinaryExpression (node: Node, matchNode: BinaryExpression): boolean {
		// If the node is not a BinaryExpression, return false
		if (!(isBinaryExpression(node))) return false;
		const leftMatch = this.matchNodeWithNode(node.left, matchNode.left);
		const operatorTokenMatch = this.matchNodeWithToken(node.operatorToken, matchNode.operatorToken);
		const rightMatch = this.matchNodeWithNode(node.right, matchNode.right);

		return leftMatch && operatorTokenMatch && rightMatch;
	}

	/**
	 * Matches the provided node with the provided ConditionalExpression
	 * @param {Node} node
	 * @param {ConditionalExpression} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithConditionalExpression (node: Node, matchNode: ConditionalExpression): boolean {
		// If the node is not a ConditionalExpression, return false
		if (!(isConditionalExpression(node))) return false;

		const conditionMatch = this.matchNodeWithNode(node.condition, matchNode.condition);
		const questionTokenMatch = this.propIsNotGiven(node, matchNode, "questionToken") || (this.propIsGiven(node, matchNode, "questionToken") && this.matchNodeWithToken(node.questionToken, matchNode.questionToken));
		const colonTokenMatch = this.propIsNotGiven(node, matchNode, "colonToken") || (this.propIsGiven(node, matchNode, "colonToken") && this.matchNodeWithToken(node.colonToken, matchNode.colonToken));
		const whenTrueMatch = this.propIsNotGiven(node, matchNode, "whenTrue") || (this.propIsGiven(node, matchNode, "whenTrue") && this.matchNodeWithNode(node.whenTrue, matchNode.whenTrue));
		const whenFalseMatch = this.propIsNotGiven(node, matchNode, "whenFalse") || (this.propIsGiven(node, matchNode, "whenFalse") && this.matchNodeWithNode(node.whenFalse, matchNode.whenFalse));

		return conditionMatch && questionTokenMatch && colonTokenMatch && whenTrueMatch && whenFalseMatch;
	}

	/**
	 * Matches the provided node with the provided PrefixUnaryExpression
	 * @param {Node} node
	 * @param {PrefixUnaryExpression} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithPrefixUnaryExpression (node: Node, matchNode: PrefixUnaryExpression): boolean {
		// If the node is not a PrefixUnaryExpression, return false
		if (!(this.isPrefixUnaryExpression(node))) return false;

		const operatorMatch = node.operator === matchNode.operator;
		const operandMatch = this.matchNodeWithNode(node.operand, matchNode.operand);

		return operatorMatch && operandMatch;
	}

	/**
	 * Matches the provided node with the provided PostfixUnaryExpression
	 * @param {Node} node
	 * @param {PostfixUnaryExpression} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithPostfixUnaryExpression (node: Node, matchNode: PostfixUnaryExpression): boolean {
		// If the node is not a PostfixUnaryExpression, return false
		if (!(this.isPostfixUnaryExpression(node))) return false;

		const operatorMatch = node.operator === matchNode.operator;
		const operandMatch = this.matchNodeWithNode(node.operand, matchNode.operand);

		return operatorMatch && operandMatch;
	}

	/**
	 * Matches the provided node with the provided UnionTypeNode
	 * @param {Node} node
	 * @param {UnionTypeNode} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithUnionTypeNode (node: Node, matchNode: UnionTypeNode): boolean {
		// If the node is not a UnionTypeNode, return false
		if (!(isUnionTypeNode(node))) return false;

		return this.matchNodeWithNodes(node.types, matchNode.types);
	}

	/**
	 * Matches the provided node with the provided IntersectionTypeNode
	 * @param {Node} node
	 * @param {IntersectionTypeNode} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithIntersectionTypeNode (node: Node, matchNode: IntersectionTypeNode): boolean {
		// If the node is not a IntersectionTypeNode, return false
		if (!(isIntersectionTypeNode(node))) return false;

		return this.matchNodeWithNodes(node.types, matchNode.types);
	}

	/**
	 * Returns true if the provided prop is given on both nodes
	 * @param {T} a
	 * @param {T} b
	 * @param {string} key
	 * @returns {boolean}
	 */
	private propIsGiven<T extends Node> (a: T, b: T, key: keyof T): boolean {
		return a[key] != null && b[key] != null;
	}

	/**
	 * Returns true if the provided prop is given on both nodes
	 * @param {T} a
	 * @param {T} b
	 * @param {string} key
	 * @returns {boolean}
	 */
	private propIsNotGiven<T extends Node> (a: T, b: T, key: keyof T): boolean {
		return a[key] == null && b[key] == null;
	}

	/**
	 * Matches the provided node with the provided FunctionTypeNode
	 * @param {Node} node
	 * @param {FunctionTypeNode} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithFunctionTypeNode (node: Node, matchNode: FunctionTypeNode): boolean {
		// If the node is not a FunctionTypeNode, return false
		if (!(isFunctionTypeNode(node))) return false;
		const nameMatch = this.propIsNotGiven(node, matchNode, "name") || (this.propIsGiven(node, matchNode, "name") && this.matchNodeWithPropertyName(node.name!, matchNode.name!));
		const typeMatch = this.propIsNotGiven(node, matchNode, "type") || (this.propIsGiven(node, matchNode, "type") && this.matchNodeWithNode(node.type!, matchNode.type!));
		const typeParametersMatch = this.propIsNotGiven(node, matchNode, "typeParameters") || (this.propIsGiven(node, matchNode, "typeParameters") && this.matchNodeWithTypeParameterDeclarations(node.typeParameters!, matchNode.typeParameters!));
		const parametersMatch = this.propIsNotGiven(node, matchNode, "parameters") || (this.propIsGiven(node, matchNode, "parameters") && this.matchNodeWithParameterDeclarations(node.parameters!, matchNode.parameters!));
		return nameMatch && typeMatch && typeParametersMatch && parametersMatch;
	}

	/**
	 * Matches the provided node with the provided ArrayTypeNode
	 * @param {Node} node
	 * @param {ArrayTypeNode} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithArrayTypeNode (node: Node, matchNode: ArrayTypeNode): boolean {
		// If the node is not a ArrayTypeNode, return false
		if (!(isArrayTypeNode(node))) return false;
		return this.matchNodeWithNode(node.elementType, matchNode.elementType);
	}

	/**
	 * Matches the provided node with the provided TupleTypeNode
	 * @param {Node} node
	 * @param {TupleTypeNode} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithTupleTypeNode (node: Node, matchNode: TupleTypeNode): boolean {
		// If the node is not a TupleTypeNode, return false
		if (!(isTupleTypeNode(node))) return false;
		return this.matchNodeWithNodes(node.elementTypes, matchNode.elementTypes);
	}

	/**
	 * Matches the provided node with the provided TypeLiteralNode
	 * @param {Node} node
	 * @param {TypeLiteralNode} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithTypeLiteralNode (node: Node, matchNode: TypeLiteralNode): boolean {
		// If the node is not a TypeLiteralNode, return false
		if (!(isTypeLiteralNode(node))) return false;
		return this.matchNodeWithTypeElements(node.members, matchNode.members);
	}

	/**
	 * Matches the provided node with the provided TypeReferenceNode
	 * @param {Node} node
	 * @param {TypeReferenceNode} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithTypeReferenceNode (node: Node, matchNode: TypeReferenceNode): boolean {
		// If the node is not a TypeReferenceNode, return false
		if (!(isTypeReferenceNode(node))) return false;
		const typeNameMatch = this.matchNodeWithEntityName(node.typeName, matchNode.typeName);
		const typeArgumentsMatch = this.propIsNotGiven(node, matchNode, "typeArguments") || (this.propIsGiven(node, matchNode, "typeArguments") && this.matchNodeWithNodes(node.typeArguments!, matchNode.typeArguments!));
		return typeNameMatch && typeArgumentsMatch;
	}

	/**
	 * Matches the provided node with the provided TypePredicateNode
	 * @param {Node} node
	 * @param {TypePredicateNode} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithTypePredicateNode (node: Node, matchNode: TypePredicateNode): boolean {
		// If the node is not a TypePredicateNode, return false
		if (!(isTypePredicateNode(node))) return false;
		const parameterNameMatch = this.matchNodeWithIdentifierOrThisTypeNode(node.parameterName, matchNode.parameterName);
		const typeMatch = this.matchNodeWithNode(node.type, matchNode.type);
		return parameterNameMatch && typeMatch;
	}

	/**
	 * Matches the provided node with the provided TypeQueryNode
	 * @param {Node} node
	 * @param {TypeQueryNode} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithTypeQueryNode (node: Node, matchNode: TypeQueryNode): boolean {
		// If the node is not a TypeQueryNode, return false
		if (!(isTypeQueryNode(node))) return false;
		return this.matchNodeWithEntityName(node.exprName, matchNode.exprName);
	}

	/**
	 * Matches the provided node with the provided FunctionDeclaration
	 * @param {Node} node
	 * @param {FunctionDeclaration} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithFunctionDeclaration (node: Node, matchNode: FunctionDeclaration): boolean {
		// If the node is not a FunctionDeclaration, return false
		if (!(isFunctionDeclaration(node))) return false;

		const nameMatch = this.propIsNotGiven(node, matchNode, "name") || (this.propIsGiven(node, matchNode, "name") && this.matchNodeWithIdentifier(node.name!, matchNode.name!));
		const bodyMatch = this.propIsNotGiven(node, matchNode, "body") || (this.propIsGiven(node, matchNode, "body") && this.matchNodeWithBlock(node.body!, matchNode.body!));
		const asteriskTokenMatch = this.propIsNotGiven(node, matchNode, "asteriskToken") || (this.propIsGiven(node, matchNode, "asteriskToken") && this.matchNodeWithToken(node.asteriskToken!, matchNode.asteriskToken!));
		const questionTokenMatch = this.propIsNotGiven(node, matchNode, "questionToken") || (this.propIsGiven(node, matchNode, "questionToken") && this.matchNodeWithToken(node.questionToken!, matchNode.questionToken!));
		const typeParametersMatch = this.propIsNotGiven(node, matchNode, "typeParameters") || (this.propIsGiven(node, matchNode, "typeParameters") && this.matchNodeWithTypeParameterDeclarations(node.typeParameters!, matchNode.typeParameters!));
		const parametersMatch = this.matchNodeWithParameterDeclarations(node.parameters, matchNode.parameters);
		const typeMatch = this.propIsNotGiven(node, matchNode, "type") || (this.propIsGiven(node, matchNode, "type") && this.matchNodeWithNode(node.type!, matchNode.type!));

		return nameMatch && bodyMatch && asteriskTokenMatch && questionTokenMatch && typeParametersMatch && parametersMatch && typeMatch;
	}

	/**
	 * Matches the provided node with the provided FunctionExpression
	 * @param {Node} node
	 * @param {FunctionExpression} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithFunctionExpression (node: Node, matchNode: FunctionExpression): boolean {
		// If the node is not a FunctionExpression, return false
		if (!(isFunctionExpression(node))) return false;

		const nameMatch = this.propIsNotGiven(node, matchNode, "name") || (this.propIsGiven(node, matchNode, "name") && this.matchNodeWithIdentifier(node.name!, matchNode.name!));
		const bodyMatch = this.matchNodeWithBlock(node.body, matchNode.body);
		const asteriskTokenMatch = this.propIsNotGiven(node, matchNode, "asteriskToken") || (this.propIsGiven(node, matchNode, "asteriskToken") && this.matchNodeWithToken(node.asteriskToken!, matchNode.asteriskToken!));
		const questionTokenMatch = this.propIsNotGiven(node, matchNode, "questionToken") || (this.propIsGiven(node, matchNode, "questionToken") && this.matchNodeWithToken(node.questionToken!, matchNode.questionToken!));
		const typeParametersMatch = this.propIsNotGiven(node, matchNode, "typeParameters") || (this.propIsGiven(node, matchNode, "typeParameters") && this.matchNodeWithTypeParameterDeclarations(node.typeParameters!, matchNode.typeParameters!));
		const parametersMatch = this.matchNodeWithParameterDeclarations(node.parameters, matchNode.parameters);
		const typeMatch = this.propIsNotGiven(node, matchNode, "type") || (this.propIsGiven(node, matchNode, "type") && this.matchNodeWithNode(node.type!, matchNode.type!));

		return nameMatch && bodyMatch && asteriskTokenMatch && questionTokenMatch && typeParametersMatch && parametersMatch && typeMatch;
	}

	/**
	 * Matches the provided node with the provided ArrowFunction
	 * @param {Node} node
	 * @param {ArrowFunction} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithArrowFunction (node: Node, matchNode: ArrowFunction): boolean {
		// If the node is not a ArrowFunction, return false
		if (!(isArrowFunction(node))) return false;

		const nameMatch = this.propIsNotGiven(node, matchNode, "name") || (this.propIsGiven(node, matchNode, "name") && this.matchNodeWithPropertyName(node.name!, matchNode.name!));
		const bodyMatch = (isBlock(node.body) && !isBlock(matchNode.body) || !isBlock(node.body) && isBlock(matchNode.body)) ? false : isBlock(node.body) && isBlock(matchNode.body) ? this.matchNodeWithBlock(node.body, matchNode.body) : this.matchNodeWithNode(node.body, matchNode.body);
		const equalsGreaterThanTokenMatch = this.propIsNotGiven(node, matchNode, "equalsGreaterThanToken") || (this.propIsGiven(node, matchNode, "equalsGreaterThanToken") && this.matchNodeWithToken(node.equalsGreaterThanToken!, matchNode.equalsGreaterThanToken!));
		const asteriskTokenMatch = this.propIsNotGiven(node, matchNode, "asteriskToken") || (this.propIsGiven(node, matchNode, "asteriskToken") && this.matchNodeWithToken(node.asteriskToken!, matchNode.asteriskToken!));
		const questionTokenMatch = this.propIsNotGiven(node, matchNode, "questionToken") || (this.propIsGiven(node, matchNode, "questionToken") && this.matchNodeWithToken(node.questionToken!, matchNode.questionToken!));
		const typeParametersMatch = this.propIsNotGiven(node, matchNode, "typeParameters") || (this.propIsGiven(node, matchNode, "typeParameters") && this.matchNodeWithTypeParameterDeclarations(node.typeParameters!, matchNode.typeParameters!));
		const parametersMatch = this.matchNodeWithParameterDeclarations(node.parameters, matchNode.parameters);
		const typeMatch = this.propIsNotGiven(node, matchNode, "type") || (this.propIsGiven(node, matchNode, "type") && this.matchNodeWithNode(node.type!, matchNode.type!));

		return nameMatch && bodyMatch && equalsGreaterThanTokenMatch && asteriskTokenMatch && questionTokenMatch && typeParametersMatch && parametersMatch && typeMatch;
	}

	/**
	 * Matches the provided node with the provided MethodSignature
	 * @param {Node} node
	 * @param {MethodSignature} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithMethodSignature (node: Node, matchNode: MethodSignature): boolean {
		// If the node is not a MethodSignature, return false
		if (!(isMethodSignature(node))) return false;

		const nameMatch = this.matchNodeWithPropertyName(node.name, matchNode.name);
		const questionTokenMatch = this.propIsNotGiven(node, matchNode, "questionToken") || (this.propIsGiven(node, matchNode, "questionToken") && this.matchNodeWithToken(node.questionToken!, matchNode.questionToken!));
		const typeParametersMatch = this.propIsNotGiven(node, matchNode, "typeParameters") || (this.propIsGiven(node, matchNode, "typeParameters") && this.matchNodeWithTypeParameterDeclarations(node.typeParameters!, matchNode.typeParameters!));
		const parametersMatch = this.matchNodeWithParameterDeclarations(node.parameters, matchNode.parameters);
		const typeMatch = this.propIsNotGiven(node, matchNode, "type") || (this.propIsGiven(node, matchNode, "type") && this.matchNodeWithNode(node.type!, matchNode.type!));

		return nameMatch && questionTokenMatch && typeParametersMatch && parametersMatch && typeMatch;
	}

	/**
	 * Matches the provided node with the provided IndexSignatureDeclaration
	 * @param {Node} node
	 * @param {IndexSignatureDeclaration} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithIndexSignatureDeclaration (node: Node, matchNode: IndexSignatureDeclaration): boolean {
		// If the node is not a IndexSignatureDeclaration, return false
		if (!(isIndexSignatureDeclaration(node))) return false;

		const nameMatch = this.propIsNotGiven(node, matchNode, "name") || (this.propIsGiven(node, matchNode, "name") && this.matchNodeWithPropertyName(node.name!, matchNode.name!));
		const questionTokenMatch = this.propIsNotGiven(node, matchNode, "questionToken") || (this.propIsGiven(node, matchNode, "questionToken") && this.matchNodeWithToken(node.questionToken!, matchNode.questionToken!));
		const typeParametersMatch = this.propIsNotGiven(node, matchNode, "typeParameters") || (this.propIsGiven(node, matchNode, "typeParameters") && this.matchNodeWithTypeParameterDeclarations(node.typeParameters!, matchNode.typeParameters!));
		const parametersMatch = this.matchNodeWithParameterDeclarations(node.parameters, matchNode.parameters);
		const typeMatch = this.propIsNotGiven(node, matchNode, "type") || (this.propIsGiven(node, matchNode, "type") && this.matchNodeWithNode(node.type!, matchNode.type!));

		return nameMatch && questionTokenMatch && typeParametersMatch && parametersMatch && typeMatch;
	}

	/**
	 * Matches the provided node with the provided MethodDeclaration
	 * @param {Node} node
	 * @param {MethodDeclaration} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithMethodDeclaration (node: Node, matchNode: MethodDeclaration): boolean {
		// If the node is not a MethodDeclaration, return false
		if (!(isMethodDeclaration(node))) return false;

		const nameMatch = this.matchNodeWithPropertyName(node.name, matchNode.name);
		const bodyMatch = this.propIsNotGiven(node, matchNode, "body") || (this.propIsGiven(node, matchNode, "body") && this.matchNodeWithBlock(node.body!, matchNode.body!));
		const questionTokenMatch = this.propIsNotGiven(node, matchNode, "questionToken") || (this.propIsGiven(node, matchNode, "questionToken") && this.matchNodeWithToken(node.questionToken!, matchNode.questionToken!));
		const asteriskTokenMatch = this.propIsNotGiven(node, matchNode, "asteriskToken") || (this.propIsGiven(node, matchNode, "asteriskToken") && this.matchNodeWithToken(node.asteriskToken!, matchNode.asteriskToken!));
		const typeParametersMatch = this.propIsNotGiven(node, matchNode, "typeParameters") || (this.propIsGiven(node, matchNode, "typeParameters") && this.matchNodeWithTypeParameterDeclarations(node.typeParameters!, matchNode.typeParameters!));
		const parametersMatch = this.matchNodeWithParameterDeclarations(node.parameters, matchNode.parameters);
		const typeMatch = this.propIsNotGiven(node, matchNode, "type") || (this.propIsGiven(node, matchNode, "type") && this.matchNodeWithNode(node.type!, matchNode.type!));

		return nameMatch && questionTokenMatch && asteriskTokenMatch && bodyMatch && typeParametersMatch && parametersMatch && typeMatch;
	}

	/**
	 * Matches the provided node with the provided GetAccessorDeclaration
	 * @param {Node} node
	 * @param {GetAccessorDeclaration} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithGetAccessorDeclaration (node: Node, matchNode: GetAccessorDeclaration): boolean {
		// If the node is not a GetAccessorDeclaration, return false
		if (!(isGetAccessorDeclaration(node))) return false;

		const nameMatch = this.matchNodeWithPropertyName(node.name, matchNode.name);
		const bodyMatch = this.matchNodeWithBlock(node.body, matchNode.body);
		const questionTokenMatch = this.propIsNotGiven(node, matchNode, "questionToken") || (this.propIsGiven(node, matchNode, "questionToken") && this.matchNodeWithToken(node.questionToken!, matchNode.questionToken!));
		const asteriskTokenMatch = this.propIsNotGiven(node, matchNode, "asteriskToken") || (this.propIsGiven(node, matchNode, "asteriskToken") && this.matchNodeWithToken(node.asteriskToken!, matchNode.asteriskToken!));
		const typeParametersMatch = this.propIsNotGiven(node, matchNode, "typeParameters") || (this.propIsGiven(node, matchNode, "typeParameters") && this.matchNodeWithTypeParameterDeclarations(node.typeParameters!, matchNode.typeParameters!));
		const parametersMatch = this.matchNodeWithParameterDeclarations(node.parameters, matchNode.parameters);
		const typeMatch = this.propIsNotGiven(node, matchNode, "type") || (this.propIsGiven(node, matchNode, "type") && this.matchNodeWithNode(node.type!, matchNode.type!));

		return nameMatch && questionTokenMatch && asteriskTokenMatch && bodyMatch && typeParametersMatch && parametersMatch && typeMatch;
	}

	/**
	 * Matches the provided node with the provided SetAccessorDeclaration
	 * @param {Node} node
	 * @param {SetAccessorDeclaration} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithSetAccessorDeclaration (node: Node, matchNode: SetAccessorDeclaration): boolean {
		// If the node is not a SetAccessorDeclaration, return false
		if (!(isSetAccessorDeclaration(node))) return false;

		const nameMatch = this.matchNodeWithPropertyName(node.name, matchNode.name);
		const bodyMatch = this.matchNodeWithBlock(node.body, matchNode.body);
		const questionTokenMatch = this.propIsNotGiven(node, matchNode, "questionToken") || (this.propIsGiven(node, matchNode, "questionToken") && this.matchNodeWithToken(node.questionToken!, matchNode.questionToken!));
		const asteriskTokenMatch = this.propIsNotGiven(node, matchNode, "asteriskToken") || (this.propIsGiven(node, matchNode, "asteriskToken") && this.matchNodeWithToken(node.asteriskToken!, matchNode.asteriskToken!));
		const typeParametersMatch = this.propIsNotGiven(node, matchNode, "typeParameters") || (this.propIsGiven(node, matchNode, "typeParameters") && this.matchNodeWithTypeParameterDeclarations(node.typeParameters!, matchNode.typeParameters!));
		const parametersMatch = this.matchNodeWithParameterDeclarations(node.parameters, matchNode.parameters);
		const typeMatch = this.propIsNotGiven(node, matchNode, "type") || (this.propIsGiven(node, matchNode, "type") && this.matchNodeWithNode(node.type!, matchNode.type!));

		return nameMatch && questionTokenMatch && asteriskTokenMatch && bodyMatch && typeParametersMatch && parametersMatch && typeMatch;
	}

	/**
	 * Matches the provided node with the provided ConstructorDeclaration
	 * @param {Node} node
	 * @param {ConstructorDeclaration} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithConstructorDeclaration (node: Node, matchNode: ConstructorDeclaration): boolean {
		// If the node is not a ConstructorDeclaration, return false
		if (!(isConstructorDeclaration(node))) return false;

		const bodyMatch = this.propIsNotGiven(node, matchNode, "body") || (this.propIsGiven(node, matchNode, "body") && this.matchNodeWithBlock(node.body!, matchNode.body!));
		const questionTokenMatch = this.propIsNotGiven(node, matchNode, "questionToken") || (this.propIsGiven(node, matchNode, "questionToken") && this.matchNodeWithToken(node.questionToken!, matchNode.questionToken!));
		const asteriskTokenMatch = this.propIsNotGiven(node, matchNode, "asteriskToken") || (this.propIsGiven(node, matchNode, "asteriskToken") && this.matchNodeWithToken(node.asteriskToken!, matchNode.asteriskToken!));
		const typeParametersMatch = this.propIsNotGiven(node, matchNode, "typeParameters") || (this.propIsGiven(node, matchNode, "typeParameters") && this.matchNodeWithTypeParameterDeclarations(node.typeParameters!, matchNode.typeParameters!));
		const parametersMatch = this.matchNodeWithParameterDeclarations(node.parameters, matchNode.parameters);
		const typeMatch = this.propIsNotGiven(node, matchNode, "type") || (this.propIsGiven(node, matchNode, "type") && this.matchNodeWithNode(node.type!, matchNode.type!));

		return questionTokenMatch && asteriskTokenMatch && bodyMatch && typeParametersMatch && parametersMatch && typeMatch;
	}

	/**
	 * Matches the provided node with the provided SemicolonClassElement
	 * @param {Node} node
	 * @param {SemicolonClassElement} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithSemiColonClassElement (node: Node, matchNode: SemicolonClassElement): boolean {
		// If the node is not a SemicolonClassElement, return false
		if (!(isSemicolonClassElement(node))) return false;

		return this.propIsNotGiven(node, matchNode, "name") || (this.propIsGiven(node, matchNode, "name") && this.matchNodeWithPropertyName(node.name!, matchNode.name!));
	}

	/**
	 * Matches the provided node with the provided Block
	 * @param {Node} node
	 * @param {Block} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithBlock (node: Node, matchNode: Block): boolean {
		// If the node is not a Block, return false
		if (!(isBlock(node))) return false;

		return this.matchNodeWithStatements(node.statements, matchNode.statements);
	}

	/**
	 * Matches the provided node with the provided ConstructorTypeNode
	 * @param {Node} node
	 * @param {ConstructorTypeNode} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithConstructorTypeNode (node: Node, matchNode: ConstructorTypeNode): boolean {
		// If the node is not a ConstructorTypeNode, return false
		if (!(isConstructorTypeNode(node))) return false;
		const nameMatch = this.propIsNotGiven(node, matchNode, "name") || (this.propIsGiven(node, matchNode, "name") && this.matchNodeWithPropertyName(node.name!, matchNode.name!));
		const typeMatch = this.propIsNotGiven(node, matchNode, "type") || (this.propIsGiven(node, matchNode, "type") && this.matchNodeWithNode(node.type!, matchNode.type!));
		const typeParametersMatch = this.propIsNotGiven(node, matchNode, "typeParameters") || (this.propIsGiven(node, matchNode, "typeParameters") && this.matchNodeWithTypeParameterDeclarations(node.typeParameters!, matchNode.typeParameters!));
		const parametersMatch = this.propIsNotGiven(node, matchNode, "parameters") || (this.propIsGiven(node, matchNode, "parameters") && this.matchNodeWithParameterDeclarations(node.parameters!, matchNode.parameters!));
		return nameMatch && typeMatch && typeParametersMatch && parametersMatch;
	}

	/**
	 * Returns true if the provided node is an ArrayBindingElement
	 * @param {Node} node
	 * @returns {boolean}
	 */
	private isArrayBindingElement (node: Node): node is ArrayBindingElement {
		return isBindingElement(node) || isOmittedExpression(node);
	}

	/**
	 * Returns true if the provided Node is a BindingPattern
	 * @param {Node} node
	 * @returns {boolean}
	 */
	private isBindingPattern (node: Node): node is BindingPattern {
		return isObjectBindingPattern(node) || isArrayBindingPattern(node);
	}

	/**
	 * Returns true if the provided node is a DeclarationName
	 * @param {Node} node
	 * @returns {boolean}
	 */
	private isDeclarationName (node: Node): node is DeclarationName {
		return isIdentifier(node) || isStringLiteral(node) || isNumericLiteral(node) || isComputedPropertyName(node) || this.isBindingPattern(node);
	}

	/**
	 * Matches the provided node with the provided ComputedPropertyName
	 * @param {Node} node
	 * @param {ComputedPropertyName} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithComputedPropertyName (node: Node, matchNode: ComputedPropertyName): boolean {
		// If the node is not a StringLiteral, return false
		if (!isComputedPropertyName(node)) return false;
		return this.matchNodeWithNode(node.expression, matchNode.expression);
	}

	/**
	 * Matches the provided node with the provided BindingPattern
	 * @param {Node} node
	 * @param {BindingPattern} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithBindingPattern (node: Node, matchNode: BindingPattern): boolean {
		// If the node is not a BindingPattern, return false
		if (!this.isBindingPattern(node)) return false;

		if (isObjectBindingPattern(matchNode)) return this.matchNodeWithObjectBindingPattern(node, matchNode);
		else if (isArrayBindingPattern(matchNode)) return this.matchNodeWithArrayBindingPattern(node, matchNode);
		return false;
	}

	/**
	 * Matches the provided node with the provided ArrayBindingPattern
	 * @param {Node} node
	 * @param {ArrayBindingPattern} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithArrayBindingPattern (node: Node, matchNode: ArrayBindingPattern): boolean {
		// If the node is not a ObjectBindingPattern, return false
		if (!isArrayBindingPattern(node)) return false;

		return this.matchNodeWithArrayBindingElements(node.elements, matchNode.elements);
	}

	/**
	 * Matches the provided node with the provided ObjectBindingPattern
	 * @param {Node} node
	 * @param {ObjectBindingPattern} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithObjectBindingPattern (node: Node, matchNode: ObjectBindingPattern): boolean {
		// If the node is not a ObjectBindingPattern, return false
		if (!isObjectBindingPattern(node)) return false;

		return this.matchNodeWithBindingElements(node.elements, matchNode.elements);
	}

	/**
	 * Matches the provided node with the provided ArrayBindingElement
	 * @param {Node} node
	 * @param {ArrayBindingElement} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithArrayBindingElement (node: Node, matchNode: ArrayBindingElement): boolean {
		// If the node is not a DeclarationName, return false
		if (!this.isArrayBindingElement(node)) return false;

		if (isBindingElement(matchNode)) return this.matchNodeWithBindingElement(node, matchNode);
		else if (isOmittedExpression(matchNode)) return this.matchNodeWithOmittedExpression(node, matchNode);

		// The two nodes are different kinds of nodes. Return false
		return false;
	}

	/**
	 * Matches the provided node with the provided TypeElement
	 * @param {Node} node
	 * @param {TypeElement} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithTypeElement (node: Node, matchNode: TypeElement): boolean {
		// Return false if the provided Node is not a TypeElement
		if (!isTypeElement(node)) return false;

		const nameMatch = this.propIsNotGiven(node, matchNode, "name") || (this.propIsGiven(node, matchNode, "name") && this.matchNodeWithPropertyName(node.name!, matchNode.name!));
		const questionTokenMatch = this.propIsNotGiven(node, matchNode, "questionToken") || (this.propIsGiven(node, matchNode, "questionToken") && this.matchNodeWithToken(node.questionToken!, matchNode.questionToken!));

		return nameMatch && questionTokenMatch;
	}

	/**
	 * Matches the provided node with the provided HeritageClause
	 * @param {Node} node
	 * @param {HeritageClause} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithHeritageClause (node: Node, matchNode: HeritageClause): boolean {
		// Return false if the provided Node is not a HeritageClause
		if (!isHeritageClause(node)) return false;

		const tokenMatch = node.token === matchNode.token;
		const typesMatch = this.matchNodeWithExpressionWithTypeArgumentss(node.types, matchNode.types);

		return tokenMatch && typesMatch;
	}

	/**
	 * Matches the provided node with the provided TemplateSpan
	 * @param {Node} node
	 * @param {TemplateSpan} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithTemplateSpan (node: Node, matchNode: TemplateSpan): boolean {
		// Return false if the provided Node is not a TemplateSpan
		if (!isTemplateSpan(node)) return false;

		const literalMatch = this.matchNodeWithTemplateMiddleOrTemplateTail(node.literal, matchNode.literal);
		const expressionMatch = this.matchNodeWithNode(node.expression, matchNode.expression);

		return literalMatch && expressionMatch;
	}

	/**
	 * Matches the provided node with the provided NodeArray of EnumMembers
	 * @param {Node} node
	 * @param {NodeArray<EnumMember>} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithEnumMembers (node: NodeArray<Node>, matchNode: NodeArray<EnumMember>): boolean {
		// Return false if they don't have the same amount of elements
		if (node.length !== matchNode.length) return false;
		return matchNode.every(element => node.some(nodeElement => this.matchNodeWithEnumMember(nodeElement, element)));
	}

	/**
	 * Matches the provided node with the provided NodeArray of HeritageClauses
	 * @param {Node} node
	 * @param {NodeArray<HeritageClause>} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithHeritageClauses (node: NodeArray<Node>, matchNode: NodeArray<HeritageClause>): boolean {
		// Return false if they don't have the same amount of elements
		if (node.length !== matchNode.length) return false;
		return matchNode.every(element => node.some(nodeElement => this.matchNodeWithHeritageClause(nodeElement, element)));
	}

	/**
	 * Matches the provided node with the provided NodeArray of CaseOrDefaultClauses
	 * @param {Node} node
	 * @param {NodeArray<CaseOrDefaultClause>} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithCaseOrDefaultClauses (node: NodeArray<Node>, matchNode: NodeArray<CaseOrDefaultClause>): boolean {
		// Return false if they don't have the same amount of elements
		if (node.length !== matchNode.length) return false;
		return matchNode.every(element => node.some(nodeElement => this.matchNodeWithCaseOrDefaultClause(nodeElement, element)));
	}

	/**
	 * Matches the provided node with the provided NodeArray of ObjectLiteralElementLike
	 * @param {Node} node
	 * @param {NodeArray<ObjectLiteralElementLike>} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithObjectLiteralElementLikes (node: NodeArray<Node>, matchNode: NodeArray<ObjectLiteralElementLike>): boolean {
		// Return false if they don't have the same amount of elements
		if (node.length !== matchNode.length) return false;
		return matchNode.every(element => node.some(nodeElement => this.matchNodeWithObjectLiteralElementLike(nodeElement, element)));
	}

	/**
	 * Matches the provided node with the provided NodeArray of JsxAttributeLikes
	 * @param {Node} node
	 * @param {NodeArray<JsxAttributeLike>} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithJsxAttributeLikes (node: NodeArray<Node>, matchNode: NodeArray<JsxAttributeLike>): boolean {
		// Return false if they don't have the same amount of elements
		if (node.length !== matchNode.length) return false;
		return matchNode.every(element => node.some(nodeElement => this.matchNodeWithJsxAttributeLike(nodeElement, element)));
	}

	/**
	 * Matches the provided node with the provided NodeArray of TemplateSpans
	 * @param {Node} node
	 * @param {NodeArray<TemplateSpan>} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithTemplateSpans (node: NodeArray<Node>, matchNode: NodeArray<TemplateSpan>): boolean {
		// Return false if they don't have the same amount of elements
		if (node.length !== matchNode.length) return false;
		return matchNode.every(element => node.some(nodeElement => this.matchNodeWithTemplateSpan(nodeElement, element)));
	}

	/**
	 * Matches the provided node with the provided NodeArray of TypeElements
	 * @param {Node} node
	 * @param {NodeArray<TypeElement>} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithTypeElements (node: NodeArray<Node>, matchNode: NodeArray<TypeElement>): boolean {
		// Return false if they don't have the same amount of elements
		if (node.length !== matchNode.length) return false;
		return matchNode.every(element => node.some(nodeElement => this.matchNodeWithTypeElement(nodeElement, element)));
	}

	/**
	 * Matches the provided node with the provided NodeArray of VariableDeclarations
	 * @param {Node} node
	 * @param {NodeArray<VariableDeclaration>} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithVariableDeclarations (node: NodeArray<Node>, matchNode: NodeArray<VariableDeclaration>): boolean {
		// Return false if they don't have the same amount of elements
		if (node.length !== matchNode.length) return false;
		return matchNode.every(element => node.some(nodeElement => this.matchNodeWithVariableDeclaration(nodeElement, element)));
	}

	/**
	 * Matches the provided node with the provided NodeArray of Statements
	 * @param {Node} node
	 * @param {NodeArray<Statement>} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithStatements (node: NodeArray<Node>, matchNode: NodeArray<Statement>): boolean {
		// Return false if they don't have the same amount of elements
		if (node.length !== matchNode.length) return false;
		return matchNode.every(element => node.some(nodeElement => this.matchNodeWithNode(nodeElement, element)));
	}

	/**
	 * Matches the provided node with the provided NodeArray of Nodes
	 * @param {Node} node
	 * @param {NodeArray<Node>} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithNodes (node: NodeArray<Node>, matchNode: NodeArray<Node>): boolean {
		// Return false if they don't have the same amount of elements
		if (node.length !== matchNode.length) return false;
		return matchNode.every(element => node.some(nodeElement => this.matchNodeWithNode(nodeElement, element)));
	}

	/**
	 * Matches the provided node with the provided NodeArray of ArrayBindingElements
	 * @param {Node} node
	 * @param {NodeArray<ArrayBindingElement>} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithArrayBindingElements (node: NodeArray<Node>, matchNode: NodeArray<ArrayBindingElement>): boolean {
		// Return false if they don't have the same amount of elements
		if (node.length !== matchNode.length) return false;
		return matchNode.every(element => node.some(nodeElement => this.matchNodeWithArrayBindingElement(nodeElement, element)));
	}

	/**
	 * Matches the provided node with the provided NodeArray of BindingElements
	 * @param {Node} node
	 * @param {NodeArray<BindingElement>} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithBindingElements (node: NodeArray<Node>, matchNode: NodeArray<BindingElement>): boolean {
		// Return false if they don't have the same amount of elements
		if (node.length !== matchNode.length) return false;
		return matchNode.every(element => node.some(nodeElement => this.matchNodeWithBindingElement(nodeElement, element)));
	}

	/**
	 * Matches the provided node with the provided TypeParameterDeclaration
	 * @param {Node} node
	 * @param {TypeParameterDeclaration} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithTypeParameterDeclaration (node: Node, matchNode: TypeParameterDeclaration): boolean {
		// If the node is not a TypeParameterDeclaration, return false
		if (!isTypeParameterDeclaration(node)) return false;
		const identifierMatch = this.matchNodeWithIdentifier(node.name, matchNode.name);
		const constraintMatch = this.propIsNotGiven(node, matchNode, "constraint") || (this.propIsGiven(node, matchNode, "constraint") && this.matchNodeWithNode(node.constraint!, matchNode.constraint!));
		const defaultMatch = this.propIsNotGiven(node, matchNode, "default") || (this.propIsGiven(node, matchNode, "default") && this.matchNodeWithNode(node.default!, matchNode.default!));
		const expressionMatch = this.propIsNotGiven(node, matchNode, "expression") || (this.propIsGiven(node, matchNode, "expression") && this.matchNodeWithNode(node.expression!, matchNode.expression!));
		return identifierMatch && constraintMatch && defaultMatch && expressionMatch;
	}

	/**
	 * Matches the provided node with the provided PropertyDeclaration
	 * @param {Node} node
	 * @param {PropertyDeclaration} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithPropertyDeclaration (node: Node, matchNode: PropertyDeclaration): boolean {
		// If the node is not a PropertyDeclaration, return false
		if (!isPropertyDeclaration(node)) return false;
		const nameMatch = this.matchNodeWithPropertyName(node.name, matchNode.name);
		const questionTokenMatch = this.propIsNotGiven(node, matchNode, "questionToken") || (this.propIsGiven(node, matchNode, "questionToken") && this.matchNodeWithToken(node.questionToken!, matchNode.questionToken!));
		const typeMatch = this.propIsNotGiven(node, matchNode, "type") || (this.propIsGiven(node, matchNode, "type") && this.matchNodeWithNode(node.type!, matchNode.type!));
		const initializerMatch = this.propIsNotGiven(node, matchNode, "initializer") || (this.propIsGiven(node, matchNode, "initializer") && this.matchNodeWithNode(node.initializer!, matchNode.initializer!));

		return nameMatch && questionTokenMatch && typeMatch && initializerMatch;
	}

	/**
	 * Matches the provided node with the provided PropertyAssignment
	 * @param {Node} node
	 * @param {PropertyAssignment} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithPropertyAssignment (node: Node, matchNode: PropertyAssignment): boolean {
		// If the node is not a PropertyAssignment, return false
		if (!isPropertyAssignment(node)) return false;

		const nameMatch = this.matchNodeWithPropertyName(node.name, matchNode.name);
		const questionTokenMatch = this.propIsNotGiven(node, matchNode, "questionToken") || (this.propIsGiven(node, matchNode, "questionToken") && this.matchNodeWithToken(node.questionToken!, matchNode.questionToken!));
		const initializerMatch = this.propIsNotGiven(node, matchNode, "initializer") || (this.propIsGiven(node, matchNode, "initializer") && this.matchNodeWithNode(node.initializer!, matchNode.initializer!));

		return nameMatch && questionTokenMatch && initializerMatch;
	}

	/**
	 * Matches the provided node with the provided PropertyAccessExpression
	 * @param {Node} node
	 * @param {PropertyAccessExpression} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithPropertyAccessExpression (node: Node, matchNode: PropertyAccessExpression): boolean {
		// If the node is not a PropertyAccessExpression, return false
		if (!isPropertyAccessExpression(node)) return false;

		const nameMatch = this.matchNodeWithIdentifier(node.name, matchNode.name);
		const expressionMatch = this.matchNodeWithNode(node.expression, matchNode.expression);

		return nameMatch && expressionMatch;
	}

	/**
	 * Matches the provided node with the provided ElementAccessExpression
	 * @param {Node} node
	 * @param {ElementAccessExpression} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithElementAccessExpression (node: Node, matchNode: ElementAccessExpression): boolean {
		// If the node is not a ElementAccessExpression, return false
		if (!isElementAccessExpression(node)) return false;

		const argumentExpressionMatch = this.propIsNotGiven(node, matchNode, "argumentExpression") || (this.propIsGiven(node, matchNode, "argumentExpression") && this.matchNodeWithNode(node.argumentExpression!, matchNode.argumentExpression!));
		const expressionMatch = this.matchNodeWithNode(node.expression, matchNode.expression);

		return argumentExpressionMatch && expressionMatch;
	}

	/**
	 * Matches the provided node with the provided CallExpression
	 * @param {Node} node
	 * @param {CallExpression} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithCallExpression (node: Node, matchNode: CallExpression): boolean {
		// If the node is not a CallExpression, return false
		if (!isCallExpression(node)) return false;

		const typeArgumentsMatch = this.propIsNotGiven(node, matchNode, "typeArguments") || (this.propIsGiven(node, matchNode, "typeArguments") && this.matchNodeWithNodes(node.typeArguments!, matchNode.typeArguments!));
		const argumentsMatch = this.propIsNotGiven(node, matchNode, "arguments") || (this.propIsGiven(node, matchNode, "arguments") && this.matchNodeWithNodes(node.arguments!, matchNode.arguments!));
		const expressionMatch = this.matchNodeWithNode(node.expression, matchNode.expression);

		return typeArgumentsMatch && expressionMatch && argumentsMatch;
	}

	/**
	 * Matches the provided node with the provided IfStatement
	 * @param {Node} node
	 * @param {IfStatement} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithIfStatement (node: Node, matchNode: IfStatement): boolean {
		// If the node is not a IfStatement, return false
		if (!isIfStatement(node)) return false;

		const expressionMatch = this.matchNodeWithNode(node.expression, matchNode.expression);
		const thenStatementMatch = this.propIsNotGiven(node, matchNode, "thenStatement") || (this.propIsGiven(node, matchNode, "thenStatement") && this.matchNodeWithNode(node.thenStatement, matchNode.thenStatement));
		const elseStatementMatch = this.propIsNotGiven(node, matchNode, "elseStatement") || (this.propIsGiven(node, matchNode, "elseStatement") && this.matchNodeWithNode(node.elseStatement!, matchNode.elseStatement!));

		return expressionMatch && thenStatementMatch && elseStatementMatch;
	}

	/**
	 * Matches the provided node with the provided DoStatement
	 * @param {Node} node
	 * @param {DoStatement} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithDoStatement (node: Node, matchNode: DoStatement): boolean {
		// If the node is not a DoStatement, return false
		if (!isDoStatement(node)) return false;

		const statementMatch = this.matchNodeWithNode(node.statement, matchNode.statement);
		const expressionMatch = this.matchNodeWithNode(node.expression, matchNode.expression);

		return statementMatch && expressionMatch;
	}

	/**
	 * Matches the provided node with the provided DoStatement
	 * @param {Node} node
	 * @param {DoStatement} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithWhileStatement (node: Node, matchNode: WhileStatement): boolean {
		// If the node is not a WhileStatement, return false
		if (!isWhileStatement(node)) return false;

		const statementMatch = this.matchNodeWithNode(node.statement, matchNode.statement);
		const expressionMatch = this.matchNodeWithNode(node.expression, matchNode.expression);

		return statementMatch && expressionMatch;
	}

	/**
	 * Matches the provided node with the provided ForStatement
	 * @param {Node} node
	 * @param {ForStatement} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithForStatement (node: Node, matchNode: ForStatement): boolean {
		// If the node is not a ForStatement, return false
		if (!isForStatement(node)) return false;

		const initializerMatch = this.propIsNotGiven(node, matchNode, "initializer") || (this.propIsGiven(node, matchNode, "initializer") && this.matchNodeWithForInitializer(node.initializer!, matchNode.initializer!));
		const conditionMatch = this.propIsNotGiven(node, matchNode, "condition") || (this.propIsGiven(node, matchNode, "condition") && this.matchNodeWithNode(node.condition!, matchNode.condition!));
		const incrementorMatch = this.propIsNotGiven(node, matchNode, "incrementor") || (this.propIsGiven(node, matchNode, "incrementor") && this.matchNodeWithNode(node.incrementor!, matchNode.incrementor!));
		const statementMatch = this.matchNodeWithNode(node.statement, matchNode.statement);

		return statementMatch && initializerMatch && conditionMatch && incrementorMatch;
	}

	/**
	 * Matches the provided node with the provided ForInStatement
	 * @param {Node} node
	 * @param {ForInStatement} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithForInStatement (node: Node, matchNode: ForInStatement): boolean {
		// If the node is not a ForInStatement, return false
		if (!isForInStatement(node)) return false;

		const initializerMatch = this.matchNodeWithForInitializer(node.initializer, matchNode.initializer);
		const expressionMatch = this.matchNodeWithNode(node.expression, matchNode.expression);
		const statementMatch = this.matchNodeWithNode(node.statement, matchNode.statement);

		return statementMatch && initializerMatch && expressionMatch;
	}

	/**
	 * Matches the provided node with the provided ForOfStatement
	 * @param {Node} node
	 * @param {ForOfStatement} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithForOfStatement (node: Node, matchNode: ForOfStatement): boolean {
		// If the node is not a ForOfStatement, return false
		if (!isForOfStatement(node)) return false;

		const initializerMatch = this.matchNodeWithForInitializer(node.initializer, matchNode.initializer);
		const expressionMatch = this.matchNodeWithNode(node.expression, matchNode.expression);
		const awaitModifierMatch = this.propIsNotGiven(node, matchNode, "awaitModifier") || (this.propIsGiven(node, matchNode, "awaitModifier") && this.matchNodeWithToken(node.awaitModifier!, matchNode.awaitModifier!));
		const statementMatch = this.matchNodeWithNode(node.statement, matchNode.statement);

		return initializerMatch && expressionMatch && awaitModifierMatch && statementMatch;
	}

	/**
	 * Matches the provided node with the provided BreakStatement
	 * @param {Node} node
	 * @param {BreakStatement} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithBreakStatement (node: Node, matchNode: BreakStatement): boolean {
		// If the node is not a BreakStatement, return false
		if (!isBreakStatement(node)) return false;

		return this.propIsNotGiven(node, matchNode, "label") || (this.propIsGiven(node, matchNode, "label") && this.matchNodeWithIdentifier(node.label!, matchNode.label!));
	}

	/**
	 * Matches the provided node with the provided ContinueStatement
	 * @param {Node} node
	 * @param {ContinueStatement} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithContinueStatement (node: Node, matchNode: ContinueStatement): boolean {
		// If the node is not a ContinueStatement, return false
		if (!isContinueStatement(node)) return false;

		return this.propIsNotGiven(node, matchNode, "label") || (this.propIsGiven(node, matchNode, "label") && this.matchNodeWithIdentifier(node.label!, matchNode.label!));
	}

	/**
	 * Matches the provided node with the provided ReturnStatement
	 * @param {Node} node
	 * @param {ReturnStatement} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithReturnStatement (node: Node, matchNode: ReturnStatement): boolean {
		// If the node is not a ReturnStatement, return false
		if (!isReturnStatement(node)) return false;

		return this.propIsNotGiven(node, matchNode, "expression") || (this.propIsGiven(node, matchNode, "expression") && this.matchNodeWithNode(node.expression!, matchNode.expression!));
	}

	/**
	 * Matches the provided node with the provided CaseClause
	 * @param {Node} node
	 * @param {CaseClause} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithCaseClause (node: Node, matchNode: CaseClause): boolean {
		// If the node is not a CaseClause, return false
		if (!isCaseClause(node)) return false;

		const expressionMatch = this.matchNodeWithNode(node.expression, matchNode.expression);
		const statementsMatch = this.matchNodeWithNodes(node.statements, matchNode.statements);

		return expressionMatch && statementsMatch;
	}

	/**
	 * Matches the provided node with the provided DefaultClause
	 * @param {Node} node
	 * @param {DefaultClause} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithDefaultClause (node: Node, matchNode: DefaultClause): boolean {
		// If the node is not a DefaultClause, return false
		if (!isDefaultClause(node)) return false;

		return this.matchNodeWithNodes(node.statements, matchNode.statements);
	}

	/**
	 * Matches the provided node with the provided LabeledStatement
	 * @param {Node} node
	 * @param {LabeledStatement} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithLabeledStatement (node: Node, matchNode: LabeledStatement): boolean {
		// If the node is not a LabeledStatement, return false
		if (!isLabeledStatement(node)) return false;

		const labelMatch = this.matchNodeWithIdentifier(node.label, matchNode.label);
		const statementMatch = this.matchNodeWithNode(node.statement, matchNode.statement);

		return labelMatch && statementMatch;
	}

	/**
	 * Matches the provided node with the provided ThrowStatement
	 * @param {Node} node
	 * @param {ThrowStatement} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithThrowStatement (node: Node, matchNode: ThrowStatement): boolean {
		// If the node is not a ThrowStatement, return false
		if (!isThrowStatement(node)) return false;

		return this.matchNodeWithNode(node.expression, matchNode.expression);
	}

	/**
	 * Matches the provided node with the provided TryStatement
	 * @param {Node} node
	 * @param {TryStatement} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithTryStatement (node: Node, matchNode: TryStatement): boolean {
		// If the node is not a TryStatement, return false
		if (!isTryStatement(node)) return false;

		const tryBlockMatch = this.matchNodeWithBlock(node.tryBlock, matchNode.tryBlock);
		const finallyBlockMatch = this.propIsNotGiven(node, matchNode, "finallyBlock") || (this.propIsGiven(node, matchNode, "finallyBlock") && this.matchNodeWithBlock(node.finallyBlock!, matchNode.finallyBlock!));
		const catchClauseMatch = this.propIsNotGiven(node, matchNode, "catchClause") || (this.propIsGiven(node, matchNode, "catchClause") && this.matchNodeWithCatchClause(node.catchClause!, matchNode.catchClause!));

		return tryBlockMatch && finallyBlockMatch && catchClauseMatch;
	}

	/**
	 * Matches the provided node with the provided CatchClause
	 * @param {Node} node
	 * @param {CatchClause} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithCatchClause (node: Node, matchNode: CatchClause): boolean {
		// If the node is not a CatchClause, return false
		if (!isCatchClause(node)) return false;

		const blockMatch = this.matchNodeWithBlock(node.block, matchNode.block);
		const variableDeclarationMatch = this.propIsNotGiven(node, matchNode, "variableDeclaration") || (this.propIsGiven(node, matchNode, "variableDeclaration") && this.matchNodeWithVariableDeclaration(node.variableDeclaration!, matchNode.variableDeclaration!));

		return blockMatch && variableDeclarationMatch;
	}

	/**
	 * Matches the provided node with the provided WithStatement
	 * @param {Node} node
	 * @param {WithStatement} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithWithStatement (node: Node, matchNode: WithStatement): boolean {
		// If the node is not a WithStatement, return false
		if (!isWithStatement(node)) return false;

		const expressionMatch = this.matchNodeWithNode(node.expression, matchNode.expression);
		const statementMatch = this.matchNodeWithNode(node.statement, matchNode.statement);

		return expressionMatch && statementMatch;
	}

	/**
	 * Matches the provided node with the provided SwitchStatement
	 * @param {Node} node
	 * @param {SwitchStatement} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithSwitchStatement (node: Node, matchNode: SwitchStatement): boolean {
		// If the node is not a SwitchStatement, return false
		if (!isSwitchStatement(node)) return false;

		const expressionMatch = this.matchNodeWithNode(node.expression, matchNode.expression);
		const caseBlockMatch = this.matchNodeWithCaseBlock(node.caseBlock, matchNode.caseBlock);
		const possiblyExhaustiveMatch = node.possiblyExhaustive === matchNode.possiblyExhaustive;

		return expressionMatch && caseBlockMatch && possiblyExhaustiveMatch;
	}

	/**
	 * Matches the provided node with the provided CaseBlock
	 * @param {Node} node
	 * @param {CaseBlock} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithCaseBlock (node: Node, matchNode: CaseBlock): boolean {
		// If the node is not a CaseBlock, return false
		if (!isCaseBlock(node)) return false;

		return this.matchNodeWithCaseOrDefaultClauses(node.clauses, matchNode.clauses);
	}

	/**
	 * Matches the provided node with the provided MissingDeclaration
	 * @param {Node} node
	 * @param {MissingDeclaration} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithMissingDeclaration (node: Node, matchNode: MissingDeclaration): boolean {
		// If the node is not a MissingDeclaration, return false
		if (!isMissingDeclaration(node)) return false;

		const nameMatch = this.propIsNotGiven(node, matchNode, "name") || (this.propIsGiven(node, matchNode, "name") && this.matchNodeWithIdentifier(node.name!, matchNode.name!));
		const questionTokenMatch = this.propIsNotGiven(node, matchNode, "questionToken") || (this.propIsGiven(node, matchNode, "questionToken") && this.matchNodeWithToken(node.questionToken!, matchNode.questionToken!));

		return nameMatch && questionTokenMatch;
	}

	/**
	 * Matches the provided node with the provided VariableStatement
	 * @param {Node} node
	 * @param {VariableStatement} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithVariableStatement (node: Node, matchNode: VariableStatement): boolean {
		// If the node is not a VariableStatement, return false
		if (!isVariableStatement(node)) return false;

		return this.matchNodeWithVariableDeclarationList(node.declarationList, matchNode.declarationList);
	}

	/**
	 * Matches the provided node with the provided ExpressionStatement
	 * @param {Node} node
	 * @param {ExpressionStatement} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithExpressionStatement (node: Node, matchNode: ExpressionStatement): boolean {
		// If the node is not a ExpressionStatement, return false
		if (!isExpressionStatement(node)) return false;

		return this.matchNodeWithNode(node.expression, matchNode.expression);
	}

	/**
	 * Matches the provided node with the provided NewExpression
	 * @param {Node} node
	 * @param {NewExpression} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithNewExpression (node: Node, matchNode: NewExpression): boolean {
		// If the node is not a NewExpression, return false
		if (!isNewExpression(node)) return false;

		const typeArgumentsMatch = this.propIsNotGiven(node, matchNode, "typeArguments") || (this.propIsGiven(node, matchNode, "typeArguments") && this.matchNodeWithNodes(node.typeArguments!, matchNode.typeArguments!));
		const argumentsMatch = this.propIsNotGiven(node, matchNode, "arguments") || (this.propIsGiven(node, matchNode, "arguments") && this.matchNodeWithNodes(node.arguments!, matchNode.arguments!));
		const expressionMatch = this.matchNodeWithNode(node.expression, matchNode.expression);

		return typeArgumentsMatch && expressionMatch && argumentsMatch;
	}

	/**
	 * Matches the provided node with the provided TaggedTemplateExpression
	 * @param {Node} node
	 * @param {TaggedTemplateExpression} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithTaggedTemplateExpression (node: Node, matchNode: TaggedTemplateExpression): boolean {
		// If the node is not a TaggedTemplateExpression, return false
		if (!isTaggedTemplateExpression(node)) return false;

		const tagMatch = this.matchNodeWithNode(node.tag, matchNode.tag);
		const templateMatch = (isTemplateExpression(node.template) && !isTemplateExpression(matchNode.template)) || (!isTemplateExpression(node.template) && isTemplateExpression(matchNode.template)) ? false : isTemplateExpression(node.template) && isTemplateExpression(matchNode.template) ? this.matchNodeWithTemplateExpression(node.template, matchNode.template) : isNoSubstitutionTemplateLiteral(node.template) && isNoSubstitutionTemplateLiteral(matchNode.template) ? this.matchNodeWithNoSubstitutionTemplateLiteral(node.template, matchNode.template) : false;

		return tagMatch && templateMatch;
	}

	/**
	 * Matches the provided node with the provided AsExpression
	 * @param {Node} node
	 * @param {AsExpression} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithAsExpression (node: Node, matchNode: AsExpression): boolean {
		// If the node is not a TaggedTemplateExpression, return false
		if (!isAsExpression(node)) return false;

		const expressionMatch = this.matchNodeWithNode(node.expression, matchNode.expression);
		const typeMatch = this.matchNodeWithNode(node.type, matchNode.type);

		return expressionMatch && typeMatch;
	}

	/**
	 * Matches the provided node with the provided TypeAssertion
	 * @param {Node} node
	 * @param {TypeAssertion} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithTypeAssertion (node: Node, matchNode: TypeAssertion): boolean {
		// If the node is not a TypeAssertion, return false
		if (!isTypeAssertion(node)) return false;

		const expressionMatch = this.matchNodeWithNode(node.expression, matchNode.expression);
		const typeMatch = this.matchNodeWithNode(node.type, matchNode.type);

		return expressionMatch && typeMatch;
	}

	/**
	 * Matches the provided node with the provided NonNullExpression
	 * @param {Node} node
	 * @param {NonNullExpression} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithNonNullExpression (node: Node, matchNode: NonNullExpression): boolean {
		// If the node is not a NonNullExpression, return false
		if (!isNonNullExpression(node)) return false;

		return this.matchNodeWithNode(node.expression, matchNode.expression);
	}

	/**
	 * Matches the provided node with the provided MetaProperty
	 * @param {Node} node
	 * @param {MetaProperty} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithMetaProperty (node: Node, matchNode: MetaProperty): boolean {
		// If the node is not a MetaProperty, return false
		if (!isMetaProperty(node)) return false;

		const keywordTokenMatch = node.keywordToken === matchNode.keywordToken;
		const nameMatch = this.matchNodeWithIdentifier(node.name, matchNode.name);

		return keywordTokenMatch && nameMatch;
	}

	/**
	 * Matches the provided node with the provided JsxElement
	 * @param {Node} node
	 * @param {JsxElement} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithJsxElement (node: Node, matchNode: JsxElement): boolean {
		// If the node is not a JsxElement, return false
		if (!isJsxElement(node)) return false;

		const openingElement = this.matchNodeWithJsxOpeningElement(node.openingElement, matchNode.openingElement);
		const childrenMatch = this.matchNodeWithNodes(node.children, matchNode.children);
		const closingElement = this.matchNodeWithJsxClosingElement(node.closingElement, matchNode.closingElement);

		return openingElement && childrenMatch && closingElement;
	}

	/**
	 * Matches the provided node with the provided JsxOpeningElement
	 * @param {Node} node
	 * @param {JsxOpeningElement} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithJsxOpeningElement (node: Node, matchNode: JsxOpeningElement): boolean {
		// If the node is not a JsxOpeningElement, return false
		if (!isJsxOpeningElement(node)) return false;

		const tagNameMatch = this.matchNodeWithJsxTagNameExpression(node.tagName, matchNode.tagName);
		const attributesMatch = this.matchNodeWithJsxAttributes(node.attributes, matchNode.attributes);

		return tagNameMatch && attributesMatch;
	}

	/**
	 * Matches the provided node with the provided JsxExpression
	 * @param {Node} node
	 * @param {JsxExpression} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithJsxExpression (node: Node, matchNode: JsxExpression): boolean {
		// If the node is not a JsxExpression, return false
		if (!isJsxExpression(node)) return false;

		const dotDotDotTokenMatch = this.propIsNotGiven(node, matchNode, "dotDotDotToken") || (this.propIsGiven(node, matchNode, "dotDotDotToken") && this.matchNodeWithToken(node.dotDotDotToken!, matchNode.dotDotDotToken!));
		const expressionMatch = this.propIsNotGiven(node, matchNode, "expression") || (this.propIsGiven(node, matchNode, "expression") && this.matchNodeWithNode(node.expression!, matchNode.expression!));

		return dotDotDotTokenMatch && expressionMatch;
	}

	/**
	 * Matches the provided node with the provided JsxText
	 * @param {Node} node
	 * @param {JsxText} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithJsxText (node: Node, matchNode: JsxText): boolean {
		// If the node is not a JsxText, return false
		if (!isJsxText(node)) return false;

		return node.containsOnlyWhiteSpaces === matchNode.containsOnlyWhiteSpaces;
	}

	/**
	 * Matches the provided node with the provided JsxClosingElement
	 * @param {Node} node
	 * @param {JsxClosingElement} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithJsxClosingElement (node: Node, matchNode: JsxClosingElement): boolean {
		// If the node is not a JsxClosingElement, return false
		if (!isJsxClosingElement(node)) return false;

		return this.matchNodeWithJsxTagNameExpression(node.tagName, matchNode.tagName);
	}

	/**
	 * Matches the provided node with the provided JsxSelfClosingElement
	 * @param {Node} node
	 * @param {JsxSelfClosingElement} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithJsxSelfClosingElement (node: Node, matchNode: JsxSelfClosingElement): boolean {
		// If the node is not a JsxSelfClosingElement, return false
		if (!isJsxSelfClosingElement(node)) return false;

		const tagNameMatch = this.matchNodeWithJsxTagNameExpression(node.tagName, matchNode.tagName);
		const attributesMatch = this.matchNodeWithJsxAttributes(node.attributes, matchNode.attributes);

		return tagNameMatch && attributesMatch;
	}

	/**
	 * Matches the provided node with the provided JsxAttributes
	 * @param {Node} node
	 * @param {JsxAttributes} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithJsxAttributes (node: Node, matchNode: JsxAttributes): boolean {
		// If the node is not a JsxAttributes, return false
		if (!isJsxAttributes(node)) return false;

		return this.matchNodeWithJsxAttributeLikes(node.properties, matchNode.properties);
	}

	/**
	 * Matches the provided node with the provided JsxAttribute
	 * @param {Node} node
	 * @param {JsxAttribute} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithJsxAttribute (node: Node, matchNode: JsxAttribute): boolean {
		// If the node is not a JsxAttribute, return false
		if (!isJsxAttribute(node)) return false;
		const tagNameMatch = this.propIsNotGiven(node, matchNode, "initializer") || (this.propIsGiven(node, matchNode, "initializer") && this.matchNodeWithStringLiteralOrJsxExpression(node.initializer!, matchNode.initializer!));
		const nameMatch = this.matchNodeWithIdentifier(node.name, matchNode.name);
		return tagNameMatch && nameMatch;
	}

	/**
	 * Matches the provided node with the provided ImportSpecifier
	 * @param {Node} node
	 * @param {ImportSpecifier} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithImportSpecifier (node: Node, matchNode: ImportSpecifier): boolean {
		// If the node is not a ImportSpecifier, return false
		if (!isImportSpecifier(node)) return false;

		const propertyNameMatch = this.propIsNotGiven(node, matchNode, "propertyName") || (this.propIsGiven(node, matchNode, "propertyName") && this.matchNodeWithIdentifier(node.propertyName!, matchNode.propertyName!));
		const nameMatch = this.matchNodeWithIdentifier(node.name, matchNode.name);

		return propertyNameMatch && nameMatch;
	}

	/**
	 * Matches the provided node with the provided ExportSpecifier
	 * @param {Node} node
	 * @param {ExportSpecifier} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithExportSpecifier (node: Node, matchNode: ExportSpecifier): boolean {
		// If the node is not a ImportSpecifier, return false
		if (!isExportSpecifier(node)) return false;

		const propertyNameMatch = this.propIsNotGiven(node, matchNode, "propertyName") || (this.propIsGiven(node, matchNode, "propertyName") && this.matchNodeWithIdentifier(node.propertyName!, matchNode.propertyName!));
		const nameMatch = this.matchNodeWithIdentifier(node.name, matchNode.name);

		return propertyNameMatch && nameMatch;
	}

	/**
	 * Matches the provided node with the provided JsxSpreadAttribute
	 * @param {Node} node
	 * @param {JsxSpreadAttribute} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithJsxSpreadAttribute (node: Node, matchNode: JsxSpreadAttribute): boolean {
		// If the node is not a JsxSpreadAttribute, return false
		if (!isJsxSpreadAttribute(node)) return false;

		return this.matchNodeWithNode(node.expression, matchNode.expression);
	}

	/**
	 * Matches the provided node with the provided ExpressionWithTypeArguments
	 * @param {Node} node
	 * @param {ExpressionWithTypeArguments} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithExpressionWithTypeArguments (node: Node, matchNode: ExpressionWithTypeArguments): boolean {
		// If the node is not a ExpressionWithTypeArguments, return false
		if (!isExpressionWithTypeArguments(node)) return false;

		const typeArgumentsMatch = this.propIsNotGiven(node, matchNode, "typeArguments") || (this.propIsGiven(node, matchNode, "typeArguments") && this.matchNodeWithNodes(node.typeArguments!, matchNode.typeArguments!));
		const expressionMatch = this.matchNodeWithNode(node.expression, matchNode.expression);

		return typeArgumentsMatch && expressionMatch;
	}

	/**
	 * Matches the provided node with the provided ShorthandPropertyAssignment
	 * @param {Node} node
	 * @param {ShorthandPropertyAssignment} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithShorthandPropertyAssignment (node: Node, matchNode: ShorthandPropertyAssignment): boolean {
		// If the node is not a ShorthandPropertyAssignment, return false
		if (!isShorthandPropertyAssignment(node)) return false;

		const nameMatch = this.matchNodeWithIdentifier(node.name, matchNode.name);
		const questionTokenMatch = this.propIsNotGiven(node, matchNode, "questionToken") || (this.propIsGiven(node, matchNode, "questionToken") && this.matchNodeWithToken(node.questionToken!, matchNode.questionToken!));
		const equalsTokenMatch = this.propIsNotGiven(node, matchNode, "equalsToken") || (this.propIsGiven(node, matchNode, "equalsToken") && this.matchNodeWithToken(node.equalsToken!, matchNode.equalsToken!));
		const initializerMatch = this.propIsNotGiven(node, matchNode, "objectAssignmentInitializer") || (this.propIsGiven(node, matchNode, "objectAssignmentInitializer") && this.matchNodeWithNode(node.objectAssignmentInitializer!, matchNode.objectAssignmentInitializer!));

		return nameMatch && questionTokenMatch && equalsTokenMatch && initializerMatch;
	}

	/**
	 * Matches the provided node with the provided SpreadAssignment
	 * @param {Node} node
	 * @param {SpreadAssignment} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithSpreadAssignment (node: Node, matchNode: SpreadAssignment): boolean {
		// If the node is not a SpreadAssignment, return false
		if (!isSpreadAssignment(node)) return false;

		const nameMatch = this.propIsNotGiven(node, matchNode, "name") || (this.propIsGiven(node, matchNode, "name") && this.matchNodeWithPropertyName(node.name!, matchNode.name!));
		const expressionMatch = this.propIsNotGiven(node, matchNode, "expression") || (this.propIsGiven(node, matchNode, "expression") && this.matchNodeWithNode(node.expression!, matchNode.expression!));
		return nameMatch && expressionMatch;
	}

	/**
	 * Matches the provided node with the provided ParameterDeclaration
	 * @param {Node} node
	 * @param {ParameterDeclaration} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithParameterDeclaration (node: Node, matchNode: ParameterDeclaration): boolean {
		// If the node is not a ParameterDeclaration, return false
		if (!isParameter(node)) return false;

		const nameMatch = this.matchNodeWithBindingName(node.name, matchNode.name);
		const dotDotDotTokenMatch = this.propIsNotGiven(node, matchNode, "dotDotDotToken") || (this.propIsGiven(node, matchNode, "dotDotDotToken") && this.matchNodeWithToken(node.dotDotDotToken!, matchNode.dotDotDotToken!));
		const questionTokenMatch = this.propIsNotGiven(node, matchNode, "questionToken") || (this.propIsGiven(node, matchNode, "questionToken") && this.matchNodeWithToken(node.questionToken!, matchNode.questionToken!));
		const typeMatch = this.propIsNotGiven(node, matchNode, "type") || (this.propIsGiven(node, matchNode, "type") && this.matchNodeWithNode(node.type!, matchNode.type!));
		const expressionMatch = this.propIsNotGiven(node, matchNode, "initializer") || (this.propIsGiven(node, matchNode, "initializer") && this.matchNodeWithNode(node.initializer!, matchNode.initializer!));
		return nameMatch && dotDotDotTokenMatch && questionTokenMatch && typeMatch && expressionMatch;
	}

	/**
	 * Matches the provided node with the provided PropertySignature
	 * @param {Node} node
	 * @param {PropertySignature} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithPropertySignature (node: Node, matchNode: PropertySignature): boolean {
		// If the node is not a PropertySignature, return false
		if (!isPropertySignature(node)) return false;

		const nameMatch = this.matchNodeWithPropertyName(node.name, matchNode.name);
		const questionTokenMatch = this.propIsNotGiven(node, matchNode, "questionToken") || (this.propIsGiven(node, matchNode, "questionToken") && this.matchNodeWithToken(node.questionToken!, matchNode.questionToken!));
		const typeMatch = this.propIsNotGiven(node, matchNode, "type") || (this.propIsGiven(node, matchNode, "type") && this.matchNodeWithNode(node.type!, matchNode.type!));
		const initializerMatch = this.propIsNotGiven(node, matchNode, "initializer") || (this.propIsGiven(node, matchNode, "initializer") && this.matchNodeWithNode(node.initializer!, matchNode.initializer!));
		return nameMatch && questionTokenMatch && typeMatch && initializerMatch;
	}

	/**
	 * Matches the provided node with the provided ImportEqualsDeclaration
	 * @param {Node} node
	 * @param {ImportEqualsDeclaration} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithImportEqualsDeclaration (node: Node, matchNode: ImportEqualsDeclaration): boolean {
		// If the node is not a ImportEqualsDeclaration, return false
		if (!isImportEqualsDeclaration(node)) return false;

		const nameMatch = this.matchNodeWithIdentifier(node.name, matchNode.name);
		const moduleReference = this.matchNodeWithModuleReference(node.moduleReference, matchNode.moduleReference);
		return nameMatch && moduleReference;
	}

	/**
	 * Matches the provided node with the provided ImportDeclaration
	 * @param {Node} node
	 * @param {ImportDeclaration} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithImportDeclaration (node: Node, matchNode: ImportDeclaration): boolean {
		// If the node is not a ImportDeclaration, return false
		if (!isImportDeclaration(node)) return false;

		const importClauseMatch = this.propIsNotGiven(node, matchNode, "importClause") || (this.propIsGiven(node, matchNode, "importClause") && this.matchNodeWithImportClause(node.importClause!, matchNode.importClause!));
		const moduleSpecifierMatch = this.matchNodeWithNode(node.moduleSpecifier, matchNode.moduleSpecifier);
		return importClauseMatch && moduleSpecifierMatch;
	}

	/**
	 * Matches the provided node with the provided ImportClause
	 * @param {Node} node
	 * @param {ImportClause} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithImportClause (node: Node, matchNode: ImportClause): boolean {
		// If the node is not a ImportClause, return false
		if (!isImportClause(node)) return false;

		const nameMatch = this.propIsNotGiven(node, matchNode, "name") || (this.propIsGiven(node, matchNode, "name") && this.matchNodeWithIdentifier(node.name!, matchNode.name!));
		const namedBindingsMatch = this.propIsNotGiven(node, matchNode, "namedBindings") || (this.propIsGiven(node, matchNode, "namedBindings") && this.matchNodeWithNamedImportBindings(node.namedBindings!, matchNode.namedBindings!));

		return nameMatch && namedBindingsMatch;
	}

	/**
	 * Matches the provided node with the provided NamespaceExportDeclaration
	 * @param {Node} node
	 * @param {NamespaceExportDeclaration} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithNamespaceExportDeclaration (node: Node, matchNode: NamespaceExportDeclaration): boolean {
		// If the node is not a NamespaceExportDeclaration, return false
		if (!isNamespaceExportDeclaration(node)) return false;

		return this.matchNodeWithIdentifier(node.name, matchNode.name);
	}

	/**
	 * Matches the provided node with the provided ExportDeclaration
	 * @param {Node} node
	 * @param {ExportDeclaration} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithExportDeclaration (node: Node, matchNode: ExportDeclaration): boolean {
		// If the node is not a ExportDeclaration, return false
		if (!isExportDeclaration(node)) return false;

		const exportClauseMatch = this.propIsNotGiven(node, matchNode, "exportClause") || (this.propIsGiven(node, matchNode, "exportClause") && this.matchNodeWithNamedExports(node.exportClause!, matchNode.exportClause!));
		const moduleSpecifierMatch = this.propIsNotGiven(node, matchNode, "moduleSpecifier") || (this.propIsGiven(node, matchNode, "moduleSpecifier") && this.matchNodeWithNode(node.moduleSpecifier!, matchNode.moduleSpecifier!));
		const nameMatch = this.propIsNotGiven(node, matchNode, "name") || (this.propIsGiven(node, matchNode, "name") && this.matchNodeWithIdentifierOrStringLiteralOrNumericLiteral(node.name!, matchNode.name!));

		return exportClauseMatch && moduleSpecifierMatch && nameMatch;
	}

	/**
	 * Matches the provided node with the provided ExportAssignment
	 * @param {Node} node
	 * @param {ExportAssignment} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithExportAssignment (node: Node, matchNode: ExportAssignment): boolean {
		// If the node is not a ExportAssignment, return false
		if (!isExportAssignment(node)) return false;

		const exportClauseMatch = this.matchNodeWithNode(node.expression!, matchNode.expression);
		const isExportEqualsMatch = node.isExportEquals === matchNode.isExportEquals;
		const nameMatch = this.propIsNotGiven(node, matchNode, "name") || (this.propIsGiven(node, matchNode, "name") && this.matchNodeWithIdentifierOrStringLiteralOrNumericLiteral(node.name!, matchNode.name!));

		return exportClauseMatch && isExportEqualsMatch && nameMatch;
	}

	/**
	 * Matches the provided node with the provided NamedExports
	 * @param {Node} node
	 * @param {NamedExports} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithNamedExports (node: Node, matchNode: NamedExports): boolean {
		// If the node is not a NamedExports, return false
		if (!isNamedExports(node)) return false;

		return this.matchNodeWithExportSpecifiers(node.elements, matchNode.elements);
	}

	/**
	 * Matches the provided node with the provided NamespaceImport
	 * @param {Node} node
	 * @param {NamespaceImport} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithNamespaceImport (node: Node, matchNode: NamespaceImport): boolean {
		// If the node is not a NamespaceImport, return false
		if (!isNamespaceImport(node)) return false;

		return this.matchNodeWithIdentifier(node.name, matchNode.name);
	}

	/**
	 * Matches the provided node with the provided NamedImports
	 * @param {Node} node
	 * @param {NamedImports} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithNamedImports (node: Node, matchNode: NamedImports): boolean {
		// If the node is not a NamedImports, return false
		if (!isNamedImports(node)) return false;

		return this.matchNodeWithImportSpecifiers(node.elements, matchNode.elements);
	}

	/**
	 * Matches the provided node with the provided Token
	 * @template TKind
	 * @param {Node} node
	 * @param {Token<TKind>} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithToken<TKind extends SyntaxKind> (node: Node, matchNode: Token<TKind>): boolean {
		// If the provided Node is not a token, return false
		if (!isToken(node)) return false;
		return node.kind === matchNode.kind;
	}

	/**
	 * Matches the provided node with the provided NodeArray of ImportSpecifiers
	 * @param {Node} node
	 * @param {NodeArray<ImportSpecifier>} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithImportSpecifiers (node: NodeArray<Node>, matchNode: NodeArray<ImportSpecifier>): boolean {
		// Return false if they don't have the same amount of elements
		if (node.length !== matchNode.length) return false;
		return matchNode.every(element => node.some(nodeElement => this.matchNodeWithImportSpecifier(nodeElement, element)));
	}

	/**
	 * Matches the provided node with the provided NodeArray of ExportSpecifier
	 * @param {Node} node
	 * @param {NodeArray<ExportSpecifier>} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithExportSpecifiers (node: NodeArray<Node>, matchNode: NodeArray<ExportSpecifier>): boolean {
		// Return false if they don't have the same amount of elements
		if (node.length !== matchNode.length) return false;
		return matchNode.every(element => node.some(nodeElement => this.matchNodeWithExportSpecifier(nodeElement, element)));
	}

	/**
	 * Matches the provided node with the provided NodeArray of TypeParameterDeclarations
	 * @param {Node} node
	 * @param {NodeArray<TypeParameterDeclaration>} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithTypeParameterDeclarations (node: NodeArray<Node>, matchNode: NodeArray<TypeParameterDeclaration>): boolean {
		// Return false if they don't have the same amount of elements
		if (node.length !== matchNode.length) return false;
		return matchNode.every(element => node.some(nodeElement => this.matchNodeWithTypeParameterDeclaration(nodeElement, element)));
	}

	/**
	 * Matches the provided node with the provided NodeArray of ExpressionWithTypeArgumentss
	 * @param {Node} node
	 * @param {NodeArray<ExpressionWithTypeArguments>} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithExpressionWithTypeArgumentss (node: NodeArray<Node>, matchNode: NodeArray<ExpressionWithTypeArguments>): boolean {
		// Return false if they don't have the same amount of elements
		if (node.length !== matchNode.length) return false;
		return matchNode.every(element => node.some(nodeElement => this.matchNodeWithExpressionWithTypeArguments(nodeElement, element)));
	}

	/**
	 * Matches the provided node with the provided NodeArray of ParameterDeclaration
	 * @param {Node} node
	 * @param {NodeArray<ParameterDeclaration>} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithParameterDeclarations (node: NodeArray<Node>, matchNode: NodeArray<ParameterDeclaration>): boolean {
		// Return false if they don't have the same amount of elements
		if (node.length !== matchNode.length) return false;
		return matchNode.every(element => node.some(nodeElement => this.matchNodeWithParameterDeclaration(nodeElement, element)));
	}

	/**
	 * Matches the provided node with the provided OmittedExpression
	 * @param {Node} node
	 * @param {OmittedExpression} _matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithOmittedExpression (node: Node, _matchNode: OmittedExpression): boolean {
		return isOmittedExpression(node);
	}

	/**
	 * Matches the provided node with the provided BindingElement
	 * @param {Node} node
	 * @param {BindingElement} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithBindingElement (node: Node, matchNode: BindingElement): boolean {
		// If the node is not a BindingElement, return false
		if (!isBindingElement(node)) return false;
		const matchedName = this.matchNodeWithBindingName(node.name, matchNode.name);
		const matchedPropertyName = this.propIsNotGiven(node, matchNode, "propertyName") || (this.propIsGiven(node, matchNode, "propertyName") && this.matchNodeWithPropertyName(node.propertyName!, matchNode.propertyName!));
		const matchedInitializer = this.propIsNotGiven(node, matchNode, "initializer") || (this.propIsGiven(node, matchNode, "initializer") && this.matchNodeWithNode(node.initializer!, matchNode.initializer!));
		return matchedName && matchedPropertyName && matchedInitializer;
	}

	/**
	 * Matches the provided node with the provided VariableDeclaration
	 * @param {Node} node
	 * @param {VariableDeclaration} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithVariableDeclaration (node: Node, matchNode: VariableDeclaration): boolean {
		// If the node is not a VariableDeclaration, return false
		if (!isVariableDeclaration(node)) return false;
		const matchedName = this.matchNodeWithBindingName(node.name, matchNode.name);
		const matchedType = this.propIsNotGiven(node, matchNode, "type") || (this.propIsGiven(node, matchNode, "type") && this.matchNodeWithNode(node.type!, matchNode.type!));
		const matchedInitializer = this.propIsNotGiven(node, matchNode, "initializer") || (this.propIsGiven(node, matchNode, "initializer") && this.matchNodeWithNode(node.initializer!, matchNode.initializer!));
		return matchedName && matchedType && matchedInitializer;
	}

	/**
	 * Matches the provided node with the provided VariableDeclarationList
	 * @param {Node} node
	 * @param {VariableDeclarationList} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithVariableDeclarationList (node: Node, matchNode: VariableDeclarationList): boolean {
		// If the node is not a VariableDeclarationList, return false
		if (!isVariableDeclarationList(node)) return false;
		return this.matchNodeWithVariableDeclarations(node.declarations, matchNode.declarations);
	}

	/**
	 * Matches the provided node with the provided BindingName
	 * @param {Node} node
	 * @param {BindingName} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithBindingName (node: Node, matchNode: BindingName): boolean {
		// If the node is not a BindingName, return false
		if (!isBindingName(node)) return false;

		if (isIdentifier(matchNode)) return this.matchNodeWithIdentifier(node, matchNode);
		else if (this.isBindingPattern(matchNode)) return this.matchNodeWithBindingPattern(node, matchNode);

		// The two nodes are different kinds of nodes. Return false
		return false;
	}

	/**
	 * Matches the provided node with the provided DeclarationName
	 * @param {Node} node
	 * @param {DeclarationName} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithDeclarationName (node: Node, matchNode: DeclarationName): boolean {
		// If the node is not a DeclarationName, return false
		if (!this.isDeclarationName(node)) return false;

		// If both nodes are identifiers, call matchNodeWithIdentifier
		if (isIdentifier(matchNode)) return this.matchNodeWithIdentifier(node, matchNode);

		// If both nodes are StringLiterals, call matchNodeWithStringLiteral
		else if (isStringLiteral(matchNode)) return this.matchNodeWithStringLiteral(node, matchNode);

		// If both nodes are NumericLiterals, call matchNodeWithNumericLiteral
		else if (isNumericLiteral(matchNode)) return this.matchNodeWithNumericLiteral(node, matchNode);

		// If both nodes are ComputedPropertyNames, call matchNodeWithComputedPropertyName
		else if (isComputedPropertyName(matchNode)) return this.matchNodeWithComputedPropertyName(node, matchNode);

		// If both nodes are BindingPatterns, call matchNodeWithBindingPattern
		else if (this.isBindingPattern(matchNode)) return this.matchNodeWithBindingPattern(node, matchNode);

		// The two nodes are different kinds of nodes. Return false
		return false;
	}

	/**
	 * Matches the provided node with the provided EntityName
	 * @param {Node} node
	 * @param {EntityName} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithPropertyName (node: Node, matchNode: PropertyName): boolean {
		// If the node is not a PropertyName, return false
		if (!isPropertyName(node)) return false;

		// If both nodes are identifiers, call matchNodeWithIdentifier
		if (isIdentifier(matchNode)) return this.matchNodeWithIdentifier(node, matchNode);

		// If both nodes are StringLiterals, call matchNodeWithStringLiteral
		else if (isStringLiteral(matchNode)) return this.matchNodeWithStringLiteral(node, matchNode);

		// If both nodes are NumericLiterals, call matchNodeWithNumericLiteral
		else if (isNumericLiteral(matchNode)) return this.matchNodeWithNumericLiteral(node, matchNode);

		// If both nodes are ComputedPropertyNames, call matchNodeWithComputedPropertyName
		else if (isComputedPropertyName(matchNode)) return this.matchNodeWithComputedPropertyName(node, matchNode);

		// The two nodes are different kinds of nodes. Return false
		return false;
	}

	/**
	 * Matches the provided node with the provided StringLiteral
	 * @param {Node} node
	 * @param {StringLiteral} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithStringLiteral (node: Node, matchNode: StringLiteral): boolean {
		// If the node is not a StringLiteral, return false
		if (!isStringLiteral(node)) return false;
		return node.text === matchNode.text;
	}

	/**
	 * Matches the provided node with the provided RegularExpressionLiteral
	 * @param {Node} node
	 * @param {RegularExpressionLiteral} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithRegularExpressionLiteral (node: Node, matchNode: RegularExpressionLiteral): boolean {
		// If the node is not a RegularExpressionLiteral, return false
		if (!isRegularExpressionLiteral(node)) return false;
		return node.text === matchNode.text;
	}

	/**
	 * Matches the provided node with the provided NoSubstitutionTemplateLiteral
	 * @param {Node} node
	 * @param {NoSubstitutionTemplateLiteral} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithNoSubstitutionTemplateLiteral (node: Node, matchNode: NoSubstitutionTemplateLiteral): boolean {
		// If the node is not a NoSubstitutionTemplateLiteral, return false
		if (!isNoSubstitutionTemplateLiteral(node)) return false;
		return node.text === matchNode.text;
	}

	/**
	 * Matches the provided node with the provided TemplateHead
	 * @param {Node} node
	 * @param {TemplateHead} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithTemplateHead (node: Node, matchNode: TemplateHead): boolean {
		// If the node is not a TemplateHead, return false
		if (!isTemplateHead(node)) return false;
		return node.text === matchNode.text;
	}

	/**
	 * Matches the provided node with the provided TemplateMiddle
	 * @param {Node} node
	 * @param {TemplateMiddle} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithTemplateMiddle (node: Node, matchNode: TemplateMiddle): boolean {
		// If the node is not a TemplateMiddle, return false
		if (!isTemplateMiddle(node)) return false;
		return node.text === matchNode.text;
	}

	/**
	 * Matches the provided node with the provided TemplateTail
	 * @param {Node} node
	 * @param {TemplateTail} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithTemplateTail (node: Node, matchNode: TemplateTail): boolean {
		// If the node is not a TemplateTail, return false
		if (!isTemplateTail(node)) return false;
		return node.text === matchNode.text;
	}

	/**
	 * Matches the provided node with the provided StringLiteral
	 * @param {Node} node
	 * @param {StringLiteral} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithNumericLiteral (node: Node, matchNode: NumericLiteral): boolean {
		// If the node is not a NumericLiteral, return false
		if (!isNumericLiteral(node)) return false;
		return node.text === matchNode.text;
	}

	/**
	 * Matches the provided node with the provided TemplateExpression
	 * @param {Node} node
	 * @param {TemplateExpression} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithTemplateExpression (node: Node, matchNode: TemplateExpression): boolean {
		// If the node is not a TemplateExpression, return false
		if (!isTemplateExpression(node)) return false;

		const headMatch = this.matchNodeWithTemplateHead(node.head, matchNode.head);
		const templateSpansMatch = this.matchNodeWithTemplateSpans(node.templateSpans, matchNode.templateSpans);

		return headMatch && templateSpansMatch;
	}

	/**
	 * Matches the provided node with the provided ParenthesizedExpression
	 * @param {Node} node
	 * @param {ParenthesizedExpression} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithParenthesizedExpression (node: Node, matchNode: ParenthesizedExpression): boolean {
		// If the node is not a ParenthesizedExpression, return false
		if (!isParenthesizedExpression(node)) return false;

		return this.matchNodeWithNode(node.expression, matchNode.expression);
	}

	/**
	 * Matches the provided node with the provided EmptyStatement
	 * @param {Node} node
	 * @param {EmptyStatement} _matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithEmptyStatement (node: Node, _matchNode: EmptyStatement): boolean {
		return isEmptyStatement(node);
	}

	/**
	 * Matches the provided node with the provided DebuggerStatement
	 * @param {Node} node
	 * @param {DebuggerStatement} _matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithDebuggerStatement (node: Node, _matchNode: DebuggerStatement): boolean {
		return isDebuggerStatement(node);
	}

	/**
	 * Matches the provided node with the provided ArrayLiteralExpression
	 * @param {Node} node
	 * @param {ArrayLiteralExpression} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithArrayLiteralExpression (node: Node, matchNode: ArrayLiteralExpression): boolean {
		// If the node is not a ArrayLiteralExpression, return false
		if (!isArrayLiteralExpression(node)) return false;

		return this.matchNodeWithNodes(node.elements, matchNode.elements);
	}

	/**
	 * Matches the provided node with the provided SpreadElement
	 * @param {Node} node
	 * @param {SpreadElement} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithSpreadElement (node: Node, matchNode: SpreadElement): boolean {
		// If the node is not a SpreadElement, return false
		if (!isSpreadElement(node)) return false;

		return this.matchNodeWithNode(node.expression, matchNode.expression);
	}

	/**
	 * Matches the provided node with the provided ObjectLiteralExpression
	 * @param {Node} node
	 * @param {ObjectLiteralExpression} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithObjectLiteralExpression (node: Node, matchNode: ObjectLiteralExpression): boolean {
		// If the node is not a ObjectLiteralExpression, return false
		if (!isObjectLiteralExpression(node)) return false;

		return this.matchNodeWithObjectLiteralElementLikes(node.properties, matchNode.properties);
	}

	/**
	 * Matches the provided node with the provided ObjectLiteralElementLike
	 * @param {Node} node
	 * @param {ObjectLiteralElementLike} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithObjectLiteralElementLike (node: Node, matchNode: ObjectLiteralElementLike): boolean {
		// If the node is not a ObjectLiteralElementLike, return false
		if (!isObjectLiteralElementLike(node)) return false;

		if (isPropertyAssignment(matchNode)) {
			return this.matchNodeWithPropertyAssignment(node, matchNode);
		}

		else if (isShorthandPropertyAssignment(matchNode)) {
			return this.matchNodeWithShorthandPropertyAssignment(node, matchNode);
		}

		else if (isSpreadAssignment(matchNode)) {
			return this.matchNodeWithSpreadAssignment(node, matchNode);
		}

		else if (isMethodDeclaration(matchNode)) {
			return this.matchNodeWithMethodDeclaration(node, matchNode);
		}

		else if (isAccessor(matchNode)) {
			return this.matchNodeWithAccessorDeclaration(node, matchNode);
		}

		return false;
	}

	/**
	 * Matches the provided node with the provided JsxAttributeLike
	 * @param {Node} node
	 * @param {JsxAttributeLike} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithJsxAttributeLike (node: Node, matchNode: JsxAttributeLike): boolean {
		// If the node is not a JsxAttributeLike, return false
		if (!isJsxAttribute(node) && !isJsxSpreadAttribute(node)) return false;

		if (isJsxAttribute(matchNode)) {
			return this.matchNodeWithJsxAttribute(node, matchNode);
		}

		else if (isJsxSpreadAttribute(matchNode)) {
			return this.matchNodeWithJsxSpreadAttribute(node, matchNode);
		}

		return false;
	}

	/**
	 * Matches the provided node with the provided identifier
	 * @param {Node} node
	 * @param {Identifier} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithIdentifier (node: Node, matchNode: Identifier): boolean {
		// If the node is not an identifier, return false
		if (!isIdentifier(node)) return false;
		return node.text === matchNode.text;
	}

	/**
	 * Matches the provided node with the provided QualifiedName
	 * @param {Node} node
	 * @param {QualifiedName} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithQualifiedName (node: Node, matchNode: QualifiedName): boolean {
		// If the node is not a QualifiedName, return false
		if (!isQualifiedName(node)) return false;
		return this.matchNodeWithEntityName(node.left, matchNode.left) && this.matchNodeWithIdentifier(node.right, matchNode.right);
	}

	/**
	 * Matches the provided node with the provided EntityName
	 * @param {Node} node
	 * @param {EntityName} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithEntityName (node: Node, matchNode: EntityName): boolean {
		// If the node is not a PropertyName, return false
		if (!isEntityName(node)) return false;

		// If both nodes are identifiers, call matchNodeWithIdentifier
		if (isIdentifier(matchNode)) return this.matchNodeWithIdentifier(node, matchNode);

		// If both nodes are qualified names, call matchNodeWithQualifiedName
		else if (isQualifiedName(matchNode)) return this.matchNodeWithQualifiedName(node, matchNode);

		// The two nodes are different kinds of nodes. Return false
		return false;
	}

	/**
	 * Matches the provided node with the provided ForInitializer
	 * @param {Node} node
	 * @param {ForInitializer} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithForInitializer (node: Node, matchNode: ForInitializer): boolean {

		if (isVariableDeclarationList(matchNode)) {
			return this.matchNodeWithVariableDeclarationList(node, matchNode);
		}

		return this.matchNodeWithNode(node, matchNode);
	}

	/**
	 * Matches the provided node with the provided CaseOrDefaultClause
	 * @param {Node} node
	 * @param {CaseOrDefaultClause} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithCaseOrDefaultClause (node: Node, matchNode: CaseOrDefaultClause): boolean {
		// If the node is not a CaseOrDefaultClause, return false
		if (!isCaseOrDefaultClause(node)) return false;

		if (isCaseClause(matchNode)) return this.matchNodeWithCaseClause(node, matchNode);
		else if (isDefaultClause(matchNode)) return this.matchNodeWithDefaultClause(node, matchNode);

		// The two nodes are different kinds of nodes. Return false
		return false;
	}

	/**
	 * Matches the provided node with the provided AccessorDeclaration
	 * @param {Node} node
	 * @param {AccessorDeclaration} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithAccessorDeclaration (node: Node, matchNode: AccessorDeclaration): boolean {
		// If the node is not a AccessorDeclaration, return false
		if (!isAccessor(node)) return false;

		if (isGetAccessorDeclaration(matchNode)) return this.matchNodeWithGetAccessorDeclaration(node, matchNode);
		else if (isSetAccessorDeclaration(matchNode)) return this.matchNodeWithSetAccessorDeclaration(node, matchNode);

		// The two nodes are different kinds of nodes. Return false
		return false;
	}

	/**
	 * Matches the provided node with the provided ModuleName
	 * @param {Node} node
	 * @param {ModuleName} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithModuleName (node: Node, matchNode: ModuleName): boolean {
		// If the node is not a ModuleName, return false
		if (!isIdentifier(node) && !isStringLiteral(node)) return false;

		if (isIdentifier(matchNode)) return this.matchNodeWithIdentifier(node, matchNode);
		else if (isStringLiteral(matchNode)) return this.matchNodeWithStringLiteral(node, matchNode);

		// The two nodes are different kinds of nodes. Return false
		return false;
	}

	/**
	 * Returns true if the provided Node is a NamespaceDeclaration
	 * @param {Node} node
	 * @returns {boolean}
	 */
	private isNamespaceDeclaration (node: Node): node is NamespaceDeclaration {
		return isModuleDeclaration(node);
	}

	/**
	 * Returns true if the provided Node is a JSDocNamespaceDeclaration
	 * @param {Node} node
	 * @returns {boolean}
	 */
	private isJSDocNamespaceDeclaration (node: Node): node is JSDocNamespaceDeclaration {
		return isModuleDeclaration(node);
	}

	/**
	 * Returns true if the provided Node is a NamespaceBody
	 * @param {Node} node
	 * @returns {boolean}
	 */
	private isNamespaceBody (node: Node): node is NamespaceBody {
		return isModuleBlock(node) || this.isNamespaceDeclaration(node);
	}

	/**
	 * Returns true if the provided Node is a NamespaceBody
	 * @param {Node} node
	 * @returns {boolean}
	 */
	private isJSDocNamespaceBody (node: Node): node is JSDocNamespaceBody {
		return isIdentifier(node) || isModuleDeclaration(node);
	}

	/**
	 * Returns true if the provided Node is a ModuleBody
	 * @param {Node} node
	 * @returns {boolean}
	 */
	private isModuleBody (node: Node): node is ModuleBody {
		return this.isNamespaceBody(node) || this.isJSDocNamespaceBody(node);
	}

	/**
	 * Matches the provided node with the provided JSDocNamespaceDeclaration
	 * @param {Node} node
	 * @param {JSDocNamespaceDeclaration} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithJSDocNamespaceDeclaration (node: Node, matchNode: JSDocNamespaceDeclaration): boolean {
		// If the node is not a JSDocNamespaceDeclaration, return false
		if (!this.isJSDocNamespaceDeclaration(node)) return false;

		const nameMatch = this.matchNodeWithIdentifier(node.name, matchNode.name);
		const bodyMatch = this.matchNodeWithJSDocNamespaceBody(node.body, matchNode.body);

		return nameMatch && bodyMatch;
	}

	/**
	 * Matches the provided node with the provided NamespaceDeclaration
	 * @param {Node} node
	 * @param {NamespaceDeclaration} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithNamespaceDeclaration (node: Node, matchNode: NamespaceDeclaration): boolean {
		// If the node is not a NamespaceDeclaration, return false
		if (!this.isNamespaceDeclaration(node)) return false;

		const nameMatch = this.matchNodeWithIdentifier(node.name, matchNode.name);
		const bodyMatch = this.matchNodeWithNamespaceBody(node.body, matchNode.body);

		return nameMatch && bodyMatch;
	}

	/**
	 * Matches the provided node with the provided NamespaceBody
	 * @param {Node} node
	 * @param {NamespaceBody} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithNamespaceBody (node: Node, matchNode: NamespaceBody): boolean {
		// If the node is not a ModuleName, return false
		if (!this.isNamespaceBody(node)) return false;

		if (isModuleBlock(matchNode)) return this.matchNodeWithModuleBlock(node, matchNode);
		else if (this.isNamespaceDeclaration(matchNode)) return this.matchNodeWithNamespaceDeclaration(node, matchNode);

		// The two nodes are different kinds of nodes. Return false
		return false;
	}

	/**
	 * Matches the provided node with the provided JSDocNamespaceBody
	 * @param {Node} node
	 * @param {JSDocNamespaceBody} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithJSDocNamespaceBody (node: Node, matchNode: JSDocNamespaceBody): boolean {
		// If the node is not a ModuleName, return false
		if (!this.isJSDocNamespaceBody(node)) return false;

		if (isIdentifier(matchNode)) return this.matchNodeWithIdentifier(node, matchNode);
		else if (this.isJSDocNamespaceDeclaration(matchNode)) return this.matchNodeWithJSDocNamespaceDeclaration(node, matchNode);

		// The two nodes are different kinds of nodes. Return false
		return false;
	}

	/**
	 * Matches the provided node with the provided ModuleBody
	 * @param {Node} node
	 * @param {ModuleBody} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithModuleBody (node: Node, matchNode: ModuleBody): boolean {
		// If the node is not a ModuleName, return false
		if (!this.isModuleBody(node)) return false;

		if (this.isNamespaceBody(matchNode)) return this.matchNodeWithNamespaceBody(node, matchNode);
		else if (this.isJSDocNamespaceBody(matchNode)) return this.matchNodeWithJSDocNamespaceBody(node, matchNode);

		// The two nodes are different kinds of nodes. Return false
		return false;
	}

	/**
	 * Matches the provided node with the provided ModuleReference
	 * @param {Node} node
	 * @param {ModuleReference} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithModuleReference (node: Node, matchNode: ModuleReference): boolean {
		// If the node is not a ModuleReference, return false
		if (!isEntityName(node) && !isExternalModuleReference(node)) return false;

		if (isEntityName(matchNode)) return this.matchNodeWithEntityName(node, matchNode);
		else if (isExternalModuleReference(matchNode)) return this.matchNodeWithExternalModuleReference(node, matchNode);

		// The two nodes are different kinds of nodes. Return false
		return false;
	}

	/**
	 * Matches the provided node with the provided NamedImportBindings
	 * @param {Node} node
	 * @param {NamedImportBindings} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithNamedImportBindings (node: Node, matchNode: NamedImportBindings): boolean {
		// If the node is not a NamedImportBindings, return false
		if (!isNamespaceImport(node) && !isNamedImports(node)) return false;

		if (isNamespaceImport(matchNode)) return this.matchNodeWithNamespaceImport(node, matchNode);
		else if (isNamedImports(matchNode)) return this.matchNodeWithNamedImports(node, matchNode);

		// The two nodes are different kinds of nodes. Return false
		return false;
	}

	/**
	 * Matches the provided node with the provided ModuleBody|JSDocNamespaceDeclaration
	 * @param {Node} node
	 * @param {ModuleBody|JSDocNamespaceDeclaration} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithModuleBodyOrJSDocNamespaceDeclaration (node: Node, matchNode: ModuleBody|JSDocNamespaceDeclaration): boolean {
		// If the node is not a ModuleBody|JSDocNamespaceDeclaration, return false
		if (!this.isModuleBody(node) && !this.isJSDocNamespaceDeclaration(node)) return false;

		if (this.isModuleBody(matchNode)) return this.matchNodeWithModuleBody(node, matchNode);
		else if (this.isJSDocNamespaceDeclaration(matchNode)) return this.matchNodeWithJSDocNamespaceDeclaration(node, matchNode);

		// The two nodes are different kinds of nodes. Return false
		return false;
	}

	/**
	 * Matches the provided node with the provided StringLiteral|JsxExpression
	 * @param {Node} node
	 * @param {StringLiteral|JsxExpression} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithStringLiteralOrJsxExpression (node: Node, matchNode: StringLiteral|JsxExpression): boolean {
		// If the node is neither a StringLiteral nor a JsxExpression, return false
		if (!isStringLiteral(node) && !isJsxExpression(node)) return false;

		if (isStringLiteral(matchNode)) {
			return this.matchNodeWithStringLiteral(node, matchNode);
		}

		else if (isJsxExpression(matchNode)) {
			return this.matchNodeWithJsxExpression(node, matchNode);
		}

		// The two nodes are different kinds of nodes. Return false
		return false;
	}

	/**
	 * Matches the provided node with the provided TemplateMiddle|TemplateTail
	 * @param {Node} node
	 * @param {TemplateMiddle|TemplateTail} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithTemplateMiddleOrTemplateTail (node: Node, matchNode: TemplateMiddle|TemplateTail): boolean {
		// If the node is neither a TemplateMiddle nor a TemplateTail, return false
		if (!isTemplateMiddle(node) && !isTemplateTail(node)) return false;

		if (isTemplateMiddle(matchNode)) {
			return this.matchNodeWithTemplateMiddle(node, matchNode);
		}

		else if (isTemplateTail(matchNode)) {
			return this.matchNodeWithTemplateTail(node, matchNode);
		}

		// The two nodes are different kinds of nodes. Return false
		return false;
	}

	/**
	 * Matches the provided node with the provided Identifier|StringLiteral|NumericLiteral
	 * @param {Node} node
	 * @param {Identifier|StringLiteral|NumericLiteral} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithIdentifierOrStringLiteralOrNumericLiteral (node: Node, matchNode: Identifier|StringLiteral|NumericLiteral): boolean {
		// If the node is not a Identifier|StringLiteral|NumericLiteral, return false
		if (!isIdentifier(node) && !isStringLiteral(node) && !isNumericLiteral(node)) return false;

		if (isIdentifier(matchNode)) {
			return this.matchNodeWithIdentifier(node, matchNode);
		}

		else if (isStringLiteral(matchNode)) {
			return this.matchNodeWithStringLiteral(node, matchNode);
		}

		else if (isNumericLiteral(matchNode)) {
			return this.matchNodeWithNumericLiteral(node, matchNode);
		}

		// The two nodes are different kinds of nodes. Return false
		return false;
	}

	/**
	 * Matches the provided node with the provided Identifier|ThisTypeNode
	 * @param {Node} node
	 * @param {Identifier|ThisTypeNode} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithIdentifierOrThisTypeNode (node: Node, matchNode: Identifier|ThisTypeNode): boolean {
		// If the node is neither a Identifier nor a ThisTypeNode, return false
		if (!isIdentifier(node) && !isThisTypeNode(node)) return false;

		if (isIdentifier(matchNode)) {
			return this.matchNodeWithIdentifier(node, matchNode);
		}

		else if (isThisTypeNode(matchNode)) {
			return this.matchNodeWithThisTypeNode(node, matchNode);
		}

		// The two nodes are different kinds of nodes. Return false
		return false;
	}

	/**
	 * Matches the provided node with the provided Identifier|ThisTypeNode
	 * @param {Node} node
	 * @param {Identifier|ThisTypeNode} matchNode
	 * @returns {boolean}
	 */
	private matchNodeWithJsxTagNameExpression (node: Node, matchNode: JsxTagNameExpression): boolean {

		if (isPropertyAccessExpression(matchNode)) {
			return this.matchNodeWithPropertyAccessExpression(node, matchNode);
		}

		return this.matchNodeWithNode(node, matchNode);
	}
}