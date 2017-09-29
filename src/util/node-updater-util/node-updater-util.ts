import {INodeUpdaterUtil} from "./i-node-updater-util";
import {AmdDependency, ArrayBindingElement, ArrayBindingPattern, ArrayLiteralExpression, ArrayTypeNode, ArrowFunction, AsExpression, AwaitExpression, BinaryExpression, BindingElement, BindingName, Block, BooleanLiteral, BreakStatement, CallExpression, CallSignatureDeclaration, CaseBlock, CaseClause, CatchClause, ClassDeclaration, ClassElement, ClassExpression, ClassLikeDeclaration, ComputedPropertyName, ConciseBody, ConditionalExpression, ConstructorDeclaration, ConstructorTypeNode, ConstructSignatureDeclaration, ContinueStatement, DebuggerStatement, Declaration, DeclarationName, DeclarationStatement, Decorator, DefaultClause, DeleteExpression, DoStatement, ElementAccessExpression, EmptyStatement, EntityName, EnumDeclaration, EnumMember, ExportAssignment, ExportDeclaration, ExportSpecifier, Expression, ExpressionStatement, ExpressionWithTypeArguments, ExternalModuleReference, FileReference, ForInStatement, ForOfStatement, ForStatement, FunctionBody, FunctionDeclaration, FunctionExpression, FunctionLikeDeclarationBase, FunctionTypeNode, GetAccessorDeclaration, HeritageClause, Identifier, IfStatement, ImportClause, ImportDeclaration, ImportEqualsDeclaration, ImportExpression, ImportSpecifier, IndexedAccessTypeNode, IndexSignatureDeclaration, InterfaceDeclaration, IntersectionTypeNode, isArrayBindingPattern, isArrayLiteralExpression, isArrayTypeNode, isArrowFunction, isAsExpression, isAwaitExpression, isBinaryExpression, isBindingElement, isBlock, isBreakStatement, isCallExpression, isCallSignatureDeclaration, isCaseBlock, isCaseClause, isCatchClause, isClassDeclaration, isClassExpression, isComputedPropertyName, isConditionalExpression, isConstructorDeclaration, isConstructorTypeNode, isConstructSignatureDeclaration, isContinueStatement, isDebuggerStatement, isDecorator, isDefaultClause, isDeleteExpression, isDoStatement, isElementAccessExpression, isEmptyStatement, isEnumDeclaration, isEnumMember, isExportAssignment, isExportDeclaration, isExportSpecifier, isExpressionStatement, isExpressionWithTypeArguments, isExternalModuleReference, isForInStatement, isForOfStatement, isForStatement, isFunctionDeclaration, isFunctionExpression, isFunctionTypeNode, isGetAccessorDeclaration, isHeritageClause, isIdentifier, isIfStatement, isImportClause, isImportDeclaration, isImportEqualsDeclaration, isImportSpecifier, isIndexedAccessTypeNode, isIndexSignatureDeclaration, isInterfaceDeclaration, isIntersectionTypeNode, isJsxAttribute, isJsxAttributes, isJsxClosingElement, isJsxElement, isJsxExpression, isJsxOpeningElement, isJsxSelfClosingElement, isJsxSpreadAttribute, isJsxText, isLabeledStatement, isLiteralTypeNode, isMappedTypeNode, isMetaProperty, isMethodDeclaration, isMethodSignature, isMissingDeclaration, isModifier, isModuleBlock, isModuleDeclaration, isNamedExports, isNamedImports, isNamespaceExportDeclaration, isNamespaceImport, isNewExpression, isNonNullExpression, isNoSubstitutionTemplateLiteral, isNumericLiteral, isObjectBindingPattern, isObjectLiteralExpression, isOmittedExpression, isParameter, isParenthesizedExpression, isParenthesizedTypeNode, isPropertyAccessExpression, isPropertyAssignment, isPropertyDeclaration, isPropertySignature, isQualifiedName, isRegularExpressionLiteral, isReturnStatement, isSemicolonClassElement, isSetAccessorDeclaration, isShorthandPropertyAssignment, isSourceFile, isSpreadAssignment, isSpreadElement, isStringLiteral, isSwitchStatement, isTaggedTemplateExpression, isTemplateExpression, isTemplateHead, isTemplateMiddle, isTemplateSpan, isTemplateTail, isThisTypeNode, isThrowStatement, isToken, isTryStatement, isTupleTypeNode, isTypeAliasDeclaration, isTypeAssertion, isTypeLiteralNode, isTypeOfExpression, isTypeOperatorNode, isTypeParameterDeclaration, isTypePredicateNode, isTypeQueryNode, isTypeReferenceNode, isUnionTypeNode, isVariableDeclaration, isVariableDeclarationList, isVariableStatement, isVoidExpression, isWhileStatement, isWithStatement, isYieldExpression, IterationStatement, JSDocNamespaceDeclaration, JsxAttribute, JsxAttributes, JsxClosingElement, JsxElement, JsxExpression, JsxOpeningElement, JsxSelfClosingElement, JsxSpreadAttribute, JsxText, KeywordTypeNode, LabeledStatement, LeftHandSideExpression, LiteralExpression, LiteralLikeNode, LiteralTypeNode, MappedTypeNode, MemberExpression, MetaProperty, MethodDeclaration, MethodSignature, MissingDeclaration, Modifier, ModuleBlock, ModuleDeclaration, NamedDeclaration, NamedExports, NamedImports, NamespaceDeclaration, NamespaceExportDeclaration, NamespaceImport, NewExpression, Node, NodeArray, NonNullExpression, NoSubstitutionTemplateLiteral, NullLiteral, NumericLiteral, ObjectBindingPattern, ObjectLiteralElement, ObjectLiteralElementLike, ObjectLiteralExpression, ObjectLiteralExpressionBase, OmittedExpression, ParameterDeclaration, ParenthesizedExpression, ParenthesizedTypeNode, PartiallyEmittedExpression, PostfixUnaryExpression, PrefixUnaryExpression, PrimaryExpression, PropertyAccessExpression, PropertyAssignment, PropertyDeclaration, PropertyName, PropertySignature, QualifiedName, RegularExpressionLiteral, ReturnStatement, SemicolonClassElement, SetAccessorDeclaration, ShorthandPropertyAssignment, SignatureDeclaration, SourceFile, SpreadAssignment, SpreadElement, Statement, StringLiteral, SuperExpression, SwitchStatement, Symbol, SyntaxKind, TaggedTemplateExpression, TemplateExpression, TemplateHead, TemplateMiddle, TemplateSpan, TemplateTail, TextRange, ThisExpression, ThisTypeNode, ThrowStatement, Token, TryStatement, TupleTypeNode, TypeAliasDeclaration, TypeAssertion, TypeElement, TypeLiteralNode, TypeNode, TypeOfExpression, TypeOperatorNode, TypeParameterDeclaration, TypePredicateNode, TypeQueryNode, TypeReferenceNode, UnaryExpression, UnionTypeNode, UpdateExpression, VariableDeclaration, VariableDeclarationList, VariableStatement, VoidExpression, WhileStatement, WithStatement, YieldExpression} from "typescript";
import {INodeMatcherUtil} from "../node-matcher-util/i-node-matcher-util";
import {NodeMatcherItem} from "../node-matcher-util/node-matcher-item";
import {IPrinter} from "../../ast/printer/i-printer";
import {IPredicateUtil} from "../predicate-util/i-predicate-util";
import {INodeUpdaterUtilUpdateOptions} from "./i-node-updater-util-update-options";
import {INodeUpdaterUtilUpdateOptionsDict} from "./i-node-updater-util-update-options-dict";
import {ITypescriptLanguageService} from "@wessberg/typescript-language-service";

/**
 * A class that helps with updating (mutating) nodes in-place
 */
export class NodeUpdaterUtil implements INodeUpdaterUtil {
	private PRESERVE_KEYS_ON_STRIP: Set<string> = new Set(["parent"]);

	constructor (private languageService: ITypescriptLanguageService,
							 private nodeMatcherUtil: INodeMatcherUtil,
							 private predicateUtil: IPredicateUtil,
							 private printer: IPrinter) {
	}

	/**
	 * Updates a Node in-place. This means it will be deep-mutated
	 * @param {T} newNode
	 * @param {T} existing
	 * @param {Partial<INodeUpdaterUtilUpdateOptionsDict>} [options={}]
	 * @returns {T}
	 */
	public updateInPlace<T extends Node> (newNode: T, existing: T, options: Partial<INodeUpdaterUtilUpdateOptionsDict> = {}): T {

		const normalizedOptions = this.getUpdateOptions(options);

		// Perform an in-place update of the Node
		this.update(newNode, existing, normalizedOptions);

		// Take the SourceFile
		const sourceFile = existing.getSourceFile();

		// Generate a new SourceFile
		const path = sourceFile.fileName;
		const content = this.printer.print(sourceFile);
		const newSourceFile = this.languageService.addFile({path, content});

		// Update the existing SourceFile (primarily for positions)
		this.update(newSourceFile, sourceFile, normalizedOptions);
		return existing;
	}

	/**
	 * Gets normalized INodeUpdaterUtilUpdateOptions
	 * @param {Partial<INodeUpdaterUtilUpdateOptions>} options
	 * @returns {INodeUpdaterUtilUpdateOptions}
	 */
	private getUpdateOptions ({}: Partial<INodeUpdaterUtilUpdateOptionsDict>): INodeUpdaterUtilUpdateOptions {
		return {};
	}

