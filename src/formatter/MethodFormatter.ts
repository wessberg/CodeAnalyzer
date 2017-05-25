import {MethodDeclaration} from "typescript";
import {INameGetter} from "../getter/interface/INameGetter";
import {ISourceFilePropertiesGetter} from "../getter/interface/ISourceFilePropertiesGetter";
import {isStaticKeyword} from "../predicate/PredicateFunctions";
import {IdentifierMapKind, IMethodDeclaration} from "../service/interface/ICodeAnalyzer";
import {FunctionLikeFormatter} from "./FunctionLikeFormatter";
import {IDecoratorsFormatter} from "./interface/IDecoratorsFormatter";
import {IMethodFormatter} from "./interface/IMethodFormatter";
import {IModifiersFormatter} from "./interface/IModifiersFormatter";
import {IParametersFormatter} from "./interface/IParametersFormatter";
import {IValueableFormatter} from "./interface/IValueableFormatter";

export class MethodFormatter extends FunctionLikeFormatter implements IMethodFormatter {

	constructor (private nameGetter: INameGetter,
							 sourceFilePropertiesGetter: ISourceFilePropertiesGetter,
							 decoratorsFormatter: IDecoratorsFormatter,
							 modifiersFormatter: IModifiersFormatter,
							 parametersFormatter: IParametersFormatter,
							 valueableFormatter: IValueableFormatter) {
		super(sourceFilePropertiesGetter, decoratorsFormatter, modifiersFormatter, parametersFormatter, valueableFormatter);
	}

	/**
	 * Takes a MethodDeclaration and returns an IMethodDeclaration.
	 * @param {MethodDeclaration} declaration
	 * @param {string} className
	 * @returns {IMethodDeclaration}
	 */
	format (declaration: MethodDeclaration, className: string): IMethodDeclaration {
		const name = <string>this.nameGetter.getNameOfMember(declaration.name, false, true);

		const isStatic = declaration.modifiers == null ? false : declaration.modifiers.find(modifier => isStaticKeyword(modifier)) != null;
		const filePath = this.sourceFilePropertiesGetter.getSourceFileProperties(declaration).filePath;

		const map: IMethodDeclaration = {
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
			value: IdentifierMapKind.METHOD,
			enumerable: false
		});
		return map;
	}

}