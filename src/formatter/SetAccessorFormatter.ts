import {SetAccessorDeclaration} from "typescript";
import {isStaticKeyword} from "../predicate/PredicateFunctions";
import {FunctionLikeFormatter} from "./FunctionLikeFormatter";
import {ISetAccessorFormatter} from "./interface/ISetAccessorFormatter";
import {identifierUtil, nameGetter, sourceFilePropertiesGetter, valueableFormatter} from "../services";
import {IdentifierMapKind, ISetAccessorDeclaration} from "../identifier/interface/IIdentifier";

export class SetAccessorFormatter extends FunctionLikeFormatter implements ISetAccessorFormatter {

	/**
	 * Takes a SetAccessorDeclaration and returns an ISetAccessorDeclaration.
	 * @param {SetAccessorDeclaration} declaration
	 * @param {string} className
	 * @returns {ISetAccessorDeclaration}
	 */
	format (declaration: SetAccessorDeclaration, className: string): ISetAccessorDeclaration {
		const name = <string>nameGetter.getNameOfMember(declaration.name, false, true);

		const isStatic = declaration.modifiers == null ? false : declaration.modifiers.find(modifier => isStaticKeyword(modifier)) != null;
		const filePath = sourceFilePropertiesGetter.getSourceFileProperties(declaration).filePath;

		const map: ISetAccessorDeclaration = identifierUtil.setKind({
			...this.formatFunctionLikeDeclaration(declaration),
			...{
				___kind: IdentifierMapKind.METHOD,
				isStatic,
				name,
				className,
				filePath,
				value: valueableFormatter.format(declaration, undefined, declaration.body)
			}
		}, IdentifierMapKind.SET_ACCESSOR);

		return map;
	}

}