	/**
	 * Updates a Node
	 * @param {T} newNode
	 * @param {T} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {T}
	 */
	private update<T extends Node> (newNode: T, existing: T, options: INodeUpdaterUtilUpdateOptions): T {
		/*tslint:disable:no-any*/
		if (newNode.kind !== existing.kind) throw new TypeError(`${this.constructor.name} could not update a node of kind ${SyntaxKind[existing.kind]}: The new node was not of an identical kind: ${SyntaxKind[newNode.kind]}`);

		// If the kinds are different, remove all properties from the existing node and all of the properties of the new Node
		if (existing.kind !== newNode.kind) {
			this.stripAllKeysOfNode(existing);
			this.addAllKeysOfNode(newNode, existing);
		} else {
			if (isSourceFile(newNode) && isSourceFile(existing)) {
				return <T><any> this.updateSourceFile(newNode, existing, options);
			}

			else if (isToken(newNode) && isToken(existing)) {
				return <T><any> this.updateToken(newNode, existing, options);
			}

			else if (isDecorator(newNode) && isDecorator(existing)) {
				return <T><any> this.updateDecorator(newNode, existing, options);
			}

			else if (isModifier(newNode) && isModifier(existing)) {
				return <T><any> this.updateModifier(newNode, existing, options);
			}

			else if (isClassDeclaration(newNode) && isClassDeclaration(existing)) {
				return <T><any> this.updateClassDeclaration(newNode, existing, options);
			}

			else if (isIdentifier(newNode) && isIdentifier(existing)) {
				return <T><any> this.updateIdentifier(newNode, existing, options);
			}

			else if (isStringLiteral(newNode) && isStringLiteral(existing)) {
				return <T><any> this.updateStringLiteral(newNode, existing, options);
			}

			else if (isNumericLiteral(newNode) && isNumericLiteral(existing)) {
				return <T><any> this.updateNumericLiteral(newNode, existing, options);
			}

			else if (isTypeParameterDeclaration(newNode) && isTypeParameterDeclaration(existing)) {
				return <T><any> this.updateTypeParameterDeclaration(newNode, existing, options);
			}

			else if (isHeritageClause(newNode) && isHeritageClause(existing)) {
				return <T><any> this.updateHeritageClause(newNode, existing, options);
			}

			else if (isExpressionWithTypeArguments(newNode) && isExpressionWithTypeArguments(existing)) {
				return <T><any> this.updateExpressionWithTypeArguments(newNode, existing, options);
			}

			else if (isPropertyDeclaration(newNode) && isPropertyDeclaration(existing)) {
				return <T><any> this.updatePropertyDeclaration(newNode, existing, options);
			}

			else if (isTypeReferenceNode(newNode) && isTypeReferenceNode(existing)) {
				return <T><any> this.updateTypeReferenceNode(newNode, existing, options);
			}

			else if (isConstructorDeclaration(newNode) && isConstructorDeclaration(existing)) {
				return <T><any> this.updateConstructorDeclaration(newNode, existing, options);
			}

			else if (isBlock(newNode) && isBlock(existing)) {
				return <T><any> this.updateBlock(newNode, existing, options);
			}

			else if (isParameter(newNode) && isParameter(existing)) {
				return <T><any> this.updateParameterDeclaration(newNode, existing, options);
			}

			else if (isBindingElement(newNode) && isBindingElement(existing)) {
				return <T><any> this.updateBindingElement(newNode, existing, options);
			}

			else if (isObjectBindingPattern(newNode) && isObjectBindingPattern(existing)) {
				return <T><any> this.updateObjectBindingPattern(newNode, existing, options);
			}

			else if (isArrayBindingPattern(newNode) && isArrayBindingPattern(existing)) {
				return <T><any> this.updateArrayBindingPattern(newNode, existing, options);
			}

			else if (isOmittedExpression(newNode) && isOmittedExpression(existing)) {
				return <T><any> this.updateOmittedExpression(newNode, existing, options);
			}

			else if (isExpressionStatement(newNode) && isExpressionStatement(existing)) {
				return <T><any> this.updateExpressionStatement(newNode, existing, options);
			}

			else if (isCallExpression(newNode) && isCallExpression(existing)) {
				return <T><any> this.updateCallExpression(newNode, existing, options);
			}

			else if (isPropertyAccessExpression(newNode) && isPropertyAccessExpression(existing)) {
				return <T><any> this.updatePropertyAccessExpression(newNode, existing, options);
			}

			else if (isElementAccessExpression(newNode) && isElementAccessExpression(existing)) {
				return <T><any> this.updateElementAccessExpression(newNode, existing, options);
			}

			else if (isFunctionTypeNode(newNode) && isFunctionTypeNode(existing)) {
				return <T><any> this.updateFunctionTypeNode(newNode, existing, options);
			}

			else if (isObjectLiteralExpression(newNode) && isObjectLiteralExpression(existing)) {
				return <T><any> this.updateObjectLiteralExpression(newNode, existing, options);
			}

			else if (isPropertyAssignment(newNode) && isPropertyAssignment(existing)) {
				return <T><any> this.updatePropertyAssignment(newNode, existing, options);
			}

			else if (isShorthandPropertyAssignment(newNode) && isShorthandPropertyAssignment(existing)) {
				return <T><any> this.updateShorthandPropertyAssignment(newNode, existing, options);
			}

			else if (isSpreadAssignment(newNode) && isSpreadAssignment(existing)) {
				return <T><any> this.updateSpreadAssignment(newNode, existing, options);
			}

			else if (isMethodDeclaration(newNode) && isMethodDeclaration(existing)) {
				return <T><any> this.updateMethodDeclaration(newNode, existing, options);
			}

			else if (isGetAccessorDeclaration(newNode) && isGetAccessorDeclaration(existing)) {
				return <T><any> this.updateGetAccessorDeclaration(newNode, existing, options);
			}

			else if (isSetAccessorDeclaration(newNode) && isSetAccessorDeclaration(existing)) {
				return <T><any> this.updateSetAccessorDeclaration(newNode, existing, options);
			}

			else if (isVariableStatement(newNode) && isVariableStatement(existing)) {
				return <T><any> this.updateVariableStatement(newNode, existing, options);
			}

			else if (isVariableDeclarationList(newNode) && isVariableDeclarationList(existing)) {
				return <T><any> this.updateVariableDeclarationList(newNode, existing, options);
			}

			else if (isVariableDeclaration(newNode) && isVariableDeclaration(existing)) {
				return <T><any> this.updateVariableDeclaration(newNode, existing, options);
			}

			else if (isBinaryExpression(newNode) && isBinaryExpression(existing)) {
				return <T><any> this.updateBinaryExpression(newNode, existing, options);
			}

			else if (isParenthesizedExpression(newNode) && isParenthesizedExpression(existing)) {
				return <T><any> this.updateParenthesizedExpression(newNode, existing, options);
			}

			else if (isConditionalExpression(newNode) && isConditionalExpression(existing)) {
				return <T><any> this.updateConditionalExpression(newNode, existing, options);
			}

			else if (isQualifiedName(newNode) && isQualifiedName(existing)) {
				return <T><any> this.updateQualifiedName(newNode, existing, options);
			}

			else if (isComputedPropertyName(newNode) && isComputedPropertyName(existing)) {
				return <T><any> this.updateComputedPropertyName(newNode, existing, options);
			}

			else if (isCallSignatureDeclaration(newNode) && isCallSignatureDeclaration(existing)) {
				return <T><any> this.updateCallSignatureDeclaration(newNode, existing, options);
			}

			else if (isConstructSignatureDeclaration(newNode) && isConstructSignatureDeclaration(existing)) {
				return <T><any> this.updateConstructSignatureDeclaration(newNode, existing, options);
			}

			else if (isPropertySignature(newNode) && isPropertySignature(existing)) {
				return <T><any> this.updatePropertySignature(newNode, existing, options);
			}

			else if (isFunctionDeclaration(newNode) && isFunctionDeclaration(existing)) {
				return <T><any> this.updateFunctionDeclaration(newNode, existing, options);
			}

			else if (isMethodSignature(newNode) && isMethodSignature(existing)) {
				return <T><any> this.updateMethodSignature(newNode, existing, options);
			}

			else if (isSemicolonClassElement(newNode) && isSemicolonClassElement(existing)) {
				return <T><any> this.updateSemicolonClassElement(newNode, existing, options);
			}

			else if (isIndexSignatureDeclaration(newNode) && isIndexSignatureDeclaration(existing)) {
				return <T><any> this.updateIndexSignatureDeclaration(newNode, existing, options);
			}

			else if (isThisTypeNode(newNode) && isThisTypeNode(existing)) {
				return <T><any> this.updateThisTypeNode(newNode, existing, options);
			}

			else if (isConstructorTypeNode(newNode) && isConstructorTypeNode(existing)) {
				return <T><any> this.updateConstructorTypeNode(newNode, existing, options);
			}

			else if (isTypePredicateNode(newNode) && isTypePredicateNode(existing)) {
				return <T><any> this.updateTypePredicateNode(newNode, existing, options);
			}

			else if (isTypeQueryNode(newNode) && isTypeQueryNode(existing)) {
				return <T><any> this.updateTypeQueryNode(newNode, existing, options);
			}

			else if (isTypeLiteralNode(newNode) && isTypeLiteralNode(existing)) {
				return <T><any> this.updateTypeLiteralNode(newNode, existing, options);
			}

			else if (isArrayTypeNode(newNode) && isArrayTypeNode(existing)) {
				return <T><any> this.updateArrayTypeNode(newNode, existing, options);
			}

			else if (isTupleTypeNode(newNode) && isTupleTypeNode(existing)) {
				return <T><any> this.updateTupleTypeNode(newNode, existing, options);
			}

			else if (isUnionTypeNode(newNode) && isUnionTypeNode(existing)) {
				return <T><any> this.updateUnionTypeNode(newNode, existing, options);
			}

			else if (isIntersectionTypeNode(newNode) && isIntersectionTypeNode(existing)) {
				return <T><any> this.updateIntersectionTypeNode(newNode, existing, options);
			}

			else if (isParenthesizedTypeNode(newNode) && isParenthesizedTypeNode(existing)) {
				return <T><any> this.updateParenthesizedTypeNode(newNode, existing, options);
			}

			else if (isTypeOperatorNode(newNode) && isTypeOperatorNode(existing)) {
				return <T><any> this.updateTypeOperatorNode(newNode, existing, options);
			}

			else if (isIndexedAccessTypeNode(newNode) && isIndexedAccessTypeNode(existing)) {
				return <T><any> this.updateIndexedAccessTypeNode(newNode, existing, options);
			}

			else if (isMappedTypeNode(newNode) && isMappedTypeNode(existing)) {
				return <T><any> this.updateMappedTypeNode(newNode, existing, options);
			}

			else if (isLiteralTypeNode(newNode) && isLiteralTypeNode(existing)) {
				return <T><any> this.updateLiteralTypeNode(newNode, existing, options);
			}

			else if (this.predicateUtil.isPartiallyEmittedExpression(newNode) && this.predicateUtil.isPartiallyEmittedExpression(existing)) {
				return <T><any> this.updatePartiallyEmittedExpression(newNode, existing, options);
			}

			else if (this.predicateUtil.isPrefixUnaryExpression(newNode) && this.predicateUtil.isPrefixUnaryExpression(existing)) {
				return <T><any> this.updatePrefixUnaryExpression(newNode, existing, options);
			}

			else if (this.predicateUtil.isPostfixUnaryExpression(newNode) && this.predicateUtil.isPostfixUnaryExpression(existing)) {
				return <T><any> this.updatePostfixUnaryExpression(newNode, existing, options);
			}

			else if (this.predicateUtil.isNullLiteral(newNode) && this.predicateUtil.isNullLiteral(existing)) {
				return <T><any> this.updateNullLiteral(newNode, existing, options);
			}

			else if (this.predicateUtil.isBooleanLiteral(newNode) && this.predicateUtil.isBooleanLiteral(existing)) {
				return <T><any> this.updateBooleanLiteral(newNode, existing, options);
			}

			else if (this.predicateUtil.isThisExpression(newNode) && this.predicateUtil.isThisExpression(existing)) {
				return <T><any> this.updateThisExpression(newNode, existing, options);
			}

			else if (this.predicateUtil.isSuperExpression(newNode) && this.predicateUtil.isSuperExpression(existing)) {
				return <T><any> this.updateSuperExpression(newNode, existing, options);
			}

			else if (this.predicateUtil.isImportExpression(newNode) && this.predicateUtil.isImportExpression(existing)) {
				return <T><any> this.updateImportExpression(newNode, existing, options);
			}

			else if (isDeleteExpression(newNode) && isDeleteExpression(existing)) {
				return <T><any> this.updateDeleteExpression(newNode, existing, options);
			}

			else if (isTypeOfExpression(newNode) && isTypeOfExpression(existing)) {
				return <T><any> this.updateTypeOfExpression(newNode, existing, options);
			}

			else if (isVoidExpression(newNode) && isVoidExpression(existing)) {
				return <T><any> this.updateVoidExpression(newNode, existing, options);
			}

			else if (isAwaitExpression(newNode) && isAwaitExpression(existing)) {
				return <T><any> this.updateAwaitExpression(newNode, existing, options);
			}

			else if (isYieldExpression(newNode) && isYieldExpression(existing)) {
				return <T><any> this.updateYieldExpression(newNode, existing, options);
			}

			else if (isFunctionExpression(newNode) && isFunctionExpression(existing)) {
				return <T><any> this.updateFunctionExpression(newNode, existing, options);
			}

			else if (isArrowFunction(newNode) && isArrowFunction(existing)) {
				return <T><any> this.updateArrowFunction(newNode, existing, options);
			}

			else if (isRegularExpressionLiteral(newNode) && isRegularExpressionLiteral(existing)) {
				return <T><any> this.updateRegularExpressionLiteral(newNode, existing, options);
			}

			else if (isNoSubstitutionTemplateLiteral(newNode) && isNoSubstitutionTemplateLiteral(existing)) {
				return <T><any> this.updateNoSubstitutionTemplateLiteral(<NoSubstitutionTemplateLiteral> newNode, <NoSubstitutionTemplateLiteral> existing, options);
			}

			else if (isTemplateHead(newNode) && isTemplateHead(existing)) {
				return <T><any> this.updateTemplateHead(newNode, existing, options);
			}

			else if (isTemplateMiddle(newNode) && isTemplateMiddle(existing)) {
				return <T><any> this.updateTemplateMiddle(newNode, existing, options);
			}

			else if (isTemplateTail(newNode) && isTemplateTail(existing)) {
				return <T><any> this.updateTemplateTail(newNode, existing, options);
			}

			else if (isTemplateExpression(newNode) && isTemplateExpression(existing)) {
				return <T><any> this.updateTemplateExpression(newNode, existing, options);
			}

			else if (isTemplateSpan(newNode) && isTemplateSpan(existing)) {
				return <T><any> this.updateTemplateSpan(newNode, existing, options);
			}

			else if (isArrayLiteralExpression(newNode) && isArrayLiteralExpression(existing)) {
				return <T><any> this.updateArrayLiteralExpression(newNode, existing, options);
			}

			else if (isSpreadElement(newNode) && isSpreadElement(existing)) {
				return <T><any> this.updateSpreadElement(newNode, existing, options);
			}

			else if (isNewExpression(newNode) && isNewExpression(existing)) {
				return <T><any> this.updateNewExpression(newNode, existing, options);
			}

			else if (isTaggedTemplateExpression(newNode) && isTaggedTemplateExpression(existing)) {
				return <T><any> this.updateTaggedTemplateExpression(newNode, existing, options);
			}

			else if (isAsExpression(newNode) && isAsExpression(existing)) {
				return <T><any> this.updateAsExpression(newNode, existing, options);
			}

			else if (isTypeAssertion(newNode) && isTypeAssertion(existing)) {
				return <T><any> this.updateTypeAssertion(newNode, existing, options);
			}

			else if (isNonNullExpression(newNode) && isNonNullExpression(existing)) {
				return <T><any> this.updateNonNullExpression(newNode, existing, options);
			}

			else if (isMetaProperty(newNode) && isMetaProperty(existing)) {
				return <T><any> this.updateMetaProperty(newNode, existing, options);
			}

			else if (isJsxElement(newNode) && isJsxElement(existing)) {
				return <T><any> this.updateJsxElement(newNode, existing, options);
			}

			else if (isJsxOpeningElement(newNode) && isJsxOpeningElement(existing)) {
				return <T><any> this.updateJsxOpeningElement(newNode, existing, options);
			}

			else if (isJsxClosingElement(newNode) && isJsxClosingElement(existing)) {
				return <T><any> this.updateJsxClosingElement(newNode, existing, options);
			}

			else if (isJsxSelfClosingElement(newNode) && isJsxSelfClosingElement(existing)) {
				return <T><any> this.updateJsxSelfClosingElement(newNode, existing, options);
			}

			else if (isJsxAttribute(newNode) && isJsxAttribute(existing)) {
				return <T><any> this.updateJsxAttribute(newNode, existing, options);
			}

			else if (isJsxAttributes(newNode) && isJsxAttributes(existing)) {
				return <T><any> this.updateJsxAttributes(newNode, existing, options);
			}

			else if (isJsxSpreadAttribute(newNode) && isJsxSpreadAttribute(existing)) {
				return <T><any> this.updateJsxSpreadAttribute(newNode, existing, options);
			}

			else if (isJsxExpression(newNode) && isJsxExpression(existing)) {
				return <T><any> this.updateJsxExpression(newNode, existing, options);
			}

			else if (isJsxText(newNode) && isJsxText(existing)) {
				return <T><any> this.updateJsxText(newNode, existing, options);
			}

			else if (isEmptyStatement(newNode) && isEmptyStatement(existing)) {
				return <T><any> this.updateEmptyStatement(newNode, existing, options);
			}

			else if (isDebuggerStatement(newNode) && isDebuggerStatement(existing)) {
				return <T><any> this.updateDebuggerStatement(newNode, existing, options);
			}

			else if (isMissingDeclaration(newNode) && isMissingDeclaration(existing)) {
				return <T><any> this.updateMissingDeclaration(newNode, existing, options);
			}

			else if (isIfStatement(newNode) && isIfStatement(existing)) {
				return <T><any> this.updateIfStatement(newNode, existing, options);
			}

			else if (isDoStatement(newNode) && isDoStatement(existing)) {
				return <T><any> this.updateDoStatement(newNode, existing, options);
			}

			else if (isWhileStatement(newNode) && isWhileStatement(existing)) {
				return <T><any> this.updateWhileStatement(newNode, existing, options);
			}

			else if (isForStatement(newNode) && isForStatement(existing)) {
				return <T><any> this.updateForStatement(newNode, existing, options);
			}

			else if (isForInStatement(newNode) && isForInStatement(existing)) {
				return <T><any> this.updateForInStatement(newNode, existing, options);
			}

			else if (isForOfStatement(newNode) && isForOfStatement(existing)) {
				return <T><any> this.updateForOfStatement(newNode, existing, options);
			}

			else if (isBreakStatement(newNode) && isBreakStatement(existing)) {
				return <T><any> this.updateBreakStatement(newNode, existing, options);
			}

			else if (isContinueStatement(newNode) && isContinueStatement(existing)) {
				return <T><any> this.updateContinueStatement(newNode, existing, options);
			}

			else if (isReturnStatement(newNode) && isReturnStatement(existing)) {
				return <T><any> this.updateReturnStatement(newNode, existing, options);
			}

			else if (isWithStatement(newNode) && isWithStatement(existing)) {
				return <T><any> this.updateWithStatement(newNode, existing, options);
			}

			else if (isSwitchStatement(newNode) && isSwitchStatement(existing)) {
				return <T><any> this.updateSwitchStatement(newNode, existing, options);
			}

			else if (isCaseBlock(newNode) && isCaseBlock(existing)) {
				return <T><any> this.updateCaseBlock(newNode, existing, options);
			}

			else if (isCaseClause(newNode) && isCaseClause(existing)) {
				return <T><any> this.updateCaseClause(newNode, existing, options);
			}

			else if (isDefaultClause(newNode) && isDefaultClause(existing)) {
				return <T><any> this.updateDefaultClause(newNode, existing, options);
			}

			else if (isLabeledStatement(newNode) && isLabeledStatement(existing)) {
				return <T><any> this.updateLabeledStatement(newNode, existing, options);
			}

			else if (isThrowStatement(newNode) && isThrowStatement(existing)) {
				return <T><any> this.updateThrowStatement(newNode, existing, options);
			}

			else if (isTryStatement(newNode) && isTryStatement(existing)) {
				return <T><any> this.updateTryStatement(newNode, existing, options);
			}

			else if (isCatchClause(newNode) && isCatchClause(existing)) {
				return <T><any> this.updateCatchClause(newNode, existing, options);
			}

			else if (isClassExpression(newNode) && isClassExpression(existing)) {
				return <T><any> this.updateClassExpression(newNode, existing, options);
			}

			else if (isInterfaceDeclaration(newNode) && isInterfaceDeclaration(existing)) {
				return <T><any> this.updateInterfaceDeclaration(newNode, existing, options);
			}

			else if (isTypeAliasDeclaration(newNode) && isTypeAliasDeclaration(existing)) {
				return <T><any> this.updateTypeAliasDeclaration(newNode, existing, options);
			}

			else if (isEnumMember(newNode) && isEnumMember(existing)) {
				return <T><any> this.updateEnumMember(newNode, existing, options);
			}

			else if (isEnumDeclaration(newNode) && isEnumDeclaration(existing)) {
				return <T><any> this.updateEnumDeclaration(newNode, existing, options);
			}

			else if (this.predicateUtil.isNamespaceDeclaration(newNode) && this.predicateUtil.isNamespaceDeclaration(existing)) {
				return <T><any> this.updateNamespaceDeclaration(newNode, existing, options);
			}

			else if (this.predicateUtil.isJSDocNamespaceDeclaration(newNode) && this.predicateUtil.isJSDocNamespaceDeclaration(existing)) {
				return <T><any> this.updateJSDocNamespaceDeclaration(newNode, existing, options);
			}

			else if (isModuleDeclaration(newNode) && isModuleDeclaration(existing)) {
				return <T><any> this.updateModuleDeclaration(newNode, existing, options);
			}

			else if (isModuleBlock(newNode) && isModuleBlock(existing)) {
				return <T><any> this.updateModuleBlock(newNode, existing, options);
			}

			else if (isImportEqualsDeclaration(newNode) && isImportEqualsDeclaration(existing)) {
				return <T><any> this.updateImportEqualsDeclaration(newNode, existing, options);
			}

			else if (isExternalModuleReference(newNode) && isExternalModuleReference(existing)) {
				return <T><any> this.updateExternalModuleReference(newNode, existing, options);
			}

			else if (isImportDeclaration(newNode) && isImportDeclaration(existing)) {
				return <T><any> this.updateImportDeclaration(newNode, existing, options);
			}

			else if (isImportClause(newNode) && isImportClause(existing)) {
				return <T><any> this.updateImportClause(newNode, existing, options);
			}

			else if (isNamespaceImport(newNode) && isNamespaceImport(existing)) {
				return <T><any> this.updateNamespaceImport(newNode, existing, options);
			}

			else if (isNamespaceExportDeclaration(newNode) && isNamespaceExportDeclaration(existing)) {
				return <T><any> this.updateNamespaceExportDeclaration(newNode, existing, options);
			}

			else if (isExportDeclaration(newNode) && isExportDeclaration(existing)) {
				return <T><any> this.updateExportDeclaration(newNode, existing, options);
			}

			else if (isNamedImports(newNode) && isNamedImports(existing)) {
				return <T><any> this.updateNamedImports(newNode, existing, options);
			}

			else if (isNamedExports(newNode) && isNamedExports(existing)) {
				return <T><any> this.updateNamedExports(newNode, existing, options);
			}

			else if (isImportSpecifier(newNode) && isImportSpecifier(existing)) {
				return <T><any> this.updateImportSpecifier(newNode, existing, options);
			}

			else if (isExportSpecifier(newNode) && isExportSpecifier(existing)) {
				return <T><any> this.updateExportSpecifier(newNode, existing, options);
			}

			else if (isExportAssignment(newNode) && isExportAssignment(existing)) {
					return <T><any> this.updateExportAssignment(newNode, existing, options);
				}
		}

		throw new TypeError(`${this.constructor.name} could not update a Node of kind ${SyntaxKind[existing.kind]}: It wasn't handled!`);
		/*tslint:enable:no-any*/
	}

	/**
	 * Updates a ExportAssignment
	 * @param {ExportAssignment} newNode
	 * @param {ExportAssignment} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {ExportAssignment}
	 */
	private updateExportAssignment (newNode: ExportAssignment, existing: ExportAssignment, options: INodeUpdaterUtilUpdateOptions): ExportAssignment {
		this.updateDeclarationStatement(newNode, existing, options);

		existing.isExportEquals = newNode.isExportEquals;
		existing.expression = this.update(newNode.expression, existing.expression, options);

		return this.extraTransformStep(newNode, existing, options);
	}

	/**
	 * Updates a ExportSpecifier
	 * @param {ExportSpecifier} newNode
	 * @param {ExportSpecifier} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {ExportSpecifier}
	 */
	private updateExportSpecifier (newNode: ExportSpecifier, existing: ExportSpecifier, options: INodeUpdaterUtilUpdateOptions): ExportSpecifier {
		this.updateNamedDeclaration(newNode, existing, options);

		existing.propertyName = this.updateNodeIfGiven(newNode.propertyName, existing.propertyName, options, this.updateIdentifier);
		existing.name = this.updateIdentifier(newNode.name, existing.name, options);

		return this.extraTransformStep(newNode, existing, options);
	}

	/**
	 * Updates ExportSpecifiers
	 * @param {Node} parent
	 * @param {NodeArray<ExportSpecifier>} newNode
	 * @param {NodeArray<ExportSpecifier>} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {NodeArray<ExportSpecifier>}
	 */
	private updateExportSpecifiers (parent: Node, newNode: NodeArray<ExportSpecifier>, existing: NodeArray<ExportSpecifier>, options: INodeUpdaterUtilUpdateOptions): NodeArray<ExportSpecifier> {
		return this.updateNodeArray(parent, newNode, existing, options, this.updateExportSpecifier);
	}

	/**
	 * Updates a ImportSpecifier
	 * @param {ImportSpecifier} newNode
	 * @param {ImportSpecifier} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {ImportSpecifier}
	 */
	private updateImportSpecifier (newNode: ImportSpecifier, existing: ImportSpecifier, options: INodeUpdaterUtilUpdateOptions): ImportSpecifier {
		this.updateNamedDeclaration(newNode, existing, options);

		existing.propertyName = this.updateNodeIfGiven(newNode.propertyName, existing.propertyName, options, this.updateIdentifier);
		existing.name = this.updateIdentifier(newNode.name, existing.name, options);

		return this.extraTransformStep(newNode, existing, options);
	}

	/**
	 * Updates ImportSpecifiers
	 * @param {Node} parent
	 * @param {NodeArray<ImportSpecifier>} newNode
	 * @param {NodeArray<ImportSpecifier>} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {NodeArray<ImportSpecifier>}
	 */
	private updateImportSpecifiers (parent: Node, newNode: NodeArray<ImportSpecifier>, existing: NodeArray<ImportSpecifier>, options: INodeUpdaterUtilUpdateOptions): NodeArray<ImportSpecifier> {
		return this.updateNodeArray(parent, newNode, existing, options, this.updateImportSpecifier);
	}

	/**
	 * Updates a NamedExports
	 * @param {NamedExports} newNode
	 * @param {NamedExports} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {NamedExports}
	 */
	private updateNamedExports (newNode: NamedExports, existing: NamedExports, options: INodeUpdaterUtilUpdateOptions): NamedExports {
		this.updateNode(newNode, existing, options);

		existing.elements = this.updateExportSpecifiers(existing, newNode.elements, existing.elements, options);

		return this.extraTransformStep(newNode, existing, options);
	}

	/**
	 * Updates a NamedImports
	 * @param {NamedImports} newNode
	 * @param {NamedImports} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {NamedImports}
	 */
	private updateNamedImports (newNode: NamedImports, existing: NamedImports, options: INodeUpdaterUtilUpdateOptions): NamedImports {
		this.updateNode(newNode, existing, options);

		existing.elements = this.updateImportSpecifiers(existing, newNode.elements, existing.elements, options);

		return this.extraTransformStep(newNode, existing, options);
	}

