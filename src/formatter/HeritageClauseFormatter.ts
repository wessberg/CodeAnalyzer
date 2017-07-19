import {HeritageClause, NodeArray} from "typescript";
import {isExtendsClause, isImplementsClause, isTypeBinding} from "../predicate/PredicateFunctions";
import {IHeritageClauseFormatter} from "./interface/IHeritageClauseFormatter";
import {tracer, typeExpressionGetter} from "../services";
import {IClassDeclaration, IdentifierMapKind, IHeritage} from "../identifier/interface/IIdentifier";

/**
 * A class that can format a classes heritage (e.g. super class)
 */
export class HeritageClauseFormatter implements IHeritageClauseFormatter {

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

				// TODO: At this point, we always assume that the extends clause is an atomic reference to something,
				// TODO: For example: Foo extends Bar. But, an extends clause can be anything, for example: Foo extends Bar.Baz
				// TODO: Or even Foo extends class Bar {}. We need to be able to take this into account.
				// TODO: see https://github.com/wessberg/CodeAnalyzer/issues/5 for more info.
				const [extendsClass] = typeExpressionGetter.getTypeExpression(classIdentifier);

				if (isTypeBinding(extendsClass)) {
					obj.extendsClass = {
						...extendsClass,
						...{
							/**
							 * Resolves the super class for the base class.
							 * @returns {IClassDeclaration}
							 */
							resolve () {
								return <IClassDeclaration>tracer.traceIdentifier(extendsClass.name, clause, undefined, IdentifierMapKind.CLASS);
							}
						}
					};
				}
			}

			if (isImplementsClause(clause)) {
				clause.types.forEach(identifier => {
					const expression = typeExpressionGetter.getTypeExpression(identifier);
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