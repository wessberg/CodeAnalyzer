import {BinaryExpression, ExpressionStatement, SyntaxKind} from "typescript";
import {ISourceFilePropertiesGetter} from "../getter/interface/ISourceFilePropertiesGetter";
import {IMapper} from "../mapper/interface/IMapper";
import {ArbitraryValue, IdentifierMapKind, IMutationDeclaration, INonNullableValueable} from "../service/interface/ICodeAnalyzer";
import {IMutationFormatter} from "./interface/IMutationFormatter";
import {IValueExpressionGetter} from "../getter/interface/IValueExpressionGetter";
import {IValueResolvedGetter} from "../getter/interface/IValueResolvedGetter";
import {isBinaryExpression, isElementAccessExpression, isExpressionStatement, isIdentifierObject, isPropertyAccessExpression} from "../predicate/PredicateFunctions";
import {INameGetter} from "../getter/interface/INameGetter";
import {IValueableFormatter} from "./interface/IValueableFormatter";

export class MutationFormatter implements IMutationFormatter {

	constructor (private mapper: IMapper,
							 private valueableFormatter: IValueableFormatter,
							 private nameGetter: INameGetter,
							 private valueExpressionGetter: IValueExpressionGetter,
							 private valueResolvedGetter: IValueResolvedGetter,
							 private sourceFilePropertiesGetter: ISourceFilePropertiesGetter) {
	}

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
			property = this.nameGetter.getName(statement.left);
		}

		if (isPropertyAccessExpression(statement.left)) {
			property = this.nameGetter.getName(statement.left.expression);
			identifier = <string>this.nameGetter.getName(statement.left.name);
		}

		if (isElementAccessExpression(statement.left)) {
			property = this.nameGetter.getName(statement.left.expression);
			const value = this.valueableFormatter.format(statement.left.argumentExpression);
			identifier = value.hasDoneFirstResolve() ? value.resolved : value.resolve();
		}

		if (property == null && identifier == null) throw new ReferenceError(`${MutationFormatter.constructor.name} could not format a statement of kind ${SyntaxKind[statement.kind]}: No identifier or property could be found!`);

		const startsAt = statement.pos;
		const endsAt = statement.end;
		const filePath = this.sourceFilePropertiesGetter.getSourceFileProperties(statement).filePath;
		const valueExpression = this.valueExpressionGetter.getValueExpression(statement.right);
		const that = this;

		const map: IMutationDeclaration = {
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
				hasDoneFirstResolve () {
					return map.value.resolved !== undefined;
				},
				resolve () {
					if (map.value.expression == null) {
						map.value.resolved = map.value.resolvedPrecompute = null;
					} else {
						const [computed, flattened] = that.valueResolvedGetter.getValueResolved(<INonNullableValueable>map.value, statement);
						map.value.resolved = computed;
						map.value.resolvedPrecompute = flattened;
					}
					return map.value.resolved;
				}
			}
		};
		// Make the kind non-enumerable.
		Object.defineProperty(map, "___kind", {
			value: IdentifierMapKind.MUTATION,
			enumerable: false
		});
		this.mapper.set(map, statement);
		return map;
	}

	private isAssignment (statement: BinaryExpression): boolean {
		return statement.operatorToken.kind === SyntaxKind.EqualsToken;
	}

}