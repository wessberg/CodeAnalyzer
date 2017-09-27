import {INodeUpdaterUtil} from "./i-node-updater-util";
import {AmdDependency, ArrayBindingElement, ArrayBindingPattern, ArrayLiteralExpression, ArrayTypeNode, ArrowFunction, AsExpression, AwaitExpression, BinaryExpression, BindingElement, BindingName, Block, BooleanLiteral, BreakStatement, CallExpression, CallSignatureDeclaration, CaseBlock, CaseClause, CatchClause, ClassDeclaration, ClassElement, ClassExpression, ClassLikeDeclaration, ComputedPropertyName, ConciseBody, ConditionalExpression, ConstructorDeclaration, ConstructorTypeNode, ConstructSignatureDeclaration, ContinueStatement, DebuggerStatement, Declaration, DeclarationName, DeclarationStatement, Decorator, DefaultClause, DeleteExpression, DoStatement, ElementAccessExpression, EmptyStatement, EntityName, EnumDeclaration, EnumMember, ExportAssignment, ExportDeclaration, ExportSpecifier, Expression, ExpressionStatement, ExpressionWithTypeArguments, ExternalModuleReference, FileReference, ForInStatement, ForOfStatement, ForStatement, FunctionBody, FunctionDeclaration, FunctionExpression, FunctionLikeDeclarationBase, FunctionTypeNode, GetAccessorDeclaration, HeritageClause, Identifier, IfStatement, ImportClause, ImportDeclaration, ImportEqualsDeclaration, ImportExpression, ImportSpecifier, IndexedAccessTypeNode, IndexSignatureDeclaration, InterfaceDeclaration, IntersectionTypeNode, isArrayBindingPattern, isArrayLiteralExpression, isArrayTypeNode, isArrowFunction, isAsExpression, isAwaitExpression, isBinaryExpression, isBindingElement, isBlock, isBreakStatement, isCallExpression, isCallSignatureDeclaration, isCaseBlock, isCaseClause, isCatchClause, isClassDeclaration, isClassExpression, isComputedPropertyName, isConditionalExpression, isConstructorDeclaration, isConstructorTypeNode, isConstructSignatureDeclaration, isContinueStatement, isDebuggerStatement, isDecorator, isDefaultClause, isDeleteExpression, isDoStatement, isElementAccessExpression, isEmptyStatement, isEnumDeclaration, isEnumMember, isExportAssignment, isExportDeclaration, isExportSpecifier, isExpressionStatement, isExpressionWithTypeArguments, isExternalModuleReference, isForInStatement, isForOfStatement, isForStatement, isFunctionDeclaration, isFunctionExpression, isFunctionTypeNode, isGetAccessorDeclaration, isHeritageClause, isIdentifier, isIfStatement, isImportClause, isImportDeclaration, isImportEqualsDeclaration, isImportSpecifier, isIndexedAccessTypeNode, isIndexSignatureDeclaration, isInterfaceDeclaration, isIntersectionTypeNode, isJsxAttribute, isJsxAttributes, isJsxClosingElement, isJsxElement, isJsxExpression, isJsxOpeningElement, isJsxSelfClosingElement, isJsxSpreadAttribute, isJsxText, isLabeledStatement, isLiteralTypeNode, isMappedTypeNode, isMetaProperty, isMethodDeclaration, isMethodSignature, isMissingDeclaration, isModifier, isModuleBlock, isModuleDeclaration, isNamedExports, isNamedImports, isNamespaceExportDeclaration, isNamespaceImport, isNewExpression, isNonNullExpression, isNoSubstitutionTemplateLiteral, isNumericLiteral, isObjectBindingPattern, isObjectLiteralExpression, isOmittedExpression, isParameter, isParenthesizedExpression, isParenthesizedTypeNode, isPropertyAccessExpression, isPropertyAssignment, isPropertyDeclaration, isPropertySignature, isQualifiedName, isRegularExpressionLiteral, isReturnStatement, isSemicolonClassElement, isSetAccessorDeclaration, isShorthandPropertyAssignment, isSourceFile, isSpreadAssignment, isSpreadElement, isStringLiteral, isSwitchStatement, isTaggedTemplateExpression, isTemplateExpression, isTemplateHead, isTemplateMiddle, isTemplateSpan, isTemplateTail, isThisTypeNode, isThrowStatement, isToken, isTryStatement, isTupleTypeNode, isTypeAliasDeclaration, isTypeAssertion, isTypeLiteralNode, isTypeOfExpression, isTypeOperatorNode, isTypeParameterDeclaration, isTypePredicateNode, isTypeQueryNode, isTypeReferenceNode, isUnionTypeNode, isVariableDeclaration, isVariableDeclarationList, isVariableStatement, isVoidExpression, isWhileStatement, isWithStatement, isYieldExpression, IterationStatement, JSDocNamespaceDeclaration, JsxAttribute, JsxAttributes, JsxClosingElement, JsxElement, JsxExpression, JsxOpeningElement, JsxSelfClosingElement, JsxSpreadAttribute, JsxText, KeywordTypeNode, LabeledStatement, LeftHandSideExpression, LiteralExpression, LiteralLikeNode, LiteralTypeNode, MappedTypeNode, MemberExpression, MetaProperty, MethodDeclaration, MethodSignature, MissingDeclaration, Modifier, ModuleBlock, ModuleDeclaration, NamedDeclaration, NamedExports, NamedImports, NamespaceDeclaration, NamespaceExportDeclaration, NamespaceImport, NewExpression, Node, NodeArray, NonNullExpression, NoSubstitutionTemplateLiteral, NullLiteral, NumericLiteral, ObjectBindingPattern, ObjectLiteralElement, ObjectLiteralElementLike, ObjectLiteralExpression, ObjectLiteralExpressionBase, OmittedExpression, ParameterDeclaration, ParenthesizedExpression, ParenthesizedTypeNode, PartiallyEmittedExpression, PostfixUnaryExpression, PrefixUnaryExpression, PrimaryExpression, PropertyAccessExpression, PropertyAssignment, PropertyDeclaration, PropertyName, PropertySignature, QualifiedName, RegularExpressionLiteral, ReturnStatement, SemicolonClassElement, SetAccessorDeclaration, ShorthandPropertyAssignment, SignatureDeclaration, SourceFile, SpreadAssignment, SpreadElement, Statement, StringLiteral, SuperExpression, SwitchStatement, Symbol, SyntaxKind, TaggedTemplateExpression, TemplateExpression, TemplateHead, TemplateMiddle, TemplateSpan, TemplateTail, TextRange, ThisExpression, ThisTypeNode, ThrowStatement, Token, TryStatement, TupleTypeNode, TypeAliasDeclaration, TypeAssertion, TypeElement, TypeLiteralNode, TypeNode, TypeOfExpression, TypeOperatorNode, TypeParameterDeclaration, TypePredicateNode, TypeQueryNode, TypeReferenceNode, UnaryExpression, UnionTypeNode, UpdateExpression, VariableDeclaration, VariableDeclarationList, VariableStatement, VoidExpression, WhileStatement, WithStatement, YieldExpression} from "typescript";
import {INodeMatcherUtil} from "../node-matcher-util/i-node-matcher-util";
import {NodeMatcherItem} from "../node-matcher-util/node-matcher-item";
import {ITypescriptLanguageService} from "@wessberg/typescript-language-service";
import {IPrinter} from "../../ast/printer/i-printer";
import {IPredicateUtil} from "../predicate-util/i-predicate-util";

/**
 * A class that helps with updating (mutating) nodes in-place
 */
export class NodeUpdaterUtil implements INodeUpdaterUtil {
	private PRESERVE_KEYS_ON_STRIP: Set<string> = new Set(["parent"]);

	constructor (private nodeMatcherUtil: INodeMatcherUtil,
							 private predicateUtil: IPredicateUtil,
							 private printer: IPrinter,
							 private languageService: ITypescriptLanguageService) {
	}

	/**
	 * Updates a Node in-place. This means it will be deep-mutated
	 * @param {T} newNode
	 * @param {T} existing
	 * @returns {T}
	 */
	public updateInPlace<T extends Node> (newNode: T, existing: T): T {

		// Perform an in-place update of the Node
		this.update(newNode, existing);

		// Take the SourceFile
		const sourceFile = existing.getSourceFile();

		// Update it in the LanguageService
		const path = sourceFile.fileName;
		const content = this.printer.print(sourceFile);
		const newSourceFile = this.languageService.addFile({path, content});

		// Update the existing SourceFile (primarily for positions)
		this.update(newSourceFile, sourceFile);
		return existing;
	}

