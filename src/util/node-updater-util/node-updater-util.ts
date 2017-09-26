import {INodeUpdaterUtil} from "./i-node-updater-util";
import {AmdDependency, ArrayBindingElement, ArrayBindingPattern, BindingElement, BindingName, Block, CallExpression, ClassDeclaration, ClassElement, ClassLikeDeclaration, ConstructorDeclaration, Declaration, DeclarationName, DeclarationStatement, Decorator, ElementAccessExpression, EntityName, Expression, ExpressionStatement, ExpressionWithTypeArguments, FileReference, FunctionBody, FunctionLikeDeclarationBase, FunctionTypeNode, GetAccessorDeclaration, HeritageClause, Identifier, isArrayBindingPattern, isBindingElement, isBlock, isCallExpression, isClassDeclaration, isConstructorDeclaration, isDecorator, isElementAccessExpression, isExpressionStatement, isExpressionWithTypeArguments, isFunctionTypeNode, isGetAccessorDeclaration, isHeritageClause, isIdentifier, isMethodDeclaration, isModifier, isNumericLiteral, isObjectBindingPattern, isObjectLiteralExpression, isOmittedExpression, isParameter, isPropertyAccessExpression, isPropertyAssignment, isPropertyDeclaration, isSetAccessorDeclaration, isShorthandPropertyAssignment, isSourceFile, isSpreadAssignment, isStringLiteral, isToken, isTypeParameterDeclaration, isTypeReferenceNode, LeftHandSideExpression, LiteralExpression, LiteralLikeNode, MemberExpression, MethodDeclaration, Modifier, NamedDeclaration, Node, NodeArray, NumericLiteral, ObjectBindingPattern, ObjectLiteralElement, ObjectLiteralElementLike, ObjectLiteralExpression, ObjectLiteralExpressionBase, OmittedExpression, ParameterDeclaration, PrimaryExpression, PropertyAccessExpression, PropertyAssignment, PropertyDeclaration, PropertyName, SetAccessorDeclaration, ShorthandPropertyAssignment, SignatureDeclaration, SourceFile, SpreadAssignment, Statement, StringLiteral, Symbol, SyntaxKind, TextRange, Token, TypeNode, TypeParameterDeclaration, TypeReferenceNode, UnaryExpression, UpdateExpression} from "typescript";
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
		}

		throw new TypeError(`${this.constructor.name} could not update a Node of kind ${SyntaxKind[existing.kind]}: It wasn't handled!`);
		/*tslint:enable:no-any*/
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
	 * Updates a FunctionBody
	 * @param {FunctionBody} newNode
	 * @param {FunctionBody} existing
	 * @returns {FunctionBody}
	 */
	private updateFunctionBody (newNode: FunctionBody, existing: FunctionBody): FunctionBody {
		return this.updateBlock(newNode, existing);
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