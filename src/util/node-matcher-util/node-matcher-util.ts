import {INodeMatcherUtil} from "./i-node-matcher-util";
import {AccessorDeclaration, ArrayBindingElement, ArrayBindingPattern, ArrayTypeNode, BindingElement, BindingName, BindingPattern, Block, CallSignatureDeclaration, ComputedPropertyName, ConstructorDeclaration, ConstructorTypeNode, ConstructSignatureDeclaration, DeclarationName, Decorator, EntityName, FunctionDeclaration, FunctionOrConstructorTypeNode, FunctionTypeNode, GetAccessorDeclaration, Identifier, IndexSignatureDeclaration, IntersectionTypeNode, isAccessor, isArrayBindingPattern, isArrayTypeNode, isBindingElement, isBindingName, isBlock, isCallSignatureDeclaration, isComputedPropertyName, isConstructorDeclaration, isConstructorTypeNode, isConstructSignatureDeclaration, isDecorator, isEntityName, isFunctionDeclaration, isFunctionOrConstructorTypeNode, isFunctionTypeNode, isGetAccessorDeclaration, isIdentifier, isIndexSignatureDeclaration, isIntersectionTypeNode, isMethodDeclaration, isMethodSignature, isNumericLiteral, isObjectBindingPattern, isOmittedExpression, isParameter, isParenthesizedTypeNode, isPropertyAssignment, isPropertyDeclaration, isPropertyName, isPropertySignature, isQualifiedName, isSemicolonClassElement, isSetAccessorDeclaration, isShorthandPropertyAssignment, isSpreadAssignment, isStringLiteral, isThisTypeNode, isToken, isTupleTypeNode, isTypeElement, isTypeLiteralNode, isTypeParameterDeclaration, isTypePredicateNode, isTypeQueryNode, isTypeReferenceNode, isUnionTypeNode, isVariableDeclaration, isVariableDeclarationList, KeywordTypeNode, MethodDeclaration, MethodSignature, Node, NodeArray, NumericLiteral, ObjectBindingPattern, OmittedExpression, ParameterDeclaration, ParenthesizedTypeNode, PropertyAssignment, PropertyDeclaration, PropertyName, PropertySignature, QualifiedName, SemicolonClassElement, SetAccessorDeclaration, ShorthandPropertyAssignment, SpreadAssignment, Statement, StringLiteral, SyntaxKind, ThisTypeNode, Token, TupleTypeNode, TypeElement, TypeLiteralNode, TypeParameterDeclaration, TypePredicateNode, TypeQueryNode, TypeReferenceNode, UnionTypeNode, VariableDeclaration, VariableDeclarationList} from "typescript";

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
		const parameterNameMatch = isIdentifier(node.parameterName) && !isIdentifier(matchNode.parameterName) ? false : isThisTypeNode(node.parameterName) && !isThisTypeNode(matchNode.parameterName) ? false : isIdentifier(node.parameterName) && isIdentifier(matchNode.parameterName) ? this.matchNodeWithIdentifier(node.parameterName, matchNode.parameterName) : this.matchNodeWithThisTypeNode(node.parameterName, <ThisTypeNode> matchNode.parameterName);
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
}