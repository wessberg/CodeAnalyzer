import {INamedImportExportCtor} from "../named-import-export/i-named-import-export-ctor";

export interface IImportClauseCtor {
	namedImports: Iterable<INamedImportExportCtor>|null;
	namespace: string|null;
	defaultName: string|null;
}