	/**
	 * Updates a Node
	 * @param {T} newNode
	 * @param {T} existing
	 * @returns {T}
	 */
	private update<T extends Node> (newNode: T, existing: T): T {
		/*tslint:disable:no-any*/
		if (newNode.kind !== existing.kind) throw new TypeError(`${this.constructor.name} could not update a node of kind ${SyntaxKind[existing.kind]}: The new node was not of an identical kind: ${SyntaxKind[newNode.kind]}`);

		// If the kinds are different, remove all properties from the existing node and all of the properties of the new Node
		if (existing.kind !== newNode.kind) {
			this.stripAllKeysOfNode(existing);
			this.addAllKeysOfNode(newNode, existing);
		} else {
			if (isSourceFile(newNode) && isSourceFile(existing)) {
				return <T><any> this.updateSourceFile(newNode, existing);
			}

			else if (isToken(newNode) && isToken(existing)) {
				return <T><any> this.updateToken(newNode, existing);
			}

			else if (isDecorator(newNode) && isDecorator(existing)) {
				return <T><any> this.updateDecorator(newNode, existing);
			}

			else if (isModifier(newNode) && isModifier(existing)) {
				return <T><any> this.updateModifier(newNode, existing);
			}

			else if (isClassDeclaration(newNode) && isClassDeclaration(existing)) {
				return <T><any> this.updateClassDeclaration(newNode, existing);
			}

			else if (isIdentifier(newNode) && isIdentifier(existing)) {
				return <T><any> this.updateIdentifier(newNode, existing);
			}

			else if (isStringLiteral(newNode) && isStringLiteral(existing)) {
				return <T><any> this.updateStringLiteral(newNode, existing);
			}

			else if (isNumericLiteral(newNode) && isNumericLiteral(existing)) {
				return <T><any> this.updateNumericLiteral(newNode, existing);
			}

			else if (isTypeParameterDeclaration(newNode) && isTypeParameterDeclaration(existing)) {
				return <T><any> this.updateTypeParameterDeclaration(newNode, existing);
			}

			else if (isHeritageClause(newNode) && isHeritageClause(existing)) {
				return <T><any> this.updateHeritageClause(newNode, existing);
			}

			else if (isExpressionWithTypeArguments(newNode) && isExpressionWithTypeArguments(existing)) {
				return <T><any> this.updateExpressionWithTypeArguments(newNode, existing);
			}

			else if (isPropertyDeclaration(newNode) && isPropertyDeclaration(existing)) {
				return <T><any> this.updatePropertyDeclaration(newNode, existing);
			}

			else if (isTypeReferenceNode(newNode) && isTypeReferenceNode(existing)) {
				return <T><any> this.updateTypeReferenceNode(newNode, existing);
			}

			else if (isConstructorDeclaration(newNode) && isConstructorDeclaration(existing)) {
				return <T><any> this.updateConstructorDeclaration(newNode, existing);
			}

			else if (isBlock(newNode) && isBlock(existing)) {
				return <T><any> this.updateBlock(newNode, existing);
			}

			else if (isParameter(newNode) && isParameter(existing)) {
				return <T><any> this.updateParameterDeclaration(newNode, existing);
			}

			else if (isBindingElement(newNode) && isBindingElement(existing)) {
				return <T><any> this.updateBindingElement(newNode, existing);
			}

			else if (isObjectBindingPattern(newNode) && isObjectBindingPattern(existing)) {
				return <T><any> this.updateObjectBindingPattern(newNode, existing);
			}

			else if (isArrayBindingPattern(newNode) && isArrayBindingPattern(existing)) {
				return <T><any> this.updateArrayBindingPattern(newNode, existing);
			}

			else if (isOmittedExpression(newNode) && isOmittedExpression(existing)) {
				return <T><any> this.updateOmittedExpression(newNode, existing);
			}

			else if (isExpressionStatement(newNode) && isExpressionStatement(existing)) {
				return <T><any> this.updateExpressionStatement(newNode, existing);
			}

			else if (isCallExpression(newNode) && isCallExpression(existing)) {
				return <T><any> this.updateCallExpression(newNode, existing);
			}

			else if (isPropertyAccessExpression(newNode) && isPropertyAccessExpression(existing)) {
				return <T><any> this.updatePropertyAccessExpression(newNode, existing);
			}

			else if (isElementAccessExpression(newNode) && isElementAccessExpression(existing)) {
				return <T><any> this.updateElementAccessExpression(newNode, existing);
			}

			else if (isFunctionTypeNode(newNode) && isFunctionTypeNode(existing)) {
				return <T><any> this.updateFunctionTypeNode(newNode, existing);
			}

			else if (isObjectLiteralExpression(newNode) && isObjectLiteralExpression(existing)) {
				return <T><any> this.updateObjectLiteralExpression(newNode, existing);
			}

			else if (isPropertyAssignment(newNode) && isPropertyAssignment(existing)) {
				return <T><any> this.updatePropertyAssignment(newNode, existing);
			}

			else if (isShorthandPropertyAssignment(newNode) && isShorthandPropertyAssignment(existing)) {
				return <T><any> this.updateShorthandPropertyAssignment(newNode, existing);
			}

			else if (isSpreadAssignment(newNode) && isSpreadAssignment(existing)) {
				return <T><any> this.updateSpreadAssignment(newNode, existing);
			}

			else if (isMethodDeclaration(newNode) && isMethodDeclaration(existing)) {
				return <T><any> this.updateMethodDeclaration(newNode, existing);
			}

			else if (isGetAccessorDeclaration(newNode) && isGetAccessorDeclaration(existing)) {
				return <T><any> this.updateGetAccessorDeclaration(newNode, existing);
			}

			else if (isSetAccessorDeclaration(newNode) && isSetAccessorDeclaration(existing)) {
				return <T><any> this.updateSetAccessorDeclaration(newNode, existing);
			}

			else if (isVariableStatement(newNode) && isVariableStatement(existing)) {
				return <T><any> this.updateVariableStatement(newNode, existing);
			}

			else if (isVariableDeclarationList(newNode) && isVariableDeclarationList(existing)) {
				return <T><any> this.updateVariableDeclarationList(newNode, existing);
			}

			else if (isVariableDeclaration(newNode) && isVariableDeclaration(existing)) {
				return <T><any> this.updateVariableDeclaration(newNode, existing);
			}

			else if (isBinaryExpression(newNode) && isBinaryExpression(existing)) {
				return <T><any> this.updateBinaryExpression(newNode, existing);
			}

			else if (isParenthesizedExpression(newNode) && isParenthesizedExpression(existing)) {
				return <T><any> this.updateParenthesizedExpression(newNode, existing);
			}

			else if (isConditionalExpression(newNode) && isConditionalExpression(existing)) {
				return <T><any> this.updateConditionalExpression(newNode, existing);
			}

			else if (isQualifiedName(newNode) && isQualifiedName(existing)) {
				return <T><any> this.updateQualifiedName(newNode, existing);
			}

			else if (isComputedPropertyName(newNode) && isComputedPropertyName(existing)) {
				return <T><any> this.updateComputedPropertyName(newNode, existing);
			}

			else if (isCallSignatureDeclaration(newNode) && isCallSignatureDeclaration(existing)) {
				return <T><any> this.updateCallSignatureDeclaration(newNode, existing);
			}

			else if (isConstructSignatureDeclaration(newNode) && isConstructSignatureDeclaration(existing)) {
				return <T><any> this.updateConstructSignatureDeclaration(newNode, existing);
			}

			else if (isPropertySignature(newNode) && isPropertySignature(existing)) {
				return <T><any> this.updatePropertySignature(newNode, existing);
			}

			else if (isFunctionDeclaration(newNode) && isFunctionDeclaration(existing)) {
				return <T><any> this.updateFunctionDeclaration(newNode, existing);
			}

			else if (isMethodSignature(newNode) && isMethodSignature(existing)) {
				return <T><any> this.updateMethodSignature(newNode, existing);
			}

			else if (isSemicolonClassElement(newNode) && isSemicolonClassElement(existing)) {
				return <T><any> this.updateSemicolonClassElement(newNode, existing);
			}

			else if (isIndexSignatureDeclaration(newNode) && isIndexSignatureDeclaration(existing)) {
				return <T><any> this.updateIndexSignatureDeclaration(newNode, existing);
			}

			else if (isThisTypeNode(newNode) && isThisTypeNode(existing)) {
				return <T><any> this.updateThisTypeNode(newNode, existing);
			}

			else if (isConstructorTypeNode(newNode) && isConstructorTypeNode(existing)) {
				return <T><any> this.updateConstructorTypeNode(newNode, existing);
			}

			else if (isTypePredicateNode(newNode) && isTypePredicateNode(existing)) {
				return <T><any> this.updateTypePredicateNode(newNode, existing);
			}

			else if (isTypeQueryNode(newNode) && isTypeQueryNode(existing)) {
				return <T><any> this.updateTypeQueryNode(newNode, existing);
			}

			else if (isTypeLiteralNode(newNode) && isTypeLiteralNode(existing)) {
				return <T><any> this.updateTypeLiteralNode(newNode, existing);
			}

			else if (isArrayTypeNode(newNode) && isArrayTypeNode(existing)) {
				return <T><any> this.updateArrayTypeNode(newNode, existing);
			}

			else if (isTupleTypeNode(newNode) && isTupleTypeNode(existing)) {
				return <T><any> this.updateTupleTypeNode(newNode, existing);
			}

			else if (isUnionTypeNode(newNode) && isUnionTypeNode(existing)) {
				return <T><any> this.updateUnionTypeNode(newNode, existing);
			}

			else if (isIntersectionTypeNode(newNode) && isIntersectionTypeNode(existing)) {
				return <T><any> this.updateIntersectionTypeNode(newNode, existing);
			}

			else if (isParenthesizedTypeNode(newNode) && isParenthesizedTypeNode(existing)) {
				return <T><any> this.updateParenthesizedTypeNode(newNode, existing);
			}

			else if (isTypeOperatorNode(newNode) && isTypeOperatorNode(existing)) {
				return <T><any> this.updateTypeOperatorNode(newNode, existing);
			}

			else if (isIndexedAccessTypeNode(newNode) && isIndexedAccessTypeNode(existing)) {
				return <T><any> this.updateIndexedAccessTypeNode(newNode, existing);
			}

			else if (isMappedTypeNode(newNode) && isMappedTypeNode(existing)) {
				return <T><any> this.updateMappedTypeNode(newNode, existing);
			}

			else if (isLiteralTypeNode(newNode) && isLiteralTypeNode(existing)) {
				return <T><any> this.updateLiteralTypeNode(newNode, existing);
			}

			else if (this.predicateUtil.isPartiallyEmittedExpression(newNode) && this.predicateUtil.isPartiallyEmittedExpression(existing)) {
				return <T><any> this.updatePartiallyEmittedExpression(newNode, existing);
			}

			else if (this.predicateUtil.isPrefixUnaryExpression(newNode) && this.predicateUtil.isPrefixUnaryExpression(existing)) {
				return <T><any> this.updatePrefixUnaryExpression(newNode, existing);
			}

			else if (this.predicateUtil.isPostfixUnaryExpression(newNode) && this.predicateUtil.isPostfixUnaryExpression(existing)) {
				return <T><any> this.updatePostfixUnaryExpression(newNode, existing);
			}

			else if (this.predicateUtil.isNullLiteral(newNode) && this.predicateUtil.isNullLiteral(existing)) {
				return <T><any> this.updateNullLiteral(newNode, existing);
			}

			else if (this.predicateUtil.isBooleanLiteral(newNode) && this.predicateUtil.isBooleanLiteral(existing)) {
				return <T><any> this.updateBooleanLiteral(newNode, existing);
			}

			else if (this.predicateUtil.isThisExpression(newNode) && this.predicateUtil.isThisExpression(existing)) {
				return <T><any> this.updateThisExpression(newNode, existing);
			}

			else if (this.predicateUtil.isSuperExpression(newNode) && this.predicateUtil.isSuperExpression(existing)) {
				return <T><any> this.updateSuperExpression(newNode, existing);
			}

			else if (this.predicateUtil.isImportExpression(newNode) && this.predicateUtil.isImportExpression(existing)) {
				return <T><any> this.updateImportExpression(newNode, existing);
			}

			else if (isDeleteExpression(newNode) && isDeleteExpression(existing)) {
				return <T><any> this.updateDeleteExpression(newNode, existing);
			}

			else if (isTypeOfExpression(newNode) && isTypeOfExpression(existing)) {
				return <T><any> this.updateTypeOfExpression(newNode, existing);
			}

			else if (isVoidExpression(newNode) && isVoidExpression(existing)) {
				return <T><any> this.updateVoidExpression(newNode, existing);
			}

			else if (isAwaitExpression(newNode) && isAwaitExpression(existing)) {
				return <T><any> this.updateAwaitExpression(newNode, existing);
			}

			else if (isYieldExpression(newNode) && isYieldExpression(existing)) {
				return <T><any> this.updateYieldExpression(newNode, existing);
			}

			else if (isFunctionExpression(newNode) && isFunctionExpression(existing)) {
				return <T><any> this.updateFunctionExpression(newNode, existing);
			}

			else if (isArrowFunction(newNode) && isArrowFunction(existing)) {
				return <T><any> this.updateArrowFunction(newNode, existing);
			}

			else if (isRegularExpressionLiteral(newNode) && isRegularExpressionLiteral(existing)) {
				return <T><any> this.updateRegularExpressionLiteral(newNode, existing);
			}

			else if (isNoSubstitutionTemplateLiteral(newNode) && isNoSubstitutionTemplateLiteral(existing)) {
				return <T><any> this.updateNoSubstitutionTemplateLiteral(<NoSubstitutionTemplateLiteral> newNode, <NoSubstitutionTemplateLiteral> existing);
			}

			else if (isTemplateHead(newNode) && isTemplateHead(existing)) {
				return <T><any> this.updateTemplateHead(newNode, existing);
			}

			else if (isTemplateMiddle(newNode) && isTemplateMiddle(existing)) {
				return <T><any> this.updateTemplateMiddle(newNode, existing);
			}

			else if (isTemplateTail(newNode) && isTemplateTail(existing)) {
				return <T><any> this.updateTemplateTail(newNode, existing);
			}

			else if (isTemplateExpression(newNode) && isTemplateExpression(existing)) {
				return <T><any> this.updateTemplateExpression(newNode, existing);
			}

			else if (isTemplateSpan(newNode) && isTemplateSpan(existing)) {
				return <T><any> this.updateTemplateSpan(newNode, existing);
			}

			else if (isArrayLiteralExpression(newNode) && isArrayLiteralExpression(existing)) {
				return <T><any> this.updateArrayLiteralExpression(newNode, existing);
			}

			else if (isSpreadElement(newNode) && isSpreadElement(existing)) {
				return <T><any> this.updateSpreadElement(newNode, existing);
			}

			else if (isNewExpression(newNode) && isNewExpression(existing)) {
				return <T><any> this.updateNewExpression(newNode, existing);
			}

			else if (isTaggedTemplateExpression(newNode) && isTaggedTemplateExpression(existing)) {
				return <T><any> this.updateTaggedTemplateExpression(newNode, existing);
			}

			else if (isAsExpression(newNode) && isAsExpression(existing)) {
				return <T><any> this.updateAsExpression(newNode, existing);
			}

			else if (isTypeAssertion(newNode) && isTypeAssertion(existing)) {
				return <T><any> this.updateTypeAssertion(newNode, existing);
			}

			else if (isNonNullExpression(newNode) && isNonNullExpression(existing)) {
				return <T><any> this.updateNonNullExpression(newNode, existing);
			}

			else if (isMetaProperty(newNode) && isMetaProperty(existing)) {
				return <T><any> this.updateMetaProperty(newNode, existing);
			}

			else if (isJsxElement(newNode) && isJsxElement(existing)) {
				return <T><any> this.updateJsxElement(newNode, existing);
			}

			else if (isJsxOpeningElement(newNode) && isJsxOpeningElement(existing)) {
				return <T><any> this.updateJsxOpeningElement(newNode, existing);
			}

			else if (isJsxClosingElement(newNode) && isJsxClosingElement(existing)) {
				return <T><any> this.updateJsxClosingElement(newNode, existing);
			}

			else if (isJsxSelfClosingElement(newNode) && isJsxSelfClosingElement(existing)) {
				return <T><any> this.updateJsxSelfClosingElement(newNode, existing);
			}

			else if (isJsxAttribute(newNode) && isJsxAttribute(existing)) {
				return <T><any> this.updateJsxAttribute(newNode, existing);
			}

			else if (isJsxAttributes(newNode) && isJsxAttributes(existing)) {
				return <T><any> this.updateJsxAttributes(newNode, existing);
			}

			else if (isJsxSpreadAttribute(newNode) && isJsxSpreadAttribute(existing)) {
				return <T><any> this.updateJsxSpreadAttribute(newNode, existing);
			}

			else if (isJsxExpression(newNode) && isJsxExpression(existing)) {
				return <T><any> this.updateJsxExpression(newNode, existing);
			}

			else if (isJsxText(newNode) && isJsxText(existing)) {
				return <T><any> this.updateJsxText(newNode, existing);
			}

			else if (isEmptyStatement(newNode) && isEmptyStatement(existing)) {
				return <T><any> this.updateEmptyStatement(newNode, existing);
			}

			else if (isDebuggerStatement(newNode) && isDebuggerStatement(existing)) {
				return <T><any> this.updateDebuggerStatement(newNode, existing);
			}

			else if (isMissingDeclaration(newNode) && isMissingDeclaration(existing)) {
				return <T><any> this.updateMissingDeclaration(newNode, existing);
			}

			else if (isIfStatement(newNode) && isIfStatement(existing)) {
				return <T><any> this.updateIfStatement(newNode, existing);
			}

			else if (isDoStatement(newNode) && isDoStatement(existing)) {
				return <T><any> this.updateDoStatement(newNode, existing);
			}

			else if (isWhileStatement(newNode) && isWhileStatement(existing)) {
				return <T><any> this.updateWhileStatement(newNode, existing);
			}

			else if (isForStatement(newNode) && isForStatement(existing)) {
				return <T><any> this.updateForStatement(newNode, existing);
			}

			else if (isForInStatement(newNode) && isForInStatement(existing)) {
				return <T><any> this.updateForInStatement(newNode, existing);
			}

			else if (isForOfStatement(newNode) && isForOfStatement(existing)) {
				return <T><any> this.updateForOfStatement(newNode, existing);
			}

			else if (isBreakStatement(newNode) && isBreakStatement(existing)) {
				return <T><any> this.updateBreakStatement(newNode, existing);
			}

			else if (isContinueStatement(newNode) && isContinueStatement(existing)) {
				return <T><any> this.updateContinueStatement(newNode, existing);
			}

			else if (isReturnStatement(newNode) && isReturnStatement(existing)) {
				return <T><any> this.updateReturnStatement(newNode, existing);
			}

			else if (isWithStatement(newNode) && isWithStatement(existing)) {
				return <T><any> this.updateWithStatement(newNode, existing);
			}

			else if (isSwitchStatement(newNode) && isSwitchStatement(existing)) {
				return <T><any> this.updateSwitchStatement(newNode, existing);
			}

			else if (isCaseBlock(newNode) && isCaseBlock(existing)) {
				return <T><any> this.updateCaseBlock(newNode, existing);
			}

			else if (isCaseClause(newNode) && isCaseClause(existing)) {
				return <T><any> this.updateCaseClause(newNode, existing);
			}

			else if (isDefaultClause(newNode) && isDefaultClause(existing)) {
				return <T><any> this.updateDefaultClause(newNode, existing);
			}

			else if (isLabeledStatement(newNode) && isLabeledStatement(existing)) {
				return <T><any> this.updateLabeledStatement(newNode, existing);
			}

			else if (isThrowStatement(newNode) && isThrowStatement(existing)) {
				return <T><any> this.updateThrowStatement(newNode, existing);
			}

			else if (isTryStatement(newNode) && isTryStatement(existing)) {
				return <T><any> this.updateTryStatement(newNode, existing);
			}

			else if (isCatchClause(newNode) && isCatchClause(existing)) {
				return <T><any> this.updateCatchClause(newNode, existing);
			}

			else if (isClassExpression(newNode) && isClassExpression(existing)) {
				return <T><any> this.updateClassExpression(newNode, existing);
			}

			else if (isInterfaceDeclaration(newNode) && isInterfaceDeclaration(existing)) {
				return <T><any> this.updateInterfaceDeclaration(newNode, existing);
			}

			else if (isTypeAliasDeclaration(newNode) && isTypeAliasDeclaration(existing)) {
				return <T><any> this.updateTypeAliasDeclaration(newNode, existing);
			}

			else if (isEnumMember(newNode) && isEnumMember(existing)) {
				return <T><any> this.updateEnumMember(newNode, existing);
			}

			else if (isEnumDeclaration(newNode) && isEnumDeclaration(existing)) {
				return <T><any> this.updateEnumDeclaration(newNode, existing);
			}

			else if (this.predicateUtil.isNamespaceDeclaration(newNode) && this.predicateUtil.isNamespaceDeclaration(existing)) {
				return <T><any> this.updateNamespaceDeclaration(newNode, existing);
			}

			else if (this.predicateUtil.isJSDocNamespaceDeclaration(newNode) && this.predicateUtil.isJSDocNamespaceDeclaration(existing)) {
				return <T><any> this.updateJSDocNamespaceDeclaration(newNode, existing);
			}

			else if (isModuleDeclaration(newNode) && isModuleDeclaration(existing)) {
				return <T><any> this.updateModuleDeclaration(newNode, existing);
			}

			else if (isModuleBlock(newNode) && isModuleBlock(existing)) {
				return <T><any> this.updateModuleBlock(newNode, existing);
			}

			else if (isImportEqualsDeclaration(newNode) && isImportEqualsDeclaration(existing)) {
				return <T><any> this.updateImportEqualsDeclaration(newNode, existing);
			}

			else if (isExternalModuleReference(newNode) && isExternalModuleReference(existing)) {
				return <T><any> this.updateExternalModuleReference(newNode, existing);
			}

			else if (isImportDeclaration(newNode) && isImportDeclaration(existing)) {
				return <T><any> this.updateImportDeclaration(newNode, existing);
			}

			else if (isImportClause(newNode) && isImportClause(existing)) {
				return <T><any> this.updateImportClause(newNode, existing);
			}

			else if (isNamespaceImport(newNode) && isNamespaceImport(existing)) {
				return <T><any> this.updateNamespaceImport(newNode, existing);
			}

			else if (isNamespaceExportDeclaration(newNode) && isNamespaceExportDeclaration(existing)) {
				return <T><any> this.updateNamespaceExportDeclaration(newNode, existing);
			}

			else if (isExportDeclaration(newNode) && isExportDeclaration(existing)) {
				return <T><any> this.updateExportDeclaration(newNode, existing);
			}

			else if (isNamedImports(newNode) && isNamedImports(existing)) {
				return <T><any> this.updateNamedImports(newNode, existing);
			}

			else if (isNamedExports(newNode) && isNamedExports(existing)) {
				return <T><any> this.updateNamedExports(newNode, existing);
			}

			else if (isImportSpecifier(newNode) && isImportSpecifier(existing)) {
				return <T><any> this.updateImportSpecifier(newNode, existing);
			}

			else if (isExportSpecifier(newNode) && isExportSpecifier(existing)) {
				return <T><any> this.updateExportSpecifier(newNode, existing);
			}

			else if (isExportAssignment(newNode) && isExportAssignment(existing)) {
					return <T><any> this.updateExportAssignment(newNode, existing);
				}
		}

		throw new TypeError(`${this.constructor.name} could not update a Node of kind ${SyntaxKind[existing.kind]}: It wasn't handled!`);
		/*tslint:enable:no-any*/
	}

	/**
	 * Updates a ExportAssignment
	 * @param {ExportAssignment} newNode
	 * @param {ExportAssignment} existing
	 * @returns {ExportAssignment}
	 */
	private updateExportAssignment (newNode: ExportAssignment, existing: ExportAssignment): ExportAssignment {
		this.updateDeclarationStatement(newNode, existing);

		existing.isExportEquals = newNode.isExportEquals;
		existing.expression = this.update(newNode.expression, existing.expression);

		return this.extraTransformStep(newNode, existing);
	}

	/**
	 * Updates a ExportSpecifier
	 * @param {ExportSpecifier} newNode
	 * @param {ExportSpecifier} existing
	 * @returns {ExportSpecifier}
	 */
	private updateExportSpecifier (newNode: ExportSpecifier, existing: ExportSpecifier): ExportSpecifier {
		this.updateNamedDeclaration(newNode, existing);

		existing.propertyName = this.updateNodeIfGiven(newNode.propertyName, existing.propertyName, this.updateIdentifier);
		existing.name = this.updateIdentifier(newNode.name, existing.name);

		return this.extraTransformStep(newNode, existing);
	}

	/**
	 * Updates ExportSpecifiers
	 * @param {Node} parent
	 * @param {NodeArray<ExportSpecifier>} newNode
	 * @param {NodeArray<ExportSpecifier>} existing
	 * @returns {NodeArray<ExportSpecifier>}
	 */
	private updateExportSpecifiers (parent: Node, newNode: NodeArray<ExportSpecifier>, existing: NodeArray<ExportSpecifier>): NodeArray<ExportSpecifier> {
		return this.updateNodeArray(parent, newNode, existing, this.updateExportSpecifier);
	}

	/**
	 * Updates a ImportSpecifier
	 * @param {ImportSpecifier} newNode
	 * @param {ImportSpecifier} existing
	 * @returns {ImportSpecifier}
	 */
	private updateImportSpecifier (newNode: ImportSpecifier, existing: ImportSpecifier): ImportSpecifier {
		this.updateNamedDeclaration(newNode, existing);

		existing.propertyName = this.updateNodeIfGiven(newNode.propertyName, existing.propertyName, this.updateIdentifier);
		existing.name = this.updateIdentifier(newNode.name, existing.name);

		return this.extraTransformStep(newNode, existing);
	}

	/**
	 * Updates ImportSpecifiers
	 * @param {Node} parent
	 * @param {NodeArray<ImportSpecifier>} newNode
	 * @param {NodeArray<ImportSpecifier>} existing
	 * @returns {NodeArray<ImportSpecifier>}
	 */
	private updateImportSpecifiers (parent: Node, newNode: NodeArray<ImportSpecifier>, existing: NodeArray<ImportSpecifier>): NodeArray<ImportSpecifier> {
		return this.updateNodeArray(parent, newNode, existing, this.updateImportSpecifier);
	}

	/**
	 * Updates a NamedExports
	 * @param {NamedExports} newNode
	 * @param {NamedExports} existing
	 * @returns {NamedExports}
	 */
	private updateNamedExports (newNode: NamedExports, existing: NamedExports): NamedExports {
		this.updateNode(newNode, existing);

		existing.elements = this.updateExportSpecifiers(existing, newNode.elements, existing.elements);

		return this.extraTransformStep(newNode, existing);
	}

