import {IFilePathUtil} from "./interface/IFilePathUtil";

export class FilePathUtil implements IFilePathUtil {
	private readonly excludedFiles: Set<RegExp> = new Set();

	public exclude (path: RegExp|RegExp[]|Set<RegExp>): void {
		if (path instanceof RegExp) this.excludedFiles.add(path);
		else [...path].forEach(item => this.excludedFiles.add(item));
	}

	public isExcluded (path: string): boolean {
		return [...this.excludedFiles].some(regex => regex.test(path));
	}

}