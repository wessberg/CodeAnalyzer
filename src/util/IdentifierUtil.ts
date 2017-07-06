import {IIdentifierUtil} from "./interface/IIdentifierUtil";
import {IdentifierMapKind} from "../identifier/interface/IIdentifier";

export class IdentifierUtil implements IIdentifierUtil {
	public setKind<T> (on: T, kind: IdentifierMapKind): T {
		Object.defineProperty(on, "___kind", {
			value: kind,
			enumerable: false
		});
		return on;
	}

}