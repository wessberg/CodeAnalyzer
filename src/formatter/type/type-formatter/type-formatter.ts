import {ITypeFormatter} from "./i-type-formatter";
import {ArrayTypeNode, ExpressionWithTypeArguments, FunctionTypeNode, Identifier, IndexSignatureDeclaration, IntersectionTypeNode, isIdentifier, isIndexSignatureDeclaration, isMethodSignature, isNumericLiteral, isStringLiteral, LeftHandSideExpression, LiteralTypeNode, MethodSignature, ParenthesizedTypeNode, PropertySignature, SyntaxKind, TupleTypeNode, TypeLiteralNode, TypeNode, TypeOperatorNode, TypeReferenceNode, UnionTypeNode} from "typescript";
import {IInterfaceTypeMemberFormatter} from "../interface-type-member-formatter/i-interface-type-member-formatter";
import {IParameterTypeFormatter} from "../parameter-type-formatter/i-parameter-type-formatter";
import {TypeKind, Type, IFunctionType, IIndexType} from "@wessberg/type";
import {ITypescriptASTUtil} from "@wessberg/typescript-ast-util";

/**
 * A class for formatting Types
 */
export class TypeFormatter implements ITypeFormatter {
	constructor (private astUtil: ITypescriptASTUtil) {}

	/**
	 * Formats the provided expression into a Type.
	 * @param {TypeNode | TypeReferenceNode | LeftHandSideExpression} node
	 * @param {IInterfaceTypeMemberFormatter} interfaceTypeMemberFormatter
	 * @param {IParameterTypeFormatter} parameterTypeFormatter
	 * @returns {Type}
	 */
	public format (node: TypeNode|TypeReferenceNode|LeftHandSideExpression|undefined, interfaceTypeMemberFormatter: IInterfaceTypeMemberFormatter, parameterTypeFormatter: IParameterTypeFormatter): Type {
		if (node == null) {
			return {
				kind: TypeKind.VOID
			};
		}

		if (node.parent != null && isMethodSignature(node.parent)) return this.formatMethod(node, node.parent, interfaceTypeMemberFormatter, parameterTypeFormatter);
		if (node.parent != null && isIndexSignatureDeclaration(node.parent)) return this.formatIndexed(node, node.parent, interfaceTypeMemberFormatter, parameterTypeFormatter);
		return this.formatProperty(node, interfaceTypeMemberFormatter, parameterTypeFormatter);
	}

	/**
	 * Converts an ordinary (non-method) property to a Type
	 * @param {ts.TypeNode | ts.TypeReferenceNode | ts.LeftHandSideExpression} node
	 * @param {IInterfaceTypeMemberFormatter} interfaceTypeMemberFormatter
	 * @param {IParameterTypeFormatter} parameterTypeFormatter
	 * @returns {Type}
	 */
	private formatProperty (node: TypeNode|TypeReferenceNode|LeftHandSideExpression, interfaceTypeMemberFormatter: IInterfaceTypeMemberFormatter, parameterTypeFormatter: IParameterTypeFormatter): Type {
		return this.formatType(node, interfaceTypeMemberFormatter, parameterTypeFormatter);
	}

	/**
	 * Converts a method signature to an IFunctionType
	 * @param {TypeNode | TypeReferenceNode | LeftHandSideExpression} node
	 * @param {MethodSignature} method
	 * @param {IInterfaceTypeMemberFormatter} interfaceTypeMemberFormatter
	 * @param {IParameterTypeFormatter} parameterTypeFormatter
	 * @returns {IFunctionType}
	 */
	private formatMethod (node: TypeNode|TypeReferenceNode|LeftHandSideExpression, method: MethodSignature, interfaceTypeMemberFormatter: IInterfaceTypeMemberFormatter, parameterTypeFormatter: IParameterTypeFormatter): IFunctionType {
		return {
			kind: TypeKind.FUNCTION,
			parameters: method.parameters.map(parameter => parameterTypeFormatter.format(parameter, interfaceTypeMemberFormatter)),
			returns: this.formatType(node, interfaceTypeMemberFormatter, parameterTypeFormatter)
		};
	}

	/**
	 * Converts an IndexSignatureDeclaration into an IIndexType
	 * @param {TypeNode | TypeReferenceNode | LeftHandSideExpression} node
	 * @param {IndexSignatureDeclaration} indexSignature
	 * @param {IInterfaceTypeMemberFormatter} interfaceTypeMemberFormatter
	 * @param {IParameterTypeFormatter} parameterTypeFormatter
	 * @returns {IIndexType}
	 */
	private formatIndexed (node: TypeNode|TypeReferenceNode|LeftHandSideExpression, indexSignature: IndexSignatureDeclaration, interfaceTypeMemberFormatter: IInterfaceTypeMemberFormatter, parameterTypeFormatter: IParameterTypeFormatter): IIndexType {
		return {
			kind: TypeKind.INDEX,
			key: interfaceTypeMemberFormatter.format(indexSignature),
			value: this.formatType(node, interfaceTypeMemberFormatter, parameterTypeFormatter)
		};
	}

