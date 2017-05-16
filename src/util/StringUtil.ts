import {ArbitraryValue} from "../service/interface/ICodeAnalyzer";
import {IStringUtil} from "./interface/IStringUtil";

export class StringUtil implements IStringUtil {
	/**
	 * Returns true if the given item is a string of pure whitespace.
	 * @param {ArbitraryValue} item
	 * @returns {boolean}
	 */
	public isWhitespace (item: ArbitraryValue): boolean {
		if (typeof item !== "string") return false;
		return /^[\t\n\r\s]+$/.test(item);
	}

	/**
	 * Returns true if the given content is a quote character (", ' or `).
	 * @param {string} content
	 * @returns {boolean}
	 */
	public isQuote (content: string): boolean {
		return /["'`]/.test(content);
	}

	/**
	 * Strips the quotes from the given content if it is wrapped in quotes already.
	 * @param {ArbitraryValue} content
	 * @returns {ArbitraryValue}
	 */
	public stripQuotesIfNecessary (content: ArbitraryValue): ArbitraryValue {
		if (!(typeof content === "string")) return content;
		const trimmed = content;
		const firstChar = trimmed[0];
		const lastChar = trimmed[trimmed.length - 1];
		const startsWithQuote = this.isQuote(firstChar);
		const endsWithQuote = this.isQuote(lastChar);
		const startOffset = startsWithQuote ? 1 : 0;
		const endOffset = endsWithQuote ? 1 : 0;
		return trimmed.slice(startOffset, trimmed.length - endOffset);
	}

	/**
	 * Quotes the given content if it is a string and doesn't start and end with a clashing quote.
	 * @param {ArbitraryValue} content
	 * @returns {ArbitraryValue}
	 */
	public quoteIfNecessary (content: ArbitraryValue): ArbitraryValue {
		if (!(typeof content === "string")) return content;
		const REPLACEMENT_CHAR = "`";
		const trimmed = content;
		const firstChar = trimmed[0];
		const lastChar = trimmed[trimmed.length - 1];
		let str = REPLACEMENT_CHAR;
		const startsWithClashingQuote = firstChar === REPLACEMENT_CHAR;
		const endsWithClashingQuote = lastChar === REPLACEMENT_CHAR;

		if (startsWithClashingQuote && endsWithClashingQuote) {
			// TODO: Return the string instead of escaping and adding even more quotes?
			const insideQuotes = trimmed.match(new RegExp(`^${REPLACEMENT_CHAR}([^${REPLACEMENT_CHAR}]*)${REPLACEMENT_CHAR}`));
			// If there are nothing but whitespace inside the quotes, just return them.
			if (insideQuotes != null && this.isWhitespace(insideQuotes[1])) return content;
		}

		const startOffset = startsWithClashingQuote ? 1 : 0;
		const endOffset = endsWithClashingQuote ? 1 : 0;
		if (startsWithClashingQuote) str += `\\${REPLACEMENT_CHAR}`;
		str += trimmed.slice(startOffset, trimmed.length - endOffset);
		if (endsWithClashingQuote) str += `\\${REPLACEMENT_CHAR}`;
		str += REPLACEMENT_CHAR;

		return str;
	}
}