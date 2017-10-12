import {NamespaceImport} from "typescript";

export interface INamespaceImportService {
	getNameOfNamespace (namespaceImport: NamespaceImport): string;
	changeNameOfNamespace (name: string, namespaceImport: NamespaceImport): NamespaceImport;
}