	/**
	 * Updates a NamedImports
	 * @param {NamedImports} newNode
	 * @param {NamedImports} existing
	 * @returns {NamedImports}
	 */
	private updateNamedImports (newNode: NamedImports, existing: NamedImports): NamedImports {
		this.updateNode(newNode, existing);

		existing.elements = this.updateImportSpecifiers(existing, newNode.elements, existing.elements);

		return this.extraTransformStep(newNode, existing);
	}

	/**
	 * Updates a ExportDeclaration
	 * @param {ExportDeclaration} newNode
	 * @param {ExportDeclaration} existing
	 * @returns {ExportDeclaration}
	 */
	private updateExportDeclaration (newNode: ExportDeclaration, existing: ExportDeclaration): ExportDeclaration {
		this.updateDeclarationStatement(newNode, existing);

		existing.exportClause = this.updateNodeIfGiven(newNode.exportClause, existing.exportClause, this.updateNamedExports);
		existing.moduleSpecifier = this.updateNodeIfGiven(newNode.moduleSpecifier, existing.moduleSpecifier, this.update);

		return this.extraTransformStep(newNode, existing);
	}

	/**
	 * Updates a NamespaceExportDeclaration
	 * @param {NamespaceExportDeclaration} newNode
	 * @param {NamespaceExportDeclaration} existing
	 * @returns {NamespaceExportDeclaration}
	 */
	private updateNamespaceExportDeclaration (newNode: NamespaceExportDeclaration, existing: NamespaceExportDeclaration): NamespaceExportDeclaration {
		this.updateDeclarationStatement(newNode, existing);

		existing.name = this.updateIdentifier(newNode.name, existing.name);

		return this.extraTransformStep(newNode, existing);
	}

	/**
	 * Updates a NamespaceImport
	 * @param {NamespaceImport} newNode
	 * @param {NamespaceImport} existing
	 * @returns {NamespaceImport}
	 */
	private updateNamespaceImport (newNode: NamespaceImport, existing: NamespaceImport): NamespaceImport {
		this.updateNamedDeclaration(newNode, existing);

		existing.name = this.updateIdentifier(newNode.name, existing.name);

		return this.extraTransformStep(newNode, existing);
	}

	/**
	 * Updates a ImportClause
	 * @param {ImportClause} newNode
	 * @param {ImportClause} existing
	 * @returns {ImportClause}
	 */
	private updateImportClause (newNode: ImportClause, existing: ImportClause): ImportClause {
		this.updateNamedDeclaration(newNode, existing);

		existing.name = this.updateNodeIfGiven(newNode.name, existing.name, this.updateIdentifier);
		existing.namedBindings = this.updateNodeIfGiven(newNode.namedBindings, existing.namedBindings, this.update);

		return this.extraTransformStep(newNode, existing);
	}

	/**
	 * Updates a ImportDeclaration
	 * @param {ImportDeclaration} newNode
	 * @param {ImportDeclaration} existing
	 * @returns {ImportDeclaration}
	 */
	private updateImportDeclaration (newNode: ImportDeclaration, existing: ImportDeclaration): ImportDeclaration {
		this.updateStatement(newNode, existing);

		existing.importClause = this.updateNodeIfGiven(newNode.importClause, existing.importClause, this.updateImportClause);
		existing.moduleSpecifier = this.update(newNode.moduleSpecifier, existing.moduleSpecifier);

		return this.extraTransformStep(newNode, existing);
	}

	/**
	 * Updates a ExternalModuleReference
	 * @param {ExternalModuleReference} newNode
	 * @param {ExternalModuleReference} existing
	 * @returns {ExternalModuleReference}
	 */
	private updateExternalModuleReference (newNode: ExternalModuleReference, existing: ExternalModuleReference): ExternalModuleReference {
		this.updateNode(newNode, existing);

		existing.expression = this.updateNodeIfGiven(newNode.expression, existing.expression, this.update);

		return this.extraTransformStep(newNode, existing);
	}

	/**
	 * Updates a ImportEqualsDeclaration
	 * @param {ImportEqualsDeclaration} newNode
	 * @param {ImportEqualsDeclaration} existing
	 * @returns {ImportEqualsDeclaration}
	 */
	private updateImportEqualsDeclaration (newNode: ImportEqualsDeclaration, existing: ImportEqualsDeclaration): ImportEqualsDeclaration {
		this.updateDeclarationStatement(newNode, existing);

		existing.name = this.updateIdentifier(newNode.name, existing.name);
		existing.moduleReference = this.update(newNode.moduleReference, existing.moduleReference);

		return this.extraTransformStep(newNode, existing);
	}

	/**
	 * Updates a ModuleBlock
	 * @param {ModuleBlock} newNode
	 * @param {ModuleBlock} existing
	 * @returns {ModuleBlock}
	 */
	private updateModuleBlock (newNode: ModuleBlock, existing: ModuleBlock): ModuleBlock {
		this.updateNode(newNode, existing);
		this.updateStatement(newNode, existing);

		existing.statements = this.updateAll(existing, newNode.statements, existing.statements);

		return this.extraTransformStep(newNode, existing);
	}

	/**
	 * Updates a JSDocNamespaceDeclaration
	 * @param {JSDocNamespaceDeclaration} newNode
	 * @param {JSDocNamespaceDeclaration} existing
	 * @returns {JSDocNamespaceDeclaration}
	 */
	private updateJSDocNamespaceDeclaration (newNode: JSDocNamespaceDeclaration, existing: JSDocNamespaceDeclaration): JSDocNamespaceDeclaration {
		this.updateModuleDeclaration(newNode, existing);

		existing.name = this.updateIdentifier(newNode.name, existing.name);
		existing.body = this.update(newNode.body, existing.body);

		return existing;
	}

	/**
	 * Updates a NamespaceDeclaration
	 * @param {NamespaceDeclaration} newNode
	 * @param {NamespaceDeclaration} existing
	 * @returns {NamespaceDeclaration}
	 */
	private updateNamespaceDeclaration (newNode: NamespaceDeclaration, existing: NamespaceDeclaration): NamespaceDeclaration {
		this.updateModuleDeclaration(newNode, existing);

		existing.name = this.updateIdentifier(newNode.name, existing.name);
		existing.body = this.update(newNode.body, existing.body);

		return existing;
	}

	/**
	 * Updates a ModuleDeclaration
	 * @param {ModuleDeclaration} newNode
	 * @param {ModuleDeclaration} existing
	 * @returns {ModuleDeclaration}
	 */
	private updateModuleDeclaration (newNode: ModuleDeclaration, existing: ModuleDeclaration): ModuleDeclaration {
		this.updateDeclarationStatement(newNode, existing);

		existing.name = this.update(newNode.name, existing.name);
		existing.body = this.updateNodeIfGiven(newNode.body, existing.body, this.update);

		return this.extraTransformStep(newNode, existing);
	}

	/**
	 * Updates a EnumDeclaration
	 * @param {EnumDeclaration} newNode
	 * @param {EnumDeclaration} existing
	 * @returns {EnumDeclaration}
	 */
	private updateEnumDeclaration (newNode: EnumDeclaration, existing: EnumDeclaration): EnumDeclaration {
		this.updateDeclarationStatement(newNode, existing);

		existing.name = this.updateIdentifier(newNode.name, existing.name);
		existing.members = this.updateEnumMembers(existing, newNode.members, existing.members);

		return this.extraTransformStep(newNode, existing);
	}

	/**
	 * Updates a EnumMember
	 * @param {EnumMember} newNode
	 * @param {EnumMember} existing
	 * @returns {EnumMember}
	 */
	private updateEnumMember (newNode: EnumMember, existing: EnumMember): EnumMember {
		this.updateNamedDeclaration(newNode, existing);

		existing.name = this.updatePropertyName(newNode.name, existing.name);
		existing.initializer = this.updateNodeIfGiven(newNode.initializer, existing.initializer, this.update);

		return this.extraTransformStep(newNode, existing);
	}

	/**
	 * Updates EnumMembers
	 * @param {Node} parent
	 * @param {NodeArray<EnumMember>} newNode
	 * @param {NodeArray<EnumMember>} existing
	 * @returns {NodeArray<EnumMember>}
	 */
	private updateEnumMembers (parent: Node, newNode: NodeArray<EnumMember>, existing: NodeArray<EnumMember>): NodeArray<EnumMember> {
		return this.updateNodeArray(parent, newNode, existing, this.updateEnumMember);
	}

	/**
	 * Updates a TypeAliasDeclaration
	 * @param {TypeAliasDeclaration} newNode
	 * @param {TypeAliasDeclaration} existing
	 * @returns {TypeAliasDeclaration}
	 */
	private updateTypeAliasDeclaration (newNode: TypeAliasDeclaration, existing: TypeAliasDeclaration): TypeAliasDeclaration {
		this.updateDeclarationStatement(newNode, existing);

		existing.name = this.updateIdentifier(newNode.name, existing.name);
		existing.typeParameters = this.updateNodesIfGiven(existing, newNode.typeParameters, existing.typeParameters, this.updateTypeParameterDeclarations);
		existing.type = this.update(newNode.type, existing.type);

		return this.extraTransformStep(newNode, existing);
	}

	/**
	 * Updates a InterfaceDeclaration
	 * @param {InterfaceDeclaration} newNode
	 * @param {InterfaceDeclaration} existing
	 * @returns {InterfaceDeclaration}
	 */
	private updateInterfaceDeclaration (newNode: InterfaceDeclaration, existing: InterfaceDeclaration): InterfaceDeclaration {
		this.updateDeclarationStatement(newNode, existing);

		existing.name = this.updateIdentifier(newNode.name, existing.name);
		existing.typeParameters = this.updateNodesIfGiven(existing, newNode.typeParameters, existing.typeParameters, this.updateTypeParameterDeclarations);
		existing.heritageClauses = this.updateNodesIfGiven(existing, newNode.heritageClauses, existing.heritageClauses, this.updateHeritageClauses);
		existing.members = this.updateAll(existing, newNode.members, existing.members);

		return this.extraTransformStep(newNode, existing);
	}

	/**
	 * Updates a CatchClause
	 * @param {CatchClause} newNode
	 * @param {CatchClause} existing
	 * @returns {CatchClause}
	 */
	private updateCatchClause (newNode: CatchClause, existing: CatchClause): CatchClause {
		this.updateNode(newNode, existing);

		existing.variableDeclaration = this.updateNodeIfGiven(newNode.variableDeclaration, existing.variableDeclaration, this.updateVariableDeclaration);
		existing.block = this.updateBlock(newNode.block, existing.block);

		return this.extraTransformStep(newNode, existing);
	}

	/**
	 * Updates a TryStatement
	 * @param {TryStatement} newNode
	 * @param {TryStatement} existing
	 * @returns {TryStatement}
	 */
	private updateTryStatement (newNode: TryStatement, existing: TryStatement): TryStatement {
		this.updateStatement(newNode, existing);

		existing.tryBlock = this.updateBlock(newNode.tryBlock, existing.tryBlock);
		existing.catchClause = this.updateNodeIfGiven(newNode.catchClause, existing.catchClause, this.updateCatchClause);
		existing.finallyBlock = this.updateNodeIfGiven(newNode.finallyBlock, existing.finallyBlock, this.updateBlock);

		return this.extraTransformStep(newNode, existing);
	}

	/**
	 * Updates a ThrowStatement
	 * @param {ThrowStatement} newNode
	 * @param {ThrowStatement} existing
	 * @returns {ThrowStatement}
	 */
	private updateThrowStatement (newNode: ThrowStatement, existing: ThrowStatement): ThrowStatement {
		this.updateStatement(newNode, existing);

		existing.expression = this.update(newNode.expression, existing.expression);

		return this.extraTransformStep(newNode, existing);
	}

	/**
	 * Updates a LabeledStatement
	 * @param {LabeledStatement} newNode
	 * @param {LabeledStatement} existing
	 * @returns {LabeledStatement}
	 */
	private updateLabeledStatement (newNode: LabeledStatement, existing: LabeledStatement): LabeledStatement {
		this.updateStatement(newNode, existing);

		existing.label = this.updateIdentifier(newNode.label, existing.label);
		existing.statement = this.update(newNode.statement, existing.statement);

		return this.extraTransformStep(newNode, existing);
	}

	/**
	 * Updates a DefaultClause
	 * @param {DefaultClause} newNode
	 * @param {DefaultClause} existing
	 * @returns {DefaultClause}
	 */
	private updateDefaultClause (newNode: DefaultClause, existing: DefaultClause): DefaultClause {
		this.updateNode(newNode, existing);

		existing.statements = this.updateAll(existing, newNode.statements, existing.statements);

		return this.extraTransformStep(newNode, existing);
	}

	/**
	 * Updates a CaseClause
	 * @param {CaseClause} newNode
	 * @param {CaseClause} existing
	 * @returns {CaseClause}
	 */
	private updateCaseClause (newNode: CaseClause, existing: CaseClause): CaseClause {
		this.updateNode(newNode, existing);

		existing.expression = this.update(newNode.expression, existing.expression);
		existing.statements = this.updateAll(existing, newNode.statements, existing.statements);

		return this.extraTransformStep(newNode, existing);
	}

	/**
	 * Updates a CaseBlock
	 * @param {CaseBlock} newNode
	 * @param {CaseBlock} existing
	 * @returns {CaseBlock}
	 */
	private updateCaseBlock (newNode: CaseBlock, existing: CaseBlock): CaseBlock {
		this.updateNode(newNode, existing);

		existing.clauses = this.updateAll(existing, newNode.clauses, existing.clauses);

		return this.extraTransformStep(newNode, existing);
	}

	/**
	 * Updates a SwitchStatement
	 * @param {SwitchStatement} newNode
	 * @param {SwitchStatement} existing
	 * @returns {SwitchStatement}
	 */
	private updateSwitchStatement (newNode: SwitchStatement, existing: SwitchStatement): SwitchStatement {
		this.updateStatement(newNode, existing);

		existing.expression = this.update(newNode.expression, existing.expression);
		existing.caseBlock = this.updateCaseBlock(newNode.caseBlock, existing.caseBlock);
		existing.possiblyExhaustive = newNode.possiblyExhaustive;

		return this.extraTransformStep(newNode, existing);
	}

	/**
	 * Updates a WithStatement
	 * @param {WithStatement} newNode
	 * @param {WithStatement} existing
	 * @returns {WithStatement}
	 */
	private updateWithStatement (newNode: WithStatement, existing: WithStatement): WithStatement {
		this.updateStatement(newNode, existing);

		existing.expression = this.update(newNode.expression, existing.expression);
		existing.statement = this.updateStatement(newNode.statement, existing.statement);

		return this.extraTransformStep(newNode, existing);
	}

	/**
	 * Updates a ReturnStatement
	 * @param {ReturnStatement} newNode
	 * @param {ReturnStatement} existing
	 * @returns {ReturnStatement}
	 */
	private updateReturnStatement (newNode: ReturnStatement, existing: ReturnStatement): ReturnStatement {
		this.updateStatement(newNode, existing);

		existing.expression = this.updateNodeIfGiven(newNode.expression, existing.expression, this.update);

		return this.extraTransformStep(newNode, existing);
	}

	/**
	 * Updates a ContinueStatement
	 * @param {ContinueStatement} newNode
	 * @param {ContinueStatement} existing
	 * @returns {ContinueStatement}
	 */
	private updateContinueStatement (newNode: ContinueStatement, existing: ContinueStatement): ContinueStatement {
		this.updateStatement(newNode, existing);

		existing.label = this.updateNodeIfGiven(newNode.label, existing.label, this.updateIdentifier);

		return this.extraTransformStep(newNode, existing);
	}

	/**
	 * Updates a BreakStatement
	 * @param {BreakStatement} newNode
	 * @param {BreakStatement} existing
	 * @returns {BreakStatement}
	 */
	private updateBreakStatement (newNode: BreakStatement, existing: BreakStatement): BreakStatement {
		this.updateStatement(newNode, existing);

		existing.label = this.updateNodeIfGiven(newNode.label, existing.label, this.updateIdentifier);

		return this.extraTransformStep(newNode, existing);
	}

	/**
	 * Updates a ForOfStatement
	 * @param {ForOfStatement} newNode
	 * @param {ForOfStatement} existing
	 * @returns {ForOfStatement}
	 */
	private updateForOfStatement (newNode: ForOfStatement, existing: ForOfStatement): ForOfStatement {
		this.updateIterationStatement(newNode, existing);

		existing.awaitModifier = this.updateNodeIfGiven(newNode.awaitModifier, existing.awaitModifier, this.updateToken);
		existing.initializer = this.update(newNode.initializer, existing.initializer);
		existing.expression = this.update(newNode.expression, existing.expression);

		return this.extraTransformStep(newNode, existing);
	}

	/**
	 * Updates a ForInStatement
	 * @param {ForInStatement} newNode
	 * @param {ForInStatement} existing
	 * @returns {ForInStatement}
	 */
	private updateForInStatement (newNode: ForInStatement, existing: ForInStatement): ForInStatement {
		this.updateIterationStatement(newNode, existing);

		existing.initializer = this.update(newNode.initializer, existing.initializer);
		existing.expression = this.update(newNode.expression, existing.expression);

		return this.extraTransformStep(newNode, existing);
	}

	/**
	 * Updates a ForStatement
	 * @param {ForStatement} newNode
	 * @param {ForStatement} existing
	 * @returns {ForStatement}
	 */
	private updateForStatement (newNode: ForStatement, existing: ForStatement): ForStatement {
		this.updateIterationStatement(newNode, existing);

		existing.initializer = this.updateNodeIfGiven(newNode.initializer, existing.initializer, this.update);
		existing.condition = this.updateNodeIfGiven(newNode.condition, existing.condition, this.update);
		existing.incrementor = this.updateNodeIfGiven(newNode.incrementor, existing.incrementor, this.update);

		return this.extraTransformStep(newNode, existing);
	}

