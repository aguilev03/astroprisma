const {
	ArrayField,
	BooleanField,
	StringField
} = foundry.data.fields;

export const WEAPON_STATS = ["vigor", "grace", "mind", "tech"] as const;
export const CHARACTER_ITEM_TYPES = ["weapon", "weaponMod", "armor", "questItem", "misc"] as const;
export const ASTROPRISMA_ITEM_TYPES = [...CHARACTER_ITEM_TYPES] as const;

export type WeaponStat = (typeof WEAPON_STATS)[number];
export type AstroprismaItemType = (typeof ASTROPRISMA_ITEM_TYPES)[number];

export interface ItemSchema extends foundry.data.fields.DataSchema {
	description: string;
	damageDie: string;
	stat: WeaponStat;
	mods: string[];
	equipped: boolean;
	damageBonusFormula: string;
	statOverride: "" | WeaponStat;
	effectNotes: string;
	[key: string]: any;
}

function textField(initial = "") {
	return new StringField({
		required: true,
		initial
	});
}

export function defineItemSchema() {
	return {
		description: textField(),
		damageDie: textField("1d4"),
		stat: textField("vigor"),
		mods: new ArrayField(new StringField(), {
			required: true,
			initial: []
		}),
		equipped: new BooleanField({
			required: true,
			initial: false
		}),
		damageBonusFormula: textField(),
		statOverride: textField(),
		effectNotes: textField()
	};
}

export function migrateItemSource(source: Record<string, unknown>) {
	source.description ??= "";
	source.damageDie ??= "1d4";
	source.stat ??= "vigor";
	source.mods ??= [];
	source.equipped ??= false;
	source.damageBonusFormula ??= "";
	source.statOverride ??= "";
	source.effectNotes ??= "";

	return source;
}

export function getAllowedItemTypes(actorType: string): readonly AstroprismaItemType[] {
	if (actorType === "starship") return [];
	return CHARACTER_ITEM_TYPES;
}

export function isItemTypeAllowed(actorType: string, itemType: string): itemType is AstroprismaItemType {
	return getAllowedItemTypes(actorType).includes(itemType as AstroprismaItemType);
}
