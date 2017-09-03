import {IReferenceTypeFormatter} from "./i-reference-type-formatter";
import {IFormattedReferenceType, FormattedTypeKind, FormattedExpressionKind} from "@wessberg/type";
import {EntityName, ExpressionWithTypeArguments, Identifier, isExpressionWithTypeArguments, isIdentifier, isQualifiedName, TypeReferenceNode} from "typescript";
import {ITypescriptASTUtil} from "@wessberg/typescript-ast-util";
import {TypeFormatterGetter} from "../type-formatter/type-formatter-getter";
import {FormattedExpressionFormatter} from "../../expression/formatted-expression/formatted-expression-formatter";
import {AstMapperGetter} from "../../../mapper/ast-mapper/ast-mapper-getter";

/**
 * A class for generating IFormattedReferenceTypes
 */
export class ReferenceTypeFormatter extends FormattedExpressionFormatter implements IReferenceTypeFormatter {
	constructor (private astMapper: AstMapperGetter,
							 private astUtil: ITypescriptASTUtil, private typeFormatter: TypeFormatterGetter) {
		super();
	}

	/**
	 * Formats the provided Expression into an IFormattedReferenceType
	 * @param {ExpressionWithTypeArguments | Identifier | TypeReferenceNode} expression
	 * @returns {IFormattedReferenceType}
	 */
	public format (expression: ExpressionWithTypeArguments|Identifier|TypeReferenceNode|EntityName): IFormattedReferenceType {
		let referenceType: IFormattedReferenceType;

		if (isExpressionWithTypeArguments(expression)) {
			referenceType = {
				...super.format(expression),
				kind: FormattedTypeKind.REFERENCE,
				name: this.astUtil.takeName(expression.expression),
				typeArguments: expression.typeArguments == null ? [] : expression.typeArguments.map(typeArgument => this.typeFormatter().format(typeArgument)),
				expressionKind: FormattedExpressionKind.TYPE
			};
		}

		else if (isIdentifier(expression)) {
			referenceType = {
				...super.format(expression),
				kind: FormattedTypeKind.REFERENCE,
				name: this.astUtil.takeName(expression),
				typeArguments: [],
				expressionKind: FormattedExpressionKind.TYPE
			};
		}

		else if (isQualifiedName(expression)) {
			referenceType = {
				...super.format(expression),
				kind: FormattedTypeKind.REFERENCE,
				name: this.astUtil.takeName(expression),
				typeArguments: [],
				expressionKind: FormattedExpressionKind.TYPE
			};
		}

		else {
			referenceType = {
				...super.format(expression),
				kind: FormattedTypeKind.REFERENCE,
				name: this.astUtil.takeName(expression.typeName),
				typeArguments: expression.typeArguments == null ? [] : expression.typeArguments.map(typeArgument => this.typeFormatter().format(typeArgument)),
				expressionKind: FormattedExpressionKind.TYPE
			};
		}

		// Map the formatted expression to the relevant statement
		this.astMapper().mapFormattedExpressionToStatement(referenceType, expression);

		// Override the 'toString()' method
		referenceType.toString = () => this.stringify(referenceType);
		return referenceType;
	}

	/**
	 * Generates a string representation of the IFormattedReferenceType
	 * @param {IFormattedReferenceType} referenceType
	 * @returns {string}
	 */
	private stringify (referenceType: IFormattedReferenceType): string {
		let str = "";
		// Add the name of the reference
		str += referenceType.name;

		// Add the type arguments if it has any
		if (referenceType.typeArguments.length > 0) {
			str += `<${referenceType.typeArguments.map(typeArgument => typeArgument.toString()).join(", ")}>`;
		}

		return str;
	}

}