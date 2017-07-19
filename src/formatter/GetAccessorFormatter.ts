import {GetAccessorDeclaration} from "typescript";
import {isStaticKeyword} from "../predicate/PredicateFunctions";
import {FunctionLikeFormatter} from "./FunctionLikeFormatter";
import {IGetAccessorFormatter} from "./interface/IGetAccessorFormatter";
import {identifierUtil, nameGetter, sourceFilePropertiesGetter, valueableFormatter} from "../services";
import {IdentifierMapKind, IGetAccessorDeclaration} from "../identifier/interface/IIdentifier";

/**
 * A class that can format any relevant kind of statement into an IGetAccessorDeclaration
 */
export class GetAccessorFormatter extends FunctionLikeFormatter implements IGetAccessorFormatter {

	/**
	 * Takes a GetAccessorDeclaration and returns an IGetAccessorDeclaration.
	 * @param {GetAccessorDeclaration} declaration
	 * @param {string} className
	 * @returns {IGetAccessorDeclaration}
	 */
	public format (declaration: GetAccessorDeclaration, className: string): IGetAccessorDeclaration {
		const name = <string>nameGetter.getNameOfMember(declaration.name, false, true);

		const isStatic = declaration.modifiers == null ? false : declaration.modifiers.find(modifier => isStaticKeyword(modifier)) != null;
		const filePath = sourceFilePropertiesGetter.getSourceFileProperties(declaration).filePath;

		return identifierUtil.setKind({
			...this.formatFunctionLikeDeclaration(declaration),
			...{
				___kind: IdentifierMapKind.METHOD,
				isStatic,
				name,
				className,
				filePath,
				value: valueableFormatter.format(declaration, undefined, declaration.body)
			}
		}, IdentifierMapKind.GET_ACCESSOR);
	}

}