	/**
	 * Updates a WhileStatement
	 * @param {WhileStatement} newNode
	 * @param {WhileStatement} existing
	 * @returns {WhileStatement}
	 */
	private updateWhileStatement (newNode: WhileStatement, existing: WhileStatement): WhileStatement {
		this.updateIterationStatement(newNode, existing);

		existing.expression = this.update(newNode.expression, existing.expression);

		return this.extraTransformStep(newNode, existing);
	}

	/**
	 * Updates a DoStatement
	 * @param {DoStatement} newNode
	 * @param {DoStatement} existing
	 * @returns {DoStatement}
	 */
	private updateDoStatement (newNode: DoStatement, existing: DoStatement): DoStatement {
		this.updateIterationStatement(newNode, existing);

		existing.expression = this.update(newNode.expression, existing.expression);

		return this.extraTransformStep(newNode, existing);
	}

	/**
	 * Updates an IfStatement
	 * @param {IfStatement} newNode
	 * @param {IfStatement} existing
	 * @returns {IfStatement}
	 */
	private updateIfStatement (newNode: IfStatement, existing: IfStatement): IfStatement {
		this.updateStatement(newNode, existing);

		existing.expression = this.update(newNode.expression, existing.expression);
		existing.thenStatement = this.update(newNode.thenStatement, existing.thenStatement);
		existing.elseStatement = this.updateNodeIfGiven(newNode.elseStatement, existing.elseStatement, this.update);

		return this.extraTransformStep(newNode, existing);
	}

	/**
	 * Updates a MissingDeclaration
	 * @param {MissingDeclaration} newNode
	 * @param {MissingDeclaration} existing
	 * @returns {MissingDeclaration}
	 */
	private updateMissingDeclaration (newNode: MissingDeclaration, existing: MissingDeclaration): MissingDeclaration {
		this.updateDeclarationStatement(newNode, existing);
		this.updateClassElement(newNode, existing);
		this.updateObjectLiteralElement(newNode, existing);
		this.updateTypeElement(newNode, existing);

		existing.name = this.updateNodeIfGiven(newNode.name, existing.name, this.updateIdentifier);

		return this.extraTransformStep(newNode, existing);
	}

	/**
	 * Updates a DebuggerStatement
	 * @param {DebuggerStatement} newNode
	 * @param {DebuggerStatement} existing
	 * @returns {DebuggerStatement}
	 */
	private updateDebuggerStatement (newNode: DebuggerStatement, existing: DebuggerStatement): DebuggerStatement {
		this.updateStatement(newNode, existing);

		return this.extraTransformStep(newNode, existing);
	}

	/**
	 * Updates a EmptyStatement
	 * @param {EmptyStatement} newNode
	 * @param {EmptyStatement} existing
	 * @returns {EmptyStatement}
	 */
	private updateEmptyStatement (newNode: EmptyStatement, existing: EmptyStatement): EmptyStatement {
		this.updateStatement(newNode, existing);

		return this.extraTransformStep(newNode, existing);
	}

	/**
	 * Updates a JsxText
	 * @param {JsxText} newNode
	 * @param {JsxText} existing
	 * @returns {JsxText}
	 */
	private updateJsxText (newNode: JsxText, existing: JsxText): JsxText {
		this.updateNode(newNode, existing);

		existing.containsOnlyWhiteSpaces = newNode.containsOnlyWhiteSpaces;

		return this.extraTransformStep(newNode, existing);
	}

	/**
	 * Updates a JsxExpression
	 * @param {JsxExpression} newNode
	 * @param {JsxExpression} existing
	 * @returns {JsxExpression}
	 */
	private updateJsxExpression (newNode: JsxExpression, existing: JsxExpression): JsxExpression {
		this.updateExpression(newNode, existing);

		existing.dotDotDotToken = this.updateNodeIfGiven(newNode.dotDotDotToken, existing.dotDotDotToken, this.updateToken);
		existing.expression = this.updateNodeIfGiven(newNode.expression, existing.expression, this.update);

		return this.extraTransformStep(newNode, existing);
	}

	/**
	 * Updates a JsxSpreadAttribute
	 * @param {JsxSpreadAttribute} newNode
	 * @param {JsxSpreadAttribute} existing
	 * @returns {JsxSpreadAttribute}
	 */
	private updateJsxSpreadAttribute (newNode: JsxSpreadAttribute, existing: JsxSpreadAttribute): JsxSpreadAttribute {
		this.updateObjectLiteralElement(newNode, existing);

		existing.expression = this.update(newNode.expression, existing.expression);

		return this.extraTransformStep(newNode, existing);
	}

	/**
	 * Updates a JsxAttribute
	 * @param {JsxAttribute} newNode
	 * @param {JsxAttribute} existing
	 * @returns {JsxAttribute}
	 */
	private updateJsxAttribute (newNode: JsxAttribute, existing: JsxAttribute): JsxAttribute {
		this.updateObjectLiteralElement(newNode, existing);

		existing.name = this.updateIdentifier(newNode.name, existing.name);
		existing.initializer = this.updateNodeIfGiven(newNode.initializer, existing.initializer, this.update);

		return this.extraTransformStep(newNode, existing);
	}

	/**
	 * Updates a JsxAttributes
	 * @param {JsxAttributes} newNode
	 * @param {JsxAttributes} existing
	 * @returns {JsxAttributes}
	 */
	private updateJsxAttributes (newNode: JsxAttributes, existing: JsxAttributes): JsxAttributes {
		this.updateObjectLiteralExpressionBase(newNode, existing);

		return this.extraTransformStep(newNode, existing);
	}

	/**
	 * Updates a JsxOpeningElement
	 * @param {JsxOpeningElement} newNode
	 * @param {JsxOpeningElement} existing
	 * @returns {JsxOpeningElement}
	 */
	private updateJsxOpeningElement (newNode: JsxOpeningElement, existing: JsxOpeningElement): JsxOpeningElement {
		this.updateExpression(newNode, existing);

		existing.tagName = this.update(newNode.tagName, existing.tagName);
		existing.attributes = this.update(newNode.attributes, existing.attributes);

		return this.extraTransformStep(newNode, existing);
	}

	/**
	 * Updates a JsxClosingElement
	 * @param {JsxClosingElement} newNode
	 * @param {JsxClosingElement} existing
	 * @returns {JsxClosingElement}
	 */
	private updateJsxClosingElement (newNode: JsxClosingElement, existing: JsxClosingElement): JsxClosingElement {
		this.updateNode(newNode, existing);

		existing.tagName = this.update(newNode.tagName, existing.tagName);

		return this.extraTransformStep(newNode, existing);
	}

	/**
	 * Updates a JsxSelfClosingElement
	 * @param {JsxSelfClosingElement} newNode
	 * @param {JsxSelfClosingElement} existing
	 * @returns {JsxSelfClosingElement}
	 */
	private updateJsxSelfClosingElement (newNode: JsxSelfClosingElement, existing: JsxSelfClosingElement): JsxSelfClosingElement {
		this.updatePrimaryExpression(newNode, existing);

		existing.tagName = this.update(newNode.tagName, existing.tagName);
		existing.attributes = this.update(newNode.attributes, existing.attributes);

		return this.extraTransformStep(newNode, existing);
	}

	/**
	 * Updates a JsxElement
	 * @param {JsxElement} newNode
	 * @param {JsxElement} existing
	 * @returns {JsxElement}
	 */
	private updateJsxElement (newNode: JsxElement, existing: JsxElement): JsxElement {
		this.updatePrimaryExpression(newNode, existing);

		existing.openingElement = this.updateJsxOpeningElement(newNode.openingElement, existing.openingElement);
		existing.closingElement = this.updateJsxClosingElement(newNode.closingElement, existing.closingElement);
		existing.children = this.updateAll(existing, newNode.children, existing.children);

		return this.extraTransformStep(newNode, existing);
	}

	/**
	 * Updates a MetaProperty
	 * @param {MetaProperty} newNode
	 * @param {MetaProperty} existing
	 * @returns {MetaProperty}
	 */
	private updateMetaProperty (newNode: MetaProperty, existing: MetaProperty): MetaProperty {
		this.updatePrimaryExpression(newNode, existing);

		existing.keywordToken = newNode.keywordToken;
		existing.name = this.updateIdentifier(newNode.name, existing.name);

		return this.extraTransformStep(newNode, existing);
	}

	/**
	 * Updates a NonNullExpression
	 * @param {NonNullExpression} newNode
	 * @param {NonNullExpression} existing
	 * @returns {NonNullExpression}
	 */
	private updateNonNullExpression (newNode: NonNullExpression, existing: NonNullExpression): NonNullExpression {
		this.updateLeftHandSideExpression(newNode, existing);

		existing.expression = this.update(newNode.expression, existing.expression);

		return this.extraTransformStep(newNode, existing);
	}

	/**
	 * Updates a TypeAssertion
	 * @param {TypeAssertion} newNode
	 * @param {TypeAssertion} existing
	 * @returns {TypeAssertion}
	 */
	private updateTypeAssertion (newNode: TypeAssertion, existing: TypeAssertion): TypeAssertion {
		this.updateUnaryExpression(newNode, existing);

		existing.expression = this.update(newNode.expression, existing.expression);
		existing.type = this.update(newNode.type, existing.type);

		return this.extraTransformStep(newNode, existing);
	}

	/**
	 * Updates a AsExpression
	 * @param {AsExpression} newNode
	 * @param {AsExpression} existing
	 * @returns {AsExpression}
	 */
	private updateAsExpression (newNode: AsExpression, existing: AsExpression): AsExpression {
		this.updateExpression(newNode, existing);

		existing.expression = this.update(newNode.expression, existing.expression);
		existing.type = this.update(newNode.type, existing.type);

		return this.extraTransformStep(newNode, existing);
	}

	/**
	 * Updates a TaggedTemplateExpression
	 * @param {TaggedTemplateExpression} newNode
	 * @param {TaggedTemplateExpression} existing
	 * @returns {TaggedTemplateExpression}
	 */
	private updateTaggedTemplateExpression (newNode: TaggedTemplateExpression, existing: TaggedTemplateExpression): TaggedTemplateExpression {
		this.updateMemberExpression(newNode, existing);

		existing.tag = this.update(newNode.tag, existing.tag);
		existing.template = this.update(newNode.template, existing.template);

		return this.extraTransformStep(newNode, existing);
	}

	/**
	 * Updates a SpreadElement
	 * @param {SpreadElement} newNode
	 * @param {SpreadElement} existing
	 * @returns {SpreadElement}
	 */
	private updateSpreadElement (newNode: SpreadElement, existing: SpreadElement): SpreadElement {
		this.updateExpression(newNode, existing);

		existing.expression = this.update(newNode.expression, existing.expression);

		return this.extraTransformStep(newNode, existing);
	}

	/**
	 * Updates a ArrayLiteralExpression
	 * @param {ArrayLiteralExpression} newNode
	 * @param {ArrayLiteralExpression} existing
	 * @returns {ArrayLiteralExpression}
	 */
	private updateArrayLiteralExpression (newNode: ArrayLiteralExpression, existing: ArrayLiteralExpression): ArrayLiteralExpression {
		this.updatePrimaryExpression(newNode, existing);

		existing.elements = this.updateAll(existing, newNode.elements, existing.elements);

		return this.extraTransformStep(newNode, existing);
	}

	/**
	 * Updates a TemplateSpan
	 * @param {TemplateSpan} newNode
	 * @param {TemplateSpan} existing
	 * @returns {TemplateSpan}
	 */
	private updateTemplateSpan (newNode: TemplateSpan, existing: TemplateSpan): TemplateSpan {
		this.updateNode(newNode, existing);

		existing.expression = this.update(newNode.expression, existing.expression);
		existing.literal = this.update(newNode.literal, existing.literal);

		return this.extraTransformStep(newNode, existing);
	}

	/**
	 * Updates TemplateSpans
	 * @param {Node} parent
	 * @param {NodeArray<TemplateSpan>} newNode
	 * @param {NodeArray<TemplateSpan>} existing
	 * @returns {NodeArray<TemplateSpan>}
	 */
	private updateTemplateSpans (parent: Node, newNode: NodeArray<TemplateSpan>, existing: NodeArray<TemplateSpan>): NodeArray<TemplateSpan> {
		return this.updateNodeArray(parent, newNode, existing, this.updateTemplateSpan);
	}

	/**
	 * Updates a TemplateExpression
	 * @param {TemplateExpression} newNode
	 * @param {TemplateExpression} existing
	 * @returns {TemplateExpression}
	 */
	private updateTemplateExpression (newNode: TemplateExpression, existing: TemplateExpression): TemplateExpression {
		this.updatePrimaryExpression(newNode, existing);

		existing.head = this.updateTemplateHead(newNode.head, existing.head);
		existing.templateSpans = this.updateTemplateSpans(existing, newNode.templateSpans, existing.templateSpans);

		return this.extraTransformStep(newNode, existing);
	}

	/**
	 * Updates a TemplateHead
	 * @param {TemplateHead} newNode
	 * @param {TemplateHead} existing
	 * @returns {TemplateHead}
	 */
	private updateTemplateHead (newNode: TemplateHead, existing: TemplateHead): TemplateHead {
		this.updateLiteralLikeNode(newNode, existing);
		return this.extraTransformStep(newNode, existing);
	}

	/**
	 * Updates a TemplateMiddle
	 * @param {TemplateMiddle} newNode
	 * @param {TemplateMiddle} existing
	 * @returns {TemplateMiddle}
	 */
	private updateTemplateMiddle (newNode: TemplateMiddle, existing: TemplateMiddle): TemplateMiddle {
		this.updateLiteralLikeNode(newNode, existing);
		return this.extraTransformStep(newNode, existing);
	}

	/**
	 * Updates a TemplateTail
	 * @param {TemplateTail} newNode
	 * @param {TemplateTail} existing
	 * @returns {TemplateTail}
	 */
	private updateTemplateTail (newNode: TemplateTail, existing: TemplateTail): TemplateTail {
		this.updateLiteralLikeNode(newNode, existing);
		return this.extraTransformStep(newNode, existing);
	}

	/**
	 * Updates a RegularExpressionLiteral
	 * @param {RegularExpressionLiteral} newNode
	 * @param {RegularExpressionLiteral} existing
	 * @returns {RegularExpressionLiteral}
	 */
	private updateRegularExpressionLiteral (newNode: RegularExpressionLiteral, existing: RegularExpressionLiteral): RegularExpressionLiteral {
		this.updateLiteralExpression(newNode, existing);
		return this.extraTransformStep(newNode, existing);
	}

	/**
	 * Updates a NoSubstitutionTemplateLiteral
	 * @param {NoSubstitutionTemplateLiteral} newNode
	 * @param {NoSubstitutionTemplateLiteral} existing
	 * @returns {NoSubstitutionTemplateLiteral}
	 */
	private updateNoSubstitutionTemplateLiteral (newNode: NoSubstitutionTemplateLiteral, existing: NoSubstitutionTemplateLiteral): NoSubstitutionTemplateLiteral {
		this.updateLiteralExpression(newNode, existing);
		return this.extraTransformStep(newNode, existing);
	}

	/**
	 * Updates a ArrowFunction
	 * @param {ArrowFunction} newNode
	 * @param {ArrowFunction} existing
	 * @returns {ArrowFunction}
	 */
	private updateArrowFunction (newNode: ArrowFunction, existing: ArrowFunction): ArrowFunction {
		this.updateExpression(newNode, existing);
		this.updateFunctionLikeDeclarationBase(newNode, existing);

		existing.equalsGreaterThanToken = this.updateToken(newNode.equalsGreaterThanToken, existing.equalsGreaterThanToken);
		existing.body = this.updateConciseBody(newNode.body, existing.body);

		return this.extraTransformStep(newNode, existing);
	}

	/**
	 * Updates a FunctionExpression
	 * @param {FunctionExpression} newNode
	 * @param {FunctionExpression} existing
	 * @returns {FunctionExpression}
	 */
	private updateFunctionExpression (newNode: FunctionExpression, existing: FunctionExpression): FunctionExpression {
		this.updatePrimaryExpression(newNode, existing);
		this.updateFunctionLikeDeclarationBase(newNode, existing);

		existing.name = this.updateNodeIfGiven(newNode.name, existing.name, this.updateIdentifier);
		existing.body = this.updateFunctionBody(newNode.body, existing.body);

		return this.extraTransformStep(newNode, existing);
	}

	/**
	 * Updates a YieldExpression
	 * @param {YieldExpression} newNode
	 * @param {YieldExpression} existing
	 * @returns {YieldExpression}
	 */
	private updateYieldExpression (newNode: YieldExpression, existing: YieldExpression): YieldExpression {
		this.updateExpression(newNode, existing);

		existing.asteriskToken = this.updateNodeIfGiven(newNode.asteriskToken, existing.asteriskToken, this.updateToken);
		existing.expression = this.updateNodeIfGiven(newNode.expression, existing.expression, this.update);

		return this.extraTransformStep(newNode, existing);
	}

	/**
	 * Updates a AwaitExpression
	 * @param {AwaitExpression} newNode
	 * @param {AwaitExpression} existing
	 * @returns {AwaitExpression}
	 */
	private updateAwaitExpression (newNode: AwaitExpression, existing: AwaitExpression): AwaitExpression {
		this.updateUnaryExpression(newNode, existing);

		existing.expression = this.update(newNode.expression, existing.expression);

		return this.extraTransformStep(newNode, existing);
	}

	/**
	 * Updates a VoidExpression
	 * @param {VoidExpression} newNode
	 * @param {VoidExpression} existing
	 * @returns {VoidExpression}
	 */
	private updateVoidExpression (newNode: VoidExpression, existing: VoidExpression): VoidExpression {
		this.updateUnaryExpression(newNode, existing);

		existing.expression = this.update(newNode.expression, existing.expression);

		return this.extraTransformStep(newNode, existing);
	}

