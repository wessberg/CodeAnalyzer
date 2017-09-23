import {INodeMatcherUtil} from "./i-node-matcher-util";
import {ArrayBindingElement, ArrayBindingPattern, BindingElement, BindingName, BindingPattern, CallSignatureDeclaration, ComputedPropertyName, ConstructorTypeNode, ConstructSignatureDeclaration, DeclarationName, Decorator, EntityName, FunctionOrConstructorTypeNode, FunctionTypeNode, Identifier, isArrayBindingPattern, isBindingElement, isBindingName, isCallSignatureDeclaration, isComputedPropertyName, isConstructorTypeNode, isConstructSignatureDeclaration, isDecorator, isEntityName, isFunctionOrConstructorTypeNode, isFunctionTypeNode, isIdentifier, isNumericLiteral, isObjectBindingPattern, isOmittedExpression, isParameter, isPropertyName, isPropertySignature, isQualifiedName, isStringLiteral, isThisTypeNode, isToken, isTypeParameterDeclaration, isVariableDeclaration, isVariableDeclarationList, KeywordTypeNode, Node, NodeArray, NumericLiteral, ObjectBindingPattern, OmittedExpression, ParameterDeclaration, PropertyName, PropertySignature, QualifiedName, StringLiteral, SyntaxKind, ThisTypeNode, Token, TypeParameterDeclaration, VariableDeclaration, VariableDeclarationList} from "typescript";

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
}