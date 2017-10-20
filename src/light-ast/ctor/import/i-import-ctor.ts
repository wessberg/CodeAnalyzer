import {IImportClauseCtor} from "../import-clause/i-import-clause-ctor";

export interface IImportCtor extends IImportClauseCtor {
	path: string;
}