import {VariableDeclaration, VariableDeclarationList, VariableStatement} from "typescript";
import {VariableIndexer} from "../../identifier/interface/IIdentifier";

export interface IVariableFormatter {
	format (statement: VariableStatement|VariableDeclarationList|VariableDeclaration): VariableIndexer;
}