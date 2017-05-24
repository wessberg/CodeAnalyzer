import {Expression, Node, Statement} from "typescript";
import {IdentifierMapKind, IIdentifier, IIdentifierMap} from "../../service/interface/ICodeAnalyzer";

export interface ITracer {
	findNearestMatchingIdentifier (from: Statement|Expression|Node, block: string, identifier: string, clojure: IIdentifierMap): IIdentifier;
	traceIdentifier (identifier: string, from: Statement|Expression|Node, scope?: string|null, ofKind?: IdentifierMapKind): IIdentifier;
	traceBlockScopeName (statement: Statement|Expression|Node): string;
	traceClojure (from: Statement|Expression|Node|string): IIdentifierMap|null;
	traceThis (statement: Statement|Expression|Node): string;
}