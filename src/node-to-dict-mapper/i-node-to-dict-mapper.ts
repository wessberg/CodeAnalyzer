import {ImportClause, ImportSpecifier} from "typescript";
import {IImportClauseDict} from "../dict/import-clause/i-import-clause-dict";
import {INamedImportDict} from "../dict/named-import/i-named-import-dict";

export interface INodeToDictMapper {
	toImportClauseDict (node: ImportClause|undefined): IImportClauseDict|undefined;
	toNamedImportDict (node: ImportSpecifier|undefined): INamedImportDict|undefined;
}