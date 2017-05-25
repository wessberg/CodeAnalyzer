import {IModifiersFormatter} from "src/formatter/interface/IModifiersFormatter";
import {ConstructorDeclaration} from "typescript";
import {ISourceFilePropertiesGetter} from "../getter/interface/ISourceFilePropertiesGetter";
import {IMapper} from "../mapper/interface/IMapper";
import {IConstructorDeclaration, IdentifierMapKind} from "../service/interface/ICodeAnalyzer";
import {FunctionLikeFormatter} from "./FunctionLikeFormatter";
import {IConstructorFormatter} from "./interface/IConstructorFormatter";
import {IDecoratorsFormatter} from "./interface/IDecoratorsFormatter";
import {IParametersFormatter} from "./interface/IParametersFormatter";
import {IValueableFormatter} from "./interface/IValueableFormatter";

export class ConstructorFormatter extends FunctionLikeFormatter implements IConstructorFormatter {
	constructor (private mapper: IMapper,
							 sourceFilePropertiesGetter: ISourceFilePropertiesGetter,
							 decoratorsFormatter: IDecoratorsFormatter,
							 modifiersFormatter: IModifiersFormatter,
							 parametersFormatter: IParametersFormatter,
							 valueableFormatter: IValueableFormatter) {

		super(sourceFilePropertiesGetter, decoratorsFormatter, modifiersFormatter, parametersFormatter, valueableFormatter);
	}

	/**
	 * Takes a ConstructorDeclaration and returns an IConstructorDeclaration.
	 * @param {ConstructorDeclaration} declaration
	 * @param {string} className
	 * @returns {IConstructorDeclaration}
	 */
	public format (declaration: ConstructorDeclaration, className: string): IConstructorDeclaration {
		const name = "constructor";

		const filePath = this.sourceFilePropertiesGetter.getSourceFileProperties(declaration).filePath;

		const map: IConstructorDeclaration = {
			...this.formatFunctionLikeDeclaration(declaration),
			...{
				___kind: IdentifierMapKind.CONSTRUCTOR,
				name,
				className,
				filePath,
				value: this.valueableFormatter.format(declaration, undefined, declaration.body)
			}
		};

		// Make the kind non-enumerable.
		Object.defineProperty(map, "___kind", {
			value: IdentifierMapKind.CONSTRUCTOR,
			enumerable: false
		});
		this.mapper.set(map, declaration);
		return map;
	}
}