	/**
	 * Updates a ExportDeclaration
	 * @param {ExportDeclaration} newNode
	 * @param {ExportDeclaration} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {ExportDeclaration}
	 */
	private updateExportDeclaration (newNode: ExportDeclaration, existing: ExportDeclaration, options: INodeUpdaterUtilUpdateOptions): ExportDeclaration {
		this.updateDeclarationStatement(newNode, existing, options);

		existing.exportClause = this.updateNodeIfGiven(newNode.exportClause, existing.exportClause, options, this.updateNamedExports);
		existing.moduleSpecifier = this.updateNodeIfGiven(newNode.moduleSpecifier, existing.moduleSpecifier, options, this.update);

		return this.extraTransformStep(newNode, existing, options);
	}

	/**
	 * Updates a NamespaceExportDeclaration
	 * @param {NamespaceExportDeclaration} newNode
	 * @param {NamespaceExportDeclaration} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {NamespaceExportDeclaration}
	 */
	private updateNamespaceExportDeclaration (newNode: NamespaceExportDeclaration, existing: NamespaceExportDeclaration, options: INodeUpdaterUtilUpdateOptions): NamespaceExportDeclaration {
		this.updateDeclarationStatement(newNode, existing, options);

		existing.name = this.updateIdentifier(newNode.name, existing.name, options);

		return this.extraTransformStep(newNode, existing, options);
	}

	/**
	 * Updates a NamespaceImport
	 * @param {NamespaceImport} newNode
	 * @param {NamespaceImport} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {NamespaceImport}
	 */
	private updateNamespaceImport (newNode: NamespaceImport, existing: NamespaceImport, options: INodeUpdaterUtilUpdateOptions): NamespaceImport {
		this.updateNamedDeclaration(newNode, existing, options);

		existing.name = this.updateIdentifier(newNode.name, existing.name, options);

		return this.extraTransformStep(newNode, existing, options);
	}

	/**
	 * Updates a ImportClause
	 * @param {ImportClause} newNode
	 * @param {ImportClause} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {ImportClause}
	 */
	private updateImportClause (newNode: ImportClause, existing: ImportClause, options: INodeUpdaterUtilUpdateOptions): ImportClause {
		this.updateNamedDeclaration(newNode, existing, options);

		existing.name = this.updateNodeIfGiven(newNode.name, existing.name, options, this.updateIdentifier);
		existing.namedBindings = this.updateNodeIfGiven(newNode.namedBindings, existing.namedBindings, options, this.update);

		return this.extraTransformStep(newNode, existing, options);
	}

	/**
	 * Updates a ImportDeclaration
	 * @param {ImportDeclaration} newNode
	 * @param {ImportDeclaration} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {ImportDeclaration}
	 */
	private updateImportDeclaration (newNode: ImportDeclaration, existing: ImportDeclaration, options: INodeUpdaterUtilUpdateOptions): ImportDeclaration {
		this.updateStatement(newNode, existing, options);

		existing.importClause = this.updateNodeIfGiven(newNode.importClause, existing.importClause, options, this.updateImportClause);
		existing.moduleSpecifier = this.update(newNode.moduleSpecifier, existing.moduleSpecifier, options);

		return this.extraTransformStep(newNode, existing, options);
	}

	/**
	 * Updates a ExternalModuleReference
	 * @param {ExternalModuleReference} newNode
	 * @param {ExternalModuleReference} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {ExternalModuleReference}
	 */
	private updateExternalModuleReference (newNode: ExternalModuleReference, existing: ExternalModuleReference, options: INodeUpdaterUtilUpdateOptions): ExternalModuleReference {
		this.updateNode(newNode, existing, options);

		existing.expression = this.updateNodeIfGiven(newNode.expression, existing.expression, options, this.update);

		return this.extraTransformStep(newNode, existing, options);
	}

	/**
	 * Updates a ImportEqualsDeclaration
	 * @param {ImportEqualsDeclaration} newNode
	 * @param {ImportEqualsDeclaration} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {ImportEqualsDeclaration}
	 */
	private updateImportEqualsDeclaration (newNode: ImportEqualsDeclaration, existing: ImportEqualsDeclaration, options: INodeUpdaterUtilUpdateOptions): ImportEqualsDeclaration {
		this.updateDeclarationStatement(newNode, existing, options);

		existing.name = this.updateIdentifier(newNode.name, existing.name, options);
		existing.moduleReference = this.update(newNode.moduleReference, existing.moduleReference, options);

		return this.extraTransformStep(newNode, existing, options);
	}

	/**
	 * Updates a ModuleBlock
	 * @param {ModuleBlock} newNode
	 * @param {ModuleBlock} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {ModuleBlock}
	 */
	private updateModuleBlock (newNode: ModuleBlock, existing: ModuleBlock, options: INodeUpdaterUtilUpdateOptions): ModuleBlock {
		this.updateNode(newNode, existing, options);
		this.updateStatement(newNode, existing, options);

		existing.statements = this.updateAll(existing, newNode.statements, existing.statements, options);

		return this.extraTransformStep(newNode, existing, options);
	}

	/**
	 * Updates a JSDocNamespaceDeclaration
	 * @param {JSDocNamespaceDeclaration} newNode
	 * @param {JSDocNamespaceDeclaration} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {JSDocNamespaceDeclaration}
	 */
	private updateJSDocNamespaceDeclaration (newNode: JSDocNamespaceDeclaration, existing: JSDocNamespaceDeclaration, options: INodeUpdaterUtilUpdateOptions): JSDocNamespaceDeclaration {
		this.updateModuleDeclaration(newNode, existing, options);

		existing.name = this.updateIdentifier(newNode.name, existing.name, options);
		existing.body = this.update(newNode.body, existing.body, options);

		return existing;
	}

	/**
	 * Updates a NamespaceDeclaration
	 * @param {NamespaceDeclaration} newNode
	 * @param {NamespaceDeclaration} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {NamespaceDeclaration}
	 */
	private updateNamespaceDeclaration (newNode: NamespaceDeclaration, existing: NamespaceDeclaration, options: INodeUpdaterUtilUpdateOptions): NamespaceDeclaration {
		this.updateModuleDeclaration(newNode, existing, options);

		existing.name = this.updateIdentifier(newNode.name, existing.name, options);
		existing.body = this.update(newNode.body, existing.body, options);

		return existing;
	}

	/**
	 * Updates a ModuleDeclaration
	 * @param {ModuleDeclaration} newNode
	 * @param {ModuleDeclaration} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {ModuleDeclaration}
	 */
	private updateModuleDeclaration (newNode: ModuleDeclaration, existing: ModuleDeclaration, options: INodeUpdaterUtilUpdateOptions): ModuleDeclaration {
		this.updateDeclarationStatement(newNode, existing, options);

		existing.name = this.update(newNode.name, existing.name, options);
		existing.body = this.updateNodeIfGiven(newNode.body, existing.body, options, this.update);

		return this.extraTransformStep(newNode, existing, options);
	}

	/**
	 * Updates a EnumDeclaration
	 * @param {EnumDeclaration} newNode
	 * @param {EnumDeclaration} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {EnumDeclaration}
	 */
	private updateEnumDeclaration (newNode: EnumDeclaration, existing: EnumDeclaration, options: INodeUpdaterUtilUpdateOptions): EnumDeclaration {
		this.updateDeclarationStatement(newNode, existing, options);

		existing.name = this.updateIdentifier(newNode.name, existing.name, options);
		existing.members = this.updateEnumMembers(existing, newNode.members, existing.members, options);

		return this.extraTransformStep(newNode, existing, options);
	}

	/**
	 * Updates a EnumMember
	 * @param {EnumMember} newNode
	 * @param {EnumMember} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {EnumMember}
	 */
	private updateEnumMember (newNode: EnumMember, existing: EnumMember, options: INodeUpdaterUtilUpdateOptions): EnumMember {
		this.updateNamedDeclaration(newNode, existing, options);

		existing.name = this.updatePropertyName(newNode.name, existing.name, options);
		existing.initializer = this.updateNodeIfGiven(newNode.initializer, existing.initializer, options, this.update);

		return this.extraTransformStep(newNode, existing, options);
	}

	/**
	 * Updates EnumMembers
	 * @param {Node} parent
	 * @param {NodeArray<EnumMember>} newNode
	 * @param {NodeArray<EnumMember>} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {NodeArray<EnumMember>}
	 */
	private updateEnumMembers (parent: Node, newNode: NodeArray<EnumMember>, existing: NodeArray<EnumMember>, options: INodeUpdaterUtilUpdateOptions): NodeArray<EnumMember> {
		return this.updateNodeArray(parent, newNode, existing, options, this.updateEnumMember);
	}

	/**
	 * Updates a TypeAliasDeclaration
	 * @param {TypeAliasDeclaration} newNode
	 * @param {TypeAliasDeclaration} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {TypeAliasDeclaration}
	 */
	private updateTypeAliasDeclaration (newNode: TypeAliasDeclaration, existing: TypeAliasDeclaration, options: INodeUpdaterUtilUpdateOptions): TypeAliasDeclaration {
		this.updateDeclarationStatement(newNode, existing, options);

		existing.name = this.updateIdentifier(newNode.name, existing.name, options);
		existing.typeParameters = this.updateNodesIfGiven(existing, newNode.typeParameters, existing.typeParameters, options, this.updateTypeParameterDeclarations);
		existing.type = this.update(newNode.type, existing.type, options);

		return this.extraTransformStep(newNode, existing, options);
	}

	/**
	 * Updates a InterfaceDeclaration
	 * @param {InterfaceDeclaration} newNode
	 * @param {InterfaceDeclaration} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {InterfaceDeclaration}
	 */
	private updateInterfaceDeclaration (newNode: InterfaceDeclaration, existing: InterfaceDeclaration, options: INodeUpdaterUtilUpdateOptions): InterfaceDeclaration {
		this.updateDeclarationStatement(newNode, existing, options);

		existing.name = this.updateIdentifier(newNode.name, existing.name, options);
		existing.typeParameters = this.updateNodesIfGiven(existing, newNode.typeParameters, existing.typeParameters, options, this.updateTypeParameterDeclarations);
		existing.heritageClauses = this.updateNodesIfGiven(existing, newNode.heritageClauses, existing.heritageClauses, options, this.updateHeritageClauses);
		existing.members = this.updateAll(existing, newNode.members, existing.members, options);

		return this.extraTransformStep(newNode, existing, options);
	}

	/**
	 * Updates a CatchClause
	 * @param {CatchClause} newNode
	 * @param {CatchClause} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {CatchClause}
	 */
	private updateCatchClause (newNode: CatchClause, existing: CatchClause, options: INodeUpdaterUtilUpdateOptions): CatchClause {
		this.updateNode(newNode, existing, options);

		existing.variableDeclaration = this.updateNodeIfGiven(newNode.variableDeclaration, existing.variableDeclaration, options, this.updateVariableDeclaration);
		existing.block = this.updateBlock(newNode.block, existing.block, options);

		return this.extraTransformStep(newNode, existing, options);
	}

	/**
	 * Updates a TryStatement
	 * @param {TryStatement} newNode
	 * @param {TryStatement} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {TryStatement}
	 */
	private updateTryStatement (newNode: TryStatement, existing: TryStatement, options: INodeUpdaterUtilUpdateOptions): TryStatement {
		this.updateStatement(newNode, existing, options);

		existing.tryBlock = this.updateBlock(newNode.tryBlock, existing.tryBlock, options);
		existing.catchClause = this.updateNodeIfGiven(newNode.catchClause, existing.catchClause, options, this.updateCatchClause);
		existing.finallyBlock = this.updateNodeIfGiven(newNode.finallyBlock, existing.finallyBlock, options, this.updateBlock);

		return this.extraTransformStep(newNode, existing, options);
	}

	/**
	 * Updates a ThrowStatement
	 * @param {ThrowStatement} newNode
	 * @param {ThrowStatement} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {ThrowStatement}
	 */
	private updateThrowStatement (newNode: ThrowStatement, existing: ThrowStatement, options: INodeUpdaterUtilUpdateOptions): ThrowStatement {
		this.updateStatement(newNode, existing, options);

		existing.expression = this.update(newNode.expression, existing.expression, options);

		return this.extraTransformStep(newNode, existing, options);
	}

	/**
	 * Updates a LabeledStatement
	 * @param {LabeledStatement} newNode
	 * @param {LabeledStatement} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {LabeledStatement}
	 */
	private updateLabeledStatement (newNode: LabeledStatement, existing: LabeledStatement, options: INodeUpdaterUtilUpdateOptions): LabeledStatement {
		this.updateStatement(newNode, existing, options);

		existing.label = this.updateIdentifier(newNode.label, existing.label, options);
		existing.statement = this.update(newNode.statement, existing.statement, options);

		return this.extraTransformStep(newNode, existing, options);
	}

	/**
	 * Updates a DefaultClause
	 * @param {DefaultClause} newNode
	 * @param {DefaultClause} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {DefaultClause}
	 */
	private updateDefaultClause (newNode: DefaultClause, existing: DefaultClause, options: INodeUpdaterUtilUpdateOptions): DefaultClause {
		this.updateNode(newNode, existing, options);

		existing.statements = this.updateAll(existing, newNode.statements, existing.statements, options);

		return this.extraTransformStep(newNode, existing, options);
	}

	/**
	 * Updates a CaseClause
	 * @param {CaseClause} newNode
	 * @param {CaseClause} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {CaseClause}
	 */
	private updateCaseClause (newNode: CaseClause, existing: CaseClause, options: INodeUpdaterUtilUpdateOptions): CaseClause {
		this.updateNode(newNode, existing, options);

		existing.expression = this.update(newNode.expression, existing.expression, options);
		existing.statements = this.updateAll(existing, newNode.statements, existing.statements, options);

		return this.extraTransformStep(newNode, existing, options);
	}

	/**
	 * Updates a CaseBlock
	 * @param {CaseBlock} newNode
	 * @param {CaseBlock} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {CaseBlock}
	 */
	private updateCaseBlock (newNode: CaseBlock, existing: CaseBlock, options: INodeUpdaterUtilUpdateOptions): CaseBlock {
		this.updateNode(newNode, existing, options);

		existing.clauses = this.updateAll(existing, newNode.clauses, existing.clauses, options);

		return this.extraTransformStep(newNode, existing, options);
	}

	/**
	 * Updates a SwitchStatement
	 * @param {SwitchStatement} newNode
	 * @param {SwitchStatement} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {SwitchStatement}
	 */
	private updateSwitchStatement (newNode: SwitchStatement, existing: SwitchStatement, options: INodeUpdaterUtilUpdateOptions): SwitchStatement {
		this.updateStatement(newNode, existing, options);

		existing.expression = this.update(newNode.expression, existing.expression, options);
		existing.caseBlock = this.updateCaseBlock(newNode.caseBlock, existing.caseBlock, options);
		existing.possiblyExhaustive = newNode.possiblyExhaustive;

		return this.extraTransformStep(newNode, existing, options);
	}

	/**
	 * Updates a WithStatement
	 * @param {WithStatement} newNode
	 * @param {WithStatement} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {WithStatement}
	 */
	private updateWithStatement (newNode: WithStatement, existing: WithStatement, options: INodeUpdaterUtilUpdateOptions): WithStatement {
		this.updateStatement(newNode, existing, options);

		existing.expression = this.update(newNode.expression, existing.expression, options);
		existing.statement = this.updateStatement(newNode.statement, existing.statement, options);

		return this.extraTransformStep(newNode, existing, options);
	}

	/**
	 * Updates a ReturnStatement
	 * @param {ReturnStatement} newNode
	 * @param {ReturnStatement} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {ReturnStatement}
	 */
	private updateReturnStatement (newNode: ReturnStatement, existing: ReturnStatement, options: INodeUpdaterUtilUpdateOptions): ReturnStatement {
		this.updateStatement(newNode, existing, options);

		existing.expression = this.updateNodeIfGiven(newNode.expression, existing.expression, options, this.update);

		return this.extraTransformStep(newNode, existing, options);
	}

	/**
	 * Updates a ContinueStatement
	 * @param {ContinueStatement} newNode
	 * @param {ContinueStatement} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {ContinueStatement}
	 */
	private updateContinueStatement (newNode: ContinueStatement, existing: ContinueStatement, options: INodeUpdaterUtilUpdateOptions): ContinueStatement {
		this.updateStatement(newNode, existing, options);

		existing.label = this.updateNodeIfGiven(newNode.label, existing.label, options, this.updateIdentifier);

		return this.extraTransformStep(newNode, existing, options);
	}

	/**
	 * Updates a BreakStatement
	 * @param {BreakStatement} newNode
	 * @param {BreakStatement} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {BreakStatement}
	 */
	private updateBreakStatement (newNode: BreakStatement, existing: BreakStatement, options: INodeUpdaterUtilUpdateOptions): BreakStatement {
		this.updateStatement(newNode, existing, options);

		existing.label = this.updateNodeIfGiven(newNode.label, existing.label, options, this.updateIdentifier);

		return this.extraTransformStep(newNode, existing, options);
	}

	/**
	 * Updates a ForOfStatement
	 * @param {ForOfStatement} newNode
	 * @param {ForOfStatement} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {ForOfStatement}
	 */
	private updateForOfStatement (newNode: ForOfStatement, existing: ForOfStatement, options: INodeUpdaterUtilUpdateOptions): ForOfStatement {
		this.updateIterationStatement(newNode, existing, options);

		existing.awaitModifier = this.updateNodeIfGiven(newNode.awaitModifier, existing.awaitModifier, options, this.updateToken);
		existing.initializer = this.update(newNode.initializer, existing.initializer, options);
		existing.expression = this.update(newNode.expression, existing.expression, options);

		return this.extraTransformStep(newNode, existing, options);
	}

	/**
	 * Updates a ForInStatement
	 * @param {ForInStatement} newNode
	 * @param {ForInStatement} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {ForInStatement}
	 */
	private updateForInStatement (newNode: ForInStatement, existing: ForInStatement, options: INodeUpdaterUtilUpdateOptions): ForInStatement {
		this.updateIterationStatement(newNode, existing, options);

		existing.initializer = this.update(newNode.initializer, existing.initializer, options);
		existing.expression = this.update(newNode.expression, existing.expression, options);

		return this.extraTransformStep(newNode, existing, options);
	}

