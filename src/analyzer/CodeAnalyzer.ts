import {CallExpression, Expression, Node, NodeArray, Statement, SyntaxKind} from "typescript";
import {isIdentifierObject} from "../predicate/PredicateFunctions";
import {allIdentifiersGetter, arrowFunctionGetter, callExpressionGetter, childStatementGetter, classDeclarationGetter, enumDeclarationGetter, exportDeclarationGetter, filePathUtil, functionDeclarationGetter, importDeclarationGetter, languageService, mutationGetter, newExpressionGetter, resolvedIdentifierValueGetter, resolvedSerializedIdentifierValueGetter, variableDeclarationGetter} from "../services";
import {ICodeAnalyzer, ICodeAnalyzerConstructorOptions} from "./interface/ICodeAnalyzer";
import {ClassIndexer, EnumIndexer, FunctionIndexer, IArrowFunction, ICallExpression, IExportDeclaration, IIdentifierMap, IImportDeclaration, IMutationDeclaration, INewExpression, ResolvedIIdentifierValueMap, ResolvedSerializedIIdentifierValueMap, VariableIndexer} from "../identifier/interface/IIdentifier";

/**
 * A service that parses and reflects on the AST generated by Typescript's language service.
 * With it, we can extract metadata such as initialization values and types, arguments and import
 * declarations.
 * @author Frederik Wessberg
 */
export class CodeAnalyzer implements ICodeAnalyzer {

	constructor(options?: ICodeAnalyzerConstructorOptions) {
		if (options != null) this.excludeFiles(options.excludeFiles);
	}

	public excludeFiles (match: RegExp|RegExp[]|Set<RegExp>): void {
		filePathUtil.exclude(match);
	}

	public addFile (fileName: string, content: string, version?: number): NodeArray<Statement> {
		return languageService.addFile(fileName, content, version);
	}

	public getExportDeclarationsForFile (fileName: string, deep: boolean = false): IExportDeclaration[] {
		return exportDeclarationGetter.getForFile(fileName, deep);
	}

	public getExportDeclarations (statements: (Statement|Expression|Node)[], deep: boolean = false): IExportDeclaration[] {
		return exportDeclarationGetter.getForStatements(statements, deep);
	}

	/**
	 * Gets and formats all CallExpressions associated with the given file.
	 * These hold information such as the arguments the members are invoked with, generic type
	 * arguments and such.
	 * @param {string} fileName
	 * @param {boolean} [deep=false]
	 * @returns {ICallExpression[]}
	 */
	public getCallExpressionsForFile (fileName: string, deep: boolean = false): ICallExpression[] {
		return callExpressionGetter.getForFile(fileName, deep);
	}

	/**
	 * Returns true if the given array of statements contains at least statement of the given kind.
	 * @param {(Statement|Expression|Node)[]} statements
	 * @param {SyntaxKind} kind
	 * @param {boolean} [deep=false]
	 * @returns {boolean}
	 */
	public statementsIncludeKind (statements: (Statement|Expression|Node)[], kind: SyntaxKind, deep: boolean = false): boolean {
		for (const statement of statements) {
			if (statement.kind === kind) return true;
			if (deep) {
				const childMatch = this.statementsIncludeKind(childStatementGetter.get(statement), kind, deep);
				if (childMatch) return true;
			}
		}
		return false;
	}

	/**
	 * Gets and formats all CallExpressions associated with the given statements.
	 * These hold information such as the arguments the members are invoked with, generic type
	 * arguments and such.
	 * @param {(Statement|Expression|Node)[]} statements
	 * @param {boolean} [deep=false]
	 * @returns {ICallExpression[]}
	 */
	public getCallExpressions (statements: (Statement|Expression|Node)[], deep: boolean = false): ICallExpression[] {
		return callExpressionGetter.getForStatements(statements, deep);
	}

	/**
	 * Gets and formats all NewExpressions associated with the given file.
	 * These hold information such as the arguments the constructor is invoked with, generic type
	 * arguments and such.
	 * @param {string} fileName
	 * @param {boolean} [deep=false]
	 * @returns {INewExpression[]}
	 */
	public getNewExpressionsForFile (fileName: string, deep: boolean = false): INewExpression[] {
		return newExpressionGetter.getForFile(fileName, deep);
	}

	/**
	 * Gets and formats all NewExpressions associated with the given statements.
	 * These hold information such as the arguments the constructor is invoked with, generic type
	 * arguments and such.
	 * @param {(Statement | Expression | Node)[]} statements
	 * @param {boolean} [deep=false]
	 * @returns {INewExpression[]}
	 */
	public getNewExpressions (statements: (Statement|Expression|Node)[], deep: boolean = false): INewExpression[] {
		return newExpressionGetter.getForStatements(statements, deep);
	}

