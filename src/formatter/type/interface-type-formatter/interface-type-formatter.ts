import {IInterfaceTypeFormatter} from "./i-interface-type-formatter";
import {InterfaceProperty} from "./interface-property";
import {InterfaceDeclaration} from "typescript";
import {IInterfaceType} from "@wessberg/type";
import {ITypescriptASTUtil} from "@wessberg/typescript-ast-util";
import {IInterfaceTypeMemberFormatter} from "../interface-type-member-formatter/i-interface-type-member-formatter";
import {IReferenceTypeFormatter} from "../reference-type-formatter/i-reference-type-formatter";
import {ITypeParameterFormatter} from "../type-parameter-formatter/i-type-parameter-formatter";

/**
 * A class for formatting IInterfaceTypes
 */
export class InterfaceTypeFormatter implements IInterfaceTypeFormatter {
	constructor (private astUtil: ITypescriptASTUtil,
							 private referenceTypeFormatter: IReferenceTypeFormatter,
							 private typeParameterFormatter: ITypeParameterFormatter,
							 private interfaceTypeMemberFormatter: IInterfaceTypeMemberFormatter) {
	}

	/**
	 * Formats an InterfaceDeclaration into an IInterfaceType
	 * @param {InterfaceDeclaration} statement
	 * @returns {IInterfaceType}
	 */
	public format (statement: InterfaceDeclaration): IInterfaceType {
		return {
			file: statement.getSourceFile().fileName,
			name: this.astUtil.takeName(statement.name),
			extends: statement.heritageClauses == null ? [] : this.referenceTypeFormatter.format(statement.heritageClauses[0]),
			typeParameters: statement.typeParameters == null ? [] : this.typeParameterFormatter.format(statement.typeParameters),
			members: statement.members.map(member => this.interfaceTypeMemberFormatter.format(<InterfaceProperty>member))
		};
	}
}