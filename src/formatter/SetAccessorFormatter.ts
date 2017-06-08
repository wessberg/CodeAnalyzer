import {SetAccessorDeclaration} from "typescript";
import {INameGetter} from "../getter/interface/INameGetter";
import {ISourceFilePropertiesGetter} from "../getter/interface/ISourceFilePropertiesGetter";
import {isStaticKeyword} from "../predicate/PredicateFunctions";
import {IdentifierMapKind, ISetAccessorDeclaration} from "../service/interface/ICodeAnalyzer";
import {FunctionLikeFormatter} from "./FunctionLikeFormatter";
import {IDecoratorsFormatter} from "./interface/IDecoratorsFormatter";
import {IModifiersFormatter} from "./interface/IModifiersFormatter";
import {IParametersFormatter} from "./interface/IParametersFormatter";
import {IValueableFormatter} from "./interface/IValueableFormatter";
import {ISetAccessorFormatter} from "./interface/ISetAccessorFormatter";

export class SetAccessorFormatter extends FunctionLikeFormatter implements ISetAccessorFormatter {

	constructor (private nameGetter: INameGetter,
							 sourceFilePropertiesGetter: ISourceFilePropertiesGetter,
							 decoratorsFormatter: IDecoratorsFormatter,
							 modifiersFormatter: IModifiersFormatter,
							 parametersFormatter: IParametersFormatter,
							 valueableFormatter: IValueableFormatter) {
		super(sourceFilePropertiesGetter, decoratorsFormatter, modifiersFormatter, parametersFormatter, valueableFormatter);
	}

	/**
	 * Takes a SetAccessorDeclaration and returns an ISetAccessorDeclaration.
	 * @param {SetAccessorDeclaration} declaration
	 * @param {string} className
	 * @returns {ISetAccessorDeclaration}
	 */
	format (declaration: SetAccessorDeclaration, className: string): ISetAccessorDeclaration {
		const name = <string>this.nameGetter.getNameOfMember(declaration.name, false, true);

		const isStatic = declaration.modifiers == null ? false : declaration.modifiers.find(modifier => isStaticKeyword(modifier)) != null;
		const filePath = this.sourceFilePropertiesGetter.getSourceFileProperties(declaration).filePath;

		const map: ISetAccessorDeclaration = {
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
			value: IdentifierMapKind.SET_ACCESSOR,
			enumerable: false
		});
		return map;
	}

}