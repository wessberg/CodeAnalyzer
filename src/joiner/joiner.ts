import {IJoinerBase} from "./i-joiner";
import {Block, ClassElement, createBlock, createHeritageClause, createNamedImports, createNodeArray, HeritageClause, NamedImports, NodeArray, Statement, SyntaxKind} from "typescript";
import {IHeritageClauseService} from "../service/heritage-clause/i-heritage-clause-service";
import {INamedImportsService} from "../service/named-imports/i-named-imports-service";

/**
 * A class for joining multiple different Nodes together to form new ones
 */
export class Joiner implements IJoinerBase {
	constructor (private heritageClauseService: IHeritageClauseService,
							 private namedImportsService: INamedImportsService) {
	}

	/**
	 * Joins two NodeArrays of Statements
	 * @param {NodeArray<Statement>|Statement} newStatements
	 * @param {NodeArray<Statement>} existingStatements
	 * @returns {NodeArray<Statement>}
	 */
	public joinStatementNodeArrays (newStatements: NodeArray<Statement>|Statement, existingStatements: NodeArray<Statement>|undefined): NodeArray<Statement> {
		const normalizedNewStatements = Array.isArray(newStatements) ? newStatements : createNodeArray([<Statement>newStatements]);
		// If there are no existing statements clause, just use the new ones
		if (existingStatements == null) {
			return normalizedNewStatements;
		}
		return createNodeArray([...existingStatements, ...normalizedNewStatements]);
	}

	/**
	 * Joins the provided ClassElements
	 * @param {ClassElement} elements
	 * @returns {NodeArray<ClassElement>}
	 */
	public joinClassElements (...elements: (ClassElement|undefined)[]): NodeArray<ClassElement> {
		// Make sure to clear out any undefined values
		const filtered = <ClassElement[]> elements.filter(element => element != null);

		return createNodeArray(filtered);
	}

	/**
	 * Joins the provided HeritageClauses
	 * @param {HeritageClause} clauses
	 * @returns {NodeArray<HeritageClause>}
	 */
	public joinHeritageClauses (...clauses: (HeritageClause|undefined)[]): NodeArray<HeritageClause> {
		// Make sure to clear out any undefined values
		const filtered = <HeritageClause[]> clauses.filter(clause => clause != null);

		// Make sure that the 'Extends' clause precedes the 'Implements' one (if it has any)
		const sorted = filtered.sort(clause => clause.token === SyntaxKind.ExtendsKeyword ? -1 : 1);

		return createNodeArray(sorted);
	}

	/**
	 * Joins two implements clauses. Takes all of the unique types
	 * @param {HeritageClause} newImplementsClause
	 * @param {HeritageClause} existingImplementsClause
	 * @returns {HeritageClause}
	 */
	public joinImplementsHeritageClause (newImplementsClause: HeritageClause, existingImplementsClause: HeritageClause|undefined): HeritageClause {
		// If there are no existing implements clause, just use the new one
		if (existingImplementsClause == null) {
			return newImplementsClause;
		}

		// Take all of the types not present in the existing ImplementsClause
		const uniqueTypes = newImplementsClause.types.filter(type => !this.heritageClauseService.hasTypeWithName(type, existingImplementsClause));

		// Create a new HeritageClause from the unique types
		return createHeritageClause(
			SyntaxKind.ImplementsKeyword,
			createNodeArray([...existingImplementsClause.types, ...uniqueTypes])
		);
	}

	/**
	 * Joins two independent Blocks
	 * @param {Block} blocks
	 * @returns {Block}
	 */
	public joinBlock (...blocks: (Block|undefined)[]): Block {
		// Make sure to clear out any undefined values
		const filtered = <Block[]> blocks.filter(block => block != null);

		// Creates a block from the statements of all of the provided Blocks
		return createBlock(
			createNodeArray(...filtered.map(block => block.statements))
		);
	}

	/**
	 * Joins two NamedImports
	 * @param {NamedImports} newNamedImports
	 * @param {NamedImports} existingNamedImports
	 * @returns {NamedImports}
	 */
	public joinNamedImports (newNamedImports: NamedImports, existingNamedImports: NamedImports|undefined): NamedImports {
		// If there are no existing NamedImports, just use the new one
		if (existingNamedImports == null) {
			return newNamedImports;
		}

		// Take all of the NamedImports not present in the existing NamedImports
		const uniqueNamedImports = newNamedImports.elements.filter(element => !this.namedImportsService.hasImportWithName(element, existingNamedImports));

		// Create a new NamedImports from the unique NamedImports
		return createNamedImports(
			createNodeArray([...existingNamedImports.elements, ...uniqueNamedImports])
		);
	}

}