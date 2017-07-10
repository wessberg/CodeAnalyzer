/*tslint:disable*/
import {IArbitraryObject, ITypeDetector, TypeOf} from "@wessberg/typedetector";
import {GlobalObject, GlobalObjectIdentifier} from "@wessberg/globalobject";

/**
 * A class that maps between a variety of data types.
 * @author Frederik Wessberg
 */
export class Marshaller {
	private static readonly SYMBOL_REGEX: RegExp = /Symbol\(([^)]*)\)/;
	private static readonly CLASS_INSTANCE_REGEX: RegExp = /\w+\s*{}/;
	private static readonly FUNCTION_REGEX_1: RegExp = /^\(*function\s*\w*\s*\([^)]*\)\s*{/;
	private static readonly FUNCTION_REGEX_2: RegExp = /^\(+[^)]*\)\s*=>/;
	private static readonly FUNCTION_REGEX_3: RegExp = /^\w+\s*=>/;

	constructor (private typeDetector: ITypeDetector) {
	}

	/**
	 * Takes some data and marshals it into the other data-type given as hint.
	 * A hint can be a constructor for a type or an instance of one.
	 * If none is given, it will attempt to figure out which data type to marshal into.
	 * @param {T} data
	 * @param {U} [hint]
	 * @returns {null|U}
	 */
	public marshal<T, U> (data: T, hint?: any): U|null|undefined {
		if (hint != null) return <U|null>this.marshalTo(data, hint);
		else return <U|null>this.marshalToBestGuess<T>(data);
	}

	/**
	 * A proxy for the 'getTypeOf' operation of the typeDetector.
	 * @param {T} data
	 * @returns {TypeOf}
	 */
	public getTypeOf<T> (data: T): TypeOf {
		return this.typeDetector.getTypeof(data);
	}

	/**
	 * Marshals a string into null.
	 * @param {string} _
	 * @returns {null}
	 */
	private marshalStringToNull (_: string|String): null {
		return null;
	}

	/**
	 * Marshals a map into null.
	 * @param {Map<{}, {}>} _
	 * @returns {null}
	 */
	private marshalMapToNull (_: Map<{}, {}>): null {
		return null;
	}

	/**
	 * Marshals a class into null.
	 * @param {{}} _
	 * @returns {null}
	 */
	private marshalClassToNull (_: {}): null {
		return null;
	}

	/**
	 * Marshals a constructor into null.
	 * @param {Function} _
	 * @returns {null}
	 */
	private marshalConstructorToNull (_: {}): null {
		return null;
	}

	/**
	 * Marshals undefined into null.
	 * @param {?} _
	 * @returns {null}
	 */
	private marshalUndefinedToNull (_: undefined): null {
		return null;
	}

	/**
	 * Marshals an object into null.
	 * @param {object} _
	 * @returns {null}
	 */
	private marshalObjectToNull<T> (_: { [key: string]: T }): null {
		return null;
	}

	/**
	 * Marshals a set into null.
	 * @param {Set<T>} _
	 * @returns {string}
	 */
	private marshalSetToNull<T> (_: Set<T>): null {
		return null;
	}

	/**
	 * Marshals a symbol into null.
	 * @param {symbol} _
	 * @returns {null}
	 */
	private marshalSymbolToNull (_: symbol): null {
		return null;
	}

	/**
	 * Marshals a boolean into null.
	 * @param {boolean} _
	 * @returns {null}
	 */
	private marshalBooleanToNull (_: boolean|Boolean): null {
		return null;
	}

	/**
	 * Marshals a number into null.
	 * @param {number} _
	 * @returns {null}
	 */
	private marshalNumberToNull (_: number|Number): null {
		return null;
	}

	/**
	 * Marshals an array into null.
	 * @param {T[]} _
	 * @returns {null}
	 */
	private marshalArrayToNull<T> (_: T[]): null {
		return null;
	}

	/**
	 * Marshals a function into null.
	 * @param {Function} _
	 * @returns {null}
	 */
	private marshalFunctionToNull (_: Function): null {
		return null;
	}

	/**
	 * Marshals a class into a string.
	 * @param {{}} data
	 * @returns {string}
	 */
	private marshalClassToString (data: {}): string {
		return `new (${this.marshalToString(this.marshalClassToConstructor(data))})()`;
	}

	/**
	 * Marshals a map into a string.
	 * @param {Map<{}, {}>} map
	 * @returns {string}
	 */
	private marshalMapToString (map: Map<{}, {}>): string {
		return `new Map(${this.marshalArrayToString([...map.entries()])})`;
	}

	/**
	 * Marshals a constructor into a string.
	 * @param {{}} data
	 * @returns {string}
	 */
	private marshalConstructorToString (data: {}): string {
		return data.toString();
	}

	/**
	 * Marshals a set into a string.
	 * @param {Set<T>} data
	 * @returns {string}
	 */
	private marshalSetToString<T> (data: Set<T>): string {
		return `new Set(${this.marshalArrayToString([...data.keys()])})`;
	}

	/**
	 * Marshals undefined into a string.
	 * @param {?} _
	 * @returns {string}
	 */
	private marshalUndefinedToString (_: undefined): string {
		return "undefined";
	}

	/**
	 * Marshals null into a string.
	 * @param {null} _
	 * @returns {string}
	 */
	private marshalNullToString (_: null): string {
		return "null";
	}

	/**
	 * Marshals a symbol into a string.
	 * @param {symbol} data
	 * @returns {string}
	 */
	private marshalSymbolToString (data: symbol): string {
		const match = data.toString().match(Marshaller.SYMBOL_REGEX);
		if (match == null) throw new ReferenceError(`${this.marshalSymbolToString.name} was given an invalid symbol to marshal!`);
		return match[1];
	}

	/**
	 * Marshals an object into a string.
	 * @param {object} data
	 * @returns {string}
	 */
	private marshalObjectToString<T> (data: { [key: string]: T }): string {
		let str = "{";
		const space = " ";
		const keys = Object.keys(data);
		keys.forEach((key, index) => {
			str += `"${key}":${space}`;
			const value = data[key];
			const isString = typeof this.marshal(value) === "string";
			const marshalled = this.marshalToString(value);
			const isFunction = this.typeDetector.isFunction(value);

			if (isFunction) str += this.formatObjectLiteralFunction(<string>marshalled);
			else if (isString) str += this.quoteIfNecessary(<string>marshalled);
			else str += marshalled;
			if (index !== keys.length - 1) str += `,${space}`;
		});
		str += "}";
		return str;
	}

	/**
	 * Marshals a boolean into a string.
	 * @param {boolean} data
	 * @returns {string}
	 */
	private marshalBooleanToString (data: boolean|Boolean): string {
		return `${data instanceof Boolean ? data.valueOf() : data}`;
	}

	/**
	 * Marshals a number into a string.
	 * @param {number} data
	 * @returns {string}
	 */
	private marshalNumberToString (data: number|Number): string {
		return `${data instanceof Number ? data.valueOf() : data}`;
	}

	/**
	 * Marshals an array into a string.
	 * @param {T[]} data
	 * @returns {string}
	 */
	private marshalArrayToString<T> (data: T[]): string {
		return JSON.stringify(data);
	}

	/**
	 * Marshals a function into a string.
	 * @param {Function} data
	 * @returns {string}
	 */
	private marshalFunctionToString (data: Function): string {
		return data.toString();
	}

	/**
	 * Marshals a constructor into a class instance.
	 * @param {(args?: ?[]) => T} data
	 * @returns {T}
	 */
	private marshalConstructorToClass<T> (data: new (args?: any[]) => T): T {
		return new data();
	}

	/**
	 * Marshals a symbol into a class.
	 * @param {symbol} data
	 * @returns {{}}
	 */
	private marshalSymbolToClass (data: symbol): {} {
		const ctor = <new () => {}>this.marshalSymbolToConstructor(data);
		return new ctor();
	}

	/**
	 * Marshals a Map into a class instance.
	 * @param {Map<{}, {}>} data
	 * @returns {{}}
	 */
	private marshalMapToClass (data: Map<{}, {}>): {} {
		const ctor = <new () => {}>this.marshalMapToConstructor(data);
		return new ctor();
	}

	/**
	 * Marshals a set into a class instance.
	 * @param {Set<T>} data
	 * @returns {{}}
	 */
	private marshalSetToClass<T> (data: Set<T>): {} {
		const ctor = <new () => {}>this.marshalSetToConstructor(data);
		return new ctor();
	}

	/**
	 * Marshals undefined into a class.
	 * @param {?} _
	 * @returns {{}}
	 */
	private marshalUndefinedToClass (_: undefined): {} {
		const ctor = <new () => {}>this.marshalUndefinedToConstructor(_);
		return new ctor();
	}

	/**
	 * Marshals null into a class.
	 * @param {null} _
	 * @returns {{}}
	 */
	private marshalNullToClass (_: null): {} {
		const ctor = <new () => {}>this.marshalNullToConstructor(_);
		return new ctor();
	}

	/**
	 * Marshals an object into a class.
	 * @param {object} data
	 * @returns {{}}
	 */
	private marshalObjectToClass<T> (data: { [key: string]: T }): {} {
		const ctor = <new () => {}>this.marshalObjectToConstructor(data);
		return new ctor();
	}

	/**
	 * Marshals a boolean into a class.
	 * @param {boolean} data
	 * @returns {{}}
	 */
	private marshalBooleanToClass (data: boolean|Boolean): {} {
		const ctor = <new () => {}>this.marshalBooleanToConstructor(data);
		return new ctor();
	}

	/**
	 * Marshals a number into a class.
	 * @param {number} data
	 * @returns {{}}
	 */
	private marshalNumberToClass (data: number|Number): {} {
		const ctor = <new () => {}>this.marshalNumberToConstructor(data);
		return new ctor();
	}

	/**
	 * Marshals an array into a class.
	 * @param {T[]} data
	 * @returns {{}}
	 */
	private marshalArrayToClass<T> (data: T[]): {} {
		const ctor = <new () => {}>this.marshalArrayToConstructor(data);
		return new ctor();
	}

	/**
	 * Marshals a function into a class.
	 * @param {Function} data
	 * @returns {{}}
	 */
	private marshalFunctionToClass (data: Function): {} {
		const ctor = <new () => {}>this.marshalFunctionToConstructor(data);
		return new ctor();
	}

	/**
	 * Marshals a string into a class instance.
	 * @param {string} data
	 * @returns {{}}
	 */
	private marshalStringToClass (data: string): {} {
		const ctor = <new () => {}>this.marshalStringToConstructor(data);
		return new ctor();
	}

	/**
	 * Marshals a string into a constructor.
	 * @param {string|String} data
	 * @returns {Function}
	 */
	private marshalStringToConstructor (data: string|String): Function {
		const primitive = data instanceof String ? data.valueOf() : data;
		if (!primitive.trim().startsWith("class")) {
			class Class {
			}

			(<any>Class)[<any>data] = data;
			return Class;
		}
		return new Function(`return (${data})`)();
	}

	/**
	 * Marshals a class into a constructor.
	 * @param {T} data
	 * @returns {Function}
	 */
	private marshalClassToConstructor<T> (data: T): Function {
		return data.constructor;
	}

	/**
	 * Marshals a symbol into a constructor.
	 * @param {symbol} data
	 * @returns {Function}
	 */
	private marshalSymbolToConstructor (data: symbol): Function {
		class Class {
		}

		(<any>Class)[<any>data] = data;
		return Class;
	}

	/**
	 * Marshals an object into a class.
	 * @param {object} data
	 * @returns {Function}
	 */
	private marshalMapToConstructor (data: Map<{}, {}>): Function {
		class Class {
		}

		for (const entry of data.entries()) {
			const [key, value] = entry;
			(<any>Class)[<any>key] = value;
		}

		return Class;
	}

	/**
	 * Marshals a set into a constructor.
	 * @param {Set<T>} data
	 * @returns {Function}
	 */
	private marshalSetToConstructor<T> (data: Set<T>): Function {
		class Class {
		}

		for (const key of data.keys()) {
			(<any>Class)[<any>key] = key;
		}

		return Class;
	}

	/**
	 * Marshals undefined into a constructor.
	 * @param {?} _
	 * @returns {Function}
	 */
	private marshalUndefinedToConstructor (_: undefined): Function {
		class Class {
		}

		return Class;
	}

	/**
	 * Marshals null into a constructor.
	 * @param {null} _
	 * @returns {Function}
	 */
	private marshalNullToConstructor (_: null): Function {
		class Class {
		}

		return Class;
	}

	/**
	 * Marshals an object into a class.
	 * @param {object} data
	 * @returns {Function}
	 */
	private marshalObjectToConstructor<T> (data: { [key: string]: T }): Function {
		class Class {
		}

		Object.keys(data).forEach(key => {
			(<any>Class)[key] = data[key];
		});
		return Class;
	}

	/**
	 * Marshals a boolean into a constructor.
	 * @param {boolean} data
	 * @returns {Function}
	 */
	private marshalBooleanToConstructor (_: boolean|Boolean): Function {
		class Class {
		}

		return Class;
	}

	/**
	 * Marshals a number into a class.
	 * @param {number} data
	 * @returns {Function}
	 */
	private marshalNumberToConstructor (data: number|Number): Function {
		class Class {
		}

		(<any>Class)[<any>data] = data;
		return Class;
	}

	/**
	 * Marshals an array into a constructor.
	 * @param {T[]} data
	 * @returns {Function}
	 */
	private marshalArrayToConstructor<T> (data: T[]): Function {
		class Class {
		}

		data.forEach((item, index) => {
			(<any>Class)[index] = item;
		});

		return Class;
	}

	/**
	 * Marshals a function into a constructor.
	 * @param {Function} data
	 * @returns {Function}
	 */
	private marshalFunctionToConstructor (data: Function): Function {
		class Class {
		}

		(<any>Class)[data.name] = data;
		return Class;
	}

	/**
	 * Marshals null into a function.
	 * @param {null} _
	 * @returns {Function}
	 */
	private marshalNullToFunction (_: null): Function {
		return () => null;
	}

	/**
	 * Marshals undefined into a function.
	 * @param {?} _
	 * @returns {Function}
	 */
	private marshalUndefinedToFunction (_: null): Function {
		return () => undefined;
	}

	/**
	 * Marshals a set into a function.
	 * @param {Map<{}, {}>} data
	 * @returns {Function}
	 */
	private marshalMapToFunction (data: Map<{}, {}>): Function {
		return () => data;
	}

	/**
	 * Marshals a set into a function.
	 * @param {Set<T>} data
	 * @returns {Function}
	 */
	private marshalSetToFunction<T> (data: Set<T>): Function {
		return () => data;
	}

	/**
	 * Marshals a symbol into a function.
	 * @param {symbol} data
	 * @returns {Function}
	 */
	private marshalSymbolToFunction (data: symbol): Function {
		return () => data;
	}

	/**
	 * Marshals a class into a function.
	 * @param {symbol} data
	 * @returns {Function}
	 */
	private marshalClassToFunction (data: {}): Function {
		return () => data;
	}

	/**
	 * Marshals a constructor into a function.
	 * @param {Function} data
	 * @returns {Function}
	 */
	private marshalConstructorToFunction (data: Function): Function {
		return () => data;
	}

	/**
	 * Marshals an object into a function.
	 * @param {object} data
	 * @returns {Function}
	 */
	private marshalObjectToFunction<T> (data: { [key: string]: T }): Function {
		return () => data;
	}

	/**
	 * Marshals a boolean into a Function.
	 * @param {boolean} data
	 * @returns {Function}
	 */
	private marshalBooleanToFunction (data: boolean|Boolean): Function {
		return () => data;
	}

	/**
	 * Marshals a number into a Function.
	 * @param {number} data
	 * @returns {Function}
	 */
	private marshalNumberToFunction (data: number|Number): Function {
		return () => data;
	}

	/**
	 * Marshals an array into a Function.
	 * @param {T[]} data
	 * @returns {Function}
	 */
	private marshalArrayToFunction<T> (data: T[]): Function {
		return () => data;
	}

	/**
	 * Marshals a string into a Function.
	 * @param {string} data
	 * @returns {Function}
	 */
	private marshalStringToFunction (data: string): Function {
		if (Marshaller.FUNCTION_REGEX_1.test(data.trim())) return new Function(`return ${data}`)();
		if (Marshaller.FUNCTION_REGEX_2.test(data.trim())) return new Function(`return ${data}`)();
		if (Marshaller.FUNCTION_REGEX_3.test(data.trim())) return new Function(`return ${data}`)();
		return () => data;
	}

	/**
	 * Marshals a string into a boolean.
	 * @param {string} data
	 * @returns {boolean}
	 */
	private marshalStringToBoolean (data: string|String): boolean {
		const primitive = data instanceof String ? data.valueOf() : data;
		return primitive === "true" || primitive === "1" || primitive === "";
	}

	/**
	 * Marshals a class into a boolean.
	 * @param {{}} _
	 * @returns {boolean}
	 */
	private marshalClassToBoolean (_: {}): boolean {
		return true;
	}

	/**
	 * Marshals a constructor into a boolean.
	 * @param {Function} _
	 * @returns {boolean}
	 */
	private marshalConstructorToBoolean (_: Function): boolean {
		return true;
	}

	/**
	 * Marshals undefined into a boolean.
	 * @param {?} _
	 * @returns {boolean}
	 */
	private marshalUndefinedToBoolean (_: undefined): boolean {
		return false;
	}

	/**
	 * Marshals null into a boolean.
	 * @param {null} _
	 * @returns {boolean}
	 */
	private marshalNullToBoolean (_: null): boolean {
		return false;
	}

	/**
	 * Marshals a Function into a boolean.
	 * @param {Function} _
	 * @returns {boolean}
	 */
	private marshalFunctionToBoolean (_: Function): boolean {
		return true;
	}

	/**
	 * Marshals a symbol into a boolean.
	 * @param {symbol} data
	 * @returns {boolean}
	 */
	private marshalSymbolToBoolean (data: symbol): boolean {
		const match = data.toString().match(Marshaller.SYMBOL_REGEX);
		if (match == null) throw new ReferenceError(`${this.marshalSymbolToBoolean.name} was given an invalid symbol to marshal!`);
		return this.marshalStringToBoolean(match[1]);
	}

	/**
	 * Marshals a Map into a boolean.
	 * @param {Map<{}, {}>} _
	 * @returns {boolean}
	 */
	private marshalMapToBoolean (_: Map<{}, {}>): boolean {
		return true;
	}

	/**
	 * Marshals a Set into a boolean.
	 * @param {Set<T>} _
	 * @returns {boolean}
	 */
	private marshalSetToBoolean<T> (_: Set<T>): boolean {
		return true;
	}

	/**
	 * Marshals an array into a boolean.
	 * @param {T[]} _
	 * @returns {boolean}
	 */
	private marshalArrayToBoolean<T> (_: T[]): boolean {
		return true;
	}

	/**
	 * Marshals an object into a boolean.
	 * @param {object} _
	 * @returns {boolean}
	 */
	private marshalObjectToBoolean<T> (_: { [key: string]: T }): boolean {
		return true;
	}

	/**
	 * Marshals a number into a boolean.
	 * @param {number} data
	 * @returns {boolean}
	 */
	private marshalNumberToBoolean (data: number|Number): boolean {
		const primitive = data instanceof Number ? data.valueOf() : data;
		return primitive > 0;
	}

	/**
	 * Marshals a string into a symbol.
	 * @param {string} data
	 * @returns {symbol}
	 */
	private marshalStringToSymbol (data: string|String): symbol {
		const primitive = data instanceof String ? data.valueOf() : data;

		if (Marshaller.SYMBOL_REGEX.test(primitive)) {
			const content = primitive.match(Marshaller.SYMBOL_REGEX);
			if (content != null) return Symbol(content[1]);
		}
		return Symbol(primitive);
	}

	/**
	 * Marshals undefined into a symbol.
	 * @param {?} _
	 * @returns {symbol}
	 */
	private marshalUndefinedToSymbol (_: undefined): symbol {
		return Symbol(this.marshalUndefinedToString(undefined));
	}

	/**
	 * Marshals a class into a symbol.
	 * @param {{}} data
	 * @returns {symbol}
	 */
	private marshalClassToSymbol (data: {}): symbol {
		return Symbol(this.marshalClassToString(data));
	}

	/**
	 * Marshals a class into a symbol.
	 * @param {Function} data
	 * @returns {symbol}
	 */
	private marshalConstructorToSymbol (data: Function): symbol {
		return Symbol(this.marshalConstructorToString(data));
	}

	/**
	 * Marshals a string into a symbol.
	 * @param {null} _
	 * @returns {symbol}
	 */
	private marshalNullToSymbol (_: null): symbol {
		return Symbol(this.marshalNullToString(null));
	}

	/**
	 * Marshals a number into a symbol.
	 * @param {number} data
	 * @returns {symbol}
	 */
	private marshalNumberToSymbol (data: number|Number): symbol {
		const primitive = data instanceof Number ? data.valueOf() : data;
		return Symbol(this.marshalNumberToString(primitive));
	}

	/**
	 * Marshals a number into a symbol.
	 * @param {Function} data
	 * @returns {symbol}
	 */
	private marshalFunctionToSymbol (data: Function): symbol {
		return Symbol(this.marshalFunctionToString(data));
	}

	/**
	 * Marshals a Map into a symbol.
	 * @param {Map<string, string>} data
	 * @returns {symbol}
	 */
	private marshalMapToSymbol (data: Map<{}, {}>): symbol {
		return Symbol(this.marshalMapToString(data));
	}

	/**
	 * Marshals a set into a symbol.
	 * @param {Set<T>} data
	 * @returns {symbol}
	 */
	private marshalSetToSymbol<T> (data: Set<T>): symbol {
		return Symbol(this.marshalSetToString(data));
	}

	/**
	 * Marshals an array into a symbol.
	 * @param {T[]} data
	 * @returns {symbol}
	 */
	private marshalArrayToSymbol<T> (data: T[]): symbol {
		return Symbol(this.marshalArrayToString(data));
	}

	/**
	 * Marshals an object into a symbol.
	 * @param {object} data
	 * @returns {symbol}
	 */
	private marshalObjectToSymbol<T> (data: { [key: string]: T }): symbol {
		return Symbol(this.marshalObjectToString(data));
	}

	/**
	 * Marshals a boolean into a symbol.
	 * @param {boolean} data
	 * @returns {symbol}
	 */
	private marshalBooleanToSymbol (data: boolean|Boolean): symbol {
		const primitive = data instanceof Boolean ? data.valueOf() : data;
		return Symbol(this.marshalBooleanToString(primitive));
	}

	/**
	 * Marshals a string into a number.
	 * @param {string} data
	 * @returns {number}
	 */
	private marshalStringToNumber (data: string|String): number {
		const primitive = data instanceof String ? data.valueOf() : data;
		return Number.parseFloat(primitive);
	}

	/**
	 * Marshals undefined into a number.
	 * @param {?} _
	 * @returns {number}
	 */
	private marshalUndefinedToNumber (_: undefined): number {
		return 0;
	}

	/**
	 * Marshals a class into a number.
	 * @param {{}} _
	 * @returns {number}
	 */
	private marshalClassToNumber (_: {}): number {
		return 0;
	}

	/**
	 * Marshals a constructor into a number.
	 * @param {Function} _
	 * @returns {number}
	 */
	private marshalConstructorToNumber (_: Function): number {
		return 0;
	}

	/**
	 * Marshals null into a number.
	 * @param {null} _
	 * @returns {number}
	 */
	private marshalNullToNumber (_: null): number {
		return 0;
	}

	/**
	 * Marshals a Function into a number.
	 * @param {Function} _
	 * @returns {number}
	 */
	private marshalFunctionToNumber (_: Function): number {
		return 1;
	}

	/**
	 * Marshals a symbol into a number.
	 * @param {symbol} data
	 * @returns {number}
	 */
	private marshalSymbolToNumber (data: symbol): number {
		const match = data.toString().match(Marshaller.SYMBOL_REGEX);
		if (match == null) throw new ReferenceError(`${this.marshalSymbolToNumber.name} was given an invalid symbol to marshal!`);
		return this.marshalStringToNumber(match[1]);
	}

	/**
	 * Marshals a Map into a number.
	 * @param {Map<{}, {}>} data
	 * @returns {number}
	 */
	private marshalMapToNumber (data: Map<{}, {}>): number {
		return data.size;
	}

	/**
	 * Marshals a set into a number.
	 * @param {Set<T>} data
	 * @returns {number}
	 */
	private marshalSetToNumber<T> (data: Set<T>): number {
		return data.size;
	}

	/**
	 * Marshals an array into a number.
	 * @param {T[]} data
	 * @returns {number}
	 */
	private marshalArrayToNumber<T> (data: T[]): number {
		return data.length;
	}

	/**
	 * Marshals an object into a number.
	 * @param {object} data
	 * @returns {number}
	 */
	private marshalObjectToNumber<T> (data: { [key: string]: T }): number {
		return Object.keys(data).length;
	}

	/**
	 * Marshals a boolean into a number.
	 * @param {boolean} data
	 * @returns {number}
	 */
	private marshalBooleanToNumber (data: boolean|Boolean): number {
		const primitive = data instanceof Boolean ? data.valueOf() : data;
		return primitive ? 1 : 0;
	}

	/**
	 * Marshals a string into a Set.
	 * @param {string} data
	 * @returns {Set<string>}
	 */
	private marshalStringToSet (data: string|String): Set<string> {
		const primitive = data instanceof String ? data.valueOf() : data;
		return new Set([primitive]);
	}

	/**
	 * Marshals a class into a Set.
	 * @param {{}} data
	 * @returns {Set<string>}
	 */
	private marshalClassToSet (data: {}): Set<string> {
		const instanceKeys = Object.getOwnPropertyNames(data.constructor.prototype);
		const staticKeys = Object.getOwnPropertyNames(data.constructor);
		return new Set([...instanceKeys, ...staticKeys]);
	}

	/**
	 * Marshals a constructor into a Set.
	 * @param {Function} data
	 * @returns {Set<string>}
	 */
	private marshalConstructorToSet (data: Function): Set<string> {
		return new Set(Object.getOwnPropertyNames(data));
	}

	/**
	 * Marshals undefined into a Set.
	 * @param {?} _
	 * @returns {Set<null>}
	 */
	private marshalUndefinedToSet (_: null): Set<undefined> {
		return new Set([undefined]);
	}

	/**
	 * Marshals null into a Set.
	 * @param {null} _
	 * @returns {Set<null>}
	 */
	private marshalNullToSet (_: null): Set<null> {
		return new Set([null]);
	}

	/**
	 * Marshals a symbol into a Set.
	 * @param {symbol} data
	 * @returns {Set<string>}
	 */
	private marshalSymbolToSet (data: symbol): Set<Symbol> {
		return new Set([data]);
	}

	/**
	 * Marshals a Function into a Set.
	 * @param {Function} data
	 * @returns {Set<Function>}
	 */
	private marshalFunctionToSet (data: Function): Set<Function> {
		return new Set([data]);
	}

	/**
	 * Marshals an array into a Set.
	 * @param {T[]} data
	 * @returns {Set<T>}
	 */
	private marshalArrayToSet<T> (data: T[]): Set<T> {
		return new Set(data);
	}

	/**
	 * Marshals an object into a Set.
	 * @param {object} data
	 * @returns {Set<[string, T]>}
	 */
	private marshalObjectToSet<T> (data: { [key: string]: T }): Set<[string, T]> {
		return new Set(Object.entries(data));
	}

	/**
	 * Marshals a boolean into a Set.
	 * @param {boolean} data
	 * @returns {Set<boolean>}
	 */
	private marshalBooleanToSet (data: boolean|Boolean): Set<boolean> {
		const primitive = data instanceof Boolean ? data.valueOf() : data;
		return new Set([primitive]);
	}

	/**
	 * Marshals a number into a Set.
	 * @param {number} data
	 * @returns {Set<number>}
	 */
	private marshalNumberToSet (data: number|Number): Set<number> {
		const primitive = data instanceof Number ? data.valueOf() : data;
		return new Set([primitive]);
	}

	/**
	 * Marshals a string into a Map.
	 * @param {string} data
	 * @returns {Map<string, string>}
	 */
	private marshalStringToMap (data: string|String): Map<string, string> {
		const primitive = data instanceof String ? data.valueOf() : data;
		return new Map([[primitive, primitive]]);
	}

	/**
	 * Marshals a class into a Map.
	 * @param {{}} data
	 * @returns {Map<string, {}>}
	 */
	private marshalClassToMap (data: {}): Map<string, {}> {
		const map: Map<string, {}> = new Map();
		const instanceKeys = Object.getOwnPropertyNames(data.constructor.prototype);
		const staticKeys = Object.getOwnPropertyNames(data.constructor);
		instanceKeys.forEach(key => {
			map.set(key, (<{ [key: string]: {} }>data)[key]);
		});

		staticKeys.forEach(key => {
			map.set(key, (<any>data)["constructor"][key]);
		});

		return map;
	}

	/**
	 * Marshals a constructor into a Map.
	 * @param {Function} data
	 * @returns {Map<string, {}>}
	 */
	private marshalConstructorToMap (data: Function): Map<string, {}> {
		const map: Map<string, {}> = new Map();
		const staticKeys = Object.getOwnPropertyNames(data);
		staticKeys.forEach(key => {
			map.set(key, (<any>data)[key]);
		});

		return map;
	}

	/**
	 * Marshals undefined into a Map.
	 * @param {?} _
	 * @returns {Map<?, ?>}
	 */
	private marshalUndefinedToMap (_: null): Map<undefined, undefined> {
		return new Map([[undefined, undefined]]);
	}

	/**
	 * Marshals null into a Map.
	 * @param {null} _
	 * @returns {Map<null, null>}
	 */
	private marshalNullToMap (_: null): Map<null, null> {
		return new Map([[null, null]]);
	}

	/**
	 * Marshals a symbol into a Map.
	 * @param {symbol} data
	 * @returns {Map<symbol, symbol>}
	 */
	private marshalSymbolToMap (data: symbol): Map<Symbol, Symbol> {
		return new Map([[data, data]]);
	}

	/**
	 * Marshals a Function into a Map.
	 * @param {Function} data
	 * @returns {Map<Function, Function>}
	 */
	private marshalFunctionToMap (data: Function): Map<Function, Function> {
		return new Map([[data, data]]);
	}

	/**
	 * Marshals a Set into a Map.
	 * @param {Set<T>} data
	 * @returns {Map<{}, {}>}
	 */
	private marshalSetToMap<T> (data: Set<T>): Map<{}, {}> {

		try {
			return new Map(<any>data);
		} catch (ex) {
			return new Map(data.entries());
		}
	}

	/**
	 * Marshals an array into a Map.
	 * @param {T[]} data
	 * @returns {Map<number, T>}
	 */
	private marshalArrayToMap<T> (data: T[]): Map<number, T> {
		const map: Map<number, T> = new Map();
		data.forEach((key, index) => map.set(index, key));
		return map;
	}

	/**
	 * Marshals an object into a Map.
	 * @param {object} data
	 * @returns {Map<string, T>}
	 */
	private marshalObjectToMap<T> (data: { [key: string]: T }): Map<string, T> {
		return new Map(Object.entries(data));
	}

	/**
	 * Marshals a boolean into a Set.
	 * @param {boolean} data
	 * @returns {Map<boolean, boolean>}
	 */
	private marshalBooleanToMap (data: boolean|Boolean): Map<boolean, boolean> {
		const primitive = data instanceof Boolean ? data.valueOf() : data;
		return new Map([[primitive, primitive]]);
	}

	/**
	 * Marshals a number into a Map.
	 * @param {number} data
	 * @returns {Map<number, number>}
	 */
	private marshalNumberToMap (data: number|Number): Map<number, number> {
		const primitive = data instanceof Number ? data.valueOf() : data;
		return new Map([[primitive, primitive]]);
	}

	/**
	 * Marshals a string into an Array.
	 * @param {string} data
	 * @returns {string[]}
	 */
	private marshalStringToArray (data: string|String): string[] {
		const primitive = data instanceof String ? data.valueOf() : data;
		try {
			// It might be a stringified array.
			if (data.startsWith("[") && data.endsWith("]")) return JSON.parse(primitive);
		} catch (e) {
		}

		return [primitive];
	}

	/**
	 * Marshals a class into an Array.
	 * @param {{}} data
	 * @returns {{}[]}
	 */
	private marshalClassToArray (data: {}): {}[] {
		return [data];
	}

	/**
	 * Marshals a constructor into an Array.
	 * @param {Function} data
	 * @returns {Function[]}
	 */
	private marshalConstructorToArray (data: Function): Function[] {
		return [data];
	}

	/**
	 * Marshals undefined into an Array.
	 * @param {?} _
	 * @returns {?[]}
	 */
	private marshalUndefinedToArray (_: undefined): undefined[] {
		return [undefined];
	}

	/**
	 * Marshals null into an Array.
	 * @param {null} _
	 * @returns {null[]}
	 */
	private marshalNullToArray (_: null): null[] {
		return [null];
	}

	/**
	 * Marshals a symbol into an array.
	 * @param {symbol} data
	 * @returns {string[]}
	 */
	private marshalSymbolToArray (data: symbol): string[] {
		const match = data.toString().match(Marshaller.SYMBOL_REGEX);
		if (match == null) throw new ReferenceError(`${this.marshalSymbolToArray.name} was given an invalid symbol to marshal!`);
		return this.marshalStringToArray(match[1]);
	}

	/**
	 * Marshals a Function into an array.
	 * @param {Function} data
	 * @returns {Function[]}
	 */
	private marshalFunctionToArray (data: Function): Function[] {
		return [data];
	}

	/**
	 * Marshals a Map into a Set.
	 * @param {Map<{}, {}>} data
	 * @returns {Set<[{}, {}]>}
	 */
	private marshalMapToSet (data: Map<{}, {}>): Set<[{}, {}]> {
		return new Set(data);
	}

	/**
	 * Marshals a Map into an Array.
	 * @param {Map<{}, {}>} data
	 * @returns {[{}, {}][]}
	 */
	private marshalMapToArray (data: Map<{}, {}>): [{}, {}][] {
		return Array.from(data);
	}

	/**
	 * Marshals a set into an Array.
	 * @param {Set<T>} data
	 * @returns {T[]}
	 */
	private marshalSetToArray<T> (data: Set<T>): T[] {
		return Array.from(data);
	}

	/**
	 * Marshals an object into an Array.
	 * @param {object} data
	 * @returns {[string, T][]}
	 */
	private marshalObjectToArray<T> (data: object): [string, T][] {
		return Object.entries(data);
	}

	/**
	 * Marshals a boolean into an Array.
	 * @param {boolean} data
	 * @returns {boolean[]}
	 */
	private marshalBooleanToArray (data: boolean|Boolean): boolean[] {
		const primitive = data instanceof Boolean ? data.valueOf() : data;
		return [primitive];
	}

	/**
	 * Marshals a number into an Array.
	 * @param {number} data
	 * @returns {number[]}
	 */
	private marshalNumberToArray (data: number|Number): number[] {
		const primitive = data instanceof Number ? data.valueOf() : data;
		return [primitive];
	}

	/**
	 * Marshals an Array into an Object.
	 * @param {T[]} data
	 * @returns {object}
	 */
	private marshalArrayToObject<T> (data: T[]): { [key: number]: T } {
		const obj: { [key: string]: T } = {};
		for (let i = 0; i < data.length; i++) obj[i] = data[i];
		return obj;
	}

	/**
	 * Marshals a class into an Object.
	 * @param {{}} data
	 * @returns {object}
	 */
	private marshalClassToObject (data: {}): { [key: string]: {} } {
		const obj: { [key: string]: {} } = {};
		const instanceKeys = Object.getOwnPropertyNames(data.constructor.prototype);
		const staticKeys = Object.getOwnPropertyNames(data.constructor);
		instanceKeys.forEach(key => {
			const prop = (<{ [key: string]: {} }>data)[key];
			obj[key] = prop;
		});

		staticKeys.forEach(key => {
			obj[key] = (<any>data)["constructor"][key];
		});

		return obj;
	}

	/**
	 * Marshals a constructor into an Object.
	 * @param {Function} data
	 * @returns {object}
	 */
	private marshalConstructorToObject (data: Function): { [key: string]: {} } {
		const obj: { [key: string]: {} } = {};
		const staticKeys = Object.getOwnPropertyNames(data);
		staticKeys.forEach(key => {
			obj[key] = (<any>data)[key];
		});

		return obj;
	}

	/**
	 * Marshals a string into an Object.
	 * @param {string|String} data
	 * @returns {object}
	 */
	private marshalStringToObject (data: string|String): { [key: string]: string } {
		const primitive = data instanceof String ? data.valueOf() : data;
		const converted = this.attemptStringToObjectConversion(primitive);
		if (converted != null) return converted;

		const obj: { [key: number]: string } = {};
		for (let i = 0; i < primitive.length; i++) obj[i] = primitive[i];
		return obj;
	}

	/**
	 * Marshals undefined into an Object.
	 * @param {?} _
	 * @returns {object}
	 */
	private marshalUndefinedToObject (_: undefined): { [key: number]: undefined } {
		return {0: undefined};
	}

	/**
	 * Marshals a string into an Object.
	 * @param {null} _
	 * @returns {object}
	 */
	private marshalNullToObject (_: null): { [key: number]: null } {
		return {0: null};
	}

	/**
	 * Marshals a Function into an Object.
	 * @param {Function} data
	 * @returns {object}
	 */
	private marshalFunctionToObject (data: Function): { [key: string]: Function } {
		return {[data.name]: data};
	}

	/**
	 * Marshals a symbol into an object.
	 * @param {symbol} data
	 * @returns {object}
	 */
	private marshalSymbolToObject (data: symbol): { [key: string]: string } {
		const match = data.toString().match(Marshaller.SYMBOL_REGEX);
		if (match == null) throw new ReferenceError(`${this.marshalSymbolToObject.name} was given an invalid symbol to marshal!`);
		return this.marshalStringToObject(match[1]);
	}

	/**
	 * Marshals a Map into an Object.
	 * @param {Map<{}, {}>} data
	 * @returns {object}
	 */
	private marshalMapToObject (data: Map<{}, {}>): { [key: number]: {} } {
		const obj: { [key: number]: {} } = {};
		for (const entry of data.entries()) {
			const [key, value] = entry;
			obj[<any>key] = value;
		}
		return obj;
	}

	/**
	 * Marshals a Set into an Object.
	 * @param {Set<T>} data
	 * @returns {object}
	 */
	private marshalSetToObject<T> (data: Set<T>): { [key: number]: T } {
		const obj: { [key: number]: T } = {};
		const arr = Array.from(data.values());
		for (let i = 0; i < arr.length; i++) obj[i] = arr[i];
		return obj;
	}

	/**
	 * Marshals a boolean into an Object.
	 * @param {boolean} data
	 * @returns {object}
	 */
	private marshalBooleanToObject (data: boolean|Boolean): { 0: boolean } {
		const primitive = data instanceof Boolean ? data.valueOf() : data;
		return {0: primitive};
	}

	/**
	 * Marshals a number into an Object.
	 * @param {number} data
	 * @returns {object}
	 */
	private marshalNumberToObject (data: number|Number): { [key: number]: number } {
		const primitive = data instanceof Number ? data.valueOf() : data;
		return {0: primitive};
	}

	/**
	 * Marshals the given data, whatever the type, into a Map.
	 * @param {T} data
	 * @returns {Map<{}|null|?, {}|null|?>|null}
	 */
	private marshalToMap<T> (data: T): Map<{}|null|undefined, {}|null|undefined>|null {
		if (data === undefined) return this.marshalUndefinedToMap(data);
		if (data === null) return this.marshalNullToMap(data);
		if (data instanceof Map) return data;
		if (this.typeDetector.isBoolean(data)) return this.marshalBooleanToMap(data);
		if (this.typeDetector.isClassConstructor(data)) return this.marshalConstructorToMap(data);
		if (this.typeDetector.isClassInstance(data)) return this.marshalClassToMap(data);
		if (this.typeDetector.isFunction(data)) return this.marshalFunctionToMap(data);
		if (this.typeDetector.isString(data))  return this.marshalStringToMap(data);
		if (typeof data === "symbol") return this.marshalSymbolToMap(data);
		if (data instanceof Set)     return this.marshalSetToMap(data);
		if (Array.isArray(data))   return this.marshalArrayToMap(data);
		if (this.typeDetector.isObject(data))  return this.marshalObjectToMap(data);
		if (this.typeDetector.isNumber(data))  return this.marshalNumberToMap(data);
		return data == null ? null : data;
	}

	/**
	 * Marshals the given data, whatever the type, into a constructor.
	 * @param {T} data
	 * @returns {Function|null}
	 */
	private marshalToConstructor<T> (data: T): Function|null {
		if (data === undefined) return this.marshalUndefinedToConstructor(data);
		if (data === null) return this.marshalNullToConstructor(data);
		if (this.typeDetector.isBoolean(data)) return this.marshalBooleanToConstructor(data);
		if (this.typeDetector.isClassConstructor(data)) return data;
		if (this.typeDetector.isClassInstance(data)) return this.marshalClassToConstructor(data);
		if (this.typeDetector.isFunction(data)) return this.marshalFunctionToConstructor(data);
		if (this.typeDetector.isString(data))  return this.marshalStringToConstructor(data);
		if (typeof data === "symbol") return this.marshalSymbolToConstructor(data);
		if (data instanceof Map) return this.marshalMapToConstructor(data);
		if (data instanceof Set)     return this.marshalSetToConstructor(data);
		if (Array.isArray(data))   return this.marshalArrayToConstructor(data);
		if (this.typeDetector.isObject(data))  return this.marshalObjectToConstructor(data);
		if (this.typeDetector.isNumber(data))  return this.marshalNumberToConstructor(data);
		return data == null ? null : data;
	}

	/**
	 * Marshals the given data, whatever the type, into a class instance.
	 * @param {T} data
	 * @returns {{}|null}
	 */
	private marshalToClass<T> (data: T): {}|null {
		if (data === undefined) return this.marshalUndefinedToClass(data);
		if (data === null) return this.marshalNullToClass(data);
		if (this.typeDetector.isBoolean(data)) return this.marshalBooleanToClass(data);
		if (this.typeDetector.isClassConstructor(data)) return this.marshalConstructorToClass(<any>data);
		if (this.typeDetector.isClassInstance(data)) return data;
		if (this.typeDetector.isFunction(data)) return this.marshalFunctionToClass(data);
		if (this.typeDetector.isString(data))  return this.marshalStringToClass(data);
		if (typeof data === "symbol") return this.marshalSymbolToClass(data);
		if (data instanceof Map) return this.marshalMapToClass(data);
		if (data instanceof Set)     return this.marshalSetToClass(data);
		if (Array.isArray(data))   return this.marshalArrayToClass(data);
		if (this.typeDetector.isObject(data))  return this.marshalObjectToClass(data);
		if (this.typeDetector.isNumber(data))  return this.marshalNumberToClass(data);
		return data == null ? null : data;
	}

	/**
	 * Marshals the given data, whatever the type, into a boolean.
	 * @param {T} data
	 * @returns {boolean|null}
	 */
	private marshalToBoolean<T> (data: T): boolean|null {
		if (data === undefined) return this.marshalUndefinedToBoolean(data);
		if (data === null) return this.marshalNullToBoolean(data);
		if (this.typeDetector.isBoolean(data)) return data;
		if (this.typeDetector.isClassConstructor(data)) return this.marshalConstructorToBoolean(<Function>data);
		if (this.typeDetector.isClassInstance(data)) return this.marshalClassToBoolean(data);
		if (this.typeDetector.isFunction(data)) return this.marshalFunctionToBoolean(data);
		if (this.typeDetector.isString(data))  return this.marshalStringToBoolean(data);
		if (typeof data === "symbol") return this.marshalSymbolToBoolean(data);
		if (data instanceof Map) return this.marshalMapToBoolean(data);
		if (data instanceof Set)     return this.marshalSetToBoolean(data);
		if (Array.isArray(data))   return this.marshalArrayToBoolean(data);
		if (this.typeDetector.isObject(data))  return this.marshalObjectToBoolean(data);
		if (this.typeDetector.isNumber(data))  return this.marshalNumberToBoolean(data);
		return data == null ? null : false;
	}

	/**
	 * Marshals the given data, whatever the type, into a number.
	 * @param {T} data
	 * @returns {number|null}
	 */
	private marshalToNumber<T> (data: T): number|null {
		if (data === undefined) return this.marshalUndefinedToNumber(data);
		if (data === null) return this.marshalNullToNumber(data);
		if (this.typeDetector.isNumber(data))   return data;
		if (this.typeDetector.isClassConstructor(data)) return this.marshalConstructorToNumber(<Function>data);
		if (this.typeDetector.isClassInstance(data)) return this.marshalClassToNumber(data);
		if (this.typeDetector.isFunction(data)) return this.marshalFunctionToNumber(data);
		if (this.typeDetector.isString(data))  return this.marshalStringToNumber(data);
		if (typeof data === "symbol") return this.marshalSymbolToNumber(data);
		if (data instanceof Map) return this.marshalMapToNumber(data);
		if (data instanceof Set)     return this.marshalSetToNumber(data);
		if (Array.isArray(data))   return this.marshalArrayToNumber(data);
		if (this.typeDetector.isObject(data))  return this.marshalObjectToNumber(data);
		if (this.typeDetector.isBoolean(data)) return this.marshalBooleanToNumber(data);
		return data == null ? null : 0;
	}

	/**
	 * Marshals the given data, whatever the type, into a symbol.
	 * @param {T} data
	 * @returns {symbol|null}
	 */
	private marshalToSymbol<T> (data: T): symbol|null {
		if (data === undefined) return this.marshalUndefinedToSymbol(data);
		if (data === null) return this.marshalNullToSymbol(data);
		if (typeof data === "symbol") return data;
		if (this.typeDetector.isClassConstructor(data)) return this.marshalConstructorToSymbol(<Function>data);
		if (this.typeDetector.isClassInstance(data)) return this.marshalClassToSymbol(data);
		if (this.typeDetector.isFunction(data)) return this.marshalFunctionToSymbol(data);
		if (this.typeDetector.isString(data)) return this.marshalStringToSymbol(data);
		if (data instanceof Map) return this.marshalMapToSymbol(data);
		if (data instanceof Set)      return this.marshalSetToSymbol(data);
		if (Array.isArray(data))    return this.marshalArrayToSymbol(data);
		if (this.typeDetector.isObject(data))  return this.marshalObjectToSymbol(data);
		if (this.typeDetector.isBoolean(data))  return this.marshalBooleanToSymbol(data);
		if (this.typeDetector.isNumber(data))    return this.marshalNumberToSymbol(data);
		if (data == null) return null;
		return Symbol(data);
	}

	/**
	 * Marshals the given data, whatever the type, into a string.
	 * @param {T} data
	 * @returns {string|null}
	 */
	private marshalToString<T> (data: T): string|null {
		if (<{}>data === GlobalObject) return GlobalObjectIdentifier;
		if (data === undefined) return this.marshalUndefinedToString(data);
		if (data === null) return this.marshalNullToString(data);
		if (this.typeDetector.isString(data)) return (<String>data instanceof String ? <string>data.valueOf() : data);
		if (this.typeDetector.isClassConstructor(data)) return this.marshalConstructorToString(<Function>data);
		if (this.typeDetector.isClassInstance(data)) return this.marshalClassToString(data);
		if (this.typeDetector.isFunction(data)) return this.marshalFunctionToString(data);
		if (typeof data === "symbol") return this.marshalSymbolToString(data);
		if (data instanceof Map) return this.marshalMapToString(data);
		if (data instanceof Set)      return this.marshalSetToString(data);
		if (Array.isArray(data))    return this.marshalArrayToString(data);
		if (this.typeDetector.isObject(data))  return this.marshalObjectToString(data);
		if (this.typeDetector.isBoolean(data))  return this.marshalBooleanToString(data);
		if (this.typeDetector.isNumber(data))    return this.marshalNumberToString(data);
		if (data == null) return null;
		return data;
	}

	/**
	 * Marshals the given data, whatever the type, into a Function.
	 * @param {T} data
	 * @returns {Function|null}
	 */
	private marshalToFunction<T> (data: T): Function|null {
		if (data === undefined) return this.marshalUndefinedToFunction(data);
		if (data === null) return this.marshalNullToFunction(data);
		if (this.typeDetector.isClassConstructor(data)) return this.marshalConstructorToFunction(<Function>data);
		if (this.typeDetector.isClassInstance(data)) return this.marshalClassToFunction(data);
		if (this.typeDetector.isFunction(data)) return data;
		if (this.typeDetector.isString(data)) return this.marshalStringToFunction(data);
		if (typeof data === "symbol") return this.marshalSymbolToFunction(data);
		if (data instanceof Map) return this.marshalMapToFunction(data);
		if (data instanceof Set)      return this.marshalSetToFunction(data);
		if (Array.isArray(data))    return this.marshalArrayToFunction(data);
		if (this.typeDetector.isObject(data))  return this.marshalObjectToFunction(data);
		if (this.typeDetector.isBoolean(data))  return this.marshalBooleanToFunction(data);
		if (this.typeDetector.isNumber(data))    return this.marshalNumberToFunction(data);
		if (data == null) return null;
		return () => data;
	}

	/**
	 * Marshals the given data, whatever the type, into a Set.
	 * @param {T} data
	 * @returns {Set<{}|null|?>|null}
	 */
	private marshalToSet<T> (data: T): Set<{}|null|undefined>|null {
		if (data === undefined) return this.marshalUndefinedToSet(data);
		if (data === null) return this.marshalNullToSet(data);
		if (data instanceof Map) return this.marshalMapToSet(data);
		if (data instanceof Set)      return data;
		if (this.typeDetector.isString(data))   return this.marshalStringToSet(data);
		if (this.typeDetector.isClassConstructor(data)) return this.marshalConstructorToSet(<Function>data);
		if (this.typeDetector.isClassInstance(data)) return this.marshalClassToSet(data);
		if (this.typeDetector.isFunction(data)) return this.marshalFunctionToSet(data);
		if (typeof data === "symbol") return this.marshalSymbolToSet(data);
		if (Array.isArray(data))    return this.marshalArrayToSet(data);
		if (this.typeDetector.isObject(data))    return this.marshalObjectToSet(data);
		if (this.typeDetector.isBoolean(data))  return this.marshalBooleanToSet(data);
		if (this.typeDetector.isNumber(data))   return this.marshalNumberToSet(data);
		return data == null ? null : new Set();
	}

	/**
	 * Marshals the given data, whatever the type, into an Array.
	 * @param {T} data
	 * @returns {({}|null|?)[]|null}
	 */
	private marshalToArray<T> (data: T): ({}|null|undefined)[]|null {
		if (data === undefined) return this.marshalUndefinedToArray(data);
		if (data === null) return this.marshalNullToArray(data);
		if (Array.isArray(data))    return data;
		if (this.typeDetector.isString(data))   return this.marshalStringToArray(data);
		if (this.typeDetector.isClassConstructor(data)) return this.marshalConstructorToArray(<Function>data);
		if (this.typeDetector.isClassInstance(data)) return this.marshalClassToArray(data);
		if (this.typeDetector.isFunction(data)) return this.marshalFunctionToArray(data);
		if (typeof data === "symbol") return this.marshalSymbolToArray(data);
		if (data instanceof Map) return this.marshalMapToArray(data);
		if (data instanceof Set)      return this.marshalSetToArray(data);
		if (this.typeDetector.isObject(data))    return this.marshalObjectToArray(data);
		if (this.typeDetector.isBoolean(data))  return this.marshalBooleanToArray(data);
		if (this.typeDetector.isNumber(data))   return this.marshalNumberToArray(data);
		return data == null ? null : [];
	}

	/**
	 * Marshals the given data, whatever the type, into an Object.
	 * @param {T} data
	 * @returns {IArbitraryObject<{}|null|?>|null}
	 */
	private marshalToObject<T> (data: T): IArbitraryObject|null {
		if (data === undefined) return this.marshalUndefinedToObject(data);
		if (data === null) return this.marshalNullToObject(data);
		if (this.typeDetector.isObject(data))    return data;
		if (this.typeDetector.isClassConstructor(data)) return this.marshalConstructorToObject(<Function>data);
		if (this.typeDetector.isClassInstance(data)) return this.marshalClassToObject(data);
		if (this.typeDetector.isFunction(data)) return this.marshalFunctionToObject(data);
		if (Array.isArray(data))    return this.marshalArrayToObject(data);
		if (typeof data === "symbol") return this.marshalSymbolToObject(data);
		if (this.typeDetector.isString(data))   return this.marshalStringToObject(data);
		if (data instanceof Map) return this.marshalMapToObject(data);
		if (data instanceof Set)      return this.marshalSetToObject(data);
		if (this.typeDetector.isBoolean(data))  return this.marshalBooleanToObject(data);
		if (this.typeDetector.isNumber(data))   return this.marshalNumberToObject(data);
		return data == null ? null : {};
	}

	/**
	 * Marshals the given data, whatever the type, into null.
	 * @param {T} data
	 * @returns {null}
	 */
	private marshalToNull<T> (data: T): null {
		if (data === undefined) return this.marshalUndefinedToNull(data);
		if (data == null) return null;
		if (this.typeDetector.isObject(data))    return this.marshalObjectToNull(<any>data);
		if (this.typeDetector.isClassConstructor(data)) return this.marshalConstructorToNull(<Function>data);
		if (this.typeDetector.isClassInstance(data)) return this.marshalClassToNull(data);
		if (this.typeDetector.isFunction(data)) return this.marshalFunctionToNull(data);
		if (Array.isArray(data))    return this.marshalArrayToNull(data);
		if (typeof data === "symbol") return this.marshalSymbolToNull(data);
		if (this.typeDetector.isString(data))   return this.marshalStringToNull(data);
		if (data instanceof Map) return this.marshalMapToNull(data);
		if (data instanceof Set)      return this.marshalSetToNull(data);
		if (this.typeDetector.isBoolean(data))  return this.marshalBooleanToNull(data);
		if (this.typeDetector.isNumber(data))   return this.marshalNumberToNull(data);
		return null;
	}

	/**
	 * Marshals the given data into the most fitting type based on heuristics.
	 * @param {T} data
	 * @returns {object|null}
	 */
	private marshalToBestGuess<T> (data: T): {}|null|undefined {
		if (data === undefined) return undefined;
		if (data === null) return null;
		if (this.typeDetector.isString(data)) return this.marshalFromStringToBestGuess(data);
		if (typeof data === "symbol") return this.marshalFromSymbolToBestGuess(data);
		return data;
	}

	/**
	 * Parses the symbol and and marshals it into the most fitting type based on heuristics.
	 * @param {symbol} data
	 * @returns {{}|null}
	 */
	private marshalFromSymbolToBestGuess (data: symbol): {}|null|undefined {
		const stringified = this.marshalSymbolToString(data);
		return this.marshalFromStringToBestGuess(stringified);
	}

	/**
	 * If the string starts with a number but should be a string nevertheless, this method returns true.
	 * @param {string} value
	 * @returns {boolean}
	 */
	private startsWithNumberButShouldEnforceString (value: string): boolean {
		// If the value starts with a digit and possibly a '.' character but then goes on with something
		// else, enforce a string.
		return /^\d+[.]*[^\d.]+/.test(value.trim());
	}

	/**
	 * Parses the string and and marshals it into the most fitting type based on heuristics.
	 * @param {string} data
	 * @returns {{}|null}
	 */
	private marshalFromStringToBestGuess (data: string|String): {}|null|undefined {
		if (data === undefined) return undefined;
		if (data === null) return null;

		const primitive = data instanceof String ? data.valueOf() : data;

		// It might be a boolean.
		if (primitive === "true") return true;
		if (primitive === "false") return false;
		if (primitive === "null") return null;
		if (primitive === "undefined") return undefined;
		if (primitive === "NaN") return NaN;
		if (primitive === "Infinity") return Infinity;

		if (Marshaller.CLASS_INSTANCE_REGEX.test(primitive)) {
			return this.marshalStringToClass(primitive);
		}

		if (Marshaller.SYMBOL_REGEX.test(primitive)) {
			return this.marshalStringToSymbol(primitive);
		}

		if (primitive.trim().startsWith("class ")) return this.marshalStringToConstructor(data);

		// It might be a number.
		const toNum = Number.parseFloat(primitive);
		if (!isNaN(toNum)) {
			if (this.startsWithNumberButShouldEnforceString(primitive)) return primitive;
			return toNum;
		}

		if (Marshaller.FUNCTION_REGEX_1.test(primitive.trim())) return new Function(`return ${primitive}`)();
		if (Marshaller.FUNCTION_REGEX_2.test(primitive.trim())) return new Function(`return ${primitive}`)();
		if (Marshaller.FUNCTION_REGEX_3.test(primitive.trim())) return new Function(`return ${primitive}`)();

		const asObj = this.attemptStringToObjectConversion(primitive);
		if (asObj != null) return asObj;

		try {
			return JSON.parse(primitive);
		} catch (e) {
			return primitive;
		}
	}

	/**
	 * Marshals from the given type into the other hint type.
	 * @param {T} data
	 * @param {Newable<U>|U} to
	 * @returns {{}|null}
	 */
	private marshalTo<T> (data: T, to: any): {}|null {
		if (typeof to === null) return this.marshalToNull(data);
		if (typeof to === "symbol" || to === Symbol) return this.marshalToSymbol(data);
		if (typeof to === <any>"constructor" || this.typeDetector.isClassConstructor(to)) return this.marshalToConstructor(data);
		if (typeof to === <any>"class" || this.typeDetector.isClassInstance(to)) return this.marshalToClass(data);
		if (this.typeDetector.isString(to) || to === String) return this.marshalToString(data);
		if (to instanceof Map || to === Map) return this.marshalToMap(data);
		if (to instanceof Set || to === Set) return this.marshalToSet(data);
		if (Array.isArray(to) || to === Array) return this.marshalToArray(data);
		if (this.typeDetector.isObject(to) || to === Object) return this.marshalToObject(data);
		if (this.typeDetector.isBoolean(to) || to === Boolean) return this.marshalToBoolean(data);
		if (this.typeDetector.isNumber(to) || to === Number) return this.marshalToNumber(data);
		if (this.typeDetector.isFunction(to) || to === <{}>Function) return this.marshalToFunction(data);
		return this.marshalToString(data);
	}

	/**
	 * Returns true if the given content is a quote.
	 * @param {string} content
	 * @returns {boolean}
	 */
	private isQuote (content: string): boolean {
		return /["'`]/.test(content);
	}

	/**
	 * Quotes the given string if needed. It will escape the string if it already starts and/or ends with a clashing quote.
	 * @param {string} content
	 * @returns {string}
	 */
	private quoteIfNecessary (content: string): string {
		if (!(typeof content === "string")) return content;
		const firstChar = content[0];
		const lastChar = content[content.length - 1];
		if (this.isQuote(firstChar) && this.isQuote(lastChar)) return content;
		let str = "`";
		const startsWithClashingQuote = firstChar === "`";
		const endsWithClashingQuote = lastChar === "`";
		const startOffset = startsWithClashingQuote ? 1 : 0;
		const endOffset = endsWithClashingQuote ? 1 : 0;
		if (startsWithClashingQuote) str += "\`";
		str += content.slice(startOffset, content.length - endOffset);
		if (endsWithClashingQuote) str += "\`";
		str += "`";
		return str;
	}

	/**
	 * Attempts to convert a string into a regular object. Returns null if it fails.
	 * @param {string} primitive
	 * @returns {object|null}
	 */
	private attemptStringToObjectConversion (primitive: string): { [key: string]: string }|null {
		try {
			return JSON.parse(primitive);
		} catch (e) {
			try {
				const evaluated = new Function(`return (${primitive})`)();
				if (this.typeDetector.isObject(evaluated)) return <{ [key: string]: string }>evaluated;
				return null;
			} catch (e) {
				return null;
			}
		}
	}

	/**
	 * Returns true if the given string is an arrow function.
	 * @param {string} str
	 * @returns {boolean}
	 */
	private isArrowFunction (str: string): boolean {
		if (this.getTypeOf(this.marshal(str)) !== "function") return false;
		const trimmed = str.trim();
		return !this.functionHasFunctionKeyword(str) && trimmed.includes("=>");
	}

	/**
	 * Returns true if the given stringified function starts with the "function" keyword.
	 * @param {string} str
	 * @returns {boolean}
	 */
	private functionHasFunctionKeyword (str: string): boolean {
		const trimmed = str.trim();
		return trimmed.startsWith("function");
	}

	/**
	 * Returns true if the given string starts with the "class" keyword.
	 * @param {string} str
	 * @returns {boolean}
	 */
	private isClass (str: string): boolean {
		const trimmed = str.trim();
		return trimmed.startsWith("class");
	}

	/**
	 * Extracts the name of the class (if the string is a class declaration).
	 * @param {string} str
	 * @returns {string}
	 */
	private takeClassName (str: string): string|null {
		const match = str.match(/class\s+([^\s\n\t\r{]*)[\s\n\t\r{]/);
		return match == null ? null : match[1];
	}

	/**
	 * Formats an object so it fits a reconstructed object literal from a string.
	 * @param {string} str
	 * @returns {string}
	 */
	private formatObjectLiteralFunction (str: string): string {
		if (this.isArrowFunction(str)) return str;
		if (this.functionHasFunctionKeyword(str)) return str;
		if (this.isClass(str)) {
			const className = this.takeClassName(str);
			if (className != null) return className;
		}
		return `function ${str}`;
	}

}
/*tslint:enable*/