import {ArbitraryValue} from "../../service/interface/ISimpleLanguageService";
export interface IStringUtil {
	stripQuotesIfNecessary (content: ArbitraryValue): ArbitraryValue;
	isQuote (content: string): boolean;
	isWhitespace (item: ArbitraryValue): boolean;
	quoteIfNecessary (content: ArbitraryValue): ArbitraryValue;
}