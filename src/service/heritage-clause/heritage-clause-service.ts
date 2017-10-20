import {IHeritageClauseService} from "./i-heritage-clause-service";
import {ExpressionWithTypeArguments, HeritageClause, SyntaxKind} from "typescript";
import {IPrinter} from "@wessberg/typescript-ast-util";
import {INameWithTypeArguments} from "../../light-ast/dict/name-with-type-arguments/i-name-with-type-arguments";

/**
 * A service for working with HeritageClauses
 */
export class HeritageClauseService implements IHeritageClauseService {

	constructor (private printer: IPrinter) {
	}

	/**
	 * Gets the first type name of a HeritageClause
	 * @param {HeritageClause} clause
	 * @returns {string}
	 */
	public getFirstTypeName (clause: HeritageClause): string {
		return this.getTypeNames(clause)[0];
	}

	/**
	 * Gets the first type name with TypeArguments of a HeritageClause
	 * @param {HeritageClause} clause
	 * @returns {INameWithTypeArguments}
	 */
	public getFirstTypeNameWithArguments (clause: HeritageClause): INameWithTypeArguments {
		return this.getTypeNamesWithArguments(clause)[0];
	}

	/**
	 * Gets the Type names as well as their TypeArguments
	 * @param {HeritageClause} clause
	 * @returns {INameWithTypeArguments[]}
	 */
	public getTypeNamesWithArguments (clause: HeritageClause): INameWithTypeArguments[] {
		return clause.types.map(type => ({
			name: this.printer.print(type.expression),
			typeArguments: type.typeArguments == null ? null : type.typeArguments.map(typeArgument => this.printer.print(typeArgument))
		}));
	}

	/**
	 * Gets the names of the types bound to the HeritageClause
	 * @param {HeritageClause} clause
	 * @returns {string[]}
	 */
	public getTypeNames (clause: HeritageClause): string[] {
		return clause.types.map(type => this.printer.print(type.expression));
	}

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
		const normalizedName = typeof name === "string" ? name : this.printer.print(name.expression);
		return this.getTypeNames(clause).includes(normalizedName);
	}
}