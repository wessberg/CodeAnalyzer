import {IDecoratorsFormatter} from "src/formatter/interface/IDecoratorsFormatter";
import {ISourceFilePropertiesGetter} from "src/getter/interface/ISourceFilePropertiesGetter";
import {FunctionDeclaration} from "typescript";
import {ICache} from "../cache/interface/ICache";
import {INameGetter} from "../getter/interface/INameGetter";
import {IMapper} from "../mapper/interface/IMapper";
import {IdentifierMapKind, IFunctionDeclaration} from "../service/interface/ICodeAnalyzer";
import {Config} from "../static/Config";
import {FunctionLikeFormatter} from "./FunctionLikeFormatter";
import {IFunctionFormatter} from "./interface/IFunctionFormatter";
import {IModifiersFormatter} from "./interface/IModifiersFormatter";
import {IParametersFormatter} from "./interface/IParametersFormatter";
import {IValueableFormatter} from "./interface/IValueableFormatter";

export class FunctionFormatter extends FunctionLikeFormatter implements IFunctionFormatter {

	constructor (private mapper: IMapper,
							 private cache: ICache,
							 private nameGetter: INameGetter,
							 sourceFilePropertiesGetter: ISourceFilePropertiesGetter,
							 decoratorsFormatter: IDecoratorsFormatter,
							 modifiersFormatter: IModifiersFormatter,
							 parametersFormatter: IParametersFormatter,
							 valueableFormatter: IValueableFormatter) {
		super(sourceFilePropertiesGetter, decoratorsFormatter, modifiersFormatter, parametersFormatter, valueableFormatter);
	}

	/**
	 * Takes a FunctionDeclaration and returns an IFunctionDeclaration.
	 * @param {FunctionDeclaration} declaration
	 * @returns {IFunctionDeclaration}
	 */
	public format (declaration: FunctionDeclaration): IFunctionDeclaration {
		const name = declaration.name == null ? Config.name.anonymous : <string>this.nameGetter.getNameOfMember(declaration.name, false, true);
		const filePath = this.sourceFilePropertiesGetter.getSourceFileProperties(declaration).filePath;

		const cached = this.cache.getCachedFunction(filePath, name);
		if (cached != null && !this.cache.cachedFunctionNeedsUpdate(cached.content)) return cached.content;

		const map: IFunctionDeclaration = {
			...this.formatFunctionLikeDeclaration(declaration),
			...{
				___kind: IdentifierMapKind.FUNCTION,
				name,
				filePath,
				value: this.valueableFormatter.format(declaration, undefined, declaration.body)
			}
		};

		// Make the kind non-enumerable.
		Object.defineProperty(map, "___kind", {
			value: IdentifierMapKind.FUNCTION,
			enumerable: false
		});
		this.mapper.set(map, declaration);
		this.cache.setCachedFunction(filePath, map);
		return map;
	}
}