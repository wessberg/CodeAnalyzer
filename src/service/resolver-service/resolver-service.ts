import {IResolverService} from "./i-resolver-service";
import {FormattedExpression} from "@wessberg/type";
import {IdentifierResolverGetter} from "../../resolver/identifier-resolver/identifier-resolver-getter";

/**
 * A class that can resolve expressions.
 */
export class ResolverService implements IResolverService {
	constructor (private resolver: IdentifierResolverGetter) {
	}

	/**
	 * Resolves an expression
	 * @param {FormattedExpression} expression
	 * @returns {FormattedExpression}
	 */
	public getDefinitionMatchingExpression (expression: FormattedExpression): FormattedExpression|undefined {
		return this.resolver().resolve(expression);
	}
}