	/**
	 * Gets a map of all identifiers for the given file and their resolved serialized values.
	 * @param {string} fileName
	 * @param {boolean} [deep=false]
	 * @returns {ResolvedSerializedIIdentifierValueMap}
	 */
	public getResolvedSerializedIdentifierValuesForFile (fileName: string, deep: boolean = false): ResolvedSerializedIIdentifierValueMap {
		return resolvedSerializedIdentifierValueGetter.getForFile(fileName, deep);
	}

	/**
	 * Gets a map of all identifiers for the given statements and their resolved serialized values.
	 * @param {(Statement|Expression|Node)[]} statements
	 * @param {boolean} [deep=false]
	 * @returns {ResolvedSerializedIIdentifierValueMap}
	 */
	public getResolvedSerializedIdentifierValues (statements: (Statement|Expression|Node)[], deep: boolean = false): ResolvedSerializedIIdentifierValueMap {
		return resolvedSerializedIdentifierValueGetter.getForStatements(statements, deep);
	}

	/**
	 * Gets a map of all identifiers for the given file and their resolved values.
	 * @param {string} fileName
	 * @param {boolean} [deep=false]
	 * @returns {ResolvedIIdentifierValueMap}
	 */
	public getResolvedIdentifierValuesForFile (fileName: string, deep: boolean = false): ResolvedIIdentifierValueMap {
		return resolvedIdentifierValueGetter.getForFile(fileName, deep);
	}

	/**
	 * Gets a map of all identifiers for the given statements and their resolved values.
	 * @param {(Statement|Expression|Node)[]} statements
	 * @param {boolean} [deep=false]
	 * @returns {ResolvedIIdentifierValueMap}
	 */
	public getResolvedIdentifierValues (statements: (Statement|Expression|Node)[], deep: boolean = false): ResolvedIIdentifierValueMap {
		return resolvedIdentifierValueGetter.getForStatements(statements, deep);
	}

	/**
	 * Gets all function declarations (if any) that occurs in the given file
	 * and returns them in a FunctionIndexer. If 'deep' is true, it will walk through the Statements recursively.
	 * @param {string} fileName
	 * @param {boolean} [deep=false]
	 * @returns {FunctionIndexer}
	 */
	public getFunctionDeclarationsForFile (fileName: string, deep: boolean = false): FunctionIndexer {
		return functionDeclarationGetter.getForFile(fileName, deep);
	}

	/**
	 * Gets all function declarations (if any) that occurs in the given array of statements
	 * and returns them in a FunctionIndexer. If 'deep' is true, it will walk through the Statements recursively.
	 * @param {(Statement|Expression|Node)[]} statements
	 * @param {boolean} [deep=false]
	 * @returns {FunctionIndexer}
	 */
	public getFunctionDeclarations (statements: (Statement|Expression|Node)[], deep: boolean = false): FunctionIndexer {
		return functionDeclarationGetter.getForStatements(statements, deep);
	}

	/**
	 * Gets all enum declarations (if any) that occurs in the given file
	 * and returns them in a EnumIndexer. If 'deep' is true, it will walk through the Statements recursively.
	 * @param {string} fileName
	 * @param {boolean} [deep=false]
	 * @returns {EnumIndexer}
	 */
	public getEnumDeclarationsForFile (fileName: string, deep: boolean = false): EnumIndexer {
		return enumDeclarationGetter.getForFile(fileName, deep);
	}

	/**
	 * Gets all enum declarations (if any) that occurs in the given array of statements
	 * and returns them in a EnumIndexer. If 'deep' is true, it will walk through the Statements recursively.
	 * @param {(Statement|Expression|Node)[]} statements
	 * @param {boolean} [deep=false]
	 * @returns {EnumIndexer}
	 */
	public getEnumDeclarations (statements: (Statement|Expression|Node)[], deep: boolean = false): EnumIndexer {
		return enumDeclarationGetter.getForStatements(statements, deep);
	}

	/**
	 * Gets all identifiers (such as variables, functions, classes, enums, imports, exports, etc) (if any) that occurs in the given file
	 * and returns them in a VariableIndexer. If 'deep' is true, it will walk through the Statements recursively.
	 * @param {string} fileName
	 * @param {boolean} [deep=false]
	 * @returns {IIdentifierMap}
	 */
	public getAllIdentifiersForFile (fileName: string, deep: boolean = false): IIdentifierMap {
		return allIdentifiersGetter.getForFile(fileName, deep);
	}

	/**
	 * Gets all identifiers (such as variables, functions, classes, enums, imports, exports, etc) (if any) that occurs in the given array of statements
	 * and returns them in a IIdentifierMap. If 'deep' is true, it will walk through the Statements recursively.
	 * @param {(Statement|Expression|Node)[]} statements
	 * @param {boolean} [deep=false]
	 * @returns {IIdentifierMap}
	 */
	public getAllIdentifiers (statements: (Statement|Expression|Node)[], deep: boolean = false): IIdentifierMap {
		return allIdentifiersGetter.getForStatements(statements, deep);
	}

