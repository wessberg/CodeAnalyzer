import {INamedImportExportDict} from "../named-import-export/i-named-import-export-dict";

export interface IImportClauseDict {
	namedImports: Iterable<INamedImportExportDict>|null;
	namespace: string|null;
	defaultName: string|null;
}