	/**
	 * Updates a ForStatement
	 * @param {ForStatement} newNode
	 * @param {ForStatement} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {ForStatement}
	 */
	private updateForStatement (newNode: ForStatement, existing: ForStatement, options: INodeUpdaterUtilUpdateOptions): ForStatement {
		this.updateIterationStatement(newNode, existing, options);

		existing.initializer = this.updateNodeIfGiven(newNode.initializer, existing.initializer, options, this.update);
		existing.condition = this.updateNodeIfGiven(newNode.condition, existing.condition, options, this.update);
		existing.incrementor = this.updateNodeIfGiven(newNode.incrementor, existing.incrementor, options, this.update);

		return this.extraTransformStep(newNode, existing, options);
	}

	/**
	 * Updates a WhileStatement
	 * @param {WhileStatement} newNode
	 * @param {WhileStatement} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {WhileStatement}
	 */
	private updateWhileStatement (newNode: WhileStatement, existing: WhileStatement, options: INodeUpdaterUtilUpdateOptions): WhileStatement {
		this.updateIterationStatement(newNode, existing, options);

		existing.expression = this.update(newNode.expression, existing.expression, options);

		return this.extraTransformStep(newNode, existing, options);
	}

	/**
	 * Updates a DoStatement
	 * @param {DoStatement} newNode
	 * @param {DoStatement} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {DoStatement}
	 */
	private updateDoStatement (newNode: DoStatement, existing: DoStatement, options: INodeUpdaterUtilUpdateOptions): DoStatement {
		this.updateIterationStatement(newNode, existing, options);

		existing.expression = this.update(newNode.expression, existing.expression, options);

		return this.extraTransformStep(newNode, existing, options);
	}

	/**
	 * Updates an IfStatement
	 * @param {IfStatement} newNode
	 * @param {IfStatement} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {IfStatement}
	 */
	private updateIfStatement (newNode: IfStatement, existing: IfStatement, options: INodeUpdaterUtilUpdateOptions): IfStatement {
		this.updateStatement(newNode, existing, options);

		existing.expression = this.update(newNode.expression, existing.expression, options);
		existing.thenStatement = this.update(newNode.thenStatement, existing.thenStatement, options);
		existing.elseStatement = this.updateNodeIfGiven(newNode.elseStatement, existing.elseStatement, options, this.update);

		return this.extraTransformStep(newNode, existing, options);
	}

	/**
	 * Updates a MissingDeclaration
	 * @param {MissingDeclaration} newNode
	 * @param {MissingDeclaration} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {MissingDeclaration}
	 */
	private updateMissingDeclaration (newNode: MissingDeclaration, existing: MissingDeclaration, options: INodeUpdaterUtilUpdateOptions): MissingDeclaration {
		this.updateDeclarationStatement(newNode, existing, options);
		this.updateClassElement(newNode, existing, options);
		this.updateObjectLiteralElement(newNode, existing, options);
		this.updateTypeElement(newNode, existing, options);

		existing.name = this.updateNodeIfGiven(newNode.name, existing.name, options, this.updateIdentifier);

		return this.extraTransformStep(newNode, existing, options);
	}

	/**
	 * Updates a DebuggerStatement
	 * @param {DebuggerStatement} newNode
	 * @param {DebuggerStatement} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {DebuggerStatement}
	 */
	private updateDebuggerStatement (newNode: DebuggerStatement, existing: DebuggerStatement, options: INodeUpdaterUtilUpdateOptions): DebuggerStatement {
		this.updateStatement(newNode, existing, options);

		return this.extraTransformStep(newNode, existing, options);
	}

	/**
	 * Updates a EmptyStatement
	 * @param {EmptyStatement} newNode
	 * @param {EmptyStatement} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {EmptyStatement}
	 */
	private updateEmptyStatement (newNode: EmptyStatement, existing: EmptyStatement, options: INodeUpdaterUtilUpdateOptions): EmptyStatement {
		this.updateStatement(newNode, existing, options);

		return this.extraTransformStep(newNode, existing, options);
	}

	/**
	 * Updates a JsxText
	 * @param {JsxText} newNode
	 * @param {JsxText} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {JsxText}
	 */
	private updateJsxText (newNode: JsxText, existing: JsxText, options: INodeUpdaterUtilUpdateOptions): JsxText {
		this.updateNode(newNode, existing, options);

		existing.containsOnlyWhiteSpaces = newNode.containsOnlyWhiteSpaces;

		return this.extraTransformStep(newNode, existing, options);
	}

	/**
	 * Updates a JsxExpression
	 * @param {JsxExpression} newNode
	 * @param {JsxExpression} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {JsxExpression}
	 */
	private updateJsxExpression (newNode: JsxExpression, existing: JsxExpression, options: INodeUpdaterUtilUpdateOptions): JsxExpression {
		this.updateExpression(newNode, existing, options);

		existing.dotDotDotToken = this.updateNodeIfGiven(newNode.dotDotDotToken, existing.dotDotDotToken, options, this.updateToken);
		existing.expression = this.updateNodeIfGiven(newNode.expression, existing.expression, options, this.update);

		return this.extraTransformStep(newNode, existing, options);
	}

	/**
	 * Updates a JsxSpreadAttribute
	 * @param {JsxSpreadAttribute} newNode
	 * @param {JsxSpreadAttribute} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {JsxSpreadAttribute}
	 */
	private updateJsxSpreadAttribute (newNode: JsxSpreadAttribute, existing: JsxSpreadAttribute, options: INodeUpdaterUtilUpdateOptions): JsxSpreadAttribute {
		this.updateObjectLiteralElement(newNode, existing, options);

		existing.expression = this.update(newNode.expression, existing.expression, options);

		return this.extraTransformStep(newNode, existing, options);
	}

	/**
	 * Updates a JsxAttribute
	 * @param {JsxAttribute} newNode
	 * @param {JsxAttribute} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {JsxAttribute}
	 */
	private updateJsxAttribute (newNode: JsxAttribute, existing: JsxAttribute, options: INodeUpdaterUtilUpdateOptions): JsxAttribute {
		this.updateObjectLiteralElement(newNode, existing, options);

		existing.name = this.updateIdentifier(newNode.name, existing.name, options);
		existing.initializer = this.updateNodeIfGiven(newNode.initializer, existing.initializer, options, this.update);

		return this.extraTransformStep(newNode, existing, options);
	}

	/**
	 * Updates a JsxAttributes
	 * @param {JsxAttributes} newNode
	 * @param {JsxAttributes} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {JsxAttributes}
	 */
	private updateJsxAttributes (newNode: JsxAttributes, existing: JsxAttributes, options: INodeUpdaterUtilUpdateOptions): JsxAttributes {
		this.updateObjectLiteralExpressionBase(newNode, existing, options);

		return this.extraTransformStep(newNode, existing, options);
	}

	/**
	 * Updates a JsxOpeningElement
	 * @param {JsxOpeningElement} newNode
	 * @param {JsxOpeningElement} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {JsxOpeningElement}
	 */
	private updateJsxOpeningElement (newNode: JsxOpeningElement, existing: JsxOpeningElement, options: INodeUpdaterUtilUpdateOptions): JsxOpeningElement {
		this.updateExpression(newNode, existing, options);

		existing.tagName = this.update(newNode.tagName, existing.tagName, options);
		existing.attributes = this.update(newNode.attributes, existing.attributes, options);

		return this.extraTransformStep(newNode, existing, options);
	}

	/**
	 * Updates a JsxClosingElement
	 * @param {JsxClosingElement} newNode
	 * @param {JsxClosingElement} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {JsxClosingElement}
	 */
	private updateJsxClosingElement (newNode: JsxClosingElement, existing: JsxClosingElement, options: INodeUpdaterUtilUpdateOptions): JsxClosingElement {
		this.updateNode(newNode, existing, options);

		existing.tagName = this.update(newNode.tagName, existing.tagName, options);

		return this.extraTransformStep(newNode, existing, options);
	}

	/**
	 * Updates a JsxSelfClosingElement
	 * @param {JsxSelfClosingElement} newNode
	 * @param {JsxSelfClosingElement} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {JsxSelfClosingElement}
	 */
	private updateJsxSelfClosingElement (newNode: JsxSelfClosingElement, existing: JsxSelfClosingElement, options: INodeUpdaterUtilUpdateOptions): JsxSelfClosingElement {
		this.updatePrimaryExpression(newNode, existing, options);

		existing.tagName = this.update(newNode.tagName, existing.tagName, options);
		existing.attributes = this.update(newNode.attributes, existing.attributes, options);

		return this.extraTransformStep(newNode, existing, options);
	}

	/**
	 * Updates a JsxElement
	 * @param {JsxElement} newNode
	 * @param {JsxElement} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {JsxElement}
	 */
	private updateJsxElement (newNode: JsxElement, existing: JsxElement, options: INodeUpdaterUtilUpdateOptions): JsxElement {
		this.updatePrimaryExpression(newNode, existing, options);

		existing.openingElement = this.updateJsxOpeningElement(newNode.openingElement, existing.openingElement, options);
		existing.closingElement = this.updateJsxClosingElement(newNode.closingElement, existing.closingElement, options);
		existing.children = this.updateAll(existing, newNode.children, existing.children, options);

		return this.extraTransformStep(newNode, existing, options);
	}

	/**
	 * Updates a MetaProperty
	 * @param {MetaProperty} newNode
	 * @param {MetaProperty} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {MetaProperty}
	 */
	private updateMetaProperty (newNode: MetaProperty, existing: MetaProperty, options: INodeUpdaterUtilUpdateOptions): MetaProperty {
		this.updatePrimaryExpression(newNode, existing, options);

		existing.keywordToken = newNode.keywordToken;
		existing.name = this.updateIdentifier(newNode.name, existing.name, options);

		return this.extraTransformStep(newNode, existing, options);
	}

	/**
	 * Updates a NonNullExpression
	 * @param {NonNullExpression} newNode
	 * @param {NonNullExpression} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {NonNullExpression}
	 */
	private updateNonNullExpression (newNode: NonNullExpression, existing: NonNullExpression, options: INodeUpdaterUtilUpdateOptions): NonNullExpression {
		this.updateLeftHandSideExpression(newNode, existing, options);

		existing.expression = this.update(newNode.expression, existing.expression, options);

		return this.extraTransformStep(newNode, existing, options);
	}

	/**
	 * Updates a TypeAssertion
	 * @param {TypeAssertion} newNode
	 * @param {TypeAssertion} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {TypeAssertion}
	 */
	private updateTypeAssertion (newNode: TypeAssertion, existing: TypeAssertion, options: INodeUpdaterUtilUpdateOptions): TypeAssertion {
		this.updateUnaryExpression(newNode, existing, options);

		existing.expression = this.update(newNode.expression, existing.expression, options);
		existing.type = this.update(newNode.type, existing.type, options);

		return this.extraTransformStep(newNode, existing, options);
	}

	/**
	 * Updates a AsExpression
	 * @param {AsExpression} newNode
	 * @param {AsExpression} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {AsExpression}
	 */
	private updateAsExpression (newNode: AsExpression, existing: AsExpression, options: INodeUpdaterUtilUpdateOptions): AsExpression {
		this.updateExpression(newNode, existing, options);

		existing.expression = this.update(newNode.expression, existing.expression, options);
		existing.type = this.update(newNode.type, existing.type, options);

		return this.extraTransformStep(newNode, existing, options);
	}

	/**
	 * Updates a TaggedTemplateExpression
	 * @param {TaggedTemplateExpression} newNode
	 * @param {TaggedTemplateExpression} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {TaggedTemplateExpression}
	 */
	private updateTaggedTemplateExpression (newNode: TaggedTemplateExpression, existing: TaggedTemplateExpression, options: INodeUpdaterUtilUpdateOptions): TaggedTemplateExpression {
		this.updateMemberExpression(newNode, existing, options);

		existing.tag = this.update(newNode.tag, existing.tag, options);
		existing.template = this.update(newNode.template, existing.template, options);

		return this.extraTransformStep(newNode, existing, options);
	}

	/**
	 * Updates a SpreadElement
	 * @param {SpreadElement} newNode
	 * @param {SpreadElement} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {SpreadElement}
	 */
	private updateSpreadElement (newNode: SpreadElement, existing: SpreadElement, options: INodeUpdaterUtilUpdateOptions): SpreadElement {
		this.updateExpression(newNode, existing, options);

		existing.expression = this.update(newNode.expression, existing.expression, options);

		return this.extraTransformStep(newNode, existing, options);
	}

	/**
	 * Updates a ArrayLiteralExpression
	 * @param {ArrayLiteralExpression} newNode
	 * @param {ArrayLiteralExpression} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {ArrayLiteralExpression}
	 */
	private updateArrayLiteralExpression (newNode: ArrayLiteralExpression, existing: ArrayLiteralExpression, options: INodeUpdaterUtilUpdateOptions): ArrayLiteralExpression {
		this.updatePrimaryExpression(newNode, existing, options);

		existing.elements = this.updateAll(existing, newNode.elements, existing.elements, options);

		return this.extraTransformStep(newNode, existing, options);
	}

	/**
	 * Updates a TemplateSpan
	 * @param {TemplateSpan} newNode
	 * @param {TemplateSpan} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {TemplateSpan}
	 */
	private updateTemplateSpan (newNode: TemplateSpan, existing: TemplateSpan, options: INodeUpdaterUtilUpdateOptions): TemplateSpan {
		this.updateNode(newNode, existing, options);

		existing.expression = this.update(newNode.expression, existing.expression, options);
		existing.literal = this.update(newNode.literal, existing.literal, options);

		return this.extraTransformStep(newNode, existing, options);
	}

	/**
	 * Updates TemplateSpans
	 * @param {Node} parent
	 * @param {NodeArray<TemplateSpan>} newNode
	 * @param {NodeArray<TemplateSpan>} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {NodeArray<TemplateSpan>}
	 */
	private updateTemplateSpans (parent: Node, newNode: NodeArray<TemplateSpan>, existing: NodeArray<TemplateSpan>, options: INodeUpdaterUtilUpdateOptions): NodeArray<TemplateSpan> {
		return this.updateNodeArray(parent, newNode, existing, options, this.updateTemplateSpan);
	}

	/**
	 * Updates a TemplateExpression
	 * @param {TemplateExpression} newNode
	 * @param {TemplateExpression} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {TemplateExpression}
	 */
	private updateTemplateExpression (newNode: TemplateExpression, existing: TemplateExpression, options: INodeUpdaterUtilUpdateOptions): TemplateExpression {
		this.updatePrimaryExpression(newNode, existing, options);

		existing.head = this.updateTemplateHead(newNode.head, existing.head, options);
		existing.templateSpans = this.updateTemplateSpans(existing, newNode.templateSpans, existing.templateSpans, options);

		return this.extraTransformStep(newNode, existing, options);
	}

	/**
	 * Updates a TemplateHead
	 * @param {TemplateHead} newNode
	 * @param {TemplateHead} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {TemplateHead}
	 */
	private updateTemplateHead (newNode: TemplateHead, existing: TemplateHead, options: INodeUpdaterUtilUpdateOptions): TemplateHead {
		this.updateLiteralLikeNode(newNode, existing, options);
		return this.extraTransformStep(newNode, existing, options);
	}

	/**
	 * Updates a TemplateMiddle
	 * @param {TemplateMiddle} newNode
	 * @param {TemplateMiddle} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {TemplateMiddle}
	 */
	private updateTemplateMiddle (newNode: TemplateMiddle, existing: TemplateMiddle, options: INodeUpdaterUtilUpdateOptions): TemplateMiddle {
		this.updateLiteralLikeNode(newNode, existing, options);
		return this.extraTransformStep(newNode, existing, options);
	}

	/**
	 * Updates a TemplateTail
	 * @param {TemplateTail} newNode
	 * @param {TemplateTail} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {TemplateTail}
	 */
	private updateTemplateTail (newNode: TemplateTail, existing: TemplateTail, options: INodeUpdaterUtilUpdateOptions): TemplateTail {
		this.updateLiteralLikeNode(newNode, existing, options);
		return this.extraTransformStep(newNode, existing, options);
	}

	/**
	 * Updates a RegularExpressionLiteral
	 * @param {RegularExpressionLiteral} newNode
	 * @param {RegularExpressionLiteral} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {RegularExpressionLiteral}
	 */
	private updateRegularExpressionLiteral (newNode: RegularExpressionLiteral, existing: RegularExpressionLiteral, options: INodeUpdaterUtilUpdateOptions): RegularExpressionLiteral {
		this.updateLiteralExpression(newNode, existing, options);
		return this.extraTransformStep(newNode, existing, options);
	}

	/**
	 * Updates a NoSubstitutionTemplateLiteral
	 * @param {NoSubstitutionTemplateLiteral} newNode
	 * @param {NoSubstitutionTemplateLiteral} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {NoSubstitutionTemplateLiteral}
	 */
	private updateNoSubstitutionTemplateLiteral (newNode: NoSubstitutionTemplateLiteral, existing: NoSubstitutionTemplateLiteral, options: INodeUpdaterUtilUpdateOptions): NoSubstitutionTemplateLiteral {
		this.updateLiteralExpression(newNode, existing, options);
		return this.extraTransformStep(newNode, existing, options);
	}

	/**
	 * Updates a ArrowFunction
	 * @param {ArrowFunction} newNode
	 * @param {ArrowFunction} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {ArrowFunction}
	 */
	private updateArrowFunction (newNode: ArrowFunction, existing: ArrowFunction, options: INodeUpdaterUtilUpdateOptions): ArrowFunction {
		this.updateExpression(newNode, existing, options);
		this.updateFunctionLikeDeclarationBase(newNode, existing, options);

		existing.equalsGreaterThanToken = this.updateToken(newNode.equalsGreaterThanToken, existing.equalsGreaterThanToken, options);
		existing.body = this.updateConciseBody(newNode.body, existing.body, options);

		return this.extraTransformStep(newNode, existing, options);
	}

	/**
	 * Updates a FunctionExpression
	 * @param {FunctionExpression} newNode
	 * @param {FunctionExpression} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {FunctionExpression}
	 */
	private updateFunctionExpression (newNode: FunctionExpression, existing: FunctionExpression, options: INodeUpdaterUtilUpdateOptions): FunctionExpression {
		this.updatePrimaryExpression(newNode, existing, options);
		this.updateFunctionLikeDeclarationBase(newNode, existing, options);

		existing.name = this.updateNodeIfGiven(newNode.name, existing.name, options, this.updateIdentifier);
		existing.body = this.updateFunctionBody(newNode.body, existing.body, options);

		return this.extraTransformStep(newNode, existing, options);
	}

	/**
	 * Updates a YieldExpression
	 * @param {YieldExpression} newNode
	 * @param {YieldExpression} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {YieldExpression}
	 */
	private updateYieldExpression (newNode: YieldExpression, existing: YieldExpression, options: INodeUpdaterUtilUpdateOptions): YieldExpression {
		this.updateExpression(newNode, existing, options);

		existing.asteriskToken = this.updateNodeIfGiven(newNode.asteriskToken, existing.asteriskToken, options, this.updateToken);
		existing.expression = this.updateNodeIfGiven(newNode.expression, existing.expression, options, this.update);

		return this.extraTransformStep(newNode, existing, options);
	}

