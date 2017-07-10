import {VariableDeclaration, VariableDeclarationList, VariableStatement} from "typescript";
import {IVariableIndexer} from "../../identifier/interface/IIdentifier";

export interface IVariableFormatter {
	format (statement: VariableStatement|VariableDeclarationList|VariableDeclaration): IVariableIndexer;
}