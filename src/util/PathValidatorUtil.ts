import {IPathValidatorUtil} from "./interface/IPathValidatorUtil";
import {PathValidator} from "@wessberg/compiler-common";

export class PathValidatorUtil implements IPathValidatorUtil {
	private static readonly pathValidator = new PathValidator();

	public isBlacklisted (path: string): boolean {
		return PathValidatorUtil.pathValidator.isBlacklisted(path);
	}

	public isBuiltIn (path: string): boolean {
		return PathValidatorUtil.pathValidator.isBuiltIn(path);
	}

}