	/**
	 * Updates a AwaitExpression
	 * @param {AwaitExpression} newNode
	 * @param {AwaitExpression} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {AwaitExpression}
	 */
	private updateAwaitExpression (newNode: AwaitExpression, existing: AwaitExpression, options: INodeUpdaterUtilUpdateOptions): AwaitExpression {
		this.updateUnaryExpression(newNode, existing, options);

		existing.expression = this.update(newNode.expression, existing.expression, options);

		return this.extraTransformStep(newNode, existing, options);
	}

	/**
	 * Updates a VoidExpression
	 * @param {VoidExpression} newNode
	 * @param {VoidExpression} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {VoidExpression}
	 */
	private updateVoidExpression (newNode: VoidExpression, existing: VoidExpression, options: INodeUpdaterUtilUpdateOptions): VoidExpression {
		this.updateUnaryExpression(newNode, existing, options);

		existing.expression = this.update(newNode.expression, existing.expression, options);

		return this.extraTransformStep(newNode, existing, options);
	}

	/**
	 * Updates a TypeOfExpression
	 * @param {TypeOfExpression} newNode
	 * @param {TypeOfExpression} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {TypeOfExpression}
	 */
	private updateTypeOfExpression (newNode: TypeOfExpression, existing: TypeOfExpression, options: INodeUpdaterUtilUpdateOptions): TypeOfExpression {
		this.updateUnaryExpression(newNode, existing, options);

		existing.expression = this.update(newNode.expression, existing.expression, options);

		return this.extraTransformStep(newNode, existing, options);
	}

	/**
	 * Updates a DeleteExpression
	 * @param {DeleteExpression} newNode
	 * @param {DeleteExpression} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {DeleteExpression}
	 */
	private updateDeleteExpression (newNode: DeleteExpression, existing: DeleteExpression, options: INodeUpdaterUtilUpdateOptions): DeleteExpression {
		this.updateUnaryExpression(newNode, existing, options);

		existing.expression = this.update(newNode.expression, existing.expression, options);

		return this.extraTransformStep(newNode, existing, options);
	}

	/**
	 * Updates a ImportExpression
	 * @param {ImportExpression} newNode
	 * @param {ImportExpression} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {ImportExpression}
	 */
	private updateImportExpression (newNode: ImportExpression, existing: ImportExpression, options: INodeUpdaterUtilUpdateOptions): ImportExpression {
		this.updatePrimaryExpression(newNode, existing, options);

		return this.extraTransformStep(newNode, existing, options);
	}

	/**
	 * Updates a ThisExpression
	 * @param {ThisExpression} newNode
	 * @param {ThisExpression} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {ThisExpression}
	 */
	private updateThisExpression (newNode: ThisExpression, existing: ThisExpression, options: INodeUpdaterUtilUpdateOptions): ThisExpression {
		this.updatePrimaryExpression(newNode, existing, options);
		this.updateKeywordTypeNode(newNode, existing, options);

		return this.extraTransformStep(newNode, existing, options);
	}

	/**
	 * Updates a SuperExpression
	 * @param {SuperExpression} newNode
	 * @param {SuperExpression} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {SuperExpression}
	 */
	private updateSuperExpression (newNode: SuperExpression, existing: SuperExpression, options: INodeUpdaterUtilUpdateOptions): SuperExpression {
		this.updatePrimaryExpression(newNode, existing, options);

		return this.extraTransformStep(newNode, existing, options);
	}

	/**
	 * Updates an IterationStatement
	 * @param {IterationStatement} newNode
	 * @param {IterationStatement} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {IterationStatement}
	 */
	private updateIterationStatement (newNode: IterationStatement, existing: IterationStatement, options: INodeUpdaterUtilUpdateOptions): IterationStatement {
		this.updateStatement(newNode, existing, options);

		existing.statement = this.update(newNode.statement, existing.statement, options);
		return existing;
	}

	/**
	 * Updates a KeywordTypeNode
	 * @param {KeywordTypeNode} newNode
	 * @param {KeywordTypeNode} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {KeywordTypeNode}
	 */
	private updateKeywordTypeNode (newNode: KeywordTypeNode, existing: KeywordTypeNode, options: INodeUpdaterUtilUpdateOptions): KeywordTypeNode {
		this.updateTypeNode(newNode, existing, options);

		existing.kind = newNode.kind;
		return existing;
	}

	/**
	 * Updates a BooleanLiteral
	 * @param {BooleanLiteral} newNode
	 * @param {BooleanLiteral} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {BooleanLiteral}
	 */
	private updateBooleanLiteral (newNode: BooleanLiteral, existing: BooleanLiteral, options: INodeUpdaterUtilUpdateOptions): BooleanLiteral {
		this.updatePrimaryExpression(newNode, existing, options);
		this.updateTypeNode(newNode, existing, options);

		existing.kind = newNode.kind;

		return this.extraTransformStep(newNode, existing, options);
	}

	/**
	 * Updates a NullLiteral
	 * @param {NullLiteral} newNode
	 * @param {NullLiteral} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {NullLiteral}
	 */
	private updateNullLiteral (newNode: NullLiteral, existing: NullLiteral, options: INodeUpdaterUtilUpdateOptions): NullLiteral {
		this.updatePrimaryExpression(newNode, existing, options);
		this.updateTypeNode(newNode, existing, options);

		return this.extraTransformStep(newNode, existing, options);
	}

	/**
	 * Updates a PrefixUnaryExpression
	 * @param {PrefixUnaryExpression} newNode
	 * @param {PrefixUnaryExpression} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {PrefixUnaryExpression}
	 */
	private updatePrefixUnaryExpression (newNode: PrefixUnaryExpression, existing: PrefixUnaryExpression, options: INodeUpdaterUtilUpdateOptions): PrefixUnaryExpression {
		this.updateUpdateExpression(newNode, existing, options);

		existing.operator = newNode.operator;
		existing.operand = this.update(newNode.operand, existing.operand, options);

		return this.extraTransformStep(newNode, existing, options);
	}

	/**
	 * Updates a PostfixUnaryExpression
	 * @param {PostfixUnaryExpression} newNode
	 * @param {PostfixUnaryExpression} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {PostfixUnaryExpression}
	 */
	private updatePostfixUnaryExpression (newNode: PostfixUnaryExpression, existing: PostfixUnaryExpression, options: INodeUpdaterUtilUpdateOptions): PostfixUnaryExpression {
		this.updateUpdateExpression(newNode, existing, options);

		existing.operator = newNode.operator;
		existing.operand = this.update(newNode.operand, existing.operand, options);

		return this.extraTransformStep(newNode, existing, options);
	}

	/**
	 * Updates a LiteralTypeNode
	 * @param {LiteralTypeNode} newNode
	 * @param {LiteralTypeNode} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {LiteralTypeNode}
	 */
	private updateLiteralTypeNode (newNode: LiteralTypeNode, existing: LiteralTypeNode, options: INodeUpdaterUtilUpdateOptions): LiteralTypeNode {
		this.updateTypeNode(newNode, existing, options);

		existing.literal = this.update(newNode.literal, existing.literal, options);

		return this.extraTransformStep(newNode, existing, options);
	}

	/**
	 * Updates a MappedTypeNode
	 * @param {MappedTypeNode} newNode
	 * @param {MappedTypeNode} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {MappedTypeNode}
	 */
	private updateMappedTypeNode (newNode: MappedTypeNode, existing: MappedTypeNode, options: INodeUpdaterUtilUpdateOptions): MappedTypeNode {
		this.updateTypeNode(newNode, existing, options);
		this.updateDeclaration(newNode, existing, options);

		existing.readonlyToken = this.updateNodeIfGiven(newNode.readonlyToken, existing.readonlyToken, options, this.updateToken);
		existing.questionToken = this.updateNodeIfGiven(newNode.questionToken, existing.questionToken, options, this.updateToken);
		existing.typeParameter = this.updateTypeParameterDeclaration(newNode.typeParameter, existing.typeParameter, options);
		existing.type = this.updateNodeIfGiven(newNode.type, existing.type, options, this.update);

		return this.extraTransformStep(newNode, existing, options);
	}

	/**
	 * Updates a IndexedAccessTypeNode
	 * @param {IndexedAccessTypeNode} newNode
	 * @param {IndexedAccessTypeNode} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {IndexedAccessTypeNode}
	 */
	private updateIndexedAccessTypeNode (newNode: IndexedAccessTypeNode, existing: IndexedAccessTypeNode, options: INodeUpdaterUtilUpdateOptions): IndexedAccessTypeNode {
		this.updateTypeNode(newNode, existing, options);

		existing.objectType = this.update(newNode.objectType, existing.objectType, options);
		existing.indexType = this.update(newNode.indexType, existing.indexType, options);

		return this.extraTransformStep(newNode, existing, options);
	}

	/**
	 * Updates a TypeOperatorNode
	 * @param {TypeOperatorNode} newNode
	 * @param {TypeOperatorNode} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {TypeOperatorNode}
	 */
	private updateTypeOperatorNode (newNode: TypeOperatorNode, existing: TypeOperatorNode, options: INodeUpdaterUtilUpdateOptions): TypeOperatorNode {
		this.updateTypeNode(newNode, existing, options);

		existing.operator = newNode.operator;
		existing.type = this.update(newNode.type, existing.type, options);

		return this.extraTransformStep(newNode, existing, options);
	}

	/**
	 * Updates a ParenthesizedTypeNode
	 * @param {ParenthesizedTypeNode} newNode
	 * @param {ParenthesizedTypeNode} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {ParenthesizedTypeNode}
	 */
	private updateParenthesizedTypeNode (newNode: ParenthesizedTypeNode, existing: ParenthesizedTypeNode, options: INodeUpdaterUtilUpdateOptions): ParenthesizedTypeNode {
		this.updateTypeNode(newNode, existing, options);

		existing.type = this.update(newNode.type, existing.type, options);

		return this.extraTransformStep(newNode, existing, options);
	}

	/**
	 * Updates a UnionTypeNode
	 * @param {UnionTypeNode} newNode
	 * @param {UnionTypeNode} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {UnionTypeNode}
	 */
	private updateUnionTypeNode (newNode: UnionTypeNode, existing: UnionTypeNode, options: INodeUpdaterUtilUpdateOptions): UnionTypeNode {
		this.updateTypeNode(newNode, existing, options);

		existing.types = this.updateAll(existing, newNode.types, existing.types, options);

		return this.extraTransformStep(newNode, existing, options);
	}

	/**
	 * Updates a IntersectionTypeNode
	 * @param {IntersectionTypeNode} newNode
	 * @param {IntersectionTypeNode} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {IntersectionTypeNode}
	 */
	private updateIntersectionTypeNode (newNode: IntersectionTypeNode, existing: IntersectionTypeNode, options: INodeUpdaterUtilUpdateOptions): IntersectionTypeNode {
		this.updateTypeNode(newNode, existing, options);

		existing.types = this.updateAll(existing, newNode.types, existing.types, options);

		return this.extraTransformStep(newNode, existing, options);
	}

	/**
	 * Updates a TupleTypeNode
	 * @param {TupleTypeNode} newNode
	 * @param {TupleTypeNode} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {TupleTypeNode}
	 */
	private updateTupleTypeNode (newNode: TupleTypeNode, existing: TupleTypeNode, options: INodeUpdaterUtilUpdateOptions): TupleTypeNode {
		this.updateTypeNode(newNode, existing, options);

		existing.elementTypes = this.updateAll(existing, newNode.elementTypes, existing.elementTypes, options);

		return this.extraTransformStep(newNode, existing, options);
	}

	/**
	 * Updates a ConstructorTypeNode
	 * @param {ConstructorTypeNode} newNode
	 * @param {ConstructorTypeNode} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {ConstructorTypeNode}
	 */
	private updateConstructorTypeNode (newNode: ConstructorTypeNode, existing: ConstructorTypeNode, options: INodeUpdaterUtilUpdateOptions): ConstructorTypeNode {
		this.updateTypeNode(newNode, existing, options);
		this.updateSignatureDeclaration(newNode, existing, options);

		return this.extraTransformStep(newNode, existing, options);
	}

	/**
	 * Updates a TypeQueryNode
	 * @param {TypeQueryNode} newNode
	 * @param {TypeQueryNode} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {TypeQueryNode}
	 */
	private updateTypeQueryNode (newNode: TypeQueryNode, existing: TypeQueryNode, options: INodeUpdaterUtilUpdateOptions): TypeQueryNode {
		this.updateTypeNode(newNode, existing, options);

		existing.exprName = this.updateEntityName(newNode.exprName, existing.exprName, options);

		return this.extraTransformStep(newNode, existing, options);
	}

	/**
	 * Updates a TypeLiteralNode
	 * @param {TypeLiteralNode} newNode
	 * @param {TypeLiteralNode} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {TypeLiteralNode}
	 */
	private updateTypeLiteralNode (newNode: TypeLiteralNode, existing: TypeLiteralNode, options: INodeUpdaterUtilUpdateOptions): TypeLiteralNode {
		this.updateTypeNode(newNode, existing, options);
		this.updateDeclaration(newNode, existing, options);

		existing.members = this.updateAll(existing, newNode.members, existing.members, options);

		return this.extraTransformStep(newNode, existing, options);
	}

	/**
	 * Updates a ArrayTypeNode
	 * @param {ArrayTypeNode} newNode
	 * @param {ArrayTypeNode} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {ArrayTypeNode}
	 */
	private updateArrayTypeNode (newNode: ArrayTypeNode, existing: ArrayTypeNode, options: INodeUpdaterUtilUpdateOptions): ArrayTypeNode {
		this.updateTypeNode(newNode, existing, options);

		existing.elementType = this.update(newNode.elementType, existing.elementType, options);

		return this.extraTransformStep(newNode, existing, options);
	}

	/**
	 * Updates the TextRange of a Node
	 * @param {TextRange} newNode
	 * @param {TextRange} existing
	 * @param {INodeUpdaterUtilUpdateOptions} _options
	 * @returns {TextRange}
	 */
	private updateTextRange (newNode: TextRange, existing: TextRange, _options: INodeUpdaterUtilUpdateOptions): TextRange {
		existing.pos = newNode.pos;
		existing.end = newNode.end;
		return existing;
	}

	/**
	 * Updates a Node if it is given
	 * @param {T} newNode
	 * @param {T} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @param {(newNode: T, existing: T, options: INodeUpdaterUtilUpdateOptions) => T} handler
	 * @returns {T}
	 */
	private updateNodeIfGiven<T extends Node> (newNode: T|undefined, existing: T|undefined, options: INodeUpdaterUtilUpdateOptions, handler: (newNode: T, existing: T, options: INodeUpdaterUtilUpdateOptions) => T): T|undefined {
		const boundHandler = handler.bind(this);
		return existing == null ? newNode : newNode == null ? undefined : boundHandler(newNode, existing, options);
	}

	/**
	 * Updates a NodeArray of Nodes if given
	 * @param {Node} parent
	 * @param {NodeArray<T extends Node>} newNode
	 * @param {NodeArray<T extends Node>} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @param {(newNode: NodeArray<T extends Node>, existing: NodeArray<T extends Node>, options: INodeUpdaterUtilUpdateOptions) => NodeArray<T extends Node>} handler
	 * @returns {NodeArray<T extends Node>}
	 */
	private updateNodesIfGiven<T extends Node> (parent: Node, newNode: NodeArray<T>|undefined, existing: NodeArray<T>|undefined, options: INodeUpdaterUtilUpdateOptions, handler: (parent: Node, newNode: NodeArray<T>, existing: NodeArray<T>, options: INodeUpdaterUtilUpdateOptions) => NodeArray<T>): NodeArray<T>|undefined {
		const boundHandler = handler.bind(this);
		return existing == null ? newNode : newNode == null ? undefined : boundHandler(parent, newNode, existing, options);
	}

	/**
	 * Updates a Node
	 * @param {Node} newNode
	 * @param {Node} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {Node}
	 */
	private updateNode (newNode: Node, existing: Node, options: INodeUpdaterUtilUpdateOptions): Node {
		this.updateTextRange(newNode, existing, options);

		existing.flags = newNode.flags;
		existing.decorators = this.updateNodesIfGiven(existing, newNode.decorators, existing.decorators, options, this.updateDecorators);
		existing.modifiers = this.updateNodesIfGiven(existing, newNode.modifiers, existing.modifiers, options, this.updateModifiers);
		return existing;
	}

	/**
	 * Updates a ObjectLiteralExpression
	 * @param {ObjectLiteralExpression} newNode
	 * @param {ObjectLiteralExpression} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {ObjectLiteralExpression}
	 */
	private updateObjectLiteralExpression (newNode: ObjectLiteralExpression, existing: ObjectLiteralExpression, options: INodeUpdaterUtilUpdateOptions): ObjectLiteralExpression {
		this.updateObjectLiteralExpressionBase<ObjectLiteralElementLike>(newNode, existing, options);

		return this.extraTransformStep(newNode, existing, options);
	}

	/**
	 * Updates a ObjectLiteralExpressionBase
	 * @param {ObjectLiteralExpressionBase} newNode
	 * @param {ObjectLiteralExpressionBase} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {ObjectLiteralExpressionBase}
	 */
	private updateObjectLiteralExpressionBase<T extends ObjectLiteralElement> (newNode: ObjectLiteralExpressionBase<T>, existing: ObjectLiteralExpressionBase<T>, options: INodeUpdaterUtilUpdateOptions): ObjectLiteralExpressionBase<T> {
		this.updatePrimaryExpression(newNode, existing, options);
		this.updateDeclaration(newNode, existing, options);

		existing.properties = this.updateAll(existing, newNode.properties, existing.properties, options);

		return existing;
	}

	/**
	 * Updates a Decorator
	 * @param {Decorator} newNode
	 * @param {Decorator} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {Decorator}
	 */
	private updateDecorator (newNode: Decorator, existing: Decorator, options: INodeUpdaterUtilUpdateOptions): Decorator {
		this.updateNode(newNode, existing, options);

		existing.expression = this.update(newNode.expression, existing.expression, options);
		return this.extraTransformStep(newNode, existing, options);
	}

	/**
	 * Updates a ObjectLiteralElement
	 * @param {ObjectLiteralElement} newNode
	 * @param {ObjectLiteralElement} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {ObjectLiteralElement}
	 */
	private updateObjectLiteralElement (newNode: ObjectLiteralElement, existing: ObjectLiteralElement, options: INodeUpdaterUtilUpdateOptions): ObjectLiteralElement {
		this.updateNamedDeclaration(newNode, existing, options);

		existing._objectLiteralBrandBrand = newNode._objectLiteralBrandBrand;
		existing.name = this.updateNodeIfGiven(newNode.name, existing.name, options, this.updatePropertyName);

		return existing;
	}

