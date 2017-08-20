import {test} from "ava";
import {ICodeAnalyzer} from "../src/code-analyzer/i-code-analyzer";
import {CodeAnalyzer} from "../src/code-analyzer/code-analyzer";

let codeAnalyzer: ICodeAnalyzer;
test.beforeEach(() => codeAnalyzer = new CodeAnalyzer());

test("foo", t => {
	const interfaces = codeAnalyzer.getInterfacesForFile("./test/static/foo");
	interfaces.forEach(item => {console.log(item.toString());});
	t.true(true);
});