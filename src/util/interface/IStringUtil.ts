import {ArbitraryValue} from "../../service/interface/ICodeAnalyzer";
export interface IStringUtil {
	stripQuotesIfNecessary (content: ArbitraryValue): ArbitraryValue;
	isQuote (content: string): boolean;
	isWhitespace (item: ArbitraryValue): boolean;
	quoteIfNecessary (content: ArbitraryValue): ArbitraryValue;
}