	/**
	 * Updates a PropertyAssignment
	 * @param {PropertyAssignment} newNode
	 * @param {PropertyAssignment} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {PropertyAssignment}
	 */
	private updatePropertyAssignment (newNode: PropertyAssignment, existing: PropertyAssignment, options: INodeUpdaterUtilUpdateOptions): PropertyAssignment {
		this.updateObjectLiteralElement(newNode, existing, options);

		existing.name = this.updatePropertyName(newNode.name, existing.name, options);
		existing.questionToken = this.updateNodeIfGiven(newNode.questionToken, existing.questionToken, options, this.updateToken);
		existing.initializer = this.update(newNode.initializer, existing.initializer, options);

		return this.extraTransformStep(newNode, existing, options);
	}

	/**
	 * Updates a VariableStatement
	 * @param {VariableStatement} newNode
	 * @param {VariableStatement} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {VariableStatement}
	 */
	private updateVariableStatement (newNode: VariableStatement, existing: VariableStatement, options: INodeUpdaterUtilUpdateOptions): VariableStatement {
		this.updateStatement(newNode, existing, options);

		existing.declarationList = this.updateVariableDeclarationList(newNode.declarationList, existing.declarationList, options);

		return this.extraTransformStep(newNode, existing, options);
	}

	/**
	 * Updates a VariableDeclarationList
	 * @param {VariableDeclarationList} newNode
	 * @param {VariableDeclarationList} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {VariableDeclarationList}
	 */
	private updateVariableDeclarationList (newNode: VariableDeclarationList, existing: VariableDeclarationList, options: INodeUpdaterUtilUpdateOptions): VariableDeclarationList {
		this.updateNode(newNode, existing, options);

		existing.declarations = this.updateVariableDeclarations(existing, newNode.declarations, existing.declarations, options);

		return this.extraTransformStep(newNode, existing, options);
	}

	/**
	 * Updates a VariableDeclarationList
	 * @param {VariableDeclarationList} newNode
	 * @param {VariableDeclarationList} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {VariableDeclarationList}
	 */
	private updateVariableDeclaration (newNode: VariableDeclaration, existing: VariableDeclaration, options: INodeUpdaterUtilUpdateOptions): VariableDeclaration {
		this.updateNamedDeclaration(newNode, existing, options);

		existing.name = this.updateBindingName(newNode.name, existing.name, options);
		existing.type = this.updateNodeIfGiven(newNode.type, existing.type, options, this.update);
		existing.initializer = this.updateNodeIfGiven(newNode.initializer, existing.initializer, options, this.update);

		return this.extraTransformStep(newNode, existing, options);
	}

	/**
	 * Updates VariableDeclarations
	 * @param {Node} parent
	 * @param {NodeArray<VariableDeclaration>} newNode
	 * @param {NodeArray<VariableDeclaration>} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {NodeArray<VariableDeclaration>}
	 */
	private updateVariableDeclarations (parent: Node, newNode: NodeArray<VariableDeclaration>, existing: NodeArray<VariableDeclaration>, options: INodeUpdaterUtilUpdateOptions): NodeArray<VariableDeclaration> {
		return this.updateNodeArray(parent, newNode, existing, options, this.updateVariableDeclaration);
	}

	/**
	 * Updates a BinaryExpression
	 * @param {BinaryExpression} newNode
	 * @param {BinaryExpression} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {BinaryExpression}
	 */
	private updateBinaryExpression (newNode: BinaryExpression, existing: BinaryExpression, options: INodeUpdaterUtilUpdateOptions): BinaryExpression {
		this.updateExpression(newNode, existing, options);
		this.updateDeclaration(newNode, existing, options);

		existing.left = this.update(newNode.left, existing.left, options);
		existing.operatorToken = this.updateToken(newNode.operatorToken, existing.operatorToken, options);
		existing.right = this.update(newNode.right, existing.right, options);

		return this.extraTransformStep(newNode, existing, options);
	}

	/**
	 * Updates a ParenthesizedExpression
	 * @param {ParenthesizedExpression} newNode
	 * @param {ParenthesizedExpression} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {ParenthesizedExpression}
	 */
	private updateParenthesizedExpression (newNode: ParenthesizedExpression, existing: ParenthesizedExpression, options: INodeUpdaterUtilUpdateOptions): ParenthesizedExpression {
		this.updatePrimaryExpression(newNode, existing, options);

		existing.expression = this.update(newNode.expression, existing.expression, options);

		return this.extraTransformStep(newNode, existing, options);
	}

	/**
	 * Updates a ConditionalExpression
	 * @param {ConditionalExpression} newNode
	 * @param {ConditionalExpression} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {ConditionalExpression}
	 */
	private updateConditionalExpression (newNode: ConditionalExpression, existing: ConditionalExpression, options: INodeUpdaterUtilUpdateOptions): ConditionalExpression {
		this.updateExpression(newNode, existing, options);

		existing.condition = this.update(newNode.condition, existing.condition, options);
		existing.questionToken = this.updateToken(newNode.questionToken, existing.questionToken, options);
		existing.colonToken = this.updateToken(newNode.colonToken, existing.colonToken, options);
		existing.whenTrue = this.update(newNode.whenTrue, existing.whenTrue, options);
		existing.whenFalse = this.update(newNode.whenFalse, existing.whenFalse, options);

		return this.extraTransformStep(newNode, existing, options);
	}

	/**
	 * Updates a ShorthandPropertyAssignment
	 * @param {ShorthandPropertyAssignment} newNode
	 * @param {ShorthandPropertyAssignment} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {ShorthandPropertyAssignment}
	 */
	private updateShorthandPropertyAssignment (newNode: ShorthandPropertyAssignment, existing: ShorthandPropertyAssignment, options: INodeUpdaterUtilUpdateOptions): ShorthandPropertyAssignment {
		this.updateObjectLiteralElement(newNode, existing, options);

		existing.name = this.updateIdentifier(newNode.name, existing.name, options);
		existing.questionToken = this.updateNodeIfGiven(newNode.questionToken, existing.questionToken, options, this.updateToken);
		existing.equalsToken = this.updateNodeIfGiven(newNode.equalsToken, existing.equalsToken, options, this.updateToken);
		existing.objectAssignmentInitializer = this.updateNodeIfGiven(newNode.objectAssignmentInitializer, existing.objectAssignmentInitializer, options, this.update);

		return this.extraTransformStep(newNode, existing, options);
	}

	/**
	 * Updates a SpreadAssignment
	 * @param {SpreadAssignment} newNode
	 * @param {SpreadAssignment} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {SpreadAssignment}
	 */
	private updateSpreadAssignment (newNode: SpreadAssignment, existing: SpreadAssignment, options: INodeUpdaterUtilUpdateOptions): SpreadAssignment {
		this.updateObjectLiteralElement(newNode, existing, options);

		existing.expression = this.update(newNode.expression, existing.expression, options);

		return this.extraTransformStep(newNode, existing, options);
	}

	/**
	 * Updates a MethodDeclaration
	 * @param {MethodDeclaration} newNode
	 * @param {MethodDeclaration} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {MethodDeclaration}
	 */
	private updateMethodDeclaration (newNode: MethodDeclaration, existing: MethodDeclaration, options: INodeUpdaterUtilUpdateOptions): MethodDeclaration {
		this.updateFunctionLikeDeclarationBase(newNode, existing, options);
		this.updateClassElement(newNode, existing, options);
		this.updateObjectLiteralElement(newNode, existing, options);

		existing.name = this.updatePropertyName(newNode.name, existing.name, options);
		existing.body = this.updateNodeIfGiven(newNode.body, existing.body, options, this.updateFunctionBody);

		return this.extraTransformStep(newNode, existing, options);
	}

	/**
	 * Updates a GetAccessorDeclaration
	 * @param {AccessorDeclaration} newNode
	 * @param {AccessorDeclaration} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {AccessorDeclaration}
	 */
	private updateGetAccessorDeclaration (newNode: GetAccessorDeclaration, existing: GetAccessorDeclaration, options: INodeUpdaterUtilUpdateOptions): GetAccessorDeclaration {
		this.updateFunctionLikeDeclarationBase(newNode, existing, options);
		this.updateClassElement(newNode, existing, options);
		this.updateObjectLiteralElement(newNode, existing, options);

		existing.name = this.updatePropertyName(newNode.name, existing.name, options);
		existing.body = this.updateFunctionBody(newNode.body, existing.body, options);

		return this.extraTransformStep(newNode, existing, options);
	}

	/**
	 * Updates a QualifiedName
	 * @param {QualifiedName} newNode
	 * @param {QualifiedName} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {QualifiedName}
	 */
	private updateQualifiedName (newNode: QualifiedName, existing: QualifiedName, options: INodeUpdaterUtilUpdateOptions): QualifiedName {
		this.updateNode(newNode, existing, options);

		existing.left = this.updateEntityName(newNode.left, existing.left, options);
		existing.right = this.updateIdentifier(newNode.right, existing.right, options);

		return this.extraTransformStep(newNode, existing, options);
	}

	/**
	 * Updates a SetAccessorDeclaration
	 * @param {SetAccessorDeclaration} newNode
	 * @param {SetAccessorDeclaration} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {SetAccessorDeclaration}
	 */
	private updateSetAccessorDeclaration (newNode: SetAccessorDeclaration, existing: SetAccessorDeclaration, options: INodeUpdaterUtilUpdateOptions): SetAccessorDeclaration {
		this.updateFunctionLikeDeclarationBase(newNode, existing, options);
		this.updateClassElement(newNode, existing, options);
		this.updateObjectLiteralElement(newNode, existing, options);

		existing.name = this.updatePropertyName(newNode.name, existing.name, options);
		existing.body = this.updateFunctionBody(newNode.body, existing.body, options);

		return this.extraTransformStep(newNode, existing, options);
	}

	/**
	 * Updates a FunctionTypeNode
	 * @param {FunctionTypeNode} newNode
	 * @param {FunctionTypeNode} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {FunctionTypeNode}
	 */
	private updateFunctionTypeNode (newNode: FunctionTypeNode, existing: FunctionTypeNode, options: INodeUpdaterUtilUpdateOptions): FunctionTypeNode {
		this.updateTypeNode(newNode, existing, options);
		this.updateSignatureDeclaration(newNode, existing, options);

		return this.extraTransformStep(newNode, existing, options);
	}

	/**
	 * Updates a Modifier
	 * @param {Modifier} newNode
	 * @param {Modifier} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {Node}
	 */
	private updateModifier (newNode: Modifier, existing: Modifier, options: INodeUpdaterUtilUpdateOptions): Modifier {
		return <Modifier> this.updateToken(newNode, existing, options);
	}

	/**
	 * Updates Modifiers
	 * @param {Node} parent
	 * @param {NodeArray<Modifier>} newNode
	 * @param {NodeArray<Modifier>} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 */
	private updateModifiers (parent: Node, newNode: NodeArray<Modifier>, existing: NodeArray<Modifier>, options: INodeUpdaterUtilUpdateOptions): NodeArray<Modifier> {
		return this.updateNodeArray(parent, newNode, existing, options, this.updateModifier);
	}

	/**
	 * Updates Decorators
	 * @param {Node} parent
	 * @param {NodeArray<Decorator>} newNode
	 * @param {NodeArray<Decorator>} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 */
	private updateDecorators (parent: Node, newNode: NodeArray<Decorator>, existing: NodeArray<Decorator>, options: INodeUpdaterUtilUpdateOptions): NodeArray<Decorator> {
		return this.updateNodeArray(parent, newNode, existing, options, this.updateDecorator);
	}

	/**
	 * Updates a Declaration
	 * @param {Declaration} newNode
	 * @param {Declaration} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {Declaration}
	 */
	private updateDeclaration (newNode: Declaration, existing: Declaration, options: INodeUpdaterUtilUpdateOptions): Declaration {
		this.updateNode(newNode, existing, options);
		existing._declarationBrand = newNode._declarationBrand;
		return existing;
	}

	/**
	 * Updates a Token
	 * @param {Token<TKind extends SyntaxKind>} newNode
	 * @param {Token<TKind extends SyntaxKind>} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {Token<TKind extends SyntaxKind>}
	 */
	private updateToken<TKind extends SyntaxKind> (newNode: Token<TKind>, existing: Token<TKind>, options: INodeUpdaterUtilUpdateOptions): Token<TKind> {
		this.updateNode(newNode, existing, options);
		existing.kind = newNode.kind;
		return this.extraTransformStep(newNode, existing, options);
	}

	/**
	 * Updates an AmdDependency
	 * @param {AmdDependency} newNode
	 * @param {AmdDependency} existing
	 * @param {INodeUpdaterUtilUpdateOptions} _options
	 * @returns {AmdDependency}
	 */
	private updateAmdDependency (newNode: AmdDependency, existing: AmdDependency, _options: INodeUpdaterUtilUpdateOptions): AmdDependency {
		existing.name = newNode.name;
		existing.path = newNode.path;
		return existing;
	}

	/**
	 * Updates AmdDependencies
	 * @param {AmdDependency[]} newNode
	 * @param {AmdDependency[]} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 */
	private updateAmdDependencies (newNode: AmdDependency[], existing: AmdDependency[], options: INodeUpdaterUtilUpdateOptions): AmdDependency[] {
		return this.updateArray(newNode, existing, options, this.updateAmdDependency);
	}

	/**
	 * Updates FileReferences
	 * @param {FileReference[]} newNode
	 * @param {FileReference[]} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 */
	private updateFileReferences (newNode: FileReference[], existing: FileReference[], options: INodeUpdaterUtilUpdateOptions): FileReference[] {
		return this.updateArray(newNode, existing, options, this.updateFileReference);
	}

	/**
	 * Updates Statements
	 * @param {Node} parent
	 * @param {NodeArray<Statement>} newNode
	 * @param {NodeArray<Statement>} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 */
	private updateStatements (parent: Node, newNode: NodeArray<Statement>, existing: NodeArray<Statement>, options: INodeUpdaterUtilUpdateOptions): NodeArray<Statement> {
		return this.updateNodeArray(parent, newNode, existing, options, this.update);
	}

	/**
	 * Updates Nodes
	 * @template T
	 * @param {Node} parent
	 * @param {NodeArray<T>} newNode
	 * @param {NodeArray<T>} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 */
	private updateAll<T extends Node> (parent: Node, newNode: NodeArray<T>, existing: NodeArray<T>, options: INodeUpdaterUtilUpdateOptions): NodeArray<T> {
		return this.updateNodeArray(parent, newNode, existing, options, this.update);
	}

	/**
	 * Updates a FileReference
	 * @param {FileReference} newNode
	 * @param {FileReference} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 */
	private updateFileReference (newNode: FileReference, existing: FileReference, options: INodeUpdaterUtilUpdateOptions): FileReference {
		this.updateTextRange(newNode, existing, options);
		existing.fileName = newNode.fileName;

		return existing;
	}

	/**
	 * Updates an Expression
	 * @param {Expression} newNode
	 * @param {Expression} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {Expression}
	 */
	private updateExpression (newNode: Expression, existing: Expression, options: INodeUpdaterUtilUpdateOptions): Expression {
		this.updateNode(newNode, existing, options);

		existing._expressionBrand = newNode._expressionBrand;

		return existing;
	}

	/**
	 * Updates a UnaryExpression
	 * @param {UnaryExpression} newNode
	 * @param {UnaryExpression} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {UnaryExpression}
	 */
	private updateUnaryExpression (newNode: UnaryExpression, existing: UnaryExpression, options: INodeUpdaterUtilUpdateOptions): UnaryExpression {
		this.updateExpression(newNode, existing, options);

		existing._unaryExpressionBrand = newNode._unaryExpressionBrand;

		return existing;
	}

	/**
	 * Updates a UpdateExpression
	 * @param {UpdateExpression} newNode
	 * @param {UpdateExpression} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {UpdateExpression}
	 */
	private updateUpdateExpression (newNode: UpdateExpression, existing: UpdateExpression, options: INodeUpdaterUtilUpdateOptions): UpdateExpression {
		this.updateUnaryExpression(newNode, existing, options);

		existing._updateExpressionBrand = newNode._updateExpressionBrand;

		return existing;
	}

	/**
	 * Updates a LeftHandSideExpression
	 * @param {LeftHandSideExpression} newNode
	 * @param {LeftHandSideExpression} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {LeftHandSideExpression}
	 */
	private updateLeftHandSideExpression (newNode: LeftHandSideExpression, existing: LeftHandSideExpression, options: INodeUpdaterUtilUpdateOptions): LeftHandSideExpression {
		this.updateUpdateExpression(newNode, existing, options);

		existing._leftHandSideExpressionBrand = newNode._leftHandSideExpressionBrand;

		return existing;
	}

	/**
	 * Updates a MemberExpression
	 * @param {MemberExpression} newNode
	 * @param {MemberExpression} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {MemberExpression}
	 */
	private updateMemberExpression (newNode: MemberExpression, existing: MemberExpression, options: INodeUpdaterUtilUpdateOptions): MemberExpression {
		this.updateLeftHandSideExpression(newNode, existing, options);

		existing._memberExpressionBrand = newNode._memberExpressionBrand;

		return existing;
	}

	/**
	 * Updates a PrimaryExpression
	 * @param {PrimaryExpression} newNode
	 * @param {PrimaryExpression} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {PrimaryExpression}
	 */
	private updatePrimaryExpression (newNode: PrimaryExpression, existing: PrimaryExpression, options: INodeUpdaterUtilUpdateOptions): PrimaryExpression {
		this.updateMemberExpression(newNode, existing, options);

		existing._primaryExpressionBrand = newNode._primaryExpressionBrand;

		return existing;
	}

	/**
	 * Updates an Identifier
	 * @param {Identifier} newNode
	 * @param {Identifier} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {Identifier}
	 */
	private updateIdentifier (newNode: Identifier, existing: Identifier, options: INodeUpdaterUtilUpdateOptions): Identifier {
		this.updatePrimaryExpression(newNode, existing, options);

		existing.escapedText = newNode.escapedText;
		existing.originalKeywordKind = newNode.originalKeywordKind;
		existing.isInJSDocNamespace = newNode.isInJSDocNamespace;

		return this.extraTransformStep(newNode, existing, options);
	}

	/**
	 * Updates an NamedDeclaration
	 * @param {NamedDeclaration} newNode
	 * @param {NamedDeclaration} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {NamedDeclaration}
	 */
	private updateNamedDeclaration (newNode: NamedDeclaration, existing: NamedDeclaration, options: INodeUpdaterUtilUpdateOptions): NamedDeclaration {
		this.updateDeclaration(newNode, existing, options);

		existing.name = this.updateNodeIfGiven(newNode.name, existing.name, options, this.updateDeclarationName);

		return existing;
	}

	/**
	 * Updates an DeclarationName
	 * @param {DeclarationName} newNode
	 * @param {DeclarationName} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {DeclarationName}
	 */
	private updateDeclarationName (newNode: DeclarationName, existing: DeclarationName, options: INodeUpdaterUtilUpdateOptions): DeclarationName {
		return this.update(newNode, existing, options);
	}

