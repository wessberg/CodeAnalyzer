import {INamedImportDict} from "../named-import/i-named-import-dict";

export interface IImportClauseDict {
	namedImports: Iterable<INamedImportDict>|null;
	namespace: string|null;
	defaultName: string|null;
}