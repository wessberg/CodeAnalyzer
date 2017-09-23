import {Modifier, Node, NodeArray} from "typescript";
import {VisibilityKind} from "../../dict/visibility/visibility-kind";
import {ModifierKind} from "../../dict/modifier/modifier-kind";

export interface IModifierService {
	getModifierName (modifier: Modifier): string;
	hasModifierWithName (name: string, node: Node): boolean;
	createModifierFromString (modifier: ModifierKind): Modifier;
	createModifiersFromStrings (modifiers: Iterable<ModifierKind>): NodeArray<Modifier>;
	createVisibilityModifier (modifier: VisibilityKind): Modifier;
	createConstModifier (): Modifier;
	createDeclareModifier (): Modifier;
	createDefaultModifier (): Modifier;
	createExportModifier (): Modifier;
	createReadonlyModifier (): Modifier;
	createPrivateModifier (): Modifier;
	createPublicModifier (): Modifier;
	createProtectedModifier (): Modifier;
	createAsyncModifier (): Modifier;
	createStaticModifier (): Modifier;
	createAbstractModifier (): Modifier;
}