import {isTypeBinding} from "../predicate/PredicateFunctions";
import {ITypeBinding, TypeExpression} from "../service/interface/ISimpleLanguageService";
import {ITypeUtil} from "./interface/ITypeUtil";

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