import {LanguageServiceHost, NodeArray, Statement} from "typescript";

export interface ILanguageService extends LanguageServiceHost {
	addFile (fileName: string, content: string, version?: number): NodeArray<Statement>;
	getFile (fileName: string): NodeArray<Statement>|null;
	removeFile (fileName: string): void;
	toAST (code: string): NodeArray<Statement>;
	getFileVersion (filePath: string): number;
}