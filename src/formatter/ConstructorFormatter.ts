import {ConstructorDeclaration} from "typescript";
import {FunctionLikeFormatter} from "./FunctionLikeFormatter";
import {IConstructorFormatter} from "./interface/IConstructorFormatter";
import {identifierUtil, mapper, sourceFilePropertiesGetter, valueableFormatter} from "../services";
import {IConstructorDeclaration, IdentifierMapKind} from "../identifier/interface/IIdentifier";

export class ConstructorFormatter extends FunctionLikeFormatter implements IConstructorFormatter {

	/**
	 * Takes a ConstructorDeclaration and returns an IConstructorDeclaration.
	 * @param {ConstructorDeclaration} declaration
	 * @param {string} className
	 * @returns {IConstructorDeclaration}
	 */
	public format (declaration: ConstructorDeclaration, className: string): IConstructorDeclaration {
		const name = "constructor";

		const filePath = sourceFilePropertiesGetter.getSourceFileProperties(declaration).filePath;

		const map: IConstructorDeclaration = identifierUtil.setKind({
			...this.formatFunctionLikeDeclaration(declaration),
			...{
				___kind: IdentifierMapKind.CONSTRUCTOR,
				name,
				className,
				filePath,
				value: valueableFormatter.format(declaration, undefined, declaration.body)
			}
		}, IdentifierMapKind.CONSTRUCTOR);

		mapper.set(map, declaration);
		return map;
	}
}