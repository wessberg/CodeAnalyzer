import {IImportClauseDict} from "../import-clause/i-import-clause-dict";

export interface IImportDict extends IImportClauseDict {
	path: string;
}