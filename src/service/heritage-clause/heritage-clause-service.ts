import {IHeritageClauseService} from "./i-heritage-clause-service";
import {ExpressionWithTypeArguments, HeritageClause, SyntaxKind} from "typescript";
import {ITypeService} from "../type/i-type-service";

/**
 * A service for working with HeritageClauses
 */
export class HeritageClauseService implements IHeritageClauseService {
	constructor (private typeService: ITypeService) {}

	/**
	 * Returns true if the provided clause is an ImplementsClause
	 * @param {HeritageClause} clause
	 * @returns {boolean}
	 */
	public isImplementsClause (clause: HeritageClause): boolean {
		return clause.token === SyntaxKind.ImplementsKeyword;
	}

	/**
	 * Returns true if the provided clause is an ExtendsClause
	 * @param {HeritageClause} clause
	 * @returns {boolean}
	 */
	public isExtendsClause (clause: HeritageClause): boolean {
		return clause.token === SyntaxKind.ExtendsKeyword;
	}

	/**
	 * Returns true if any of the clauses matches the provided name
	 * @param {string | ExpressionWithTypeArguments} name
	 * @param {HeritageClause} clause
	 * @returns {boolean}
	 */
	public hasTypeWithName (name: string|ExpressionWithTypeArguments, clause: HeritageClause): boolean {
		const normalizedName = typeof name === "string" ? name : this.typeService.getTypeNameOf(name);
		return clause.types.some(type => this.typeService.getTypeNameOf(type) === normalizedName);
	}
}