	/**
	 * Updates a PropertyName
	 * @param {PropertyName} newNode
	 * @param {PropertyName} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {PropertyName}
	 */
	private updatePropertyName (newNode: PropertyName, existing: PropertyName, options: INodeUpdaterUtilUpdateOptions): PropertyName {
		return this.update(newNode, existing, options);
	}

	/**
	 * Updates a TypeNode
	 * @param {TypeNode} newNode
	 * @param {TypeNode} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {TypeNode}
	 */
	private updateTypeNode (newNode: TypeNode, existing: TypeNode, options: INodeUpdaterUtilUpdateOptions): TypeNode {
		this.updateNode(newNode, existing, options);

		existing._typeNodeBrand = newNode._typeNodeBrand;

		return existing;
	}

	/**
	 * Updates a EntityName
	 * @param {EntityName} newNode
	 * @param {EntityName} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {EntityName}
	 */
	private updateEntityName (newNode: EntityName, existing: EntityName, options: INodeUpdaterUtilUpdateOptions): EntityName {
		return this.update(newNode, existing, options);
	}

	/**
	 * Updates a TypeReferenceNode
	 * @param {TypeReferenceNode} newNode
	 * @param {TypeReferenceNode} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {TypeReferenceNode}
	 */
	private updateTypeReferenceNode (newNode: TypeReferenceNode, existing: TypeReferenceNode, options: INodeUpdaterUtilUpdateOptions): TypeReferenceNode {
		this.updateTypeNode(newNode, existing, options);

		existing.typeName = this.updateEntityName(newNode.typeName, existing.typeName, options);
		existing.typeArguments = this.updateNodesIfGiven(existing, newNode.typeArguments, existing.typeArguments, options, this.updateAll);

		return this.extraTransformStep(newNode, existing, options);
	}

	/**
	 * Updates a TypePredicateNode
	 * @param {TypePredicateNode} newNode
	 * @param {TypePredicateNode} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {TypePredicateNode}
	 */
	private updateTypePredicateNode (newNode: TypePredicateNode, existing: TypePredicateNode, options: INodeUpdaterUtilUpdateOptions): TypePredicateNode {
		this.updateTypeNode(newNode, existing, options);

		existing.parameterName = this.update(newNode.parameterName, existing.parameterName, options);
		existing.type = this.update(newNode.type, existing.type, options);

		return this.extraTransformStep(newNode, existing, options);
	}

	/**
	 * Updates a ClassLikeDeclaration
	 * @param {ClassLikeDeclaration} newNode
	 * @param {ClassLikeDeclaration} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {ClassLikeDeclaration}
	 */
	private updateClassLikeDeclaration (newNode: ClassLikeDeclaration, existing: ClassLikeDeclaration, options: INodeUpdaterUtilUpdateOptions): ClassLikeDeclaration {
		this.updateNamedDeclaration(newNode, existing, options);

		existing.name = this.updateNodeIfGiven(newNode.name, existing.name, options, this.updateIdentifier);
		existing.typeParameters = this.updateNodesIfGiven(existing, newNode.typeParameters, existing.typeParameters, options, this.updateTypeParameterDeclarations);
		existing.heritageClauses = this.updateNodesIfGiven(existing, newNode.heritageClauses, existing.heritageClauses, options, this.updateHeritageClauses);
		existing.members = this.updateAll(existing, newNode.members, existing.members, options);

		return existing;
	}

	/**
	 * Updates a PropertyDeclaration
	 * @param {PropertyDeclaration} newNode
	 * @param {PropertyDeclaration} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {PropertyDeclaration}
	 */
	private updatePropertyDeclaration (newNode: PropertyDeclaration, existing: PropertyDeclaration, options: INodeUpdaterUtilUpdateOptions): PropertyDeclaration {
		this.updateClassElement(newNode, existing, options);

		existing.questionToken = this.updateNodeIfGiven(newNode.questionToken, existing.questionToken, options, this.updateToken);
		existing.name = this.updatePropertyName(newNode.name, existing.name, options);
		existing.type = this.updateNodeIfGiven(newNode.type, existing.type, options, this.update);
		existing.initializer = this.updateNodeIfGiven(newNode.initializer, existing.initializer, options, this.update);

		return this.extraTransformStep(newNode, existing, options);
	}

	/**
	 * Updates a FunctionDeclaration
	 * @param {FunctionDeclaration} newNode
	 * @param {FunctionDeclaration} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {FunctionDeclaration}
	 */
	private updateFunctionDeclaration (newNode: FunctionDeclaration, existing: FunctionDeclaration, options: INodeUpdaterUtilUpdateOptions): FunctionDeclaration {
		this.updateFunctionLikeDeclarationBase(newNode, existing, options);
		this.updateDeclarationStatement(newNode, existing, options);

		existing.name = this.updateNodeIfGiven(newNode.name, existing.name, options, this.updateIdentifier);
		existing.body = this.updateNodeIfGiven(newNode.body, existing.body, options, this.updateFunctionBody);

		return this.extraTransformStep(newNode, existing, options);
	}

	/**
	 * Updates a MethodSignature
	 * @param {MethodSignature} newNode
	 * @param {MethodSignature} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {MethodSignature}
	 */
	private updateMethodSignature (newNode: MethodSignature, existing: MethodSignature, options: INodeUpdaterUtilUpdateOptions): MethodSignature {
		this.updateSignatureDeclaration(newNode, existing, options);
		this.updateTypeElement(newNode, existing, options);

		existing.name = this.updatePropertyName(newNode.name, existing.name, options);

		return this.extraTransformStep(newNode, existing, options);
	}

	/**
	 * Updates a FunctionLikeDeclarationBase
	 * @param {FunctionLikeDeclarationBase} newNode
	 * @param {FunctionLikeDeclarationBase} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {FunctionLikeDeclarationBase}
	 */
	private updateSignatureDeclaration (newNode: SignatureDeclaration, existing: SignatureDeclaration, options: INodeUpdaterUtilUpdateOptions): SignatureDeclaration {
		this.updateNamedDeclaration(newNode, existing, options);

		existing.name = this.updateNodeIfGiven(newNode.name, existing.name, options, this.updatePropertyName);
		existing.typeParameters = this.updateNodesIfGiven(existing, newNode.typeParameters, existing.typeParameters, options, this.updateTypeParameterDeclarations);
		existing.parameters = this.updateParameterDeclarations(existing, newNode.parameters, existing.parameters, options);
		existing.type = this.updateNodeIfGiven(newNode.type, existing.type, options, this.update);

		return existing;
	}

	/**
	 * Updates a FunctionLikeDeclarationBase
	 * @param {FunctionLikeDeclarationBase} newNode
	 * @param {FunctionLikeDeclarationBase} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {FunctionLikeDeclarationBase}
	 */
	private updateFunctionLikeDeclarationBase (newNode: FunctionLikeDeclarationBase, existing: FunctionLikeDeclarationBase, options: INodeUpdaterUtilUpdateOptions): FunctionLikeDeclarationBase {
		this.updateSignatureDeclaration(newNode, existing, options);

		existing.asteriskToken = this.updateNodeIfGiven(newNode.asteriskToken, existing.asteriskToken, options, this.updateToken);
		existing.questionToken = this.updateNodeIfGiven(newNode.questionToken, existing.questionToken, options, this.updateToken);
		existing.body = this.updateNodeIfGiven(newNode.body, existing.body, options, this.update);
		existing._functionLikeDeclarationBrand = newNode._functionLikeDeclarationBrand;

		return existing;
	}

	/**
	 * Updates a ParameterDeclaration
	 * @param {ParameterDeclaration} newNode
	 * @param {ParameterDeclaration} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {ParameterDeclaration}
	 */
	private updateParameterDeclaration (newNode: ParameterDeclaration, existing: ParameterDeclaration, options: INodeUpdaterUtilUpdateOptions): ParameterDeclaration {
		this.updateNamedDeclaration(newNode, existing, options);

		existing.dotDotDotToken = this.updateNodeIfGiven(newNode.dotDotDotToken, existing.dotDotDotToken, options, this.updateToken);
		existing.questionToken = this.updateNodeIfGiven(newNode.questionToken, existing.questionToken, options, this.updateToken);
		existing.type = this.updateNodeIfGiven(newNode.type, existing.type, options, this.update);
		existing.initializer = this.updateNodeIfGiven(newNode.initializer, existing.initializer, options, this.update);
		existing.name = this.updateBindingName(newNode.name, existing.name, options);
		return this.extraTransformStep(newNode, existing, options);
	}

	/**
	 * Updates a BindingName
	 * @param {BindingName} newNode
	 * @param {BindingName} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {BindingName}
	 */
	private updateBindingName (newNode: BindingName, existing: BindingName, options: INodeUpdaterUtilUpdateOptions): BindingName {
		return this.update(newNode, existing, options);
	}

	/**
	 * Updates an ObjectBindingPattern
	 * @param {ObjectBindingPattern} newNode
	 * @param {ObjectBindingPattern} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {ObjectBindingPattern}
	 */
	private updateObjectBindingPattern (newNode: ObjectBindingPattern, existing: ObjectBindingPattern, options: INodeUpdaterUtilUpdateOptions): ObjectBindingPattern {
		this.updateNode(newNode, existing, options);

		existing.elements = this.updateBindingElements(existing, newNode.elements, existing.elements, options);

		return this.extraTransformStep(newNode, existing, options);
	}

	/**
	 * Updates an ArrayBindingPattern
	 * @param {ArrayBindingPattern} newNode
	 * @param {ArrayBindingPattern} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {ArrayBindingPattern}
	 */
	private updateArrayBindingPattern (newNode: ArrayBindingPattern, existing: ArrayBindingPattern, options: INodeUpdaterUtilUpdateOptions): ArrayBindingPattern {
		this.updateNode(newNode, existing, options);

		existing.elements = this.updateArrayBindingElements(existing, newNode.elements, existing.elements, options);

		return this.extraTransformStep(newNode, existing, options);
	}

	/**
	 * Updates an ArrayBindingElement
	 * @param {ArrayBindingElement} newNode
	 * @param {ArrayBindingElement} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {ArrayBindingElement}
	 */
	private updateArrayBindingElement (newNode: ArrayBindingElement, existing: ArrayBindingElement, options: INodeUpdaterUtilUpdateOptions): ArrayBindingElement {
		return this.update(newNode, existing, options);
	}

	/**
	 * Updates ArrayBindingElements
	 * @param {Node} parent
	 * @param {NodeArray<ArrayBindingElement>} newNode
	 * @param {NodeArray<ArrayBindingElement>} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 */
	private updateArrayBindingElements (parent: Node, newNode: NodeArray<ArrayBindingElement>, existing: NodeArray<ArrayBindingElement>, options: INodeUpdaterUtilUpdateOptions): NodeArray<ArrayBindingElement> {
		return this.updateNodeArray(parent, newNode, existing, options, this.updateArrayBindingElement);
	}

	/**
	 * Updates a BindingElement
	 * @param {BindingElement} newNode
	 * @param {BindingElement} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {BindingElement}
	 */
	private updateBindingElement (newNode: BindingElement, existing: BindingElement, options: INodeUpdaterUtilUpdateOptions): BindingElement {
		this.updateNamedDeclaration(newNode, existing, options);

		existing.propertyName = this.updateNodeIfGiven(newNode.propertyName, existing.propertyName, options, this.updatePropertyName);
		existing.dotDotDotToken = this.updateNodeIfGiven(newNode.dotDotDotToken, existing.dotDotDotToken, options, this.updateToken);
		existing.name = this.updateBindingName(newNode.name, existing.name, options);
		existing.initializer = this.updateNodeIfGiven(newNode.initializer, existing.initializer, options, this.update);

		return this.extraTransformStep(newNode, existing, options);
	}

	/**
	 * Updates an OmittedExpression
	 * @param {OmittedExpression} newNode
	 * @param {OmittedExpression} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {OmittedExpression}
	 */
	private updateOmittedExpression (newNode: OmittedExpression, existing: OmittedExpression, options: INodeUpdaterUtilUpdateOptions): OmittedExpression {
		this.updateExpression(newNode, existing, options);

		return this.extraTransformStep(newNode, existing, options);
	}

	/**
	 * Updates an PartiallyEmittedExpression
	 * @param {PartiallyEmittedExpression} newNode
	 * @param {PartiallyEmittedExpression} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {PartiallyEmittedExpression}
	 */
	private updatePartiallyEmittedExpression (newNode: PartiallyEmittedExpression, existing: PartiallyEmittedExpression, options: INodeUpdaterUtilUpdateOptions): PartiallyEmittedExpression {
		this.updateLeftHandSideExpression(newNode, existing, options);

		existing.expression = this.update(newNode.expression, existing.expression, options);

		return this.extraTransformStep(newNode, existing, options);
	}

	/**
	 * Updates BindingElements
	 * @param {Node} parent
	 * @param {NodeArray<BindingElement>} newNode
	 * @param {NodeArray<BindingElement>} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 */
	private updateBindingElements (parent: Node, newNode: NodeArray<BindingElement>, existing: NodeArray<BindingElement>, options: INodeUpdaterUtilUpdateOptions): NodeArray<BindingElement> {
		return this.updateNodeArray(parent, newNode, existing, options, this.updateBindingElement);
	}

	/**
	 * Updates ParameterDeclaration
	 * @param {Node} parent
	 * @param {NodeArray<ParameterDeclaration>} newNode
	 * @param {NodeArray<ParameterDeclaration>} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 */
	private updateParameterDeclarations (parent: Node, newNode: NodeArray<ParameterDeclaration>, existing: NodeArray<ParameterDeclaration>, options: INodeUpdaterUtilUpdateOptions): NodeArray<ParameterDeclaration> {
		return this.updateNodeArray(parent, newNode, existing, options, this.updateParameterDeclaration);
	}

	/**
	 * Updates a ConstructorDeclaration
	 * @param {ConstructorDeclaration} newNode
	 * @param {ConstructorDeclaration} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {ConstructorDeclaration}
	 */
	private updateConstructorDeclaration (newNode: ConstructorDeclaration, existing: ConstructorDeclaration, options: INodeUpdaterUtilUpdateOptions): ConstructorDeclaration {
		this.updateFunctionLikeDeclarationBase(newNode, existing, options);
		this.updateClassElement(newNode, existing, options);

		existing.body = this.updateNodeIfGiven(newNode.body, existing.body, options, this.updateFunctionBody);

		return this.extraTransformStep(newNode, existing, options);
	}

	/**
	 * Updates a SemicolonClassElement
	 * @param {SemicolonClassElement} newNode
	 * @param {SemicolonClassElement} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {SemicolonClassElement}
	 */
	private updateSemicolonClassElement (newNode: SemicolonClassElement, existing: SemicolonClassElement, options: INodeUpdaterUtilUpdateOptions): SemicolonClassElement {
		this.updateClassElement(newNode, existing, options);

		return this.extraTransformStep(newNode, existing, options);
	}

	/**
	 * Updates a FunctionBody
	 * @param {FunctionBody} newNode
	 * @param {FunctionBody} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {FunctionBody}
	 */
	private updateFunctionBody (newNode: FunctionBody, existing: FunctionBody, options: INodeUpdaterUtilUpdateOptions): FunctionBody {
		return this.updateBlock(newNode, existing, options);
	}

	/**
	 * Updates a ConciseBody
	 * @param {ConciseBody} newNode
	 * @param {ConciseBody} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {ConciseBody}
	 */
	private updateConciseBody (newNode: ConciseBody, existing: ConciseBody, options: INodeUpdaterUtilUpdateOptions): ConciseBody {
		return this.update(newNode, existing, options);
	}

	/**
	 * Updates a FunctionBody
	 * @param {FunctionBody} newNode
	 * @param {FunctionBody} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {FunctionBody}
	 */
	private updateBlock (newNode: Block, existing: Block, options: INodeUpdaterUtilUpdateOptions): Block {
		this.updateStatement(newNode, existing, options);

		this.updateAll(existing, newNode.statements, existing.statements, options);

		return this.extraTransformStep(newNode, existing, options);
	}

	/**
	 * Updates a HeritageClause
	 * @param {HeritageClause} newNode
	 * @param {HeritageClause} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {HeritageClause}
	 */
	private updateHeritageClause (newNode: HeritageClause, existing: HeritageClause, options: INodeUpdaterUtilUpdateOptions): HeritageClause {
		this.updateNode(newNode, existing, options);

		existing.token = newNode.token;
		existing.types = this.updateExpressionWithTypeArgumentss(existing, newNode.types, existing.types, options);

		return this.extraTransformStep(newNode, existing, options);
	}

	/**
	 * Updates a ExpressionWithTypeArguments
	 * @param {ExpressionWithTypeArguments} newNode
	 * @param {ExpressionWithTypeArguments} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {ExpressionWithTypeArguments}
	 */
	private updateExpressionWithTypeArguments (newNode: ExpressionWithTypeArguments, existing: ExpressionWithTypeArguments, options: INodeUpdaterUtilUpdateOptions): ExpressionWithTypeArguments {
		this.updateTypeNode(newNode, existing, options);

		existing.expression = this.update(newNode.expression, existing.expression, options);
		existing.typeArguments = this.updateNodesIfGiven(existing, newNode.typeArguments, existing.typeArguments, options, this.updateAll);

		return this.extraTransformStep(newNode, existing, options);
	}

	/**
	 * Updates ExpressionWithTypeArgumentss
	 * @param {Node} parent
	 * @param {NodeArray<ExpressionWithTypeArguments>} newNode
	 * @param {NodeArray<ExpressionWithTypeArguments>} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 */
	private updateExpressionWithTypeArgumentss (parent: Node, newNode: NodeArray<ExpressionWithTypeArguments>, existing: NodeArray<ExpressionWithTypeArguments>, options: INodeUpdaterUtilUpdateOptions): NodeArray<ExpressionWithTypeArguments> {
		return this.updateNodeArray(parent, newNode, existing, options, this.updateExpressionWithTypeArguments);
	}

