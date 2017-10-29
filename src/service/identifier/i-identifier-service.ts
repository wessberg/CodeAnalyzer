import {Identifier} from "typescript";
import {INodeService} from "../node/i-node-service";

export interface IIdentifierService extends INodeService<Identifier> {
	getText (identifier: Identifier): string;
}