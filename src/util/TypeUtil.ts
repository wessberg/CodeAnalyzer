import {isTypeBinding} from "../predicate/PredicateFunctions";
import {ITypeUtil} from "./interface/ITypeUtil";
import {ITypeBinding, TypeExpression} from "../identifier/interface/IIdentifier";

/**
 * A class for working with type expressions.
 */
export class TypeUtil implements ITypeUtil {
	/**
	 * Takes all ITypeBindings from a TypeExpression and returns an array of them.
	 * @param {TypeExpression} expression
	 * @param {boolean} [deep=false]
	 * @returns {ITypeBinding[]}
	 */
	public takeTypeBindings (expression: TypeExpression, deep: boolean = false): ITypeBinding[] {
		const bindings: ITypeBinding[] = [];

		expression.forEach(token => {
			if (isTypeBinding(token)) {
				bindings.push(token);

				if (token.typeArguments != null && deep) {
					this.takeTypeBindings(token.typeArguments, deep).forEach(typeBinding => bindings.push(typeBinding));
				}
			}
		});
		return bindings;
	}
}