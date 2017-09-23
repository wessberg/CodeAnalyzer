import {Identifier, NamedImports, NamespaceImport, StringLiteral} from "typescript";

export interface IImportDict {
	path: string|StringLiteral;
	namedImports: Iterable<string>|null|NamedImports;
	namespace: string|null|NamespaceImport;
	defaultName: string|null|Identifier;
}