	/**
	 * Updates a TypeOfExpression
	 * @param {TypeOfExpression} newNode
	 * @param {TypeOfExpression} existing
	 * @returns {TypeOfExpression}
	 */
	private updateTypeOfExpression (newNode: TypeOfExpression, existing: TypeOfExpression): TypeOfExpression {
		this.updateUnaryExpression(newNode, existing);

		existing.expression = this.update(newNode.expression, existing.expression);

		return this.extraTransformStep(newNode, existing);
	}

	/**
	 * Updates a DeleteExpression
	 * @param {DeleteExpression} newNode
	 * @param {DeleteExpression} existing
	 * @returns {DeleteExpression}
	 */
	private updateDeleteExpression (newNode: DeleteExpression, existing: DeleteExpression): DeleteExpression {
		this.updateUnaryExpression(newNode, existing);

		existing.expression = this.update(newNode.expression, existing.expression);

		return this.extraTransformStep(newNode, existing);
	}

	/**
	 * Updates a ImportExpression
	 * @param {ImportExpression} newNode
	 * @param {ImportExpression} existing
	 * @returns {ImportExpression}
	 */
	private updateImportExpression (newNode: ImportExpression, existing: ImportExpression): ImportExpression {
		this.updatePrimaryExpression(newNode, existing);

		return this.extraTransformStep(newNode, existing);
	}

	/**
	 * Updates a ThisExpression
	 * @param {ThisExpression} newNode
	 * @param {ThisExpression} existing
	 * @returns {ThisExpression}
	 */
	private updateThisExpression (newNode: ThisExpression, existing: ThisExpression): ThisExpression {
		this.updatePrimaryExpression(newNode, existing);
		this.updateKeywordTypeNode(newNode, existing);

		return this.extraTransformStep(newNode, existing);
	}

	/**
	 * Updates a SuperExpression
	 * @param {SuperExpression} newNode
	 * @param {SuperExpression} existing
	 * @returns {SuperExpression}
	 */
	private updateSuperExpression (newNode: SuperExpression, existing: SuperExpression): SuperExpression {
		this.updatePrimaryExpression(newNode, existing);

		return this.extraTransformStep(newNode, existing);
	}

	/**
	 * Updates an IterationStatement
	 * @param {IterationStatement} newNode
	 * @param {IterationStatement} existing
	 * @returns {IterationStatement}
	 */
	private updateIterationStatement (newNode: IterationStatement, existing: IterationStatement): IterationStatement {
		this.updateStatement(newNode, existing);

		existing.statement = this.update(newNode.statement, existing.statement);
		return existing;
	}

	/**
	 * Updates a KeywordTypeNode
	 * @param {KeywordTypeNode} newNode
	 * @param {KeywordTypeNode} existing
	 * @returns {KeywordTypeNode}
	 */
	private updateKeywordTypeNode (newNode: KeywordTypeNode, existing: KeywordTypeNode): KeywordTypeNode {
		this.updateTypeNode(newNode, existing);

		existing.kind = newNode.kind;
		return existing;
	}

	/**
	 * Updates a BooleanLiteral
	 * @param {BooleanLiteral} newNode
	 * @param {BooleanLiteral} existing
	 * @returns {BooleanLiteral}
	 */
	private updateBooleanLiteral (newNode: BooleanLiteral, existing: BooleanLiteral): BooleanLiteral {
		this.updatePrimaryExpression(newNode, existing);
		this.updateTypeNode(newNode, existing);

		existing.kind = newNode.kind;

		return this.extraTransformStep(newNode, existing);
	}

	/**
	 * Updates a NullLiteral
	 * @param {NullLiteral} newNode
	 * @param {NullLiteral} existing
	 * @returns {NullLiteral}
	 */
	private updateNullLiteral (newNode: NullLiteral, existing: NullLiteral): NullLiteral {
		this.updatePrimaryExpression(newNode, existing);
		this.updateTypeNode(newNode, existing);

		return this.extraTransformStep(newNode, existing);
	}

	/**
	 * Updates a PrefixUnaryExpression
	 * @param {PrefixUnaryExpression} newNode
	 * @param {PrefixUnaryExpression} existing
	 * @returns {PrefixUnaryExpression}
	 */
	private updatePrefixUnaryExpression (newNode: PrefixUnaryExpression, existing: PrefixUnaryExpression): PrefixUnaryExpression {
		this.updateUpdateExpression(newNode, existing);

		existing.operator = newNode.operator;
		existing.operand = this.update(newNode.operand, existing.operand);

		return this.extraTransformStep(newNode, existing);
	}

	/**
	 * Updates a PostfixUnaryExpression
	 * @param {PostfixUnaryExpression} newNode
	 * @param {PostfixUnaryExpression} existing
	 * @returns {PostfixUnaryExpression}
	 */
	private updatePostfixUnaryExpression (newNode: PostfixUnaryExpression, existing: PostfixUnaryExpression): PostfixUnaryExpression {
		this.updateUpdateExpression(newNode, existing);

		existing.operator = newNode.operator;
		existing.operand = this.update(newNode.operand, existing.operand);

		return this.extraTransformStep(newNode, existing);
	}

	/**
	 * Updates a LiteralTypeNode
	 * @param {LiteralTypeNode} newNode
	 * @param {LiteralTypeNode} existing
	 * @returns {LiteralTypeNode}
	 */
	private updateLiteralTypeNode (newNode: LiteralTypeNode, existing: LiteralTypeNode): LiteralTypeNode {
		this.updateTypeNode(newNode, existing);

		existing.literal = this.update(newNode.literal, existing.literal);

		return this.extraTransformStep(newNode, existing);
	}

	/**
	 * Updates a MappedTypeNode
	 * @param {MappedTypeNode} newNode
	 * @param {MappedTypeNode} existing
	 * @returns {MappedTypeNode}
	 */
	private updateMappedTypeNode (newNode: MappedTypeNode, existing: MappedTypeNode): MappedTypeNode {
		this.updateTypeNode(newNode, existing);
		this.updateDeclaration(newNode, existing);

		existing.readonlyToken = this.updateNodeIfGiven(newNode.readonlyToken, existing.readonlyToken, this.updateToken);
		existing.questionToken = this.updateNodeIfGiven(newNode.questionToken, existing.questionToken, this.updateToken);
		existing.typeParameter = this.updateTypeParameterDeclaration(newNode.typeParameter, existing.typeParameter);
		existing.type = this.updateNodeIfGiven(newNode.type, existing.type, this.update);

		return this.extraTransformStep(newNode, existing);
	}

	/**
	 * Updates a IndexedAccessTypeNode
	 * @param {IndexedAccessTypeNode} newNode
	 * @param {IndexedAccessTypeNode} existing
	 * @returns {IndexedAccessTypeNode}
	 */
	private updateIndexedAccessTypeNode (newNode: IndexedAccessTypeNode, existing: IndexedAccessTypeNode): IndexedAccessTypeNode {
		this.updateTypeNode(newNode, existing);

		existing.objectType = this.update(newNode.objectType, existing.objectType);
		existing.indexType = this.update(newNode.indexType, existing.indexType);

		return this.extraTransformStep(newNode, existing);
	}

	/**
	 * Updates a TypeOperatorNode
	 * @param {TypeOperatorNode} newNode
	 * @param {TypeOperatorNode} existing
	 * @returns {TypeOperatorNode}
	 */
	private updateTypeOperatorNode (newNode: TypeOperatorNode, existing: TypeOperatorNode): TypeOperatorNode {
		this.updateTypeNode(newNode, existing);

		existing.operator = newNode.operator;
		existing.type = this.update(newNode.type, existing.type);

		return this.extraTransformStep(newNode, existing);
	}

	/**
	 * Updates a ParenthesizedTypeNode
	 * @param {ParenthesizedTypeNode} newNode
	 * @param {ParenthesizedTypeNode} existing
	 * @returns {ParenthesizedTypeNode}
	 */
	private updateParenthesizedTypeNode (newNode: ParenthesizedTypeNode, existing: ParenthesizedTypeNode): ParenthesizedTypeNode {
		this.updateTypeNode(newNode, existing);

		existing.type = this.update(newNode.type, existing.type);

		return this.extraTransformStep(newNode, existing);
	}

	/**
	 * Updates a UnionTypeNode
	 * @param {UnionTypeNode} newNode
	 * @param {UnionTypeNode} existing
	 * @returns {UnionTypeNode}
	 */
	private updateUnionTypeNode (newNode: UnionTypeNode, existing: UnionTypeNode): UnionTypeNode {
		this.updateTypeNode(newNode, existing);

		existing.types = this.updateAll(existing, newNode.types, existing.types);

		return this.extraTransformStep(newNode, existing);
	}

	/**
	 * Updates a IntersectionTypeNode
	 * @param {IntersectionTypeNode} newNode
	 * @param {IntersectionTypeNode} existing
	 * @returns {IntersectionTypeNode}
	 */
	private updateIntersectionTypeNode (newNode: IntersectionTypeNode, existing: IntersectionTypeNode): IntersectionTypeNode {
		this.updateTypeNode(newNode, existing);

		existing.types = this.updateAll(existing, newNode.types, existing.types);

		return this.extraTransformStep(newNode, existing);
	}

	/**
	 * Updates a TupleTypeNode
	 * @param {TupleTypeNode} newNode
	 * @param {TupleTypeNode} existing
	 * @returns {TupleTypeNode}
	 */
	private updateTupleTypeNode (newNode: TupleTypeNode, existing: TupleTypeNode): TupleTypeNode {
		this.updateTypeNode(newNode, existing);

		existing.elementTypes = this.updateAll(existing, newNode.elementTypes, existing.elementTypes);

		return this.extraTransformStep(newNode, existing);
	}

	/**
	 * Updates a ConstructorTypeNode
	 * @param {ConstructorTypeNode} newNode
	 * @param {ConstructorTypeNode} existing
	 * @returns {ConstructorTypeNode}
	 */
	private updateConstructorTypeNode (newNode: ConstructorTypeNode, existing: ConstructorTypeNode): ConstructorTypeNode {
		this.updateTypeNode(newNode, existing);
		this.updateSignatureDeclaration(newNode, existing);

		return this.extraTransformStep(newNode, existing);
	}

	/**
	 * Updates a TypeQueryNode
	 * @param {TypeQueryNode} newNode
	 * @param {TypeQueryNode} existing
	 * @returns {TypeQueryNode}
	 */
	private updateTypeQueryNode (newNode: TypeQueryNode, existing: TypeQueryNode): TypeQueryNode {
		this.updateTypeNode(newNode, existing);

		existing.exprName = this.updateEntityName(newNode.exprName, existing.exprName);

		return this.extraTransformStep(newNode, existing);
	}

	/**
	 * Updates a TypeLiteralNode
	 * @param {TypeLiteralNode} newNode
	 * @param {TypeLiteralNode} existing
	 * @returns {TypeLiteralNode}
	 */
	private updateTypeLiteralNode (newNode: TypeLiteralNode, existing: TypeLiteralNode): TypeLiteralNode {
		this.updateTypeNode(newNode, existing);
		this.updateDeclaration(newNode, existing);

		existing.members = this.updateAll(existing, newNode.members, existing.members);

		return this.extraTransformStep(newNode, existing);
	}

	/**
	 * Updates a ArrayTypeNode
	 * @param {ArrayTypeNode} newNode
	 * @param {ArrayTypeNode} existing
	 * @returns {ArrayTypeNode}
	 */
	private updateArrayTypeNode (newNode: ArrayTypeNode, existing: ArrayTypeNode): ArrayTypeNode {
		this.updateTypeNode(newNode, existing);

		existing.elementType = this.update(newNode.elementType, existing.elementType);

		return this.extraTransformStep(newNode, existing);
	}

	/**
	 * Updates the TextRange of a Node
	 * @param {TextRange} newNode
	 * @param {TextRange} existing
	 * @returns {TextRange}
	 */
	private updateTextRange (newNode: TextRange, existing: TextRange): TextRange {
		existing.pos = newNode.pos;
		existing.end = newNode.end;
		return existing;
	}

	/**
	 * Updates a Node if it is given
	 * @param {T} newNode
	 * @param {T} existing
	 * @param {(newNode: T, existing: T) => T} handler
	 * @returns {T}
	 */
	private updateNodeIfGiven<T extends Node> (newNode: T|undefined, existing: T|undefined, handler: (newNode: T, existing: T) => T): T|undefined {
		const boundHandler = handler.bind(this);
		return existing == null ? newNode : newNode == null ? undefined : boundHandler(newNode, existing);
	}

	/**
	 * Updates a NodeArray of Nodes if given
	 * @param {Node} parent
	 * @param {NodeArray<T extends Node>} newNode
	 * @param {NodeArray<T extends Node>} existing
	 * @param {(newNode: NodeArray<T extends Node>, existing: NodeArray<T extends Node>) => NodeArray<T extends Node>} handler
	 * @returns {NodeArray<T extends Node>}
	 */
	private updateNodesIfGiven<T extends Node> (parent: Node, newNode: NodeArray<T>|undefined, existing: NodeArray<T>|undefined, handler: (parent: Node, newNode: NodeArray<T>, existing: NodeArray<T>) => NodeArray<T>): NodeArray<T>|undefined {
		const boundHandler = handler.bind(this);
		return existing == null ? newNode : newNode == null ? undefined : boundHandler(parent, newNode, existing);
	}

	/**
	 * Updates a Node
	 * @param {Node} newNode
	 * @param {Node} existing
	 * @returns {Node}
	 */
	private updateNode (newNode: Node, existing: Node): Node {
		this.updateTextRange(newNode, existing);

		existing.flags = newNode.flags;
		existing.decorators = this.updateNodesIfGiven(existing, newNode.decorators, existing.decorators, this.updateDecorators);
		existing.modifiers = this.updateNodesIfGiven(existing, newNode.modifiers, existing.modifiers, this.updateModifiers);
		return existing;
	}

	/**
	 * Updates a ObjectLiteralExpression
	 * @param {ObjectLiteralExpression} newNode
	 * @param {ObjectLiteralExpression} existing
	 * @returns {ObjectLiteralExpression}
	 */
	private updateObjectLiteralExpression (newNode: ObjectLiteralExpression, existing: ObjectLiteralExpression): ObjectLiteralExpression {
		this.updateObjectLiteralExpressionBase<ObjectLiteralElementLike>(newNode, existing);

		return this.extraTransformStep(newNode, existing);
	}

	/**
	 * Updates a ObjectLiteralExpressionBase
	 * @param {ObjectLiteralExpressionBase} newNode
	 * @param {ObjectLiteralExpressionBase} existing
	 * @returns {ObjectLiteralExpressionBase}
	 */
	private updateObjectLiteralExpressionBase<T extends ObjectLiteralElement> (newNode: ObjectLiteralExpressionBase<T>, existing: ObjectLiteralExpressionBase<T>): ObjectLiteralExpressionBase<T> {
		this.updatePrimaryExpression(newNode, existing);
		this.updateDeclaration(newNode, existing);

		existing.properties = this.updateAll(existing, newNode.properties, existing.properties);

		return existing;
	}

	/**
	 * Updates a Decorator
	 * @param {Decorator} newNode
	 * @param {Decorator} existing
	 * @returns {Decorator}
	 */
	private updateDecorator (newNode: Decorator, existing: Decorator): Decorator {
		this.updateNode(newNode, existing);

		existing.expression = this.update(newNode.expression, existing.expression);
		return this.extraTransformStep(newNode, existing);
	}

	/**
	 * Updates a ObjectLiteralElement
	 * @param {ObjectLiteralElement} newNode
	 * @param {ObjectLiteralElement} existing
	 * @returns {ObjectLiteralElement}
	 */
	private updateObjectLiteralElement (newNode: ObjectLiteralElement, existing: ObjectLiteralElement): ObjectLiteralElement {
		this.updateNamedDeclaration(newNode, existing);

		existing._objectLiteralBrandBrand = newNode._objectLiteralBrandBrand;
		existing.name = this.updateNodeIfGiven(newNode.name, existing.name, this.updatePropertyName);

		return existing;
	}

	/**
	 * Updates a PropertyAssignment
	 * @param {PropertyAssignment} newNode
	 * @param {PropertyAssignment} existing
	 * @returns {PropertyAssignment}
	 */
	private updatePropertyAssignment (newNode: PropertyAssignment, existing: PropertyAssignment): PropertyAssignment {
		this.updateObjectLiteralElement(newNode, existing);

		existing.name = this.updatePropertyName(newNode.name, existing.name);
		existing.questionToken = this.updateNodeIfGiven(newNode.questionToken, existing.questionToken, this.updateToken);
		existing.initializer = this.update(newNode.initializer, existing.initializer);

		return this.extraTransformStep(newNode, existing);
	}

	/**
	 * Updates a VariableStatement
	 * @param {VariableStatement} newNode
	 * @param {VariableStatement} existing
	 * @returns {VariableStatement}
	 */
	private updateVariableStatement (newNode: VariableStatement, existing: VariableStatement): VariableStatement {
		this.updateStatement(newNode, existing);

		existing.declarationList = this.updateVariableDeclarationList(newNode.declarationList, existing.declarationList);

		return this.extraTransformStep(newNode, existing);
	}

	/**
	 * Updates a VariableDeclarationList
	 * @param {VariableDeclarationList} newNode
	 * @param {VariableDeclarationList} existing
	 * @returns {VariableDeclarationList}
	 */
	private updateVariableDeclarationList (newNode: VariableDeclarationList, existing: VariableDeclarationList): VariableDeclarationList {
		this.updateNode(newNode, existing);

		existing.declarations = this.updateVariableDeclarations(existing, newNode.declarations, existing.declarations);

		return this.extraTransformStep(newNode, existing);
	}

	/**
	 * Updates a VariableDeclarationList
	 * @param {VariableDeclarationList} newNode
	 * @param {VariableDeclarationList} existing
	 * @returns {VariableDeclarationList}
	 */
	private updateVariableDeclaration (newNode: VariableDeclaration, existing: VariableDeclaration): VariableDeclaration {
		this.updateNamedDeclaration(newNode, existing);

		existing.name = this.updateBindingName(newNode.name, existing.name);
		existing.type = this.updateNodeIfGiven(newNode.type, existing.type, this.update);
		existing.initializer = this.updateNodeIfGiven(newNode.initializer, existing.initializer, this.update);

		return this.extraTransformStep(newNode, existing);
	}

