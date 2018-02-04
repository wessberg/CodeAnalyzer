import {INamedImportExportCtor} from "../named-import-export/i-named-import-export-ctor";

export interface IImportClauseCtor {
	namedImports: INamedImportExportCtor[]|null;
	namespace: string|null;
	defaultName: string|null;
}