import {VariableDeclaration, VariableDeclarationList, VariableStatement} from "typescript";
import {VariableIndexer} from "../../service/interface/ISimpleLanguageService";

export interface IVariableFormatter {
	format (statement: VariableStatement | VariableDeclarationList | VariableDeclaration): VariableIndexer;
}