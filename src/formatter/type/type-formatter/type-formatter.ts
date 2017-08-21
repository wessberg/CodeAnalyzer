import {ITypeFormatter, TypeFormatterNode} from "./i-type-formatter";
import {ArrayTypeNode, ExpressionWithTypeArguments, FunctionTypeNode, Identifier, IntersectionTypeNode, isIndexSignatureDeclaration, isMethodSignature, isNumericLiteral, isParameter, isPropertySignature, isStringLiteral, LeftHandSideExpression, LiteralTypeNode, ParenthesizedTypeNode, SyntaxKind, TupleTypeNode, TypeLiteralNode, TypeNode, TypeOperatorNode, TypeReferenceNode, UnionTypeNode} from "typescript";
import {IInterfaceTypeMemberFormatter} from "../interface-type-member-formatter/i-interface-type-member-formatter";
import {IParameterTypeFormatter} from "../parameter-type-formatter/i-parameter-type-formatter";
import {Type} from "@wessberg/type";
import {isBooleanLiteral} from "@wessberg/typescript-ast-util";
import {IReferenceTypeFormatter} from "../reference-type-formatter/i-reference-type-formatter";
import {IFunctionTypeFormatter} from "../function-type-formatter/i-function-type-formatter";
import {isInterfaceProperty} from "../interface-type-formatter/interface-property";
import {IIndexTypeFormatter} from "../index-type-formatter/i-index-type-formatter";
import {IPojoTypeFormatter} from "../pojo-type-formatter/i-pojo-type-formatter";
import {IVoidTypeFormatter} from "../void-type-formatter/i-void-type-formatter";
import {INumberTypeFormatter} from "../number-type-formatter/i-number-type-formatter";
import {IAnyTypeFormatter} from "../any-type-formatter/i-any-type-formatter";
import {IStringTypeFormatter} from "../string-type-formatter/i-string-type-formatter";
import {IBooleanTypeFormatter} from "../boolean-type-formatter/i-boolean-type-formatter";
import {INullTypeFormatter} from "../null-type-formatter/i-null-type-formatter";
import {ISymbolTypeFormatter} from "../symbol-type-formatter/i-symbol-type-formatter";
import {IThisTypeFormatter} from "../this-type-formatter/i-this-type-formatter";
import {IObjectTypeFormatter} from "../object-type-formatter/i-object-type-formatter";
import {IUndefinedTypeFormatter} from "../undefined-type-formatter/i-undefined-type-formatter";
import {IBooleanEnumerationTypeFormatter} from "../boolean-enumeration-type-formatter/i-boolean-enumeration-type-formatter";
import {IStringEnumerationTypeFormatter} from "../string-enumeration-type-formatter/i-string-enumeration-type-formatter";
import {INumberEnumerationTypeFormatter} from "../number-enumeration-type-formatter/i-number-enumeration-type-formatter";
import {INeverTypeFormatter} from "../never-type-formatter/i-never-type-formatter";
import {ITupleTypeFormatter} from "../tuple-type-formatter/i-tuple-type-formatter";
import {IArrayTypeFormatter} from "../array-type-formatter/i-array-type-formatter";
import {IKeyofTypeFormatter} from "../keyof-type-formatter/i-keyof-type-formatter";
import {IParenthesizedTypeFormatter} from "../parenthesized-type-formatter/i-parenthesized-type-formatter";
import {IUnionTypeFormatter} from "../union-type-formatter/i-union-type-formatter";
import {IIntersectionTypeFormatter} from "../intersection-type-formatter/i-intersection-type-formatter";

/**
 * A class for formatting Types
 */
export class TypeFormatter implements ITypeFormatter {
	constructor (private neverTypeFormatter: INeverTypeFormatter,
							 private voidTypeFormatter: IVoidTypeFormatter,
							 private anyTypeFormatter: IAnyTypeFormatter,
							 private undefinedTypeFormatter: IUndefinedTypeFormatter,
							 private nullTypeFormatter: INullTypeFormatter,
							 private numberTypeFormatter: INumberTypeFormatter,
							 private numberEnumerationTypeFormatter: INumberEnumerationTypeFormatter,
							 private stringTypeFormatter: IStringTypeFormatter,
							 private stringEnumerationTypeFormatter: IStringEnumerationTypeFormatter,
							 private booleanTypeFormatter: IBooleanTypeFormatter,
							 private booleanEnumerationTypeFormatter: IBooleanEnumerationTypeFormatter,
							 private symbolTypeFormatter: ISymbolTypeFormatter,
							 private objectTypeFormatter: IObjectTypeFormatter,
							 private pojoTypeFormatter: IPojoTypeFormatter,
							 private thisTypeFormatter: IThisTypeFormatter,
							 private tupleTypeFormatter: ITupleTypeFormatter,
							 private arrayTypeFormatter: IArrayTypeFormatter,
							 private keyofTypeFormatter: IKeyofTypeFormatter,
							 private functionTypeFormatter: IFunctionTypeFormatter,
							 private indexTypeFormatter: IIndexTypeFormatter,
							 private referenceTypeFormatter: IReferenceTypeFormatter,
							 private parenthesizedTypeFormatter: IParenthesizedTypeFormatter,
							 private unionTypeFormatter: IUnionTypeFormatter,
							 private intersectionTypeFormatter: IIntersectionTypeFormatter) {
	}

