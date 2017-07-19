import {BinaryExpression, Expression, ExpressionStatement, Node, Statement} from "typescript";
import {IMutationGetter} from "./interface/IMutationGetter";
import {IdentifierMapKind, IMutationDeclaration} from "../identifier/interface/IIdentifier";
import {childStatementGetter, filePathUtil, identifierUtil, languageService, mutationFormatter, pathValidatorUtil, statementUtil} from "../services";
import {isBinaryExpression, isExpressionStatement} from "../predicate/PredicateFunctions";

/**
 * A class that can get all IMutationDeclarations for a file, some Statements or a block of code.
 */
export class MutationGetter implements IMutationGetter {

	/**
	 * Gets all IMutationDeclarations for the given file.
	 * @param {string} fileName
	 * @param {boolean} deep
	 * @returns {IMutationDeclaration[]}
	 */
	public getForFile (fileName: string, deep: boolean = false): IMutationDeclaration[] {
		if (filePathUtil.isExcluded(fileName) || pathValidatorUtil.isBlacklisted(fileName)) return [];

		const statements = languageService.getFile(fileName);
		if (statements == null) throw new ReferenceError(`${this.constructor.name} could not find any statements associated with the given filename: ${fileName}. Have you added it to the service yet?`);
		return this.getForStatements(statements, deep);
	}

	/**
	 * Tracks all BinaryExpressions in the given array of statements, checks if they assign new values to identifiers and returns an array of IMutationDeclarations.
	 * @param {(Statement|Expression|Node)[]} statements
	 * @param {boolean} [deep=false]
	 * @returns {IExportDeclaration[]}
	 */
	public getForStatements (statements: (Statement|Expression|Node)[], deep: boolean = false): IMutationDeclaration[] {
		const mutations: IMutationDeclaration[] = [];
		for (const statement of statements) {
			// Skip the kind (and don't traverse its parents) if the statement kind is blacklisted.
			if (statementUtil.shouldSkip(statement)) continue;

			if (!statementUtil.isResolvingStatement(statement)) {
				if (
					isBinaryExpression(statement) ||
					isExpressionStatement(statement)
				) {
					statementUtil.setResolvingStatement(statement);
					const mutation = this.get(statement);
					if (mutation != null) mutations.push(mutation);
					statementUtil.removeResolvingStatement(statement);
				}
			}

			if (deep) {
				const otherMutations = this.getForStatements(childStatementGetter.get(statement), deep);
				otherMutations.forEach(mutation => mutations.push(mutation));
			}
		}
		return identifierUtil.setKind(mutations, IdentifierMapKind.MUTATIONS);
	}

	/**
	 * If given something that might be a mutation (such as element.foo = "bar"), a formatted IMutationDeclaration will be returned.
	 * @param {BinaryExpression} statement
	 * @returns {IMutationDeclaration|null}
	 */
	public get (statement: BinaryExpression|ExpressionStatement): IMutationDeclaration|null {
		return mutationFormatter.format(statement);
	}

}