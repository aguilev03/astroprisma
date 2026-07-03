const {
	ArrayField,
	BooleanField,
	NumberField,
	SchemaField,
	StringField
} = foundry.data.fields;

export const CHARACTER_ITEM_TYPES = ["weapon", "armor", "gear", "consumable", "talent", "ability"] as const;
export const STARSHIP_ITEM_TYPES = ["shipWeapon", "shipModule"] as const;
export const ASTROPRISMA_ITEM_TYPES = [...CHARACTER_ITEM_TYPES, ...STARSHIP_ITEM_TYPES] as const;

export type AstroprismaItemType = (typeof ASTROPRISMA_ITEM_TYPES)[number];
export type CharacterItemType = (typeof CHARACTER_ITEM_TYPES)[number];
export type StarshipItemType = (typeof STARSHIP_ITEM_TYPES)[number];

export interface ItemSchema extends foundry.data.fields.DataSchema {
	description: string;
	quantity: number;
	equipped: boolean;
	damage: string;
	range: string;
	attackBonus: number;
	defenseBonus: number;
	cost: number;
	weight: number;
	tags: string[];
	[key: string]: any;
}

function textField() {
	return new StringField({
		required: true,
		initial: ""
	});
}

function numberField(initial = 0) {
	return new NumberField({
		required: true,
		integer: false,
		min: 0,
		initial
	});
}

export function defineItemSchema() {
	return {
		description: textField(),
		quantity: new NumberField({
			required: true,
			integer: true,
			min: 0,
			initial: 1
		}),
		equipped: new BooleanField({
			required: true,
			initial: false
		}),
		damage: textField(),
		range: textField(),
		attackBonus: numberField(),
		defenseBonus: numberField(),
		cost: numberField(),
		weight: numberField(),
		tags: new ArrayField(new StringField(), {
			required: true,
			initial: []
		})
	};
}

export function migrateItemSource(source: Record<string, unknown>) {
	source.description ??= "";
	source.quantity ??= 1;
	source.equipped ??= false;
	source.damage ??= "";
	source.range ??= "";
	source.attackBonus ??= 0;
	source.defenseBonus ??= 0;
	source.cost ??= 0;
	source.weight ??= 0;
	source.tags ??= [];

	return source;
}

export function getAllowedItemTypes(actorType: string): readonly AstroprismaItemType[] {
	if (actorType === "starship") return STARSHIP_ITEM_TYPES;
	return CHARACTER_ITEM_TYPES;
}

export function isItemTypeAllowed(actorType: string, itemType: string): itemType is AstroprismaItemType {
	return getAllowedItemTypes(actorType).includes(itemType as AstroprismaItemType);
}
