import * as jsdom from "jsdom";

const {JSDOM} = </*tslint:disable:no-any*/any/*tslint:enable:no-any*/>jsdom;
const dom = new JSDOM();

/**
 * Adds the 'window' object and its relevant members to the environment, if it doesn't exist already.
 */
function addWindow (): void {
	if (!("window" in global)) Object.defineProperty(global, "window", {value: dom.window, writable: true});
	else {
		Object.keys(dom.window).forEach(property => {
			if (!(property in (</*tslint:disable:no-any*/any/*tslint:enable:no-any*/>global).window)) Object.defineProperty((/*tslint:disable:no-any*/<any/*tslint:enable:no-any*/>global).window, property, {value: dom.window[property], writable: true});
		});
	}
}

/**
 * Adds all relevant window properties to the global object (if they don't exist in the global object already).
 */
function addWindowPropertiesToGlobal (): void {
	Object.keys(dom.window).forEach(property => {
		if (!(property in global)) Object.defineProperty(global, property, {value: dom.window[property], writable: true});
	});
}

addWindow();
addWindowPropertiesToGlobal();

// Add in the most relevant DOM APIs:
const document = (</*tslint:disable:no-any*/any/*tslint:enable:no-any*/>global).document;
const htmlElement = document.body.constructor.__proto__;
const element = document.body.constructor.__proto__.__proto__;
const node = document.body.constructor.__proto__.__proto__.__proto__;
const eventTarget = document.body.constructor.__proto__.__proto__.__proto__.__proto__;

if (!("HTMLElement" in global)) Object.defineProperty(global, "HTMLElement", {value: htmlElement, writable: true});
if (!("Element" in global)) Object.defineProperty(global, "Element", {value: element, writable: true});
if (!("Node" in global)) Object.defineProperty(global, "Node", {value: node, writable: true});
if (!("EventTarget" in global)) Object.defineProperty(global, "EventTarget", {value: eventTarget, writable: true});