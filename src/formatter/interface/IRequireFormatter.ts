import {CallExpression, ExternalModuleReference, VariableDeclaration, VariableDeclarationList, VariableStatement} from "typescript";
import {ICallExpression, IRequire} from "../../service/interface/ICodeAnalyzer";
import {IModuleFormatter} from "./IModuleFormatter";

export interface IRequireFormatter extends IModuleFormatter {
	format (declaration: CallExpression|VariableStatement|VariableDeclaration|VariableDeclarationList|ExternalModuleReference|ICallExpression): IRequire|null;
}