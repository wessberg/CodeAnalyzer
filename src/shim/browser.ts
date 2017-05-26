import * as jsdom from "jsdom";

const {JSDOM} = <any>jsdom;

const dom = new JSDOM();

function addWindow (): void {
	if (!("window" in global)) Object.defineProperty(global, "window", {value: dom.window, writable: true});
	else {
		Object.keys(dom.window).forEach(property => {
			if (!(property in (<any>global).window)) Object.defineProperty((<any>global).window, property, {value: dom.window[property], writable: true});
		});
	}
}

function addWindowPropertiesToGlobal (): void {
	Object.keys(dom.window).forEach(property => {
		if (!(property in global)) Object.defineProperty(global, property, {value: dom.window[property], writable: true});
	});
}

addWindow();
addWindowPropertiesToGlobal();

// Add in the most relevant DOM APIs:
const document = (<any>global).document;
const HTMLElement = document.body.constructor.__proto__;
const Element = document.body.constructor.__proto__.__proto__;
const Node = document.body.constructor.__proto__.__proto__.__proto__;
const EventTarget = document.body.constructor.__proto__.__proto__.__proto__.__proto__;

if (!("HTMLElement" in global)) Object.defineProperty(global, "HTMLElement", {value: HTMLElement, writable: true});
if (!("Element" in global)) Object.defineProperty(global, "Element", {value: Element, writable: true});
if (!("Node" in global)) Object.defineProperty(global, "Node", {value: Node, writable: true});
if (!("EventTarget" in global)) Object.defineProperty(global, "EventTarget", {value: EventTarget, writable: true});