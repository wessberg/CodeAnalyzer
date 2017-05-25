import {CallExpression, Expression, NewExpression} from "typescript";
import {IMapper} from "../mapper/interface/IMapper";
import {IArgument, IdentifierMapKind} from "../service/interface/ICodeAnalyzer";
import {IArgumentsFormatter} from "./interface/IArgumentsFormatter";
import {IValueableFormatter} from "./interface/IValueableFormatter";

export class ArgumentsFormatter implements IArgumentsFormatter {

	constructor (private mapper: IMapper,
							 private valueableFormatter: IValueableFormatter) {
	}

	/**
	 * Takes the arguments from a CallExpression and returns an array of IArguments.
	 * @param {CallExpression} declaration
	 * @returns {IArgument[]}
	 */
	public format (declaration: CallExpression|NewExpression): IArgument[] {
		return declaration.arguments == null ? [] : declaration.arguments.map(arg => this.formatArgument(arg));
	}

	/**
	 * Formats a concrete ParameterDeclaration and returns an IArgument.
	 * @param {Expression} argument
	 * @returns {IArgument}
	 */
	private formatArgument (argument: Expression): IArgument {
		const startsAt = argument.pos;
		const endsAt = argument.end;

		const map: IArgument = {
			___kind: IdentifierMapKind.ARGUMENT,
			startsAt,
			endsAt,
			value: this.valueableFormatter.format(argument)
		};
		// Make the kind non-enumerable.
		Object.defineProperty(map, "___kind", {
			value: IdentifierMapKind.ARGUMENT,
			enumerable: false
		});
		this.mapper.set(map, argument);
		return map;
	}
}