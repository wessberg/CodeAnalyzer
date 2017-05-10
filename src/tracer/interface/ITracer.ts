import {IIdentifier, IIdentifierMap} from "../../interface/ISimpleLanguageService";
import {Statement, Expression, Node} from "typescript";

export interface ITracer {
	findNearestMatchingIdentifier (from: Statement | Expression | Node, block: string, identifier: string, clojure?: IIdentifierMap): IIdentifier | null;
	traceIdentifier (identifier: string, from: Statement | Expression | Node, scope: string | null): IIdentifier | null;
	traceBlockScopeName (statement: Statement | Expression | Node): string;
	traceClojure (from: Statement | Expression | Node): IIdentifierMap;
	traceThis (statement: Statement | Expression | Node): string;
}