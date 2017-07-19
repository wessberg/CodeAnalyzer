import {ArrowFunction} from "typescript";
import {FunctionLikeFormatter} from "./FunctionLikeFormatter";
import {IArrowFunctionFormatter} from "./interface/IArrowFunctionFormatter";
import {identifierUtil, mapper, sourceFilePropertiesGetter, valueableFormatter} from "../services";
import {IArrowFunction, IdentifierMapKind} from "../identifier/interface/IIdentifier";

/**
 * A class that can format any kind of relevant statement into an IArrowFunction
 */
export class ArrowFunctionFormatter extends FunctionLikeFormatter implements IArrowFunctionFormatter {

	/**
	 * Takes a ArrowFunction and returns an IArrowFunction.
	 * @param {ArrowFunction} arrowFunction
	 * @returns {IArrowFunction}
	 */
	public format (arrowFunction: ArrowFunction): IArrowFunction {
		const filePath = sourceFilePropertiesGetter.getSourceFileProperties(arrowFunction).filePath;

		const map: IArrowFunction = identifierUtil.setKind({
			...this.formatFunctionLikeDeclaration(arrowFunction),
			...{
				___kind: IdentifierMapKind.ARROW_FUNCTION,
				filePath,
				value: valueableFormatter.format(arrowFunction, undefined, arrowFunction.body)
			}
		}, IdentifierMapKind.ARROW_FUNCTION);

		mapper.set(map, arrowFunction);
		return map;
	}
}