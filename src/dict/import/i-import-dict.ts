import {Identifier, NamedImports, NamespaceImport, StringLiteral} from "typescript";
import {INamedImportDict} from "./i-named-import-dict";

export interface IImportDict {
	path: string|StringLiteral;
	namedImports: Iterable<INamedImportDict>|null|NamedImports;
	namespace: string|null|NamespaceImport;
	defaultName: string|null|Identifier;
}