	/**
	 * Formats the provided expression into a Type.
	 * @param {TypeFormatterNode} node
	 * @param {IInterfaceTypeMemberFormatter} interfaceTypeMemberFormatter
	 * @param {IParameterTypeFormatter} parameterTypeFormatter
	 * @returns {Type}
	 */
	public format (node: TypeFormatterNode, interfaceTypeMemberFormatter: IInterfaceTypeMemberFormatter, parameterTypeFormatter: IParameterTypeFormatter): Type {
		if (node == null) return this.voidTypeFormatter.format();

		if (isMethodSignature(node)) return this.functionTypeFormatter.format({node, interfaceTypeMemberFormatter, parameterTypeFormatter, typeFormatter: this});
		else if (isIndexSignatureDeclaration(node)) return this.indexTypeFormatter.format({node, interfaceTypeMemberFormatter, parameterTypeFormatter, typeFormatter: this});
		else {
			const candidateNode = (
				isPropertySignature(node) ||
				isInterfaceProperty(node) ||
				isParameter(node)
			) ? node.type : node;
			if (candidateNode == null) return this.voidTypeFormatter.format();
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
				return this.anyTypeFormatter.format();

			case SyntaxKind.StringKeyword:
				return this.stringTypeFormatter.format();

			case SyntaxKind.NumberKeyword:
				return this.numberTypeFormatter.format();

			case SyntaxKind.BooleanKeyword:
				return this.booleanTypeFormatter.format();

			case SyntaxKind.NullKeyword:
				return this.nullTypeFormatter.format();

			case SyntaxKind.SymbolKeyword:
				return this.symbolTypeFormatter.format();

			case SyntaxKind.ThisType:
				return this.thisTypeFormatter.format();

			case SyntaxKind.ObjectKeyword:
				return this.objectTypeFormatter.format();

			case SyntaxKind.TupleType:
				return this.tupleTypeFormatter.format({node: <TupleTypeNode>node, interfaceTypeMemberFormatter, parameterTypeFormatter, typeFormatter: this});

			case SyntaxKind.FunctionType:
				return this.functionTypeFormatter.format({node: <FunctionTypeNode>node, interfaceTypeMemberFormatter, parameterTypeFormatter, typeFormatter: this});

			case SyntaxKind.UndefinedKeyword:
				return this.undefinedTypeFormatter.format();

			case SyntaxKind.LastTypeNode:
				const lastTypeNode = <LiteralTypeNode>node;

				if (isStringLiteral(lastTypeNode.literal)) {
					return this.stringEnumerationTypeFormatter.format({node: lastTypeNode.literal});
				}

				else if (isNumericLiteral(lastTypeNode.literal)) {
					return this.numberEnumerationTypeFormatter.format({node: lastTypeNode.literal});
				}

				else if (isBooleanLiteral(lastTypeNode.literal)) {
					return this.booleanEnumerationTypeFormatter.format({node: lastTypeNode.literal});
				}

				throw new TypeError(`${this.constructor.name} could not format a type of kind ${SyntaxKind[lastTypeNode.kind]} of literal kind: ${SyntaxKind[lastTypeNode.literal.kind]}`);

			case SyntaxKind.ArrayType:
				return this.arrayTypeFormatter.format({node: <ArrayTypeNode>node, interfaceTypeMemberFormatter, parameterTypeFormatter, typeFormatter: this});

			case SyntaxKind.TypeOperator:
				const typeOperatorNode = <TypeOperatorNode>node;

				// Switch through all the possible type operators
				switch (typeOperatorNode.operator) {
					case SyntaxKind.KeyOfKeyword:
						return this.keyofTypeFormatter.format({node: typeOperatorNode.type, interfaceTypeMemberFormatter, parameterTypeFormatter, typeFormatter: this});
					default: {
						return this.neverTypeFormatter.format();
					}
				}

			case SyntaxKind.ParenthesizedType:
				return this.parenthesizedTypeFormatter.format({node: (<ParenthesizedTypeNode>node).type, interfaceTypeMemberFormatter, parameterTypeFormatter, typeFormatter: this});

			case SyntaxKind.TypeReference:
			case SyntaxKind.Identifier:
			case SyntaxKind.ExpressionWithTypeArguments:
				return this.referenceTypeFormatter.format({node: <TypeReferenceNode|Identifier|ExpressionWithTypeArguments>node, typeFormatter: this, interfaceTypeMemberFormatter, parameterTypeFormatter});

			case SyntaxKind.UnionType:
				return this.unionTypeFormatter.format({node: <UnionTypeNode>node, interfaceTypeMemberFormatter, parameterTypeFormatter, typeFormatter: this});

			case SyntaxKind.IntersectionType:
				return this.intersectionTypeFormatter.format({node: <IntersectionTypeNode>node, interfaceTypeMemberFormatter, parameterTypeFormatter, typeFormatter: this});

			default: {
				return this.neverTypeFormatter.format();
			}
		}
	}
}