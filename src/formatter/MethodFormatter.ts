import {MethodDeclaration} from "typescript";
import {isStaticKeyword} from "../predicate/PredicateFunctions";
import {FunctionLikeFormatter} from "./FunctionLikeFormatter";
import {IMethodFormatter} from "./interface/IMethodFormatter";
import {identifierUtil, nameGetter, sourceFilePropertiesGetter, valueableFormatter} from "../services";
import {IdentifierMapKind, IMethodDeclaration} from "../identifier/interface/IIdentifier";

/**
 * A class that can format any kind of relevant statement into an IMethodDeclaration
 */
export class MethodFormatter extends FunctionLikeFormatter implements IMethodFormatter {

	/**
	 * Takes a MethodDeclaration and returns an IMethodDeclaration.
	 * @param {MethodDeclaration} declaration
	 * @param {string} className
	 * @returns {IMethodDeclaration}
	 */
	public format (declaration: MethodDeclaration, className: string): IMethodDeclaration {
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
		}, IdentifierMapKind.METHOD);
	}

}