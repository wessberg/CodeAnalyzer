import {IInterfaceTypeFormatter} from "./i-interface-type-formatter";
import {InterfaceProperty} from "./interface-property";
import {InterfaceDeclaration} from "typescript";
import {IInterfaceType} from "@wessberg/type";
import {ITypescriptASTUtil} from "@wessberg/typescript-ast-util";
import {IInterfaceTypeMemberFormatter} from "../interface-type-member-formatter/i-interface-type-member-formatter";
import {IReferenceTypeFormatter} from "../reference-type-formatter/i-reference-type-formatter";
import {ITypeParameterFormatter} from "../type-parameter-formatter/i-type-parameter-formatter";
import {ITypeFormatter} from "../type-formatter/i-type-formatter";
import {IParameterTypeFormatter} from "../parameter-type-formatter/i-parameter-type-formatter";

/**
 * A class for formatting IInterfaceTypes
 */
export class InterfaceTypeFormatter implements IInterfaceTypeFormatter {
	constructor (private astUtil: ITypescriptASTUtil,
							 private typeFormatter: ITypeFormatter,
							 private referenceTypeFormatter: IReferenceTypeFormatter,
							 private typeParameterFormatter: ITypeParameterFormatter,
							 private parameterTypeFormatter: IParameterTypeFormatter,
							 private interfaceTypeMemberFormatter: IInterfaceTypeMemberFormatter) {
	}

	/**
	 * Formats an InterfaceDeclaration into an IInterfaceType
	 * @param {InterfaceDeclaration} statement
	 * @returns {IInterfaceType}
	 */
	public format (statement: InterfaceDeclaration): IInterfaceType {
		const {typeFormatter, interfaceTypeMemberFormatter, parameterTypeFormatter} = this;

		const interfaceType: IInterfaceType = {
			file: statement.getSourceFile().fileName,
			name: this.astUtil.takeName(statement.name),
			extends: statement.heritageClauses == null ? [] : statement.heritageClauses[0].types.map(node => this.referenceTypeFormatter.format({node, interfaceTypeMemberFormatter, parameterTypeFormatter, typeFormatter})),
			typeParameters: statement.typeParameters == null ? [] : this.typeParameterFormatter.format(statement.typeParameters),
			members: statement.members.map(member => this.interfaceTypeMemberFormatter.format(<InterfaceProperty>member))
		};

		// Override the 'toString()' method
		interfaceType.toString = () => this.stringify(interfaceType);
		return interfaceType;
	}

	/**
	 * Generates a string representation of the IInterfaceType
	 * @param {IInterfaceType} interfaceType
	 * @returns {string}
	 */
	private stringify (interfaceType: IInterfaceType): string {
		let str = `interface ${interfaceType.name}`;
		// Add the type parameters to it
		if (interfaceType.typeParameters.length > 0) {
			str += `<${interfaceType.typeParameters.map(typeParameter => typeParameter.toString()).join(", ")}>`;
		}

		// Add the 'extends' relation(s) to the interface
		if (interfaceType.extends.length > 0) {
			str += ` extends ${interfaceType.extends.map(extend => extend.toString()).join(", ")}`;
		}
		// Add the opening bracket.
		str += " {";

		// Add all of the members.
		str += interfaceType.members.map(member => `\n\t${member.toString()}`).join(";");
		// Add one last ';' if required.
		if (interfaceType.members.length > 0) str += ";";

		// Add the closing bracket.
		str += "\n}";
		return str;
	}
}