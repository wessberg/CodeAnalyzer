import {test} from "ava";
import {ICodeAnalyzer} from "../src/code-analyzer/i-code-analyzer";
import {CodeAnalyzer} from "../src/code-analyzer/code-analyzer";

let codeAnalyzer: ICodeAnalyzer;
test.beforeEach(() => codeAnalyzer = new CodeAnalyzer());

test("foo", t => {
	const expressions = codeAnalyzer.getClassesForFile("./test/static/class/b");
	expressions.forEach(_expression => {
		_expression.members.forEach(member => console.log(member));
	});
	t.true(true);
});