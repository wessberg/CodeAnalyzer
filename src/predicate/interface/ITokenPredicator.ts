import {ArbitraryValue} from "../../service/interface/ICodeAnalyzer";

export interface ITokenPredicator {
	isTokenLike (item: ArbitraryValue): boolean;
	throwsIfPrimitive (item: ArbitraryValue): boolean;
	isKeywordLike (item: ArbitraryValue): boolean;
	isOperatorLike (item: ArbitraryValue): boolean;
}