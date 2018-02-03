import {IJoinerBase} from "./i-joiner";
import {Block, ClassElement, createBlock, createHeritageClause, createNamedExports, createNamedImports, createNodeArray, Declaration, Decorator, Expression, HeritageClause, NamedExports, NamedImports, Node, NodeArray, Statement, SyntaxKind} from "typescript";
import {IHeritageClauseService} from "../service/heritage-clause/i-heritage-clause-service";
import {INamedImportsService} from "../service/named-imports/i-named-imports-service";
import {INamedExportsService} from "../service/named-exports/i-named-exports-service";
import {IPlacement} from "../placement/i-placement";

/**
 * A class for joining multiple different Nodes together to form new ones
 */
export class Joiner implements IJoinerBase {
	constructor (private readonly heritageClauseService: IHeritageClauseService,
							 private readonly namedImportsService: INamedImportsService,
							 private readonly namedExportsService: INamedExportsService) {
	}

	/**
	 * Joins two NodeArrays of Statements
	 * @param {NodeArray<Statement>|Statement} newStatements
	 * @param {NodeArray<Statement>} existingStatements
	 * @param {IPlacement} [placement]
	 * @returns {NodeArray<Statement>}
	 */
	public joinStatementNodeArrays (newStatements: NodeArray<Statement>|Statement, existingStatements: NodeArray<Statement>|undefined, placement?: IPlacement): NodeArray<Statement> {
		return <NodeArray<Statement>>this.joinNodeArrays(newStatements, existingStatements, placement);
	}

	/**
	 * Joins two arrays of Expressions
	 * @param {NodeArray<Expression> | Expression} newExpressions
	 * @param {NodeArray<Expression>} existingExpressions
	 * @param {IPlacement} [placement]
	 * @returns {NodeArray<Expression>}
	 */
	public joinExpressionNodeArrays (newExpressions: NodeArray<Expression>|Expression, existingExpressions: NodeArray<Expression>|undefined, placement?: IPlacement): NodeArray<Expression> {
		return <NodeArray<Expression>>this.joinNodeArrays(newExpressions, existingExpressions, placement);
	}

	/**
	 * Joins two arrays of Declarations
	 * @param {NodeArray<Declaration> | Declaration} newDeclarations
	 * @param {NodeArray<Declaration>} existingDeclarations
	 * @param {IPlacement} [placement]
	 * @returns {NodeArray<Declaration>}
	 */
	public joinDeclarationNodeArrays (newDeclarations: NodeArray<Declaration>|Declaration, existingDeclarations: NodeArray<Declaration>|undefined, placement?: IPlacement): NodeArray<Declaration> {
		return <NodeArray<Declaration>>this.joinNodeArrays(newDeclarations, existingDeclarations, placement);
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

	/**
	 * Joins two NodeArrays of Nodes
	 * @param {NodeArray<Node>|Node} newNodes
	 * @param {NodeArray<Node>} existingNodes
	 * @param {IPlacement} [placement]
	 * @returns {NodeArray<Node>}
	 */
	private joinNodeArrays (newNodes: NodeArray<Node>|Node, existingNodes: NodeArray<Node>|undefined, placement?: IPlacement): NodeArray<Node> {
		const normalizedNewNodes = Array.isArray(newNodes) ? newNodes : createNodeArray([<Node>newNodes]);
		// If there are no existing nodes, just use the new ones
		if (existingNodes == null) {
			return normalizedNewNodes;
		}

		// If no placement is given, add the node(s) after the existing ones
		if (placement == null) {
			return createNodeArray([...existingNodes, ...normalizedNewNodes]);
		}

		// Otherwise, if no node is given within the placement, either place the new node(s) before or after the existing ones
		if (placement.node == null) {
			return createNodeArray(placement.position === "BEFORE" ? [...normalizedNewNodes, ...existingNodes] : [...existingNodes, ...normalizedNewNodes]);
		}

		// Otherwise, start with taking the index of the given node within the existing nodes
		const indexOfNode = existingNodes.indexOf(<Statement> placement.node);

		// If the Node is not contained within the existing nodes, just use the placement
		if (indexOfNode === -1) {
			return createNodeArray(placement.position === "BEFORE" ? [...normalizedNewNodes, ...existingNodes] : [...existingNodes, ...normalizedNewNodes]);
		}

		// Otherwise, first generate a mutable array from the existing nodes
		const mutableExistingExpressions = [...existingNodes];

		// Now, splice it to add the new expressions, either before or after the matched Node
		mutableExistingExpressions.splice(placement.position === "BEFORE" ? indexOfNode : indexOfNode + 1, 0, ...normalizedNewNodes);

		// Return a new NodeArray
		return createNodeArray(mutableExistingExpressions);
	}

}