	/**
	 * Updates HeritageClauses
	 * @param {Node} parent
	 * @param {NodeArray<HeritageClause>} newNode
	 * @param {NodeArray<HeritageClause>} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 */
	private updateHeritageClauses (parent: Node, newNode: NodeArray<HeritageClause>, existing: NodeArray<HeritageClause>, options: INodeUpdaterUtilUpdateOptions): NodeArray<HeritageClause> {
		const result = this.updateNodeArray(parent, newNode, existing, options, this.updateHeritageClause);

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
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {TypeParameterDeclaration}
	 */
	private updateTypeParameterDeclaration (newNode: TypeParameterDeclaration, existing: TypeParameterDeclaration, options: INodeUpdaterUtilUpdateOptions): TypeParameterDeclaration {
		this.updateNamedDeclaration(newNode, existing, options);

		existing.name = this.updateIdentifier(newNode.name, existing.name, options);
		existing.constraint = this.updateNodeIfGiven(newNode.constraint, existing.constraint, options, this.update);
		existing.default = this.updateNodeIfGiven(newNode.default, existing.default, options, this.update);
		existing.expression = this.updateNodeIfGiven(newNode.expression, existing.expression, options, this.update);

		return this.extraTransformStep(newNode, existing, options);
	}

	/**
	 * Updates a ExpressionStatement
	 * @param {ExpressionStatement} newNode
	 * @param {ExpressionStatement} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {ExpressionStatement}
	 */
	private updateExpressionStatement (newNode: ExpressionStatement, existing: ExpressionStatement, options: INodeUpdaterUtilUpdateOptions): ExpressionStatement {
		this.updateStatement(newNode, existing, options);

		existing.expression = this.update(newNode.expression, existing.expression, options);

		return this.extraTransformStep(newNode, existing, options);
	}

	/**
	 * Updates a IndexSignatureDeclaration
	 * @param {IndexSignatureDeclaration} newNode
	 * @param {IndexSignatureDeclaration} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {IndexSignatureDeclaration}
	 */
	private updateIndexSignatureDeclaration (newNode: IndexSignatureDeclaration, existing: IndexSignatureDeclaration, options: INodeUpdaterUtilUpdateOptions): IndexSignatureDeclaration {
		this.updateSignatureDeclaration(newNode, existing, options);
		this.updateClassElement(newNode, existing, options);
		this.updateTypeElement(newNode, existing, options);

		return this.extraTransformStep(newNode, existing, options);
	}

	/**
	 * Updates a ThisTypeNode
	 * @param {ThisTypeNode} newNode
	 * @param {ThisTypeNode} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {ThisTypeNode}
	 */
	private updateThisTypeNode (newNode: ThisTypeNode, existing: ThisTypeNode, options: INodeUpdaterUtilUpdateOptions): ThisTypeNode {
		this.updateTypeNode(newNode, existing, options);

		return this.extraTransformStep(newNode, existing, options);
	}

	/**
	 * Updates a CallSignatureDeclaration
	 * @param {CallSignatureDeclaration} newNode
	 * @param {CallSignatureDeclaration} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {CallSignatureDeclaration}
	 */
	private updateCallSignatureDeclaration (newNode: CallSignatureDeclaration, existing: CallSignatureDeclaration, options: INodeUpdaterUtilUpdateOptions): CallSignatureDeclaration {
		this.updateSignatureDeclaration(newNode, existing, options);
		this.updateTypeElement(newNode, existing, options);

		return this.extraTransformStep(newNode, existing, options);
	}

	/**
	 * Updates a ConstructSignatureDeclaration
	 * @param {ConstructSignatureDeclaration} newNode
	 * @param {ConstructSignatureDeclaration} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {ConstructSignatureDeclaration}
	 */
	private updateConstructSignatureDeclaration (newNode: ConstructSignatureDeclaration, existing: ConstructSignatureDeclaration, options: INodeUpdaterUtilUpdateOptions): ConstructSignatureDeclaration {
		this.updateSignatureDeclaration(newNode, existing, options);
		this.updateTypeElement(newNode, existing, options);

		return this.extraTransformStep(newNode, existing, options);
	}

	/**
	 * Updates a ClassElement
	 * @param {ClassElement} newNode
	 * @param {ClassElement} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {ClassElement}
	 */
	private updateTypeElement (newNode: TypeElement, existing: TypeElement, options: INodeUpdaterUtilUpdateOptions): TypeElement {
		this.updateNamedDeclaration(newNode, existing, options);

		existing._typeElementBrand = newNode._typeElementBrand;
		existing.name = this.updateNodeIfGiven(newNode.name, existing.name, options, this.updatePropertyName);
		existing.questionToken = this.updateNodeIfGiven(newNode.questionToken, existing.questionToken, options, this.updateToken);

		return existing;
	}

	/**
	 * Updates a NewExpression
	 * @param {NewExpression} newNode
	 * @param {NewExpression} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {NewExpression}
	 */
	private updateNewExpression (newNode: NewExpression, existing: NewExpression, options: INodeUpdaterUtilUpdateOptions): NewExpression {
		this.updatePrimaryExpression(newNode, existing, options);
		this.updateDeclaration(newNode, existing, options);

		existing.expression = this.update(newNode.expression, existing.expression, options);
		existing.typeArguments = this.updateNodesIfGiven(existing, newNode.typeArguments, existing.typeArguments, options, this.updateAll);
		existing.arguments = this.updateNodesIfGiven(existing, newNode.arguments, existing.arguments, options, this.updateAll);

		return this.extraTransformStep(newNode, existing, options);
	}

	/**
	 * Updates a CallExpression
	 * @param {CallExpression} newNode
	 * @param {CallExpression} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {CallExpression}
	 */
	private updateCallExpression (newNode: CallExpression, existing: CallExpression, options: INodeUpdaterUtilUpdateOptions): CallExpression {
		this.updateLeftHandSideExpression(newNode, existing, options);
		this.updateDeclaration(newNode, existing, options);

		existing.expression = this.update(newNode.expression, existing.expression, options);
		existing.typeArguments = this.updateNodesIfGiven(existing, newNode.typeArguments, existing.typeArguments, options, this.updateAll);
		existing.arguments = this.updateAll(existing, newNode.arguments, existing.arguments, options);

		return this.extraTransformStep(newNode, existing, options);
	}

	/**
	 * Updates a PropertyAccessExpression
	 * @param {PropertyAccessExpression} newNode
	 * @param {PropertyAccessExpression} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {PropertyAccessExpression}
	 */
	private updatePropertyAccessExpression (newNode: PropertyAccessExpression, existing: PropertyAccessExpression, options: INodeUpdaterUtilUpdateOptions): PropertyAccessExpression {
		this.updateMemberExpression(newNode, existing, options);
		this.updateNamedDeclaration(newNode, existing, options);

		existing.expression = this.update(newNode.expression, existing.expression, options);
		existing.name = this.updateIdentifier(newNode.name, existing.name, options);

		return this.extraTransformStep(newNode, existing, options);
	}

	/**
	 * Updates a PropertySignature
	 * @param {PropertySignature} newNode
	 * @param {PropertySignature} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {PropertySignature}
	 */
	private updatePropertySignature (newNode: PropertySignature, existing: PropertySignature, options: INodeUpdaterUtilUpdateOptions): PropertySignature {
		this.updateTypeElement(newNode, existing, options);

		existing.name = this.updatePropertyName(newNode.name, existing.name, options);
		existing.questionToken = this.updateNodeIfGiven(newNode.questionToken, existing.questionToken, options, this.updateToken);
		existing.type = this.updateNodeIfGiven(newNode.type, existing.type, options, this.update);
		existing.initializer = this.updateNodeIfGiven(newNode.initializer, existing.initializer, options, this.update);

		return this.extraTransformStep(newNode, existing, options);
	}

	/**
	 * Updates a ElementAccessExpression
	 * @param {ElementAccessExpression} newNode
	 * @param {ElementAccessExpression} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {ElementAccessExpression}
	 */
	private updateElementAccessExpression (newNode: ElementAccessExpression, existing: ElementAccessExpression, options: INodeUpdaterUtilUpdateOptions): ElementAccessExpression {
		this.updateMemberExpression(newNode, existing, options);

		existing.expression = this.update(newNode.expression, existing.expression, options);
		existing.argumentExpression = this.updateNodeIfGiven(newNode.expression, existing.expression, options, this.update);

		return this.extraTransformStep(newNode, existing, options);
	}

	/**
	 * Updates a ComputedPropertyName
	 * @param {ComputedPropertyName} newNode
	 * @param {ComputedPropertyName} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {ComputedPropertyName}
	 */
	private updateComputedPropertyName (newNode: ComputedPropertyName, existing: ComputedPropertyName, options: INodeUpdaterUtilUpdateOptions): ComputedPropertyName {
		this.updateNode(newNode, existing, options);

		existing.expression = this.update(newNode.expression, existing.expression, options);

		return this.extraTransformStep(newNode, existing, options);
	}

	/**
	 * Updates a ClassElement
	 * @param {ClassElement} newNode
	 * @param {ClassElement} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {ClassElement}
	 */
	private updateClassElement (newNode: ClassElement, existing: ClassElement, options: INodeUpdaterUtilUpdateOptions): ClassElement {
		this.updateNamedDeclaration(newNode, existing, options);

		existing._classElementBrand = newNode._classElementBrand;
		existing.name = this.updateNodeIfGiven(newNode.name, existing.name, options, this.updatePropertyName);

		return existing;
	}

	/**
	 * Updates TypeParameterDeclarations
	 * @param {Node} parent
	 * @param {NodeArray<TypeParameterDeclaration>} newNode
	 * @param {NodeArray<TypeParameterDeclaration>} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 */
	private updateTypeParameterDeclarations (parent: Node, newNode: NodeArray<TypeParameterDeclaration>, existing: NodeArray<TypeParameterDeclaration>, options: INodeUpdaterUtilUpdateOptions): NodeArray<TypeParameterDeclaration> {
		return this.updateNodeArray(parent, newNode, existing, options, this.updateTypeParameterDeclaration);
	}

	/**
	 * Updates a LiteralLikeNode
	 * @param {LiteralLikeNode} newNode
	 * @param {LiteralLikeNode} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {LiteralLikeNode}
	 */
	private updateLiteralLikeNode (newNode: LiteralLikeNode, existing: LiteralLikeNode, options: INodeUpdaterUtilUpdateOptions): LiteralLikeNode {
		this.updateNode(newNode, existing, options);

		existing.text = newNode.text;
		existing.isUnterminated = newNode.isUnterminated;
		existing.hasExtendedUnicodeEscape = newNode.hasExtendedUnicodeEscape;

		return existing;
	}

	/**
	 * Updates a LiteralExpression
	 * @param {LiteralExpression} newNode
	 * @param {LiteralExpression} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {LiteralExpression}
	 */
	private updateLiteralExpression (newNode: LiteralExpression, existing: LiteralExpression, options: INodeUpdaterUtilUpdateOptions): LiteralExpression {
		this.updateLiteralLikeNode(newNode, existing, options);
		this.updatePrimaryExpression(newNode, existing, options);

		existing._literalExpressionBrand = newNode._literalExpressionBrand;

		return existing;
	}

	/**
	 * Updates a StringLiteral
	 * @param {StringLiteral} newNode
	 * @param {StringLiteral} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {StringLiteral}
	 */
	private updateStringLiteral (newNode: StringLiteral, existing: StringLiteral, options: INodeUpdaterUtilUpdateOptions): StringLiteral {
		this.updateLiteralExpression(newNode, existing, options);
		return this.extraTransformStep(newNode, existing, options);
	}

	/**
	 * Updates a NumericLiteral
	 * @param {NumericLiteral} newNode
	 * @param {NumericLiteral} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {NumericLiteral}
	 */
	private updateNumericLiteral (newNode: NumericLiteral, existing: NumericLiteral, options: INodeUpdaterUtilUpdateOptions): NumericLiteral {
		this.updateLiteralExpression(newNode, existing, options);
		return this.extraTransformStep(newNode, existing, options);
	}

	/**
	 * Updates a DeclarationStatement
	 * @param {DeclarationStatement} newNode
	 * @param {DeclarationStatement} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {DeclarationStatement}
	 */
	private updateDeclarationStatement (newNode: DeclarationStatement, existing: DeclarationStatement, options: INodeUpdaterUtilUpdateOptions): DeclarationStatement {
		this.updateNamedDeclaration(newNode, existing, options);
		this.updateStatement(newNode, existing, options);

		existing.name = this.updateNodeIfGiven(newNode.name, existing.name, options, this.update);

		return existing;
	}

	/**
	 * Updates a Statement
	 * @param {Statement} newNode
	 * @param {Statement} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {Statement}
	 */
	private updateStatement (newNode: Statement, existing: Statement, options: INodeUpdaterUtilUpdateOptions): Statement {
		this.updateNode(newNode, existing, options);

		existing._statementBrand = newNode._statementBrand;

		return existing;
	}

	/**
	 * Changes the parent of a Node
	 * @param {T} parent
	 * @param {T} node
	 * @returns {T}
	 */
	private cloneWithParent<T extends Node> (parent: Node, node: T): T {
		node.parent = parent;
		return node;
	}

	/**
	 * Generates a new Symbol with all of the upper-level parents changed
	 * @param {Node} parent
	 * @param {Symbol} existing
	 * @param {INodeUpdaterUtilUpdateOptions} _options
	 * @returns {Symbol}
	 */
	private copySymbolWithParent (parent: Node, existing: Symbol, _options: INodeUpdaterUtilUpdateOptions): Symbol {
		const {flags, escapedName, declarations, valueDeclaration, members, exports, globalExports, name, getDeclarations, getDocumentationComment, getEscapedName, getFlags, getJsDocTags, getName} = existing;
		return {
			flags,
			escapedName,
			declarations: declarations == null ? undefined : declarations.map(declaration => this.cloneWithParent(parent, declaration)),
			valueDeclaration: valueDeclaration == null ? undefined : this.cloneWithParent(parent, valueDeclaration),
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
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {ClassDeclaration}
	 */
	private updateClassDeclaration (newNode: ClassDeclaration, existing: ClassDeclaration, options: INodeUpdaterUtilUpdateOptions): ClassDeclaration {
		this.updateClassLikeDeclaration(newNode, existing, options);
		this.updateDeclarationStatement(newNode, existing, options);

		existing.name = this.updateNodeIfGiven(newNode.name, existing.name, options, this.updateIdentifier);

		this.extraTransformStep(newNode, existing, options);
		return existing;
	}

	/**
	 * Updates a ClassExpression
	 * @param {ClassExpression} newNode
	 * @param {ClassExpression} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {ClassExpression}
	 */
	private updateClassExpression (newNode: ClassExpression, existing: ClassExpression, options: INodeUpdaterUtilUpdateOptions): ClassExpression {
		this.updateClassLikeDeclaration(newNode, existing, options);
		this.updatePrimaryExpression(newNode, existing, options);

		this.extraTransformStep(newNode, existing, options);
		return existing;
	}

	/**
	 * Updates a SourceFile
	 * @param {SourceFile} newNode
	 * @param {SourceFile} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {SourceFile}
	 */
	private updateSourceFile (newNode: SourceFile, existing: SourceFile, options: INodeUpdaterUtilUpdateOptions): SourceFile {
		this.updateDeclaration(newNode, existing, options);

		existing.statements = this.updateStatements(existing, newNode.statements, existing.statements, options);
		existing.endOfFileToken = this.updateToken(newNode.endOfFileToken, existing.endOfFileToken, options);
		existing.fileName = newNode.fileName;
		existing.text = newNode.text;
		existing.amdDependencies = this.updateAmdDependencies(newNode.amdDependencies, existing.amdDependencies, options);
		existing.moduleName = newNode.moduleName;
		existing.referencedFiles = this.updateFileReferences(newNode.referencedFiles, existing.referencedFiles, options);
		existing.typeReferenceDirectives = this.updateFileReferences(newNode.typeReferenceDirectives, existing.typeReferenceDirectives, options);
		existing.languageVariant = newNode.languageVariant;
		existing.isDeclarationFile = newNode.isDeclarationFile;
		existing.hasNoDefaultLib = newNode.hasNoDefaultLib;
		existing.languageVersion = newNode.languageVersion;

		return this.extraTransformStep(newNode, existing, options);
	}

	/**
	 * Updates an Array of Nodes
	 * @param {T[]} newNodes
	 * @param {T[]} existingNodes
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @param {(newNode: T, existing: T, options: INodeUpdaterUtilUpdateOptions) => T} handler
	 * @returns {T[]}
	 */
	private updateArray<T extends NodeMatcherItem> (newNodes: T[], existingNodes: T[], options: INodeUpdaterUtilUpdateOptions, handler: (newNode: T, existing: T, options: INodeUpdaterUtilUpdateOptions) => T): T[] {
		// Filter out anything that exists within the new nodes but not inside the existing array
		const existingFiltered = existingNodes.filter(existingPart => this.nodeMatcherUtil.match(existingPart, newNodes) != null);
		const boundHandler = handler.bind(this);

		// Update all of the existing ones
		newNodes.forEach(newNode => {
			// Find the match within the existing ones
			const match = this.nodeMatcherUtil.match(newNode, existingFiltered);
			// If it exists, update it
			if (match != null) {
				boundHandler(newNode, match, options);
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
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @param {(newNode: T, existing: T, options: INodeUpdaterUtilUpdateOptions) => T} handler
	 * @returns {NodeArray<T extends Node>}
	 */
	private updateNodeArray<T extends Node> (parent: Node, newNodes: NodeArray<T>, existingNodes: NodeArray<T>, options: INodeUpdaterUtilUpdateOptions, handler: (newNode: T, existing: T, options: INodeUpdaterUtilUpdateOptions) => T): NodeArray<T> {
		const boundHandler = handler.bind(this);
		this.updateTextRange(newNodes, existingNodes, options);

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
				boundHandler(newNode, match, options);
			} else {
				// Otherwise, push to the array, but do change the parent
				mutableExistingNodes.push(this.cloneWithParent(parent, newNode));
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
	 * @param {T} newNode
	 * @param {T} existing
	 * @returns {T}
	 */
	private addAllKeysOfNode<T extends Node> (newNode: T, existing: T): T {
		Object.keys(newNode).forEach((key: keyof T) => {

			// Don't add the key if the provided node must preserve it
			if (!this.PRESERVE_KEYS_ON_STRIP.has(key)) {
				existing[key] = newNode[key];
			}
		});
		return existing;
	}

	/**
	 * A last transform step to perform on Nodes to cover things that are not explicitly defined by the interfaces of the Nodes
	 * @param {T} newNode
	 * @param {T} existing
	 * @param {INodeUpdaterUtilUpdateOptions} options
	 * @returns {T}
	 */
	private extraTransformStep<T extends Node> (newNode: T, existing: T, options: INodeUpdaterUtilUpdateOptions): T {
		/*tslint:disable:no-any*/
		if (this.predicateUtil.hasSymbol(newNode)) {
			const parent = existing.getSourceFile();
			(<any>existing).symbol = this.copySymbolWithParent(parent, newNode.symbol, options);
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
			const parent = existing.getSourceFile();
			(<any>existing).nextContainer = this.cloneWithParent(parent, newNode.nextContainer);
		}

		if (this.predicateUtil.hasLocals(newNode)) {
			const parent = existing.getSourceFile();
			const mapped: Map<string, Symbol> = <any> Array.from(newNode.locals.entries()).map(entry => [entry[0], this.copySymbolWithParent(parent, entry[1], options)]);
			(<any>existing).locals = new Map(mapped);
		}

		/*tslint:enable:no-any*/
		return existing;
	}
}