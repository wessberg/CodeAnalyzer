import {IJoinerBase} from "./i-joiner";
import {Block, ClassElement, createBlock, createHeritageClause, createNamedExports, createNamedImports, createNodeArray, Decorator, Expression, HeritageClause, NamedExports, NamedImports, NodeArray, Statement, SyntaxKind} from "typescript";
import {IHeritageClauseService} from "../service/heritage-clause/i-heritage-clause-service";
import {INamedImportsService} from "../service/named-imports/i-named-imports-service";
import {INamedExportsService} from "../service/named-exports/i-named-exports-service";
import {IPlacement} from "../placement/i-placement";

/**
 * A class for joining multiple different Nodes together to form new ones
 */
export class Joiner implements IJoinerBase {
	constructor (private heritageClauseService: IHeritageClauseService,
							 private namedImportsService: INamedImportsService,
							 private namedExportsService: INamedExportsService) {
	}

	/**
	 * Joins two NodeArrays of Statements
	 * @param {NodeArray<Statement>|Statement} newStatements
	 * @param {NodeArray<Statement>} existingStatements
	 * @param {IPlacement} [placement]
	 * @returns {NodeArray<Statement>}
	 */
	public joinStatementNodeArrays (newStatements: NodeArray<Statement>|Statement, existingStatements: NodeArray<Statement>|undefined, placement?: IPlacement): NodeArray<Statement> {
		const normalizedNewStatements = Array.isArray(newStatements) ? newStatements : createNodeArray([<Statement>newStatements]);
		// If there are no existing statements clause, just use the new ones
		if (existingStatements == null) {
			return normalizedNewStatements;
		}

		// If no placement is given, add the statement(s) after the existing ones
		if (placement == null) {
			return createNodeArray([...existingStatements, ...normalizedNewStatements]);
		}

		// Otherwise, if no node is given within the placement, either place the new statement(s) before or after the existing ones
		if (placement.node == null) {
			return createNodeArray(placement.position === "BEFORE" ? [...normalizedNewStatements, ...existingStatements] : [...existingStatements, ...normalizedNewStatements]);
		}

		// Otherwise, start with taking the index of the given node within the existing statements
		const indexOfNode = existingStatements.indexOf(<Statement> placement.node);

		// If the Node is not contained within the existing statements, just use the placement
		if (indexOfNode === -1) {
			return createNodeArray(placement.position === "BEFORE" ? [...normalizedNewStatements, ...existingStatements] : [...existingStatements, ...normalizedNewStatements]);
		}

		// Otherwise, first generate a mutable array from the existing statements
		const mutableExistingExpressions = [...existingStatements];

		// Now, splice it to add the new expressions, either before or after the matched Node
		mutableExistingExpressions.splice(placement.position === "BEFORE" ? indexOfNode : indexOfNode + 1, 0, ...normalizedNewStatements);

		// Return a new NodeArray
		return createNodeArray(mutableExistingExpressions);
	}

	/**
	 * Joins two arrays of Expressions
	 * @param {NodeArray<Expression> | Expression} newExpressions
	 * @param {NodeArray<Expression>} existingExpressions
	 * @param {IPlacement} [placement]
	 * @returns {NodeArray<Expression>}
	 */
	public joinExpressionNodeArrays (newExpressions: NodeArray<Expression>|Expression, existingExpressions: NodeArray<Expression>|undefined, placement?: IPlacement): NodeArray<Expression> {
		const normalizedNewExpressions = Array.isArray(newExpressions) ? newExpressions : createNodeArray([<Expression>newExpressions]);

		// If there are no existing expressions clause, just use the new ones
		if (existingExpressions == null) {
			return createNodeArray(normalizedNewExpressions);
		}

		// If no placement is given, add the expression(s) after the existing ones
		if (placement == null) {
			return createNodeArray([...existingExpressions, ...normalizedNewExpressions]);
		}

		// Otherwise, if no node is given within the placement, either place the new expression(s) before or after the existing ones
		if (placement.node == null) {
			return createNodeArray(placement.position === "BEFORE" ? [...normalizedNewExpressions, ...existingExpressions] : [...existingExpressions, ...normalizedNewExpressions]);
		}

		// Otherwise, start with taking the index of the given node within the existing expressions
		const indexOfNode = existingExpressions.indexOf(<Expression> placement.node);

		// If the Node is not contained within the existing expressions, just use the placement
		if (indexOfNode === -1) {
			return createNodeArray(placement.position === "BEFORE" ? [...normalizedNewExpressions, ...existingExpressions] : [...existingExpressions, ...normalizedNewExpressions]);
		}

		// Otherwise, first generate a mutable array from the existing expressions
		const mutableExistingExpressions = [...existingExpressions];

		// Now, splice it to add the new expressions, either before or after the matched Node
		mutableExistingExpressions.splice(placement.position === "BEFORE" ? indexOfNode : indexOfNode + 1, 0, ...normalizedNewExpressions);

		// Return a new NodeArray
		return createNodeArray(mutableExistingExpressions);
	}

	/**
	 * Joins the provided Decorators
	 * @param {Decorator | undefined} decorators
	 * @returns {ts.NodeArray<Decorator>}
	 */
	public joinDecorators (...decorators: (Decorator|undefined)[]): NodeArray<Decorator> {
		const filtered = <Decorator[]> decorators.filter(decorator => decorator != null);

		return createNodeArray(filtered);
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
		const combined: Statement[] = [];
		// Make sure to clear out any undefined values
		const filtered = <Block[]> blocks.filter(block => block != null);

		// Add all of the statements to the combined Statement array
		filtered.forEach(part => combined.push(...part.statements));

		// Creates a block from the statements of all of the provided Blocks
		return createBlock(
			createNodeArray(combined)
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

	/**
	 * Joins two NamedExports
	 * @param {NamedExports} newNamedExports
	 * @param {NamedExports} existingNamedExports
	 * @returns {NamedExports}
	 */
	public joinNamedExports (newNamedExports: NamedExports, existingNamedExports: NamedExports|undefined): NamedExports {
		// If there are no existing NamedExports, just use the new one
		if (existingNamedExports == null) {
			return newNamedExports;
		}

		// Take all of the NamedExports not present in the existing NamedExports
		const uniqueNamedExports = newNamedExports.elements.filter(element => !this.namedExportsService.hasExportWithName(element, existingNamedExports));

		// Create a new NamedImports from the unique NamedImports
		return createNamedExports(
			createNodeArray([...existingNamedExports.elements, ...uniqueNamedExports])
		);
	}

}