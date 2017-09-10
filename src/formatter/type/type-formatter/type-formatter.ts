import {ITypeFormatter, TypeFormatterNode} from "./i-type-formatter";
import {ArrayTypeNode, createToken, ExpressionWithTypeArguments, FunctionTypeNode, Identifier, IndexedAccessTypeNode, IntersectionTypeNode, isIndexSignatureDeclaration, isMethodSignature, isNumericLiteral, isParameter, isPropertySignature, isStringLiteral, LeftHandSideExpression, LiteralTypeNode, ParenthesizedTypeNode, SyntaxKind, Token, TupleTypeNode, TypeLiteralNode, TypeNode, TypeOperatorNode, TypePredicateNode, TypeQueryNode, TypeReferenceNode, UnionTypeNode} from "typescript";
import {FormattedType} from "@wessberg/type";
import {isBooleanLiteral, ITypescriptASTUtil} from "@wessberg/typescript-ast-util";
import {isInterfaceProperty} from "../interface-type-formatter/interface-property";
import {NeverTypeFormatterGetter} from "../never-type-formatter/never-type-formatter-getter";
import {VoidTypeFormatterGetter} from "../void-type-formatter/void-type-formatter-getter";
import {AnyTypeFormatterGetter} from "../any-type-formatter/any-type-formatter-getter";
import {UndefinedTypeFormatterGetter} from "../undefined-type-formatter/undefined-type-formatter-getter";
import {NullTypeFormatterGetter} from "../null-type-formatter/null-type-formatter-getter";
import {NumberTypeFormatterGetter} from "../number-type-formatter/number-type-formatter-getter";
import {NumberEnumerationTypeFormatterGetter} from "../number-enumeration-type-formatter/number-enumeration-type-formatter-getter";
import {StringTypeFormatterGetter} from "../string-type-formatter/string-type-formatter-getter";
import {StringEnumerationTypeFormatterGetter} from "../string-enumeration-type-formatter/string-enumeration-type-formatter-getter";
import {BooleanTypeFormatterGetter} from "../boolean-type-formatter/boolean-type-formatter-getter";
import {BooleanEnumerationTypeFormatterGetter} from "../boolean-enumeration-type-formatter/boolean-enumeration-type-formatter-getter";
import {SymbolTypeFormatterGetter} from "../symbol-type-formatter/symbol-type-formatter-getter";
import {ObjectTypeFormatterGetter} from "../object-type-formatter/object-type-formatter-getter";
import {PojoTypeFormatterGetter} from "../pojo-type-formatter/pojo-type-formatter-getter";
import {ThisTypeFormatterGetter} from "../this-type-formatter/this-type-formatter-getter";
import {TupleTypeFormatterGetter} from "../tuple-type-formatter/tuple-type-formatter-getter";
import {ArrayTypeFormatterGetter} from "../array-type-formatter/array-type-formatter-getter";
import {KeyofTypeFormatterGetter} from "../keyof-type-formatter/keyof-type-formatter-getter";
import {FunctionTypeFormatterGetter} from "../function-type-formatter/function-type-formatter-getter";
import {IndexTypeFormatterGetter} from "../index-type-formatter/index-type-formatter-getter";
import {ReferenceTypeFormatterGetter} from "../reference-type-formatter/reference-type-formatter-getter";
import {ParenthesizedTypeFormatterGetter} from "../parenthesized-type-formatter/parenthesized-type-formatter-getter";
import {UnionTypeFormatterGetter} from "../union-type-formatter/union-type-formatter-getter";
import {IntersectionTypeFormatterGetter} from "../intersection-type-formatter/intersection-type-formatter-getter";
import {TypeofTypeFormatterGetter} from "../typeof-type-formatter/typeof-type-formatter-getter";
import {PredicateTypeFormatterGetter} from "../predicate-type-formatter/predicate-type-formatter-getter";
import {IndexedAccessTypeFormatterGetter} from "../indexed-access-type-formatter/indexed-access-type-formatter-getter";

/**
 * A class for formatting Types
 */
