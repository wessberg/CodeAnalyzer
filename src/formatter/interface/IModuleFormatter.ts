export interface IModuleFormatter {
	resolvePath (filePath: string): string;
	normalizeExtension (filePath: string): string;
}