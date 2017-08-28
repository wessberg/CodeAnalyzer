import {IPredicateType, TypeKind} from "@wessberg/type";
import {IPredicateTypeFormatter} from "./i-predicate-type-formatter";
import {IPredicateTypeFormatterOptions} from "./i-predicate-type-formatter-options";
import {ITypescriptASTUtil} from "@wessberg/typescript-ast-util";
import {TypeFormatterGetter} from "../type-formatter/type-formatter-getter";

/**
 * A class for generating IPredicateTypes
 */
export class PredicateTypeFormatter implements IPredicateTypeFormatter {
	constructor (private astUtil: ITypescriptASTUtil,
							 private typeFormatter: TypeFormatterGetter) {
	}

	/**
	 * Formats the provided Expression into an IBooleanType
	 * @param {node} FirstTypeNode
	 * @returns {IBooleanType}
	 */
	public format ({node}: IPredicateTypeFormatterOptions): IPredicateType {

		const result: IPredicateType = {
			kind: TypeKind.PREDICATE,
			name: this.astUtil.takeName(node.parameterName),
			type: this.typeFormatter().format(node.type)
		};

		// Override the 'toString()' method
		result.toString = () => this.stringify(result);
		return result;
	}

	/**
	 * Generates a string representation of the IPredicateType
	 * @param {IPredicateType} formatted
	 * @returns {string}
	 */
	private stringify (formatted: IPredicateType): string {
		return `${formatted.name} is ${formatted.type.toString()}`;
	}

}