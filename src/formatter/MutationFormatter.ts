import {BinaryExpression, ExpressionStatement, SyntaxKind} from "typescript";
import {IMutationFormatter} from "./interface/IMutationFormatter";
import {isBinaryExpression, isElementAccessExpression, isExpressionStatement, isIdentifierObject, isPropertyAccessExpression} from "../predicate/PredicateFunctions";
import {identifierUtil, mapper, nameGetter, sourceFilePropertiesGetter, valueableFormatter, valueExpressionGetter, valueResolvedGetter} from "../services";
import {ArbitraryValue, IdentifierMapKind, IMutationDeclaration, INonNullableValueable} from "../identifier/interface/IIdentifier";

/**
 * Formats the any kind of relevant statement into an IMutationDeclaration.
 */
export class MutationFormatter implements IMutationFormatter {

	/**
	 * Formats the given BinaryExpression|ExpressionStatement and returns an IMutationDeclaration (or null, if it isn't an assignment).
	 * @param {BinaryExpression} statement
	 * @returns {IMutationDeclaration|null}
	 */
	public format (statement: BinaryExpression|ExpressionStatement): IMutationDeclaration|null {
		let property: ArbitraryValue = null;
		let identifier: ArbitraryValue = null;

		if (isExpressionStatement(statement)) {
			if (!isBinaryExpression(statement.expression)) return null;
			return this.format(statement.expression);
		}

		if (!this.isAssignment(statement)) return null;

		if (isIdentifierObject(statement.left)) {
			property = nameGetter.getName(statement.left);
		}

		if (isPropertyAccessExpression(statement.left)) {
			property = nameGetter.getName(statement.left.expression);
			identifier = nameGetter.getName(statement.left.name);
		}

		if (isElementAccessExpression(statement.left)) {
			try {
				property = nameGetter.getName(statement.left.expression);
			} catch (ex) {
				// It is a non-trivial expression. Format it and set it as a property.
				const formatted = valueableFormatter.format(statement.left.expression);
				property = formatted.expression;
			}

			const value = valueableFormatter.format(statement.left.argumentExpression);
			identifier = value.hasDoneFirstResolve() ? value.resolved : value.resolve();
		}

		if (property == null && identifier == null) throw new ReferenceError(`${MutationFormatter.constructor.name} could not format a statement of kind ${SyntaxKind[statement.kind]}: No identifier or property could be found!`);

		const startsAt = statement.pos;
		const endsAt = statement.end;
		const filePath = sourceFilePropertiesGetter.getSourceFileProperties(statement).filePath;
		const valueExpression = valueExpressionGetter.getValueExpression(statement.right);

		const map: IMutationDeclaration = identifierUtil.setKind({
			___kind: IdentifierMapKind.MUTATION,
			property,
			identifier,
			startsAt,
			endsAt,
			filePath,
			value: {
				expression: valueExpression,
				resolving: false,
				resolved: undefined,
				resolvedPrecompute: undefined,

				/**
				 * Returns true if a value has been resolved previously.
				 * @returns {boolean}
				 */
				hasDoneFirstResolve () {
					return map.value.resolved !== undefined;
				},

				/**
				 * Resolves/computes a value for the associated value expression.
				 * @returns {ArbitraryValue}
				 */
				resolve () {
					if (map.value.expression == null) {
						map.value.resolved = map.value.resolvedPrecompute = null;
					} else {
						const [computed, flattened] = valueResolvedGetter.getValueResolved(<INonNullableValueable>map.value, statement);
						map.value.resolved = computed;
						map.value.resolvedPrecompute = flattened;
					}
					return map.value.resolved;
				}
			}
		}, IdentifierMapKind.MUTATION);

		mapper.set(map, statement);
		return map;
	}

	/**
	 * Returns true if the given BinaryExpression is an assignment.
	 * @param {BinaryExpression} statement
	 * @returns {boolean}
	 */
	private isAssignment (statement: BinaryExpression): boolean {
		return statement.operatorToken.kind === SyntaxKind.EqualsToken;
	}

}