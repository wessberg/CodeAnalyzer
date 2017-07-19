import {IFilePathUtil} from "./interface/IFilePathUtil";

/**
 * A class that can exclude files from being parsed/traversed by the CodeAnalyzer.
 */
export class FilePathUtil implements IFilePathUtil {
	/**
	 * A Set of regular expressions that, if matched, excludes a given filepath from being parsed/traversed.
	 * @type {Set<RegExp>}
	 */
	private readonly excludedFiles: Set<RegExp> = new Set();

	/**
	 * Excludes paths matched by the given regular expression(s) from the service.
	 * @param {RegExp | RegExp[] | Set<RegExp>} path
	 */
	public exclude (path: RegExp|RegExp[]|Set<RegExp>): void {
		if (path instanceof RegExp) this.excludedFiles.add(path);
		else [...path].forEach(item => this.excludedFiles.add(item));
	}

	/**
	 * Returns true if the given path is matched by any of the regular expressions that, if matched, excludes files from being parsed/traversed by the service.
	 * @param {string} path
	 * @returns {boolean}
	 */
	public isExcluded (path: string): boolean {
		return [...this.excludedFiles].some(regex => regex.test(path));
	}

}