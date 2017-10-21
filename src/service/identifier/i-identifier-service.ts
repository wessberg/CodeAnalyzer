import {Identifier} from "typescript";

export interface IIdentifierService {
	getText (identifier: Identifier): string;
}