	/**
	 * Updates VariableDeclarations
	 * @param {Node} parent
	 * @param {NodeArray<VariableDeclaration>} newNode
	 * @param {NodeArray<VariableDeclaration>} existing
	 * @returns {NodeArray<VariableDeclaration>}
	 */
	private updateVariableDeclarations (parent: Node, newNode: NodeArray<VariableDeclaration>, existing: NodeArray<VariableDeclaration>): NodeArray<VariableDeclaration> {
		return this.updateNodeArray(parent, newNode, existing, this.updateVariableDeclaration);
	}

	/**
	 * Updates a BinaryExpression
	 * @param {BinaryExpression} newNode
	 * @param {BinaryExpression} existing
	 * @returns {BinaryExpression}
	 */
	private updateBinaryExpression (newNode: BinaryExpression, existing: BinaryExpression): BinaryExpression {
		this.updateExpression(newNode, existing);
		this.updateDeclaration(newNode, existing);

		existing.left = this.update(newNode.left, existing.left);
		existing.operatorToken = this.updateToken(newNode.operatorToken, existing.operatorToken);
		existing.right = this.update(newNode.right, existing.right);

		return this.extraTransformStep(newNode, existing);
	}

	/**
	 * Updates a ParenthesizedExpression
	 * @param {ParenthesizedExpression} newNode
	 * @param {ParenthesizedExpression} existing
	 * @returns {ParenthesizedExpression}
	 */
	private updateParenthesizedExpression (newNode: ParenthesizedExpression, existing: ParenthesizedExpression): ParenthesizedExpression {
		this.updatePrimaryExpression(newNode, existing);

		existing.expression = this.update(newNode.expression, existing.expression);

		return this.extraTransformStep(newNode, existing);
	}

	/**
	 * Updates a ConditionalExpression
	 * @param {ConditionalExpression} newNode
	 * @param {ConditionalExpression} existing
	 * @returns {ConditionalExpression}
	 */
	private updateConditionalExpression (newNode: ConditionalExpression, existing: ConditionalExpression): ConditionalExpression {
		this.updateExpression(newNode, existing);

		existing.condition = this.update(newNode.condition, existing.condition);
		existing.questionToken = this.updateToken(newNode.questionToken, existing.questionToken);
		existing.colonToken = this.updateToken(newNode.colonToken, existing.colonToken);
		existing.whenTrue = this.update(newNode.whenTrue, existing.whenTrue);
		existing.whenFalse = this.update(newNode.whenFalse, existing.whenFalse);

		return this.extraTransformStep(newNode, existing);
	}

	/**
	 * Updates a ShorthandPropertyAssignment
	 * @param {ShorthandPropertyAssignment} newNode
	 * @param {ShorthandPropertyAssignment} existing
	 * @returns {ShorthandPropertyAssignment}
	 */
	private updateShorthandPropertyAssignment (newNode: ShorthandPropertyAssignment, existing: ShorthandPropertyAssignment): ShorthandPropertyAssignment {
		this.updateObjectLiteralElement(newNode, existing);

		existing.name = this.updateIdentifier(newNode.name, existing.name);
		existing.questionToken = this.updateNodeIfGiven(newNode.questionToken, existing.questionToken, this.updateToken);
		existing.equalsToken = this.updateNodeIfGiven(newNode.equalsToken, existing.equalsToken, this.updateToken);
		existing.objectAssignmentInitializer = this.updateNodeIfGiven(newNode.objectAssignmentInitializer, existing.objectAssignmentInitializer, this.update);

		return this.extraTransformStep(newNode, existing);
	}

	/**
	 * Updates a SpreadAssignment
	 * @param {SpreadAssignment} newNode
	 * @param {SpreadAssignment} existing
	 * @returns {SpreadAssignment}
	 */
	private updateSpreadAssignment (newNode: SpreadAssignment, existing: SpreadAssignment): SpreadAssignment {
		this.updateObjectLiteralElement(newNode, existing);

		existing.expression = this.update(newNode.expression, existing.expression);

		return this.extraTransformStep(newNode, existing);
	}

	/**
	 * Updates a MethodDeclaration
	 * @param {MethodDeclaration} newNode
	 * @param {MethodDeclaration} existing
	 * @returns {MethodDeclaration}
	 */
	private updateMethodDeclaration (newNode: MethodDeclaration, existing: MethodDeclaration): MethodDeclaration {
		this.updateFunctionLikeDeclarationBase(newNode, existing);
		this.updateClassElement(newNode, existing);
		this.updateObjectLiteralElement(newNode, existing);

		existing.name = this.updatePropertyName(newNode.name, existing.name);
		existing.body = this.updateNodeIfGiven(newNode.body, existing.body, this.updateFunctionBody);

		return this.extraTransformStep(newNode, existing);
	}

	/**
	 * Updates a GetAccessorDeclaration
	 * @param {AccessorDeclaration} newNode
	 * @param {AccessorDeclaration} existing
	 * @returns {AccessorDeclaration}
	 */
	private updateGetAccessorDeclaration (newNode: GetAccessorDeclaration, existing: GetAccessorDeclaration): GetAccessorDeclaration {
		this.updateFunctionLikeDeclarationBase(newNode, existing);
		this.updateClassElement(newNode, existing);
		this.updateObjectLiteralElement(newNode, existing);

		existing.name = this.updatePropertyName(newNode.name, existing.name);
		existing.body = this.updateFunctionBody(newNode.body, existing.body);

		return this.extraTransformStep(newNode, existing);
	}

	/**
	 * Updates a QualifiedName
	 * @param {QualifiedName} newNode
	 * @param {QualifiedName} existing
	 * @returns {QualifiedName}
	 */
	private updateQualifiedName (newNode: QualifiedName, existing: QualifiedName): QualifiedName {
		this.updateNode(newNode, existing);

		existing.left = this.updateEntityName(newNode.left, existing.left);
		existing.right = this.updateIdentifier(newNode.right, existing.right);

		return this.extraTransformStep(newNode, existing);
	}

	/**
	 * Updates a SetAccessorDeclaration
	 * @param {SetAccessorDeclaration} newNode
	 * @param {SetAccessorDeclaration} existing
	 * @returns {SetAccessorDeclaration}
	 */
	private updateSetAccessorDeclaration (newNode: SetAccessorDeclaration, existing: SetAccessorDeclaration): SetAccessorDeclaration {
		this.updateFunctionLikeDeclarationBase(newNode, existing);
		this.updateClassElement(newNode, existing);
		this.updateObjectLiteralElement(newNode, existing);

		existing.name = this.updatePropertyName(newNode.name, existing.name);
		existing.body = this.updateFunctionBody(newNode.body, existing.body);

		return this.extraTransformStep(newNode, existing);
	}

	/**
	 * Updates a FunctionTypeNode
	 * @param {FunctionTypeNode} newNode
	 * @param {FunctionTypeNode} existing
	 * @returns {FunctionTypeNode}
	 */
	private updateFunctionTypeNode (newNode: FunctionTypeNode, existing: FunctionTypeNode): FunctionTypeNode {
		this.updateTypeNode(newNode, existing);
		this.updateSignatureDeclaration(newNode, existing);

		return this.extraTransformStep(newNode, existing);
	}

	/**
	 * Updates a Modifier
	 * @param {Modifier} newNode
	 * @param {Modifier} existing
	 * @returns {Node}
	 */
	private updateModifier (newNode: Modifier, existing: Modifier): Modifier {
		return <Modifier> this.updateToken(newNode, existing);
	}

	/**
	 * Updates Modifiers
	 * @param {Node} parent
	 * @param {NodeArray<Modifier>} newNode
	 * @param {NodeArray<Modifier>} existing
	 */
	private updateModifiers (parent: Node, newNode: NodeArray<Modifier>, existing: NodeArray<Modifier>): NodeArray<Modifier> {
		return this.updateNodeArray(parent, newNode, existing, this.updateModifier);
	}

	/**
	 * Updates Decorators
	 * @param {Node} parent
	 * @param {NodeArray<Decorator>} newNode
	 * @param {NodeArray<Decorator>} existing
	 */
	private updateDecorators (parent: Node, newNode: NodeArray<Decorator>, existing: NodeArray<Decorator>): NodeArray<Decorator> {
		return this.updateNodeArray(parent, newNode, existing, this.updateDecorator);
	}

	/**
	 * Updates a Declaration
	 * @param {Declaration} newNode
	 * @param {Declaration} existing
	 * @returns {Declaration}
	 */
	private updateDeclaration (newNode: Declaration, existing: Declaration): Declaration {
		this.updateNode(newNode, existing);
		existing._declarationBrand = newNode._declarationBrand;
		return existing;
	}

	/**
	 * Updates a Token
	 * @param {Token<TKind extends SyntaxKind>} newNode
	 * @param {Token<TKind extends SyntaxKind>} existing
	 * @returns {Token<TKind extends SyntaxKind>}
	 */
	private updateToken<TKind extends SyntaxKind> (newNode: Token<TKind>, existing: Token<TKind>): Token<TKind> {
		this.updateNode(newNode, existing);
		existing.kind = newNode.kind;
		return this.extraTransformStep(newNode, existing);
	}

	/**
	 * Updates an AmdDependency
	 * @param {AmdDependency} newNode
	 * @param {AmdDependency} existing
	 * @returns {AmdDependency}
	 */
	private updateAmdDependency (newNode: AmdDependency, existing: AmdDependency): AmdDependency {
		existing.name = newNode.name;
		existing.path = newNode.path;
		return existing;
	}

	/**
	 * Updates AmdDependencies
	 * @param {AmdDependency[]} newNode
	 * @param {AmdDependency[]} existing
	 */
	private updateAmdDependencies (newNode: AmdDependency[], existing: AmdDependency[]): AmdDependency[] {
		return this.updateArray(newNode, existing, this.updateAmdDependency);
	}

	/**
	 * Updates FileReferences
	 * @param {FileReference[]} newNode
	 * @param {FileReference[]} existing
	 */
	private updateFileReferences (newNode: FileReference[], existing: FileReference[]): FileReference[] {
		return this.updateArray(newNode, existing, this.updateFileReference);
	}

	/**
	 * Updates Statements
	 * @param {Node} parent
	 * @param {NodeArray<Statement>} newNode
	 * @param {NodeArray<Statement>} existing
	 */
	private updateStatements (parent: Node, newNode: NodeArray<Statement>, existing: NodeArray<Statement>): NodeArray<Statement> {
		return this.updateNodeArray(parent, newNode, existing, this.update);
	}

	/**
	 * Updates Nodes
	 * @template T
	 * @param {Node} parent
	 * @param {NodeArray<T>} newNode
	 * @param {NodeArray<T>} existing
	 */
	private updateAll<T extends Node> (parent: Node, newNode: NodeArray<T>, existing: NodeArray<T>): NodeArray<T> {
		return this.updateNodeArray(parent, newNode, existing, this.update);
	}

	/**
	 * Updates a FileReference
	 * @param {FileReference} newNode
	 * @param {FileReference} existing
	 */
	private updateFileReference (newNode: FileReference, existing: FileReference): FileReference {
		this.updateTextRange(newNode, existing);
		existing.fileName = newNode.fileName;

		return existing;
	}

	/**
	 * Updates an Expression
	 * @param {Expression} newNode
	 * @param {Expression} existing
	 * @returns {Expression}
	 */
	private updateExpression (newNode: Expression, existing: Expression): Expression {
		this.updateNode(newNode, existing);

		existing._expressionBrand = newNode._expressionBrand;

		return existing;
	}

	/**
	 * Updates a UnaryExpression
	 * @param {UnaryExpression} newNode
	 * @param {UnaryExpression} existing
	 * @returns {UnaryExpression}
	 */
	private updateUnaryExpression (newNode: UnaryExpression, existing: UnaryExpression): UnaryExpression {
		this.updateExpression(newNode, existing);

		existing._unaryExpressionBrand = newNode._unaryExpressionBrand;

		return existing;
	}

	/**
	 * Updates a UpdateExpression
	 * @param {UpdateExpression} newNode
	 * @param {UpdateExpression} existing
	 * @returns {UpdateExpression}
	 */
	private updateUpdateExpression (newNode: UpdateExpression, existing: UpdateExpression): UpdateExpression {
		this.updateUnaryExpression(newNode, existing);

		existing._updateExpressionBrand = newNode._updateExpressionBrand;

		return existing;
	}

	/**
	 * Updates a LeftHandSideExpression
	 * @param {LeftHandSideExpression} newNode
	 * @param {LeftHandSideExpression} existing
	 * @returns {LeftHandSideExpression}
	 */
	private updateLeftHandSideExpression (newNode: LeftHandSideExpression, existing: LeftHandSideExpression): LeftHandSideExpression {
		this.updateUpdateExpression(newNode, existing);

		existing._leftHandSideExpressionBrand = newNode._leftHandSideExpressionBrand;

		return existing;
	}

	/**
	 * Updates a MemberExpression
	 * @param {MemberExpression} newNode
	 * @param {MemberExpression} existing
	 * @returns {MemberExpression}
	 */
	private updateMemberExpression (newNode: MemberExpression, existing: MemberExpression): MemberExpression {
		this.updateLeftHandSideExpression(newNode, existing);

		existing._memberExpressionBrand = newNode._memberExpressionBrand;

		return existing;
	}

	/**
	 * Updates a PrimaryExpression
	 * @param {PrimaryExpression} newNode
	 * @param {PrimaryExpression} existing
	 * @returns {PrimaryExpression}
	 */
	private updatePrimaryExpression (newNode: PrimaryExpression, existing: PrimaryExpression): PrimaryExpression {
		this.updateMemberExpression(newNode, existing);

		existing._primaryExpressionBrand = newNode._primaryExpressionBrand;

		return existing;
	}

	/**
	 * Updates an Identifier
	 * @param {Identifier} newNode
	 * @param {Identifier} existing
	 * @returns {Identifier}
	 */
	private updateIdentifier (newNode: Identifier, existing: Identifier): Identifier {
		this.updatePrimaryExpression(newNode, existing);

		existing.escapedText = newNode.escapedText;
		existing.originalKeywordKind = newNode.originalKeywordKind;
		existing.isInJSDocNamespace = newNode.isInJSDocNamespace;

		return this.extraTransformStep(newNode, existing);
	}

	/**
	 * Updates an NamedDeclaration
	 * @param {NamedDeclaration} newNode
	 * @param {NamedDeclaration} existing
	 * @returns {NamedDeclaration}
	 */
	private updateNamedDeclaration (newNode: NamedDeclaration, existing: NamedDeclaration): NamedDeclaration {
		this.updateDeclaration(newNode, existing);

		existing.name = this.updateNodeIfGiven(newNode.name, existing.name, this.updateDeclarationName);

		return existing;
	}

	/**
	 * Updates an DeclarationName
	 * @param {DeclarationName} newNode
	 * @param {DeclarationName} existing
	 * @returns {DeclarationName}
	 */
	private updateDeclarationName (newNode: DeclarationName, existing: DeclarationName): DeclarationName {
		return this.update(newNode, existing);
	}

	/**
	 * Updates a PropertyName
	 * @param {PropertyName} newNode
	 * @param {PropertyName} existing
	 * @returns {PropertyName}
	 */
	private updatePropertyName (newNode: PropertyName, existing: PropertyName): PropertyName {
		return this.update(newNode, existing);
	}

	/**
	 * Updates a TypeNode
	 * @param {TypeNode} newNode
	 * @param {TypeNode} existing
	 * @returns {TypeNode}
	 */
	private updateTypeNode (newNode: TypeNode, existing: TypeNode): TypeNode {
		this.updateNode(newNode, existing);

		existing._typeNodeBrand = newNode._typeNodeBrand;

		return existing;
	}

	/**
	 * Updates a EntityName
	 * @param {EntityName} newNode
	 * @param {EntityName} existing
	 * @returns {EntityName}
	 */
	private updateEntityName (newNode: EntityName, existing: EntityName): EntityName {
		return this.update(newNode, existing);
	}

	/**
	 * Updates a TypeReferenceNode
	 * @param {TypeReferenceNode} newNode
	 * @param {TypeReferenceNode} existing
	 * @returns {TypeReferenceNode}
	 */
	private updateTypeReferenceNode (newNode: TypeReferenceNode, existing: TypeReferenceNode): TypeReferenceNode {
		this.updateTypeNode(newNode, existing);

		existing.typeName = this.updateEntityName(newNode.typeName, existing.typeName);
		existing.typeArguments = this.updateNodesIfGiven(existing, newNode.typeArguments, existing.typeArguments, this.updateAll);

		return this.extraTransformStep(newNode, existing);
	}

	/**
	 * Updates a TypePredicateNode
	 * @param {TypePredicateNode} newNode
	 * @param {TypePredicateNode} existing
	 * @returns {TypePredicateNode}
	 */
	private updateTypePredicateNode (newNode: TypePredicateNode, existing: TypePredicateNode): TypePredicateNode {
		this.updateTypeNode(newNode, existing);

		existing.parameterName = this.update(newNode.parameterName, existing.parameterName);
		existing.type = this.update(newNode.type, existing.type);

		return this.extraTransformStep(newNode, existing);
	}

