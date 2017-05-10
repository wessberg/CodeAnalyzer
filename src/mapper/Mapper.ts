import {IIdentifier} from "src";
import {Expression, Node, Statement} from "typescript";
import {IMapper} from "./interface/IMapper";

export class Mapper implements IMapper {
	private static readonly map: Map<IIdentifier, Statement | Expression | Node> = new Map();

	public set (identifier: IIdentifier, statement: Statement | Expression | Node): void {
		Mapper.map.set(identifier, statement);
	}

	public get (identifier: IIdentifier): Statement | Expression | Node | undefined {
		return Mapper.map.get(identifier);
	}
}