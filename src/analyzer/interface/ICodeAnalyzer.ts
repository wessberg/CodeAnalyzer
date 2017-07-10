import {Expression, Node, NodeArray, Statement, SyntaxKind} from "typescript";
import {IArrowFunction, ICallExpression, IClassIndexer, IEnumIndexer, IExportDeclaration, IFunctionIndexer, IIdentifierMap, IImportDeclaration, IMutationDeclaration, INewExpression, IResolvedIIdentifierValueMap, IResolvedSerializedIIdentifierValueMap, IVariableIndexer} from "../../identifier/interface/IIdentifier";

export interface ICodeAnalyzerConstructorOptions {
	excludeFiles: RegExp|RegExp[]|Set<RegExp>;
}

export interface ICodeAnalyzer {
	excludeFiles (match: RegExp|RegExp[]|Set<RegExp>): void;
	addFile (fileName: string, content: string, version?: number): NodeArray<Statement>;
	statementsIncludeKind (statements: (Statement|Expression|Node)[], kind: SyntaxKind, deep?: boolean): boolean;
	getClassDeclarations (statements: (Statement|Expression|Node)[], deep?: boolean): IClassIndexer;
	getClassDeclarationsForFile (fileName: string, deep?: boolean): IClassIndexer;
	getAllIdentifiers (statements: (Statement|Expression|Node)[], deep?: boolean): IIdentifierMap;
	getAllIdentifiersForFile (fileName: string, deep?: boolean): IIdentifierMap;
	getVariableDeclarations (statements: (Statement|Expression|Node)[], deep?: boolean): IVariableIndexer;
	getVariableDeclarationsForFile (fileName: string, deep?: boolean): IVariableIndexer;
	getEnumDeclarations (statements: (Statement|Expression|Node)[], deep?: boolean): IEnumIndexer;
	getEnumDeclarationsForFile (fileName: string, deep?: boolean): IEnumIndexer;
	getFunctionDeclarations (statements: (Statement|Expression|Node)[], deep?: boolean): IFunctionIndexer;
	getFunctionDeclarationsForFile (fileName: string, deep?: boolean): IFunctionIndexer;
	getImportDeclarationsForFile (fileName: string, deep?: boolean): IImportDeclaration[];
	getImportDeclarations (statements: (Statement|Expression|Node)[], deep?: boolean): IImportDeclaration[];
	getExportDeclarationsForFile (fileName: string, deep?: boolean): IExportDeclaration[];
	getExportDeclarations (statements: (Statement|Expression|Node)[], deep?: boolean): IExportDeclaration[];
	getArrowFunctionsForFile (fileName: string, deep?: boolean): IArrowFunction[];
	getArrowFunctions (statements: (Statement|Expression|Node)[], deep?: boolean): IArrowFunction[];
	getCallExpressions (statements: (Statement|Expression|Node)[], deep?: boolean): ICallExpression[];
	getCallExpressionsForFile (fileName: string, deep?: boolean): ICallExpression[];
	getNewExpressions (statements: (Statement|Expression|Node)[], deep?: boolean): INewExpression[];
	getNewExpressionsForFile (fileName: string, deep?: boolean): INewExpression[];
	getResolvedSerializedIdentifierValuesForFile (fileName: string, deep?: boolean): IResolvedSerializedIIdentifierValueMap;
	getResolvedSerializedIdentifierValues (statements: (Statement|Expression|Node)[], deep?: boolean): IResolvedSerializedIIdentifierValueMap;
	getResolvedIdentifierValuesForFile (fileName: string, deep?: boolean): IResolvedIIdentifierValueMap;
	getResolvedIdentifierValues (statements: (Statement|Expression|Node)[], deep?: boolean): IResolvedIIdentifierValueMap;
	getMutationsForFile (fileName: string, deep?: boolean): IMutationDeclaration[];
	getMutations (statements: (Statement|Expression|Node)[], deep?: boolean): IMutationDeclaration[];
}