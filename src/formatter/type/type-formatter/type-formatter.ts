import {ITypeFormatter, TypeFormatterNode} from "./i-type-formatter";
import {ArrayTypeNode, ExpressionWithTypeArguments, FunctionTypeNode, Identifier, IntersectionTypeNode, isIndexSignatureDeclaration, isMethodSignature, isNumericLiteral, isParameter, isPropertySignature, isStringLiteral, LeftHandSideExpression, LiteralTypeNode, ParenthesizedTypeNode, SyntaxKind, TupleTypeNode, TypeLiteralNode, TypeNode, TypeOperatorNode, TypeReferenceNode, UnionTypeNode} from "typescript";
import {IInterfaceTypeMemberFormatter} from "../interface-type-member-formatter/i-interface-type-member-formatter";
import {IParameterTypeFormatter} from "../parameter-type-formatter/i-parameter-type-formatter";
import {Type, TypeKind} from "@wessberg/type";
import {ITypescriptASTUtil} from "@wessberg/typescript-ast-util";
import {IReferenceTypeFormatter} from "../reference-type-formatter/i-reference-type-formatter";
import {IFunctionTypeFormatter} from "../function-type-formatter/i-function-type-formatter";
import {isInterfaceProperty} from "../interface-type-formatter/interface-property";
import {IIndexTypeFormatter} from "../index-type-formatter/i-index-type-formatter";
import {IPojoTypeFormatter} from "../pojo-type-formatter/i-pojo-type-formatter";
import {IVoidTypeFormatter} from "../void-type-formatter/i-void-type-formatter";

/**
 * A class for formatting Types
 */
export class TypeFormatter implements ITypeFormatter {
	constructor (private astUtil: ITypescriptASTUtil,
							 private voidTypeFormatter: IVoidTypeFormatter,
							 private pojoTypeFormatter: IPojoTypeFormatter,
							 private functionTypeFormatter: IFunctionTypeFormatter,
							 private indexTypeFormatter: IIndexTypeFormatter,
							 private referenceTypeFormatter: IReferenceTypeFormatter) {
	}

	/**
	 * Formats the provided expression into a Type.
	 * @param {TypeFormatterNode} node
	 * @param {IInterfaceTypeMemberFormatter} interfaceTypeMemberFormatter
	 * @param {IParameterTypeFormatter} parameterTypeFormatter
	 * @returns {Type}
	 */
	public format (node: TypeFormatterNode, interfaceTypeMemberFormatter: IInterfaceTypeMemberFormatter, parameterTypeFormatter: IParameterTypeFormatter): Type {
		if (node == null) return {kind: TypeKind.VOID};

		if (isMethodSignature(node)) return this.functionTypeFormatter.format({node, interfaceTypeMemberFormatter, parameterTypeFormatter, typeFormatter: this});
		else if (isIndexSignatureDeclaration(node)) return this.indexTypeFormatter.format({node, interfaceTypeMemberFormatter, parameterTypeFormatter, typeFormatter: this});
		else {
			const candidateNode = (
				isPropertySignature(node) ||
				isInterfaceProperty(node) ||
				isParameter(node)
			) ? node.type : node;
			if (candidateNode == null) return {kind: TypeKind.VOID};
			return this.formatType(candidateNode, interfaceTypeMemberFormatter, parameterTypeFormatter);
		}
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
				return this.pojoTypeFormatter.format({node: <TypeLiteralNode>node, interfaceTypeMemberFormatter});

			case SyntaxKind.VoidKeyword:
				return this.voidTypeFormatter.format();

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
				return this.functionTypeFormatter.format({node: <FunctionTypeNode>node, interfaceTypeMemberFormatter, parameterTypeFormatter, typeFormatter: this});

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
			case SyntaxKind.ExpressionWithTypeArguments:
				return this.referenceTypeFormatter.format({node: <TypeReferenceNode|Identifier|ExpressionWithTypeArguments>node, typeFormatter: this, interfaceTypeMemberFormatter, parameterTypeFormatter});

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