	/**
	 * Updates a ClassLikeDeclaration
	 * @param {ClassLikeDeclaration} newNode
	 * @param {ClassLikeDeclaration} existing
	 * @returns {ClassLikeDeclaration}
	 */
	private updateClassLikeDeclaration (newNode: ClassLikeDeclaration, existing: ClassLikeDeclaration): ClassLikeDeclaration {
		this.updateNamedDeclaration(newNode, existing);

		existing.name = this.updateNodeIfGiven(newNode.name, existing.name, this.updateIdentifier);
		existing.typeParameters = this.updateNodesIfGiven(existing, newNode.typeParameters, existing.typeParameters, this.updateTypeParameterDeclarations);
		existing.heritageClauses = this.updateNodesIfGiven(existing, newNode.heritageClauses, existing.heritageClauses, this.updateHeritageClauses);
		existing.members = this.updateAll(existing, newNode.members, existing.members);

		return existing;
	}

	/**
	 * Updates a PropertyDeclaration
	 * @param {PropertyDeclaration} newNode
	 * @param {PropertyDeclaration} existing
	 * @returns {PropertyDeclaration}
	 */
	private updatePropertyDeclaration (newNode: PropertyDeclaration, existing: PropertyDeclaration): PropertyDeclaration {
		this.updateClassElement(newNode, existing);

		existing.questionToken = this.updateNodeIfGiven(newNode.questionToken, existing.questionToken, this.updateToken);
		existing.name = this.updatePropertyName(newNode.name, existing.name);
		existing.type = this.updateNodeIfGiven(newNode.type, existing.type, this.update);
		existing.initializer = this.updateNodeIfGiven(newNode.initializer, existing.initializer, this.update);

		return this.extraTransformStep(newNode, existing);
	}

	/**
	 * Updates a FunctionDeclaration
	 * @param {FunctionDeclaration} newNode
	 * @param {FunctionDeclaration} existing
	 * @returns {FunctionDeclaration}
	 */
	private updateFunctionDeclaration (newNode: FunctionDeclaration, existing: FunctionDeclaration): FunctionDeclaration {
		this.updateFunctionLikeDeclarationBase(newNode, existing);
		this.updateDeclarationStatement(newNode, existing);

		existing.name = this.updateNodeIfGiven(newNode.name, existing.name, this.updateIdentifier);
		existing.body = this.updateNodeIfGiven(newNode.body, existing.body, this.updateFunctionBody);

		return this.extraTransformStep(newNode, existing);
	}

	/**
	 * Updates a MethodSignature
	 * @param {MethodSignature} newNode
	 * @param {MethodSignature} existing
	 * @returns {MethodSignature}
	 */
	private updateMethodSignature (newNode: MethodSignature, existing: MethodSignature): MethodSignature {
		this.updateSignatureDeclaration(newNode, existing);
		this.updateTypeElement(newNode, existing);

		existing.name = this.updatePropertyName(newNode.name, existing.name);

		return this.extraTransformStep(newNode, existing);
	}

	/**
	 * Updates a FunctionLikeDeclarationBase
	 * @param {FunctionLikeDeclarationBase} newNode
	 * @param {FunctionLikeDeclarationBase} existing
	 * @returns {FunctionLikeDeclarationBase}
	 */
	private updateSignatureDeclaration (newNode: SignatureDeclaration, existing: SignatureDeclaration): SignatureDeclaration {
		this.updateNamedDeclaration(newNode, existing);

		existing.name = this.updateNodeIfGiven(newNode.name, existing.name, this.updatePropertyName);
		existing.typeParameters = this.updateNodesIfGiven(existing, newNode.typeParameters, existing.typeParameters, this.updateTypeParameterDeclarations);
		existing.parameters = this.updateParameterDeclarations(existing, newNode.parameters, existing.parameters);
		existing.type = this.updateNodeIfGiven(newNode.type, existing.type, this.update);

		return existing;
	}

	/**
	 * Updates a FunctionLikeDeclarationBase
	 * @param {FunctionLikeDeclarationBase} newNode
	 * @param {FunctionLikeDeclarationBase} existing
	 * @returns {FunctionLikeDeclarationBase}
	 */
	private updateFunctionLikeDeclarationBase (newNode: FunctionLikeDeclarationBase, existing: FunctionLikeDeclarationBase): FunctionLikeDeclarationBase {
		this.updateSignatureDeclaration(newNode, existing);

		existing.asteriskToken = this.updateNodeIfGiven(newNode.asteriskToken, existing.asteriskToken, this.updateToken);
		existing.questionToken = this.updateNodeIfGiven(newNode.questionToken, existing.questionToken, this.updateToken);
		existing.body = this.updateNodeIfGiven(newNode.body, existing.body, this.update);
		existing._functionLikeDeclarationBrand = newNode._functionLikeDeclarationBrand;

		return existing;
	}

	/**
	 * Updates a ParameterDeclaration
	 * @param {ParameterDeclaration} newNode
	 * @param {ParameterDeclaration} existing
	 * @returns {ParameterDeclaration}
	 */
	private updateParameterDeclaration (newNode: ParameterDeclaration, existing: ParameterDeclaration): ParameterDeclaration {
		this.updateNamedDeclaration(newNode, existing);

		existing.dotDotDotToken = this.updateNodeIfGiven(newNode.dotDotDotToken, existing.dotDotDotToken, this.updateToken);
		existing.questionToken = this.updateNodeIfGiven(newNode.questionToken, existing.questionToken, this.updateToken);
		existing.type = this.updateNodeIfGiven(newNode.type, existing.type, this.update);
		existing.initializer = this.updateNodeIfGiven(newNode.initializer, existing.initializer, this.update);
		existing.name = this.updateBindingName(newNode.name, existing.name);
		return this.extraTransformStep(newNode, existing);
	}

	/**
	 * Updates a BindingName
	 * @param {BindingName} newNode
	 * @param {BindingName} existing
	 * @returns {BindingName}
	 */
	private updateBindingName (newNode: BindingName, existing: BindingName): BindingName {
		return this.update(newNode, existing);
	}

	/**
	 * Updates an ObjectBindingPattern
	 * @param {ObjectBindingPattern} newNode
	 * @param {ObjectBindingPattern} existing
	 * @returns {ObjectBindingPattern}
	 */
	private updateObjectBindingPattern (newNode: ObjectBindingPattern, existing: ObjectBindingPattern): ObjectBindingPattern {
		this.updateNode(newNode, existing);

		existing.elements = this.updateBindingElements(existing, newNode.elements, existing.elements);

		return this.extraTransformStep(newNode, existing);
	}

	/**
	 * Updates an ArrayBindingPattern
	 * @param {ArrayBindingPattern} newNode
	 * @param {ArrayBindingPattern} existing
	 * @returns {ArrayBindingPattern}
	 */
	private updateArrayBindingPattern (newNode: ArrayBindingPattern, existing: ArrayBindingPattern): ArrayBindingPattern {
		this.updateNode(newNode, existing);

		existing.elements = this.updateArrayBindingElements(existing, newNode.elements, existing.elements);

		return this.extraTransformStep(newNode, existing);
	}

	/**
	 * Updates an ArrayBindingElement
	 * @param {ArrayBindingElement} newNode
	 * @param {ArrayBindingElement} existing
	 * @returns {ArrayBindingElement}
	 */
	private updateArrayBindingElement (newNode: ArrayBindingElement, existing: ArrayBindingElement): ArrayBindingElement {
		return this.update(newNode, existing);
	}

	/**
	 * Updates ArrayBindingElements
	 * @param {Node} parent
	 * @param {NodeArray<ArrayBindingElement>} newNode
	 * @param {NodeArray<ArrayBindingElement>} existing
	 */
	private updateArrayBindingElements (parent: Node, newNode: NodeArray<ArrayBindingElement>, existing: NodeArray<ArrayBindingElement>): NodeArray<ArrayBindingElement> {
		return this.updateNodeArray(parent, newNode, existing, this.updateArrayBindingElement);
	}

	/**
	 * Updates a BindingElement
	 * @param {BindingElement} newNode
	 * @param {BindingElement} existing
	 * @returns {BindingElement}
	 */
	private updateBindingElement (newNode: BindingElement, existing: BindingElement): BindingElement {
		this.updateNamedDeclaration(newNode, existing);

		existing.propertyName = this.updateNodeIfGiven(newNode.propertyName, existing.propertyName, this.updatePropertyName);
		existing.dotDotDotToken = this.updateNodeIfGiven(newNode.dotDotDotToken, existing.dotDotDotToken, this.updateToken);
		existing.name = this.updateBindingName(newNode.name, existing.name);
		existing.initializer = this.updateNodeIfGiven(newNode.initializer, existing.initializer, this.update);

		return this.extraTransformStep(newNode, existing);
	}

	/**
	 * Updates an OmittedExpression
	 * @param {OmittedExpression} newNode
	 * @param {OmittedExpression} existing
	 * @returns {OmittedExpression}
	 */
	private updateOmittedExpression (newNode: OmittedExpression, existing: OmittedExpression): OmittedExpression {
		this.updateExpression(newNode, existing);

		return this.extraTransformStep(newNode, existing);
	}

	/**
	 * Updates an PartiallyEmittedExpression
	 * @param {PartiallyEmittedExpression} newNode
	 * @param {PartiallyEmittedExpression} existing
	 * @returns {PartiallyEmittedExpression}
	 */
	private updatePartiallyEmittedExpression (newNode: PartiallyEmittedExpression, existing: PartiallyEmittedExpression): PartiallyEmittedExpression {
		this.updateLeftHandSideExpression(newNode, existing);

		existing.expression = this.update(newNode.expression, existing.expression);

		return this.extraTransformStep(newNode, existing);
	}

	/**
	 * Updates BindingElements
	 * @param {Node} parent
	 * @param {NodeArray<BindingElement>} newNode
	 * @param {NodeArray<BindingElement>} existing
	 */
	private updateBindingElements (parent: Node, newNode: NodeArray<BindingElement>, existing: NodeArray<BindingElement>): NodeArray<BindingElement> {
		return this.updateNodeArray(parent, newNode, existing, this.updateBindingElement);
	}

	/**
	 * Updates ParameterDeclaration
	 * @param {Node} parent
	 * @param {NodeArray<ParameterDeclaration>} newNode
	 * @param {NodeArray<ParameterDeclaration>} existing
	 */
	private updateParameterDeclarations (parent: Node, newNode: NodeArray<ParameterDeclaration>, existing: NodeArray<ParameterDeclaration>): NodeArray<ParameterDeclaration> {
		return this.updateNodeArray(parent, newNode, existing, this.updateParameterDeclaration);
	}

	/**
	 * Updates a ConstructorDeclaration
	 * @param {ConstructorDeclaration} newNode
	 * @param {ConstructorDeclaration} existing
	 * @returns {ConstructorDeclaration}
	 */
	private updateConstructorDeclaration (newNode: ConstructorDeclaration, existing: ConstructorDeclaration): ConstructorDeclaration {
		this.updateFunctionLikeDeclarationBase(newNode, existing);
		this.updateClassElement(newNode, existing);

		existing.body = this.updateNodeIfGiven(newNode.body, existing.body, this.updateFunctionBody);

		return this.extraTransformStep(newNode, existing);
	}

	/**
	 * Updates a SemicolonClassElement
	 * @param {SemicolonClassElement} newNode
	 * @param {SemicolonClassElement} existing
	 * @returns {SemicolonClassElement}
	 */
	private updateSemicolonClassElement (newNode: SemicolonClassElement, existing: SemicolonClassElement): SemicolonClassElement {
		this.updateClassElement(newNode, existing);

		return this.extraTransformStep(newNode, existing);
	}

	/**
	 * Updates a FunctionBody
	 * @param {FunctionBody} newNode
	 * @param {FunctionBody} existing
	 * @returns {FunctionBody}
	 */
	private updateFunctionBody (newNode: FunctionBody, existing: FunctionBody): FunctionBody {
		return this.updateBlock(newNode, existing);
	}

	/**
	 * Updates a ConciseBody
	 * @param {ConciseBody} newNode
	 * @param {ConciseBody} existing
	 * @returns {ConciseBody}
	 */
	private updateConciseBody (newNode: ConciseBody, existing: ConciseBody): ConciseBody {
		return this.update(newNode, existing);
	}

	/**
	 * Updates a FunctionBody
	 * @param {FunctionBody} newNode
	 * @param {FunctionBody} existing
	 * @returns {FunctionBody}
	 */
	private updateBlock (newNode: Block, existing: Block): Block {
		this.updateStatement(newNode, existing);

		this.updateAll(existing, newNode.statements, existing.statements);

		return this.extraTransformStep(newNode, existing);
	}

	/**
	 * Updates a HeritageClause
	 * @param {HeritageClause} newNode
	 * @param {HeritageClause} existing
	 * @returns {HeritageClause}
	 */
	private updateHeritageClause (newNode: HeritageClause, existing: HeritageClause): HeritageClause {
		this.updateNode(newNode, existing);

		existing.token = newNode.token;
		existing.types = this.updateExpressionWithTypeArgumentss(existing, newNode.types, existing.types);

		return this.extraTransformStep(newNode, existing);
	}

	/**
	 * Updates a ExpressionWithTypeArguments
	 * @param {ExpressionWithTypeArguments} newNode
	 * @param {ExpressionWithTypeArguments} existing
	 * @returns {ExpressionWithTypeArguments}
	 */
	private updateExpressionWithTypeArguments (newNode: ExpressionWithTypeArguments, existing: ExpressionWithTypeArguments): ExpressionWithTypeArguments {
		this.updateTypeNode(newNode, existing);

		existing.expression = this.update(newNode.expression, existing.expression);
		existing.typeArguments = this.updateNodesIfGiven(existing, newNode.typeArguments, existing.typeArguments, this.updateAll);

		return this.extraTransformStep(newNode, existing);
	}

	/**
	 * Updates ExpressionWithTypeArgumentss
	 * @param {Node} parent
	 * @param {NodeArray<ExpressionWithTypeArguments>} newNode
	 * @param {NodeArray<ExpressionWithTypeArguments>} existing
	 */
	private updateExpressionWithTypeArgumentss (parent: Node, newNode: NodeArray<ExpressionWithTypeArguments>, existing: NodeArray<ExpressionWithTypeArguments>): NodeArray<ExpressionWithTypeArguments> {
		return this.updateNodeArray(parent, newNode, existing, this.updateExpressionWithTypeArguments);
	}

	/**
	 * Updates HeritageClauses
	 * @param {Node} parent
	 * @param {NodeArray<HeritageClause>} newNode
	 * @param {NodeArray<HeritageClause>} existing
	 */
	private updateHeritageClauses (parent: Node, newNode: NodeArray<HeritageClause>, existing: NodeArray<HeritageClause>): NodeArray<HeritageClause> {
		const result = this.updateNodeArray(parent, newNode, existing, this.updateHeritageClause);

		// Get the indexes for the implements and extends clauses
		const implementsClauseIndex = result.findIndex(clause => clause.token === SyntaxKind.ImplementsKeyword);
		const extendsClauseIndex = result.findIndex(clause => clause.token === SyntaxKind.ExtendsKeyword);
		const hasBothClauses = implementsClauseIndex >= 0 && extendsClauseIndex >= 0;

		// If it has both and the 'implements' clause precedes the 'extends' clause, swap them
		if (hasBothClauses && implementsClauseIndex < extendsClauseIndex) {

			// Force-cast to allow mutating the array
			/*tslint:disable:no-any*/
			const castResult = <HeritageClause[]><any> result;
			/*tslint:enable:no-any*/

			// Swap the two clauses
			const implementsClause = result[implementsClauseIndex];
			castResult[implementsClauseIndex] = result[extendsClauseIndex];
			castResult[extendsClauseIndex] = implementsClause;
		}

		return result;
	}

	/**
	 * Updates a TypeParameterDeclaration
	 * @param {TypeParameterDeclaration} newNode
	 * @param {TypeParameterDeclaration} existing
	 * @returns {TypeParameterDeclaration}
	 */
	private updateTypeParameterDeclaration (newNode: TypeParameterDeclaration, existing: TypeParameterDeclaration): TypeParameterDeclaration {
		this.updateNamedDeclaration(newNode, existing);

		existing.name = this.updateIdentifier(newNode.name, existing.name);
		existing.constraint = this.updateNodeIfGiven(newNode.constraint, existing.constraint, this.update);
		existing.default = this.updateNodeIfGiven(newNode.default, existing.default, this.update);
		existing.expression = this.updateNodeIfGiven(newNode.expression, existing.expression, this.update);

		return this.extraTransformStep(newNode, existing);
	}

	/**
	 * Updates a ExpressionStatement
	 * @param {ExpressionStatement} newNode
	 * @param {ExpressionStatement} existing
	 * @returns {ExpressionStatement}
	 */
	private updateExpressionStatement (newNode: ExpressionStatement, existing: ExpressionStatement): ExpressionStatement {
		this.updateStatement(newNode, existing);

		existing.expression = this.update(newNode.expression, existing.expression);

		return this.extraTransformStep(newNode, existing);
	}

	/**
	 * Updates a IndexSignatureDeclaration
	 * @param {IndexSignatureDeclaration} newNode
	 * @param {IndexSignatureDeclaration} existing
	 * @returns {IndexSignatureDeclaration}
	 */
	private updateIndexSignatureDeclaration (newNode: IndexSignatureDeclaration, existing: IndexSignatureDeclaration): IndexSignatureDeclaration {
		this.updateSignatureDeclaration(newNode, existing);
		this.updateClassElement(newNode, existing);
		this.updateTypeElement(newNode, existing);

		return this.extraTransformStep(newNode, existing);
	}

	/**
	 * Updates a ThisTypeNode
	 * @param {ThisTypeNode} newNode
	 * @param {ThisTypeNode} existing
	 * @returns {ThisTypeNode}
	 */
	private updateThisTypeNode (newNode: ThisTypeNode, existing: ThisTypeNode): ThisTypeNode {
		this.updateTypeNode(newNode, existing);

		return this.extraTransformStep(newNode, existing);
	}

