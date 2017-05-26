import {IDecoratorsFormatter} from "src/formatter/interface/IDecoratorsFormatter";
import {ISourceFilePropertiesGetter} from "src/getter/interface/ISourceFilePropertiesGetter";
import {ArrowFunction} from "typescript";
import {IMapper} from "../mapper/interface/IMapper";
import {IArrowFunction, IdentifierMapKind} from "../service/interface/ICodeAnalyzer";
import {FunctionLikeFormatter} from "./FunctionLikeFormatter";
import {IArrowFunctionFormatter} from "./interface/IArrowFunctionFormatter";
import {IModifiersFormatter} from "./interface/IModifiersFormatter";
import {IParametersFormatter} from "./interface/IParametersFormatter";
import {IValueableFormatter} from "./interface/IValueableFormatter";

export class ArrowFunctionFormatter extends FunctionLikeFormatter implements IArrowFunctionFormatter {

	constructor (private mapper: IMapper,
							 sourceFilePropertiesGetter: ISourceFilePropertiesGetter,
							 decoratorsFormatter: IDecoratorsFormatter,
							 modifiersFormatter: IModifiersFormatter,
							 parametersFormatter: IParametersFormatter,
							 valueableFormatter: IValueableFormatter) {
		super(sourceFilePropertiesGetter, decoratorsFormatter, modifiersFormatter, parametersFormatter, valueableFormatter);
	}

	/**
	 * Takes a ArrowFunction and returns an IArrowFunction.
	 * @param {ArrowFunction} arrowFunction
	 * @returns {IArrowFunction}
	 */
	public format (arrowFunction: ArrowFunction): IArrowFunction {
		const filePath = this.sourceFilePropertiesGetter.getSourceFileProperties(arrowFunction).filePath;

		const map: IArrowFunction = {
			...this.formatFunctionLikeDeclaration(arrowFunction),
			...{
				___kind: IdentifierMapKind.ARROW_FUNCTION,
				filePath,
				value: this.valueableFormatter.format(arrowFunction, undefined, arrowFunction.body)
			}
		};

		// Make the kind non-enumerable.
		Object.defineProperty(map, "___kind", {
			value: IdentifierMapKind.ARROW_FUNCTION,
			enumerable: false
		});
		this.mapper.set(map, arrowFunction);
		return map;
	}
}