export class TypeFormatter implements ITypeFormatter {
	constructor (private astUtil: ITypescriptASTUtil,
							 private predicateTypeFormatter: PredicateTypeFormatterGetter,
							 private indexedAccessTypeFormatter: IndexedAccessTypeFormatterGetter,
							 private neverTypeFormatter: NeverTypeFormatterGetter,
							 private voidTypeFormatter: VoidTypeFormatterGetter,
							 private anyTypeFormatter: AnyTypeFormatterGetter,
							 private undefinedTypeFormatter: UndefinedTypeFormatterGetter,
							 private nullTypeFormatter: NullTypeFormatterGetter,
							 private numberTypeFormatter: NumberTypeFormatterGetter,
							 private numberEnumerationTypeFormatter: NumberEnumerationTypeFormatterGetter,
							 private stringTypeFormatter: StringTypeFormatterGetter,
							 private stringEnumerationTypeFormatter: StringEnumerationTypeFormatterGetter,
							 private booleanTypeFormatter: BooleanTypeFormatterGetter,
							 private booleanEnumerationTypeFormatter: BooleanEnumerationTypeFormatterGetter,
							 private symbolTypeFormatter: SymbolTypeFormatterGetter,
							 private objectTypeFormatter: ObjectTypeFormatterGetter,
							 private pojoTypeFormatter: PojoTypeFormatterGetter,
							 private thisTypeFormatter: ThisTypeFormatterGetter,
							 private tupleTypeFormatter: TupleTypeFormatterGetter,
							 private arrayTypeFormatter: ArrayTypeFormatterGetter,
							 private keyofTypeFormatter: KeyofTypeFormatterGetter,
							 private typeofTypeFormatter: TypeofTypeFormatterGetter,
							 private functionTypeFormatter: FunctionTypeFormatterGetter,
							 private indexTypeFormatter: IndexTypeFormatterGetter,
							 private referenceTypeFormatter: ReferenceTypeFormatterGetter,
							 private parenthesizedTypeFormatter: ParenthesizedTypeFormatterGetter,
							 private unionTypeFormatter: UnionTypeFormatterGetter,
							 private intersectionTypeFormatter: IntersectionTypeFormatterGetter) {
	}

	/**
	 * Formats the provided expression into a Type.
	 * @param {TypeFormatterNode} node
	 * @returns {FormattedType}
	 */
	public format (node: TypeFormatterNode): FormattedType {
		if (node == null) return this.voidTypeFormatter().format(createToken(SyntaxKind.VoidKeyword));

		if (isMethodSignature(node)) return this.functionTypeFormatter().format(node);
		else if (isIndexSignatureDeclaration(node)) return this.indexTypeFormatter().format(node);
		else {
			const candidateNode = (
				isPropertySignature(node) ||
				isInterfaceProperty(node) ||
				isParameter(node)
			) ? node.type : node;
			if (candidateNode == null) return this.voidTypeFormatter().format(createToken(SyntaxKind.VoidKeyword));
			return this.formatType(candidateNode);
		}
	}

