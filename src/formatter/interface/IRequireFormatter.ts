import {CallExpression, ExternalModuleReference, VariableDeclaration, VariableDeclarationList, VariableStatement} from "typescript";
import {IModuleFormatter} from "./IModuleFormatter";
import {ICallExpression, IRequire} from "../../identifier/interface/IIdentifier";

export interface IRequireFormatter extends IModuleFormatter {
	format (declaration: CallExpression|VariableStatement|VariableDeclaration|VariableDeclarationList|ExternalModuleReference|ICallExpression): IRequire|null;
}