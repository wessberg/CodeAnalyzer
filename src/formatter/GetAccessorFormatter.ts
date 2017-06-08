import {GetAccessorDeclaration} from "typescript";
import {INameGetter} from "../getter/interface/INameGetter";
import {ISourceFilePropertiesGetter} from "../getter/interface/ISourceFilePropertiesGetter";
import {isStaticKeyword} from "../predicate/PredicateFunctions";
import {IdentifierMapKind, IGetAccessorDeclaration} from "../service/interface/ICodeAnalyzer";
import {FunctionLikeFormatter} from "./FunctionLikeFormatter";
import {IDecoratorsFormatter} from "./interface/IDecoratorsFormatter";
import {IModifiersFormatter} from "./interface/IModifiersFormatter";
import {IParametersFormatter} from "./interface/IParametersFormatter";
import {IValueableFormatter} from "./interface/IValueableFormatter";
import {IGetAccessorFormatter} from "./interface/IGetAccessorFormatter";

export class GetAccessorFormatter extends FunctionLikeFormatter implements IGetAccessorFormatter {

	constructor (private nameGetter: INameGetter,
							 sourceFilePropertiesGetter: ISourceFilePropertiesGetter,
							 decoratorsFormatter: IDecoratorsFormatter,
							 modifiersFormatter: IModifiersFormatter,
							 parametersFormatter: IParametersFormatter,
							 valueableFormatter: IValueableFormatter) {
		super(sourceFilePropertiesGetter, decoratorsFormatter, modifiersFormatter, parametersFormatter, valueableFormatter);
	}

	/**
	 * Takes a GetAccessorDeclaration and returns an IGetAccessorDeclaration.
	 * @param {GetAccessorDeclaration} declaration
	 * @param {string} className
	 * @returns {IGetAccessorDeclaration}
	 */
	format (declaration: GetAccessorDeclaration, className: string): IGetAccessorDeclaration {
		const name = <string>this.nameGetter.getNameOfMember(declaration.name, false, true);

		const isStatic = declaration.modifiers == null ? false : declaration.modifiers.find(modifier => isStaticKeyword(modifier)) != null;
		const filePath = this.sourceFilePropertiesGetter.getSourceFileProperties(declaration).filePath;

		const map: IGetAccessorDeclaration = {
			...this.formatFunctionLikeDeclaration(declaration),
			...{
				___kind: IdentifierMapKind.METHOD,
				isStatic,
				name,
				className,
				filePath,
				value: this.valueableFormatter.format(declaration, undefined, declaration.body)
			}
		};

		// Make the kind non-enumerable.
		Object.defineProperty(map, "___kind", {
			value: IdentifierMapKind.GET_ACCESSOR,
			enumerable: false
		});
		return map;
	}

}