	/**
	 * Gets all variable assignments (if any) that occurs in the given file
	 * and returns them in a VariableIndexer. If 'deep' is true, it will walk through the Statements recursively.
	 * @param {string} fileName
	 * @param {boolean} [deep=false]
	 * @returns {VariableIndexer}
	 */
	public getVariableDeclarationsForFile (fileName: string, deep: boolean = false): VariableIndexer {
		return variableDeclarationGetter.getForFile(fileName, deep);
	}

	/**
	 * Gets all variable assignments (if any) that occurs in the given array of statements
	 * and returns them in a VariableIndexer. If 'deep' is true, it will walk through the Statements recursively.
	 * @param {(Statement|Expression|Node)[]} statements
	 * @param {boolean} [deep=false]
	 * @returns {VariableIndexer}
	 */
	public getVariableDeclarations (statements: (Statement|Expression|Node)[], deep: boolean = false): VariableIndexer {
		return variableDeclarationGetter.getForStatements(statements, deep);
	}

	/**
	 * Gets all class declarations (if any) that occurs in the given file
	 * and returns them as a ClassIndexer.
	 * @param {string} fileName
	 * @param {boolean} [deep=false]
	 * @returns {ClassIndexer}
	 */
	public getClassDeclarationsForFile (fileName: string, deep: boolean = false): ClassIndexer {
		return classDeclarationGetter.getForFile(fileName, deep);
	}

	/**
	 * Gets all class declarations (if any) that occurs in the given array of statements
	 * and returns them as a ClassIndexer.
	 * @param {(Statement|Expression|Node)[]} statements
	 * @param {boolean} [deep=false]
	 * @returns {ClassIndexer}
	 */
	public getClassDeclarations (statements: (Statement|Expression|Node)[], deep: boolean = false): ClassIndexer {
		return classDeclarationGetter.getForStatements(statements, deep);
	}

	/**
	 * Gets and returns all ArrowFunctions (if any) that occur in the given file
	 * @param {string} fileName
	 * @param {boolean} [deep=false]
	 * @returns {IArrowFunction[]}
	 */
	public getArrowFunctionsForFile (fileName: string, deep: boolean = false): IArrowFunction[] {
		return arrowFunctionGetter.getForFile(fileName, deep);
	}

	/**
	 * Gets and returns all ArrowFunctions (if any) that occur in the given array of statements.
	 * @param {(Statement|Expression|Node)[]} statements
	 * @param {boolean} [deep=false]
	 * @returns {IArrowFunction[]}
	 */
	public getArrowFunctions (statements: (Statement|Expression|Node)[], deep: boolean = false): IArrowFunction[] {
		return arrowFunctionGetter.getForStatements(statements, deep);
	}

	/**
	 * Gets and returns all ImportDeclarations (if any) that occur in the given file
	 * @param {string} fileName
	 * @param {boolean} [deep=false]
	 * @returns {IImportDeclaration[]}
	 */
	public getImportDeclarationsForFile (fileName: string, deep: boolean = false): IImportDeclaration[] {
		return importDeclarationGetter.getForFile(fileName, deep);
	}

	/**
	 * Gets and returns all ImportDeclarations (if any) that occur in the given array of statements.
	 * @param {(Statement|Expression|Node)[]} statements
	 * @param {boolean} [deep=false]
	 * @returns {IImportDeclaration[]}
	 */
	public getImportDeclarations (statements: (Statement|Expression|Node)[], deep: boolean = false): IImportDeclaration[] {
		return importDeclarationGetter.getForStatements(statements, deep);
	}

	/**
	 * Tracks all BinaryExpressions in the given file, checks if they assign new values to identifiers and returns an array of IMutationDeclarations.
	 * @param {string} fileName
	 * @param {boolean} [deep=false]
	 * @returns {IMutationDeclaration[]}
	 */
	public getMutationsForFile (fileName: string, deep: boolean = false): IMutationDeclaration[] {
		return mutationGetter.getForFile(fileName, deep);
	}

	/**
	 * Tracks all BinaryExpressions in the given array of statements, checks if they assign new values to identifiers and returns an array of IMutationDeclarations.
	 * @param {(Statement|Expression|Node)[]} statements
	 * @param {boolean} [deep=false]
	 * @returns {IExportDeclaration[]}
	 */
	public getMutations (statements: (Statement|Expression|Node)[], deep: boolean = false): IMutationDeclaration[] {
		return mutationGetter.getForStatements(statements, deep);
	}

	/**
	 * Gets the member name for call expression.
	 * @param {CallExpression} statement
	 * @returns {string}
	 */
	private getCallExpressionMemberName (statement: CallExpression): string {
		if (isIdentifierObject(statement.expression)) return statement.expression.text;
		throw new TypeError(`${this.getCallExpressionMemberName.name} could not get the name for an expression!`);
	}
}