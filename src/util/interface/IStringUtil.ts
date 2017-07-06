import {ArbitraryValue} from "../../identifier/interface/IIdentifier";

export interface IStringUtil {
	stripQuotesIfNecessary (content: ArbitraryValue): ArbitraryValue;
	isQuote (content: string): boolean;
	isWhitespace (item: ArbitraryValue): boolean;
	quoteIfNecessary (content: ArbitraryValue): ArbitraryValue;
}