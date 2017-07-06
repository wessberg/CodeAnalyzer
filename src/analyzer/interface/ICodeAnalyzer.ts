import {Expression, Node, NodeArray, Statement, SyntaxKind} from "typescript";
import {ClassIndexer, EnumIndexer, FunctionIndexer, IArrowFunction, ICallExpression, IExportDeclaration, IIdentifierMap, IImportDeclaration, IMutationDeclaration, INewExpression, ResolvedIIdentifierValueMap, ResolvedSerializedIIdentifierValueMap, VariableIndexer} from "../../identifier/interface/IIdentifier";

export interface ICodeAnalyzerConstructorOptions {
	excludeFiles: RegExp|RegExp[]|Set<RegExp>;
}

export interface ICodeAnalyzer {
	addFile (fileName: string, content: string, version?: number): NodeArray<Statement>;
	statementsIncludeKind (statements: (Statement|Expression|Node)[], kind: SyntaxKind, deep?: boolean): boolean;
	getClassDeclarations(statements: (Statement|Expression|Node)[], deep?: boolean): ClassIndexer;
	getClassDeclarationsForFile(fileName: string, deep?: boolean): ClassIndexer;
	getAllIdentifiers(statements: (Statement|Expression|Node)[], deep?: boolean): IIdentifierMap;
	getAllIdentifiersForFile(fileName: string, deep?: boolean): IIdentifierMap;
	getVariableDeclarations(statements: (Statement|Expression|Node)[], deep?: boolean): VariableIndexer;
	getVariableDeclarationsForFile(fileName: string, deep?: boolean): VariableIndexer;
	getEnumDeclarations(statements: (Statement|Expression|Node)[], deep?: boolean): EnumIndexer;
	getEnumDeclarationsForFile(fileName: string, deep?: boolean): EnumIndexer;
	getFunctionDeclarations(statements: (Statement|Expression|Node)[], deep?: boolean): FunctionIndexer;
	getFunctionDeclarationsForFile(fileName: string, deep?: boolean): FunctionIndexer;
	getImportDeclarationsForFile (fileName: string, deep?: boolean): IImportDeclaration[];
	getImportDeclarations(statements: (Statement|Expression|Node)[], deep?: boolean): IImportDeclaration[];
	getExportDeclarationsForFile (fileName: string, deep?: boolean): IExportDeclaration[];
	getExportDeclarations (statements: (Statement|Expression|Node)[], deep?: boolean): IExportDeclaration[];
	getArrowFunctionsForFile (fileName: string, deep?: boolean): IArrowFunction[];
	getArrowFunctions (statements: (Statement|Expression|Node)[], deep?: boolean): IArrowFunction[];
	getCallExpressions(statements: (Statement|Expression|Node)[], deep?: boolean): ICallExpression[];
	getCallExpressionsForFile(fileName: string, deep?: boolean): ICallExpression[];
	getNewExpressions(statements: (Statement|Expression|Node)[], deep?: boolean): INewExpression[];
	getNewExpressionsForFile(fileName: string, deep?: boolean): INewExpression[];
	getResolvedSerializedIdentifierValuesForFile (fileName: string, deep?: boolean): ResolvedSerializedIIdentifierValueMap;
	getResolvedSerializedIdentifierValues (statements: (Statement|Expression|Node)[], deep?: boolean): ResolvedSerializedIIdentifierValueMap;
	getResolvedIdentifierValuesForFile (fileName: string, deep?: boolean): ResolvedIIdentifierValueMap;
	getResolvedIdentifierValues (statements: (Statement|Expression|Node)[], deep?: boolean): ResolvedIIdentifierValueMap;
	getMutationsForFile (fileName: string, deep?: boolean): IMutationDeclaration[];
	getMutations (statements: (Statement|Expression|Node)[], deep?: boolean): IMutationDeclaration[];
}