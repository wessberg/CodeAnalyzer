import {Expression, Node, Statement} from "typescript";
import {IIdentifier, IIdentifierMap} from "../../service/interface/ICodeAnalyzer";

export interface ITracer {
	findNearestMatchingIdentifier (from: Statement|Expression|Node, block: string, identifier: string, clojure?: IIdentifierMap): IIdentifier|null;
	traceIdentifier (identifier: string, from: Statement|Expression|Node, scope: string|null): IIdentifier|null|string;
	traceBlockScopeName (statement: Statement|Expression|Node): string;
	traceClojure (from: Statement|Expression|Node|string): IIdentifierMap|string;
	traceThis (statement: Statement|Expression|Node): string;
}