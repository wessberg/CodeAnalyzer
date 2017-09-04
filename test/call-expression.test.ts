import {test} from "ava";
import {ICodeAnalyzer} from "../src/code-analyzer/i-code-analyzer";
import {CodeAnalyzer} from "../src/code-analyzer/code-analyzer";

let codeAnalyzer: ICodeAnalyzer;
test.beforeEach(() => codeAnalyzer = new CodeAnalyzer());

test("foo", t => {
	const expressions = codeAnalyzer.getCallExpressionsForFile("./test/static/call-expression/a");
	expressions.forEach(_expression => {
		console.log(codeAnalyzer.getDefinitionMatchingExpression(_expression.typeArguments[0]));
	});
	t.true(true);
});