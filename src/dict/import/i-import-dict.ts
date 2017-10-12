import {INamedImportDict} from "./i-named-import-dict";

export interface IImportDict {
	path: string;
	namedImports: Iterable<INamedImportDict>|null;
	namespace: string|null;
	defaultName: string|null;
}