	/**
	 * Updates a CallSignatureDeclaration
	 * @param {CallSignatureDeclaration} newNode
	 * @param {CallSignatureDeclaration} existing
	 * @returns {CallSignatureDeclaration}
	 */
	private updateCallSignatureDeclaration (newNode: CallSignatureDeclaration, existing: CallSignatureDeclaration): CallSignatureDeclaration {
		this.updateSignatureDeclaration(newNode, existing);
		this.updateTypeElement(newNode, existing);

		return this.extraTransformStep(newNode, existing);
	}

	/**
	 * Updates a ConstructSignatureDeclaration
	 * @param {ConstructSignatureDeclaration} newNode
	 * @param {ConstructSignatureDeclaration} existing
	 * @returns {ConstructSignatureDeclaration}
	 */
	private updateConstructSignatureDeclaration (newNode: ConstructSignatureDeclaration, existing: ConstructSignatureDeclaration): ConstructSignatureDeclaration {
		this.updateSignatureDeclaration(newNode, existing);
		this.updateTypeElement(newNode, existing);

		return this.extraTransformStep(newNode, existing);
	}

	/**
	 * Updates a ClassElement
	 * @param {ClassElement} newNode
	 * @param {ClassElement} existing
	 * @returns {ClassElement}
	 */
	private updateTypeElement (newNode: TypeElement, existing: TypeElement): TypeElement {
		this.updateNamedDeclaration(newNode, existing);

		existing._typeElementBrand = newNode._typeElementBrand;
		existing.name = this.updateNodeIfGiven(newNode.name, existing.name, this.updatePropertyName);
		existing.questionToken = this.updateNodeIfGiven(newNode.questionToken, existing.questionToken, this.updateToken);

		return existing;
	}

	/**
	 * Updates a NewExpression
	 * @param {NewExpression} newNode
	 * @param {NewExpression} existing
	 * @returns {NewExpression}
	 */
	private updateNewExpression (newNode: NewExpression, existing: NewExpression): NewExpression {
		this.updatePrimaryExpression(newNode, existing);
		this.updateDeclaration(newNode, existing);

		existing.expression = this.update(newNode.expression, existing.expression);
		existing.typeArguments = this.updateNodesIfGiven(existing, newNode.typeArguments, existing.typeArguments, this.updateAll);
		existing.arguments = this.updateNodesIfGiven(existing, newNode.arguments, existing.arguments, this.updateAll);

		return this.extraTransformStep(newNode, existing);
	}

	/**
	 * Updates a CallExpression
	 * @param {CallExpression} newNode
	 * @param {CallExpression} existing
	 * @returns {CallExpression}
	 */
	private updateCallExpression (newNode: CallExpression, existing: CallExpression): CallExpression {
		this.updateLeftHandSideExpression(newNode, existing);
		this.updateDeclaration(newNode, existing);

		existing.expression = this.update(newNode.expression, existing.expression);
		existing.typeArguments = this.updateNodesIfGiven(existing, newNode.typeArguments, existing.typeArguments, this.updateAll);
		existing.arguments = this.updateAll(existing, newNode.arguments, existing.arguments);

		return this.extraTransformStep(newNode, existing);
	}

	/**
	 * Updates a PropertyAccessExpression
	 * @param {PropertyAccessExpression} newNode
	 * @param {PropertyAccessExpression} existing
	 * @returns {PropertyAccessExpression}
	 */
	private updatePropertyAccessExpression (newNode: PropertyAccessExpression, existing: PropertyAccessExpression): PropertyAccessExpression {
		this.updateMemberExpression(newNode, existing);
		this.updateNamedDeclaration(newNode, existing);

		existing.expression = this.update(newNode.expression, existing.expression);
		existing.name = this.updateIdentifier(newNode.name, existing.name);

		return this.extraTransformStep(newNode, existing);
	}

	/**
	 * Updates a PropertySignature
	 * @param {PropertySignature} newNode
	 * @param {PropertySignature} existing
	 * @returns {PropertySignature}
	 */
	private updatePropertySignature (newNode: PropertySignature, existing: PropertySignature): PropertySignature {
		this.updateTypeElement(newNode, existing);

		existing.name = this.updatePropertyName(newNode.name, existing.name);
		existing.questionToken = this.updateNodeIfGiven(newNode.questionToken, existing.questionToken, this.updateToken);
		existing.type = this.updateNodeIfGiven(newNode.type, existing.type, this.update);
		existing.initializer = this.updateNodeIfGiven(newNode.initializer, existing.initializer, this.update);

		return this.extraTransformStep(newNode, existing);
	}

	/**
	 * Updates a ElementAccessExpression
	 * @param {ElementAccessExpression} newNode
	 * @param {ElementAccessExpression} existing
	 * @returns {ElementAccessExpression}
	 */
	private updateElementAccessExpression (newNode: ElementAccessExpression, existing: ElementAccessExpression): ElementAccessExpression {
		this.updateMemberExpression(newNode, existing);

		existing.expression = this.update(newNode.expression, existing.expression);
		existing.argumentExpression = this.updateNodeIfGiven(newNode.expression, existing.expression, this.update);

		return this.extraTransformStep(newNode, existing);
	}

	/**
	 * Updates a ComputedPropertyName
	 * @param {ComputedPropertyName} newNode
	 * @param {ComputedPropertyName} existing
	 * @returns {ComputedPropertyName}
	 */
	private updateComputedPropertyName (newNode: ComputedPropertyName, existing: ComputedPropertyName): ComputedPropertyName {
		this.updateNode(newNode, existing);

		existing.expression = this.update(newNode.expression, existing.expression);

		return this.extraTransformStep(newNode, existing);
	}

	/**
	 * Updates a ClassElement
	 * @param {ClassElement} newNode
	 * @param {ClassElement} existing
	 * @returns {ClassElement}
	 */
	private updateClassElement (newNode: ClassElement, existing: ClassElement): ClassElement {
		this.updateNamedDeclaration(newNode, existing);

		existing._classElementBrand = newNode._classElementBrand;
		existing.name = this.updateNodeIfGiven(newNode.name, existing.name, this.updatePropertyName);

		return existing;
	}

	/**
	 * Updates TypeParameterDeclarations
	 * @param {Node} parent
	 * @param {NodeArray<TypeParameterDeclaration>} newNode
	 * @param {NodeArray<TypeParameterDeclaration>} existing
	 */
	private updateTypeParameterDeclarations (parent: Node, newNode: NodeArray<TypeParameterDeclaration>, existing: NodeArray<TypeParameterDeclaration>): NodeArray<TypeParameterDeclaration> {
		return this.updateNodeArray(parent, newNode, existing, this.updateTypeParameterDeclaration);
	}

	/**
	 * Updates a LiteralLikeNode
	 * @param {LiteralLikeNode} newNode
	 * @param {LiteralLikeNode} existing
	 * @returns {LiteralLikeNode}
	 */
	private updateLiteralLikeNode (newNode: LiteralLikeNode, existing: LiteralLikeNode): LiteralLikeNode {
		this.updateNode(newNode, existing);

		existing.text = newNode.text;
		existing.isUnterminated = newNode.isUnterminated;
		existing.hasExtendedUnicodeEscape = newNode.hasExtendedUnicodeEscape;

		return existing;
	}

	/**
	 * Updates a LiteralExpression
	 * @param {LiteralExpression} newNode
	 * @param {LiteralExpression} existing
	 * @returns {LiteralExpression}
	 */
	private updateLiteralExpression (newNode: LiteralExpression, existing: LiteralExpression): LiteralExpression {
		this.updateLiteralLikeNode(newNode, existing);
		this.updatePrimaryExpression(newNode, existing);

		existing._literalExpressionBrand = newNode._literalExpressionBrand;

		return existing;
	}

	/**
	 * Updates a StringLiteral
	 * @param {StringLiteral} newNode
	 * @param {StringLiteral} existing
	 * @returns {StringLiteral}
	 */
	private updateStringLiteral (newNode: StringLiteral, existing: StringLiteral): StringLiteral {
		this.updateLiteralExpression(newNode, existing);
		return this.extraTransformStep(newNode, existing);
	}

	/**
	 * Updates a NumericLiteral
	 * @param {NumericLiteral} newNode
	 * @param {NumericLiteral} existing
	 * @returns {NumericLiteral}
	 */
	private updateNumericLiteral (newNode: NumericLiteral, existing: NumericLiteral): NumericLiteral {
		this.updateLiteralExpression(newNode, existing);
		return this.extraTransformStep(newNode, existing);
	}

	/**
	 * Updates a DeclarationStatement
	 * @param {DeclarationStatement} newNode
	 * @param {DeclarationStatement} existing
	 * @returns {DeclarationStatement}
	 */
	private updateDeclarationStatement (newNode: DeclarationStatement, existing: DeclarationStatement): DeclarationStatement {
		this.updateNamedDeclaration(newNode, existing);
		this.updateStatement(newNode, existing);

		existing.name = this.updateNodeIfGiven(newNode.name, existing.name, this.update);

		return existing;
	}

	/**
	 * Updates a Statement
	 * @param {Statement} newNode
	 * @param {Statement} existing
	 * @returns {Statement}
	 */
	private updateStatement (newNode: Statement, existing: Statement): Statement {
		this.updateNode(newNode, existing);

		existing._statementBrand = newNode._statementBrand;

		return existing;
	}

	/**
	 * Changes the parent of a Node
	 * @param {T} parent
	 * @param {T} node
	 * @returns {T}
	 */
	private changeParent<T extends Node> (parent: Node, node: T): T {
		node.parent = parent;
		return node;
	}

	/**
	 * Generates a new Symbol with all of the upper-level parents changed
	 * @param {Node} parent
	 * @param {Symbol} existing
	 * @returns {Symbol}
	 */
	private copySymbolWithParent (parent: Node, existing: Symbol): Symbol {
		const {flags, escapedName, declarations, valueDeclaration, members, exports, globalExports, name, getDeclarations, getDocumentationComment, getEscapedName, getFlags, getJsDocTags, getName} = existing;
		return {
			flags,
			escapedName,
			declarations: declarations == null ? undefined : declarations.map(declaration => this.changeParent(parent, declaration)),
			valueDeclaration: valueDeclaration == null ? undefined : this.changeParent(parent, valueDeclaration),
			members,
			exports,
			globalExports,
			name,
			getDocumentationComment,
			getJsDocTags,
			getFlags,
			getEscapedName,
			getDeclarations,
			getName
		};
	}

	/**
	 * Updates a ClassDeclaration
	 * @param {ClassDeclaration} newNode
	 * @param {ClassDeclaration} existing
	 * @returns {ClassDeclaration}
	 */
	private updateClassDeclaration (newNode: ClassDeclaration, existing: ClassDeclaration): ClassDeclaration {
		this.updateClassLikeDeclaration(newNode, existing);
		this.updateDeclarationStatement(newNode, existing);

		existing.name = this.updateNodeIfGiven(newNode.name, existing.name, this.updateIdentifier);

		this.extraTransformStep(newNode, existing);
		return existing;
	}

	/**
	 * Updates a ClassExpression
	 * @param {ClassExpression} newNode
	 * @param {ClassExpression} existing
	 * @returns {ClassExpression}
	 */
	private updateClassExpression (newNode: ClassExpression, existing: ClassExpression): ClassExpression {
		this.updateClassLikeDeclaration(newNode, existing);
		this.updatePrimaryExpression(newNode, existing);

		this.extraTransformStep(newNode, existing);
		return existing;
	}

	/**
	 * Updates a SourceFile
	 * @param {SourceFile} newNode
	 * @param {SourceFile} existing
	 * @returns {SourceFile}
	 */
	private updateSourceFile (newNode: SourceFile, existing: SourceFile): SourceFile {
		this.updateDeclaration(newNode, existing);

		existing.statements = this.updateStatements(existing, newNode.statements, existing.statements);
		existing.endOfFileToken = this.updateToken(newNode.endOfFileToken, existing.endOfFileToken);
		existing.fileName = newNode.fileName;
		existing.text = newNode.text;
		existing.amdDependencies = this.updateAmdDependencies(newNode.amdDependencies, existing.amdDependencies);
		existing.moduleName = newNode.moduleName;
		existing.referencedFiles = this.updateFileReferences(newNode.referencedFiles, existing.referencedFiles);
		existing.typeReferenceDirectives = this.updateFileReferences(newNode.typeReferenceDirectives, existing.typeReferenceDirectives);
		existing.languageVariant = newNode.languageVariant;
		existing.isDeclarationFile = newNode.isDeclarationFile;
		existing.hasNoDefaultLib = newNode.hasNoDefaultLib;
		existing.languageVersion = newNode.languageVersion;

		return this.extraTransformStep(newNode, existing);
	}

	/**
	 * Updates an Array of Nodes
	 * @param {T[]} newNodes
	 * @param {T[]} existingNodes
	 * @param {(newNode: T, existing: T) => T} handler
	 * @returns {T[]}
	 */
	private updateArray<T extends NodeMatcherItem> (newNodes: T[], existingNodes: T[], handler: (newNode: T, existing: T) => T): T[] {
		// Filter out anything that exists within the new nodes but not inside the existing array
		const existingFiltered = existingNodes.filter(existingPart => this.nodeMatcherUtil.match(existingPart, newNodes) != null);
		const boundHandler = handler.bind(this);

		// Update all of the existing ones
		newNodes.forEach(newNode => {
			// Find the match within the existing ones
			const match = this.nodeMatcherUtil.match(newNode, existingFiltered);
			// If it exists, update it
			if (match != null) {
				boundHandler(newNode, match);
			}

			// Otherwise, push to the array
			else existingFiltered.push(newNode);
		});
		return existingFiltered;
	}

	/**
	 * Updates a NodeArray
	 * @param {Node} parent
	 * @param {NodeArray<T extends Node>} newNodes
	 * @param {NodeArray<T extends Node>} existingNodes
	 * @param {(newNode: T, existing: T) => T} handler
	 * @returns {NodeArray<T extends Node>}
	 */
	private updateNodeArray<T extends Node> (parent: Node, newNodes: NodeArray<T>, existingNodes: NodeArray<T>, handler: (newNode: T, existing: T) => T): NodeArray<T> {
		const boundHandler = handler.bind(this);
		this.updateTextRange(newNodes, existingNodes);

		// Force-cast to a mutable array
		/*tslint:disable:no-any*/
		const mutableExistingNodes = <T[]> <any> existingNodes;
		/*tslint:enable:no-any*/

		const removeIndexes: Set<number> = new Set();
		mutableExistingNodes.forEach((existingNode, existingIndex) => {

			// Find a match for the existingNoe with the newNodes. If none exists, add the index to the Set of indexes to remove from the existing items
			if (this.nodeMatcherUtil.match(existingNode, newNodes) == null) {
				removeIndexes.add(existingIndex);
			}
		});

		// Remove all of the unmatched items
		removeIndexes.forEach(index => mutableExistingNodes.splice(index, 1));

		// Update all of the existing ones
		newNodes.forEach(newNode => {
			// Find the match within the existing ones
			const match = this.nodeMatcherUtil.match(newNode, mutableExistingNodes);
			// If it exists, update it
			if (match != null) {
				boundHandler(newNode, match);
			} else {
				// Otherwise, push to the array, but do change the parent
				mutableExistingNodes.push(this.changeParent(parent, newNode));
			}
		});
		return existingNodes;
	}

	/**
	 * Strips all keys from a Node
	 * @param {T} node
	 * @returns {T}
	 */
	private stripAllKeysOfNode<T extends Node> (node: T): T {
		Object.keys(node).forEach((key: keyof T) => {

			// Don't strip the keys that are strictly required to be preserved
			if (!this.PRESERVE_KEYS_ON_STRIP.has(key)) {
				delete node[key];
			}
		});
		return node;
	}

	/**
	 * Adds all keys from a Node to another
	 * @param {T} node
	 * @param {T} existing
	 * @returns {T}
	 */
	private addAllKeysOfNode<T extends Node> (node: T, existing: T): T {
		Object.keys(existing).forEach((key: keyof T) => {

			// Don't add the key if the provided node must preserve it
			if (!this.PRESERVE_KEYS_ON_STRIP.has(key)) {
				node[key] = existing[key];
			}
		});
		return node;
	}

	/**
	 * A last transform step to perform on Nodes to cover things that are not explicitly defined by the interfaces of the Nodes
	 * @param {T} newNode
	 * @param {T} existing
	 * @returns {T}
	 */
	private extraTransformStep<T extends Node> (newNode: T, existing: T): T {
		/*tslint:disable:no-any*/
		if (this.predicateUtil.hasSymbol(newNode)) {
			const parent = newNode.getSourceFile();
			(<any>existing).symbol = this.copySymbolWithParent(parent, newNode.symbol);
		}

		if (this.predicateUtil.hasClassifiableNames(newNode)) {
			(<any>existing).classifiableNames = newNode.classifiableNames;
		}

		if (this.predicateUtil.hasIdentifiers(newNode)) {
			(<any>existing).identifiers = newNode.identifiers;
		}

		if (this.predicateUtil.hasSymbolCount(newNode)) {
			(<any>existing).symbolCount = newNode.symbolCount;
		}

		if (this.predicateUtil.hasNodeCount(newNode)) {
			(<any>existing).nodeCount = newNode.nodeCount;
		}

		if (this.predicateUtil.hasIdentifierCount(newNode)) {
			(<any>existing).identifierCount = newNode.identifierCount;
		}

		if (this.predicateUtil.hasLineMap(newNode)) {
			(<any>existing).lineMap = newNode.lineMap;
		}

		if (this.predicateUtil.hasNextContainer(newNode)) {
			const parent = newNode.getSourceFile();
			(<any>existing).nextContainer = this.changeParent(parent, newNode.nextContainer);
		}

		if (this.predicateUtil.hasLocals(newNode)) {
			const parent = newNode.getSourceFile();
			const mapped: Map<string, Symbol> = <any> Array.from(newNode.locals.entries()).map(entry => [entry[0], this.copySymbolWithParent(parent, entry[1])]);
			(<any>existing).locals = new Map(mapped);
		}

		/*tslint:enable:no-any*/
		return existing;
	}
}