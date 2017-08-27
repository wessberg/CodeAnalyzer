import {test} from "ava";
import {ICodeAnalyzer} from "../src/code-analyzer/i-code-analyzer";
import {CodeAnalyzer} from "../src/code-analyzer/code-analyzer";

let codeAnalyzer: ICodeAnalyzer;
test.beforeEach(() => codeAnalyzer = new CodeAnalyzer());

test("foo", t => {
	const expressions = codeAnalyzer.getClassesForFile("@wessberg/stringutil/dist/es2015/string-util/string-util");
	expressions.forEach(expression => {
		console.log(expression);
		console.log(expression.toString());
	});
	t.true(true);
});