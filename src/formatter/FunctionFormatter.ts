import {FunctionDeclaration} from "typescript";
import {config} from "../static/Config";
import {FunctionLikeFormatter} from "./FunctionLikeFormatter";
import {IFunctionFormatter} from "./interface/IFunctionFormatter";
import {cache, identifierUtil, mapper, nameGetter, sourceFilePropertiesGetter, valueableFormatter} from "../services";
import {IdentifierMapKind, IFunctionDeclaration} from "../identifier/interface/IIdentifier";

/**
 * A class that can format any kind of relevant statement into an IFunctionDeclaration
 */
export class FunctionFormatter extends FunctionLikeFormatter implements IFunctionFormatter {

	/**
	 * Takes a FunctionDeclaration and returns an IFunctionDeclaration.
	 * @param {FunctionDeclaration} declaration
	 * @returns {IFunctionDeclaration}
	 */
	public format (declaration: FunctionDeclaration): IFunctionDeclaration {
		const name = declaration.name == null ? config.name.anonymous : <string>nameGetter.getNameOfMember(declaration.name, false, true);
		const filePath = sourceFilePropertiesGetter.getSourceFileProperties(declaration).filePath;

		const cached = cache.getCachedFunction(filePath, name);
		if (cached != null && !cache.cachedFunctionNeedsUpdate(cached.content)) return cached.content;

		const map: IFunctionDeclaration = identifierUtil.setKind({
			...this.formatFunctionLikeDeclaration(declaration),
			...{
				___kind: IdentifierMapKind.FUNCTION,
				name,
				filePath,
				value: valueableFormatter.format(declaration, undefined, declaration.body)
			}
		}, IdentifierMapKind.FUNCTION);

		mapper.set(map, declaration);
		cache.setCachedFunction(filePath, map);
		return map;
	}
}