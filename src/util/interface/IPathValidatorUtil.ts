export interface IPathValidatorUtil {
	isBlacklisted(path: string): boolean;
	isBuiltIn(path: string): boolean;
}