	/**
	 * Formats the provided TypeNode, TypeReferenceNode or LeftHandSideExpression into a Type
	 * @param {TypeNode | TypeReferenceNode | LeftHandSideExpression} node
	 * @param {IInterfaceTypeMemberFormatter} interfaceTypeMemberFormatter
	 * @param {IParameterTypeFormatter} parameterTypeFormatter
	 * @returns {Type}
	 */
	private formatType (node: TypeNode|TypeReferenceNode|LeftHandSideExpression, interfaceTypeMemberFormatter: IInterfaceTypeMemberFormatter, parameterTypeFormatter: IParameterTypeFormatter): Type {
		switch (node.kind) {

			case SyntaxKind.TypeLiteral:

				const typeLiteralNode = <TypeLiteralNode> node;

				return {
					kind: TypeKind.POJO,
					properties: typeLiteralNode.members.map(member => interfaceTypeMemberFormatter.format(<PropertySignature>member))
				};

			case SyntaxKind.ExpressionWithTypeArguments:

				const expressionWithTypeArgumentsNode = <ExpressionWithTypeArguments> node;
				return this.format(expressionWithTypeArgumentsNode.expression, interfaceTypeMemberFormatter, parameterTypeFormatter);

			case SyntaxKind.VoidKeyword:

				return {
					kind: TypeKind.VOID
				};

			case SyntaxKind.AnyKeyword:

				return {
					kind: TypeKind.ANY
				};

			case SyntaxKind.StringKeyword:

				return {
					kind: TypeKind.STRING
				};

			case SyntaxKind.NumberKeyword:

				return {
					kind: TypeKind.NUMBER
				};

			case SyntaxKind.BooleanKeyword:

				return {
					kind: TypeKind.BOOLEAN
				};

			case SyntaxKind.NullKeyword:

				return {
					kind: TypeKind.NULL
				};

			case SyntaxKind.SymbolKeyword:

				return {
					kind: TypeKind.SYMBOL
				};

			case SyntaxKind.ThisType:

				return {
					kind: TypeKind.THIS
				};

			case SyntaxKind.ObjectKeyword:

				return {
					kind: TypeKind.OBJECT
				};

			case SyntaxKind.TupleType:
				const tupleTypeNode = <TupleTypeNode> node;

				return {
					kind: TypeKind.TUPLE,
					members: tupleTypeNode.elementTypes.map(elementType => this.format(elementType, interfaceTypeMemberFormatter, parameterTypeFormatter))
				};

			case SyntaxKind.FunctionType:
				const functionTypeNode = <FunctionTypeNode>node;

				return {
					kind: TypeKind.FUNCTION,
					parameters: functionTypeNode.parameters.map(parameter => parameterTypeFormatter.format(parameter, interfaceTypeMemberFormatter)),
					returns: this.format(functionTypeNode.type, interfaceTypeMemberFormatter, parameterTypeFormatter)
				};

			case SyntaxKind.UndefinedKeyword:

				return {
					kind: TypeKind.UNDEFINED
				};

			case SyntaxKind.LastTypeNode:
				const lastTypeNode = <LiteralTypeNode>node;

				let lastTypeNodeValue: string;
				if (isStringLiteral(lastTypeNode.literal)) {
					lastTypeNodeValue = this.astUtil.takeName(lastTypeNode.literal);
					return {
						kind: TypeKind.STRING_ENUMERATION,
						value: lastTypeNodeValue
					};
				}

				if (isNumericLiteral(lastTypeNode.literal)) {
					lastTypeNodeValue = this.astUtil.takeName(lastTypeNode.literal);
					return {
						kind: TypeKind.NUMBER_ENUMERATION,
						value: parseInt(lastTypeNodeValue)
					};
				}

				return {
					kind: TypeKind.BOOLEAN_ENUMERATION,
					value: lastTypeNode.literal.kind === SyntaxKind.TrueKeyword
				};

			case SyntaxKind.ArrayType:
				const arrayType = <ArrayTypeNode>node;

				return {
					kind: TypeKind.ARRAY,
					type: this.format(arrayType.elementType, interfaceTypeMemberFormatter, parameterTypeFormatter)
				};

			case SyntaxKind.TypeOperator:
				const typeOperatorNode = <TypeOperatorNode>node;

				// Switch through all the possible type operators
				switch (typeOperatorNode.operator) {
					case SyntaxKind.KeyOfKeyword:
						return {
							kind: TypeKind.KEYOF,
							type: this.format(typeOperatorNode.type, interfaceTypeMemberFormatter, parameterTypeFormatter)
						};
					default: {
						return {
							kind: TypeKind.NEVER
						};
					}
				}

			case SyntaxKind.ParenthesizedType:
				const parenthesizedType = <ParenthesizedTypeNode>node;

				return {
					kind: TypeKind.PARENTHESIZED,
					type: this.format(parenthesizedType.type, interfaceTypeMemberFormatter, parameterTypeFormatter)
				};

			case SyntaxKind.TypeReference:
			case SyntaxKind.Identifier:
				const referenceNode = <TypeReferenceNode | Identifier>node;

				return {
					kind: TypeKind.REFERENCE,
					name: this.astUtil.takeName(isIdentifier(referenceNode) ? referenceNode : referenceNode.typeName),
					typeArguments: isIdentifier(referenceNode) ? [] : referenceNode.typeArguments == null ? [] : referenceNode.typeArguments.map(typeArgument => this.format(typeArgument, interfaceTypeMemberFormatter, parameterTypeFormatter))
				};

			case SyntaxKind.UnionType:

				return {
					kind: TypeKind.UNION,
					types: (<UnionTypeNode>node).types.map(type => this.format(type, interfaceTypeMemberFormatter, parameterTypeFormatter))
				};

			case SyntaxKind.IntersectionType:

				return {
					kind: TypeKind.INTERSECTION,
					types: (<IntersectionTypeNode>node).types.map(type => this.format(type, interfaceTypeMemberFormatter, parameterTypeFormatter))
				};

			default: {
				return {
					kind: TypeKind.NEVER
				};
			}
		}
	}
}