	/**
	 * Formats the provided TypeQueryNode, TypeNode, TypeReferenceNode or LeftHandSideExpression into a Type
	 * @param {TypeQueryNode |TypeNode | TypeReferenceNode | LeftHandSideExpression} node
	 * @returns {FormattedType}
	 */
	private formatType (node: TypeQueryNode|TypeNode|TypeReferenceNode|LeftHandSideExpression): FormattedType {
		switch (node.kind) {

			case SyntaxKind.TypeLiteral:
				return this.pojoTypeFormatter().format(<TypeLiteralNode>node);

			case SyntaxKind.VoidKeyword:
				return this.voidTypeFormatter().format(<Token<SyntaxKind.VoidKeyword>>node);

			case SyntaxKind.AnyKeyword:
				return this.anyTypeFormatter().format(<Token<SyntaxKind.AnyKeyword>>node);

			case SyntaxKind.StringKeyword:
				return this.stringTypeFormatter().format(<Token<SyntaxKind.StringKeyword>>node);

			case SyntaxKind.NumberKeyword:
				return this.numberTypeFormatter().format(<Token<SyntaxKind.NumberKeyword>>node);

			case SyntaxKind.BooleanKeyword:
				return this.booleanTypeFormatter().format(<Token<SyntaxKind.BooleanKeyword>>node);

			case SyntaxKind.NullKeyword:
				return this.nullTypeFormatter().format(<Token<SyntaxKind.NullKeyword>>node);

			case SyntaxKind.SymbolKeyword:
				return this.symbolTypeFormatter().format(<Token<SyntaxKind.SymbolKeyword>>node);

			case SyntaxKind.ThisType:
				return this.thisTypeFormatter().format(<Token<SyntaxKind.ThisKeyword>>node);

			case SyntaxKind.ObjectKeyword:
				return this.objectTypeFormatter().format(<Token<SyntaxKind.ObjectKeyword>>node);

			case SyntaxKind.IndexedAccessType:
				return this.indexedAccessTypeFormatter().format(<IndexedAccessTypeNode>node);

			case SyntaxKind.TupleType:
				return this.tupleTypeFormatter().format(<TupleTypeNode>node);

			case SyntaxKind.FunctionType:
				return this.functionTypeFormatter().format(<FunctionTypeNode>node);

			case SyntaxKind.UndefinedKeyword:
				return this.undefinedTypeFormatter().format(<Token<SyntaxKind.UndefinedKeyword>>node);

			case SyntaxKind.FirstTypeNode:
			case SyntaxKind.TypePredicate:
				return this.predicateTypeFormatter().format(<TypePredicateNode>node);

			case SyntaxKind.LastTypeNode:
				const lastTypeNode = <LiteralTypeNode>node;

				if (isStringLiteral(lastTypeNode.literal)) {
					return this.stringEnumerationTypeFormatter().format(lastTypeNode.literal);
				}

				else if (isNumericLiteral(lastTypeNode.literal)) {
					return this.numberEnumerationTypeFormatter().format(lastTypeNode.literal);
				}

				else if (isBooleanLiteral(lastTypeNode.literal)) {
					return this.booleanEnumerationTypeFormatter().format(lastTypeNode.literal);
				}

				throw new TypeError(`${this.constructor.name} could not format a type of kind ${SyntaxKind[lastTypeNode.kind]} of literal kind: ${SyntaxKind[lastTypeNode.literal.kind]}`);

			case SyntaxKind.ArrayType:
				return this.arrayTypeFormatter().format(<ArrayTypeNode>node);

			case SyntaxKind.TypeQuery:
				return this.typeofTypeFormatter().format(<TypeQueryNode>node);

			case SyntaxKind.TypeOperator:
				const typeOperatorNode = <TypeOperatorNode>node;

				// Switch through all the possible type operators
				switch (typeOperatorNode.operator) {
					case SyntaxKind.KeyOfKeyword:
						return this.keyofTypeFormatter().format(typeOperatorNode.type);
					default: {
						return this.neverTypeFormatter().format(<Token<SyntaxKind.NeverKeyword>>node);
					}
				}

			case SyntaxKind.ParenthesizedType:
				return this.parenthesizedTypeFormatter().format(<ParenthesizedTypeNode>node);

			case SyntaxKind.TypeReference:
			case SyntaxKind.Identifier:
			case SyntaxKind.ExpressionWithTypeArguments:
				return this.referenceTypeFormatter().format(<TypeReferenceNode|Identifier|ExpressionWithTypeArguments>node);

			case SyntaxKind.UnionType:
				return this.unionTypeFormatter().format(<UnionTypeNode>node);

			case SyntaxKind.IntersectionType:
				return this.intersectionTypeFormatter().format(<IntersectionTypeNode>node);

			default: {
				console.log(`${this.constructor.name} could not detect the kind of a type with SyntaxKind: ${SyntaxKind[node.kind]} around here: ${this.astUtil.getRawText(node)}. Defaulting to 'never'...`);
				return this.neverTypeFormatter().format(<Token<SyntaxKind.NeverKeyword>>node);
			}
		}
	}
}