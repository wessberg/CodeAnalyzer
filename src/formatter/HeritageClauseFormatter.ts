import {HeritageClause, NodeArray} from "typescript";
import {ITypeExpressionGetter} from "../getter/interface/ITypeExpressionGetter";
import {isExtendsClause, isImplementsClause, isTypeBinding} from "../predicate/PredicateFunctions";
import {IHeritage} from "../service/interface/ISimpleLanguageService";
import {IHeritageClauseFormatter} from "./interface/IHeritageClauseFormatter";

export class HeritageClauseFormatter implements IHeritageClauseFormatter {

	constructor (private typeExpressionGetter: ITypeExpressionGetter) {}

	/**
	 * Takes a PropertyDeclaration and returns an IPropDeclaration.
	 * @param {NodeArray<HeritageClause>} clauses
	 * @returns {IPropDeclaration}
	 */
	public format (clauses: NodeArray<HeritageClause>): IHeritage {
		const obj: IHeritage = {extendsClass: null, implementsInterfaces: []};

		clauses.forEach(clause => {

			if (isExtendsClause(clause)) {
				// There can only be one extended class.
				const [classIdentifier] = clause.types;
				const [extendsClass] = this.typeExpressionGetter.getTypeExpression(classIdentifier);
				if (isTypeBinding(extendsClass)) {
					obj.extendsClass = extendsClass;
				}
			}

			if (isImplementsClause(clause)) {
				clause.types.forEach(identifier => {
					const expression = this.typeExpressionGetter.getTypeExpression(identifier);
					expression.forEach(part => {
						if (isTypeBinding(part)) {
							obj.implementsInterfaces.push(part);
						}
					});
				});
			}
		});
		return obj;
	}
}