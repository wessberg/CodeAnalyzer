import {IdentifierMapKind} from "../../identifier/interface/IIdentifier";

export interface IIdentifierUtil {
	setKind<T> (on: T, kind: IdentifierMapKind): T;
}