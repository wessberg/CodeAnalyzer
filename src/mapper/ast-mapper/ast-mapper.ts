import {IAstMapper} from "./i-ast-mapper";
import {AstNode} from "../../type/ast-node/ast-node";
import {NodeArray} from "typescript";
import {FormattedExpression, isFormattedClass, isFormattedMethod, isFormattedNormalFunction} from "@wessberg/type";

/**
 * A class that can map AstNodes to formatted expressions and vice-versa
 */
export class AstMapper implements IAstMapper {
	/**
	 * A map between formatted expressions and statements
	 * @type {WeakMap<FormattedExpression, Set<AstNode|NodeArray<AstNode>>>}
	 */
	public static readonly FORMATTED_EXPRESSION_TO_STATEMENT_MAP: WeakMap<FormattedExpression, Set<AstNode|NodeArray<AstNode>>> = new WeakMap();
	/**
	 * A map between statements and formatted expressions
	 * @type {WeakMap<AstNode|NodeArray<AstNode>, Set<FormattedExpression>>}
	 */
	private static readonly STATEMENT_TO_FORMATTED_EXPRESSIONS_MAP: WeakMap<AstNode|NodeArray<AstNode>, Set<FormattedExpression>> = new WeakMap();
	/**
	 * A map between files and a map between positions and AstNodes
	 * @type {Map<string, Map<number, FormattedExpression>>}
	 */
	private static readonly FILE_TO_POSITION_TO_FORMATTED_EXPRESSION_MAP: Map<string, Map<number, FormattedExpression>> = new Map();

	/**
	 * Gets the FormattedExpression hat matches the provided file on the provided position
	 * @param {string} file
	 * @param {number} position
	 * @returns {FormattedExpression|null}
	 */
	public getFormattedExpressionForFileAtPosition (file: string, position: number): FormattedExpression|null {
		const map = AstMapper.FILE_TO_POSITION_TO_FORMATTED_EXPRESSION_MAP.get(file);
		if (map == null) return null;
		const match = map.get(position);
		if (match == null) return null;
		return match;
	}

	/**
	 * Maps the provided formatted expression to the provided statement
	 * @param {FormattedExpression} formattedExpression
	 * @param {AstNode|NodeArray<AstNode>} statement
	 */
	public mapFormattedExpressionToStatement (formattedExpression: FormattedExpression, statement: AstNode|NodeArray<AstNode>): void {
		// Retrieve the existing statements
		let statementSet = AstMapper.FORMATTED_EXPRESSION_TO_STATEMENT_MAP.get(formattedExpression);
		// Initialize to a new set if required
		if (statementSet == null) statementSet = new Set<AstNode>();
		// Add the statement to it.
		statementSet.add(statement);
		// Store the relation in the map
		AstMapper.FORMATTED_EXPRESSION_TO_STATEMENT_MAP.set(formattedExpression, statementSet);

		// Retrieve the existing formatted expressions
		let formattedExpressionSet = AstMapper.STATEMENT_TO_FORMATTED_EXPRESSIONS_MAP.get(statement);
		// Initialize to a new set if required
		if (formattedExpressionSet == null) formattedExpressionSet = new Set<FormattedExpression>();
		// Add the formatted expression to it
		formattedExpressionSet.add(formattedExpression);
		// Store the relation in the map
		AstMapper.STATEMENT_TO_FORMATTED_EXPRESSIONS_MAP.set(statement, formattedExpressionSet);

		// Map the statement to its file and position

		// First check if the map has values associated with the file already
		let map = AstMapper.FILE_TO_POSITION_TO_FORMATTED_EXPRESSION_MAP.get(formattedExpression.file);
		// Initialize to an empty map if required
		if (map == null) map = new Map<number, FormattedExpression>();
		// Map the formatted expression to its start position
		map.set(formattedExpression.startsAt, formattedExpression);

		// Add identifier positions as aliases. For example, for classes, the 'name' should point to the class
		if ((
				isFormattedClass(formattedExpression) ||
				isFormattedMethod(formattedExpression) ||
				isFormattedNormalFunction(formattedExpression)
			) && formattedExpression.name != null) {
			map.set(formattedExpression.name.startsAt, formattedExpression);
		}

		// Add it to the map
		AstMapper.FILE_TO_POSITION_TO_FORMATTED_EXPRESSION_MAP.set(formattedExpression.file, map);
	}

	/**
	 * Retrieves all statements for the provided formatted expression
	 * @param {FormattedExpression} formattedExpression
	 * @returns {Set<AstNode|NodeArray<AstNode>>}
	 */
	public getStatementsForFormattedExpression (formattedExpression: FormattedExpression): Set<AstNode|NodeArray<AstNode>> {
		const result = AstMapper.FORMATTED_EXPRESSION_TO_STATEMENT_MAP.get(formattedExpression);
		return result == null ? new Set() : result;
	}

	/**
	 * Retrieves all formatted expressions for the provided statement
	 * @param {AstNode|NodeArray<AstNode>} statement
	 * @returns {Set<FormattedExpression>}
	 */
	public getFormattedExpressionsForStatement (statement: AstNode|NodeArray<AstNode>): Set<FormattedExpression> {
		const result = AstMapper.STATEMENT_TO_FORMATTED_EXPRESSIONS_MAP.get(statement);
		return result == null ? new Set() : result;
	}

}