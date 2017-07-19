import {CallExpression, Expression, NewExpression} from "typescript";
import {IArgumentsFormatter} from "./interface/IArgumentsFormatter";
import {identifierUtil, mapper, valueableFormatter} from "../services";
import {IArgument, IdentifierMapKind} from "../identifier/interface/IIdentifier";

/**
 * A class that can format any kind of relevant statement into an array of IArguments
 */
export class ArgumentsFormatter implements IArgumentsFormatter {

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

		const map: IArgument = identifierUtil.setKind({
			___kind: IdentifierMapKind.ARGUMENT,
			startsAt,
			endsAt,
			value: valueableFormatter.format(argument)
		}, IdentifierMapKind.ARGUMENT);

		mapper.set(map, argument);
		return map;
	}
}