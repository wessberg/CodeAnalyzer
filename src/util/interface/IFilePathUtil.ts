export interface IFilePathUtil {
	exclude(path: RegExp|RegExp[]|Set<RegExp>): void;
	isExcluded(path: string): boolean;
}