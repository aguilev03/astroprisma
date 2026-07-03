const {
	BooleanField,
	NumberField,
	SchemaField,
	StringField
} = foundry.data.fields;

export interface CharacterSchema extends foundry.data.fields.DataSchema {
	origin: string;
	health: Meter;
	energy: Meter;
	armor: number;
	exp: number;
	hyperdrive: number;
	attributes: AttributeScores;
	conditions: CharacterConditions;
	memorySlots: number;
	weapons: string;
	inventory: string;
	cybertech: string;
	notes: string;
	[key: string]: any;
}

export interface StarshipSchema extends foundry.data.fields.DataSchema {
	shipType: string;
	hull: Meter;
	shields: Meter;
	fuel: Meter;
	control: number;
	engines: number;
	modules: string;
	cargoHold: string;
	crew: string;
	conditions: string;
	notes: string;
	[key: string]: any;
}

export interface Meter {
	value: number;
	max: number;
}

export interface AttributeScores {
	vigor: number;
	grace: number;
	mind: number;
	tech: number;
}

export interface CharacterConditions {
	stun: boolean;
	breach: boolean;
	shock: boolean;
	silence: boolean;
	immunity: boolean;
	overheat: boolean;
}

function meterField(initial: number) {
	return new SchemaField({
		value: new NumberField({
			required: true,
			integer: true,
			min: 0,
			initial
		}),
		max: new NumberField({
			required: true,
			integer: true,
			min: 0,
			initial
		})
	});
}

function numberField(initial = 0) {
	return new NumberField({
		required: true,
		integer: true,
		min: 0,
		initial
	});
}

function textField() {
	return new StringField({
		required: true,
		initial: ""
	});
}

export function defineCharacterSchema() {
	return {
		origin: textField(),
		health: meterField(10),
		energy: meterField(10),
		armor: numberField(),
		exp: numberField(),
		hyperdrive: numberField(),
		attributes: new SchemaField({
			vigor: numberField(),
			grace: numberField(),
			mind: numberField(),
			tech: numberField()
		}),
		conditions: new SchemaField({
			stun: new BooleanField({ required: true, initial: false }),
			breach: new BooleanField({ required: true, initial: false }),
			shock: new BooleanField({ required: true, initial: false }),
			silence: new BooleanField({ required: true, initial: false }),
			immunity: new BooleanField({ required: true, initial: false }),
			overheat: new BooleanField({ required: true, initial: false })
		}),
		memorySlots: numberField(),
		weapons: textField(),
		inventory: textField(),
		cybertech: textField(),
		notes: textField()
	};
}

export function defineStarshipSchema() {
	return {
		shipType: textField(),
		hull: meterField(20),
		shields: meterField(10),
		fuel: meterField(10),
		control: numberField(),
		engines: numberField(),
		modules: textField(),
		cargoHold: textField(),
		crew: textField(),
		conditions: textField(),
		notes: textField()
	};
}

export function migrateCharacterSource(source: Record<string, unknown>) {
	source.origin ??= "";
	source.health ??= { value: 10, max: 10 };
	source.energy ??= { value: 10, max: 10 };
	source.armor ??= 0;
	source.exp ??= 0;
	source.hyperdrive ??= 0;
	source.attributes ??= {
		vigor: 0,
		grace: 0,
		mind: 0,
		tech: 0
	};
	source.conditions ??= {
		stun: false,
		breach: false,
		shock: false,
		silence: false,
		immunity: false,
		overheat: false
	};
	source.memorySlots ??= 0;
	source.weapons ??= "";
	source.inventory ??= "";
	source.cybertech ??= "";
	source.notes ??= "";

	return source;
}

export function migrateStarshipSource(source: Record<string, unknown>) {
	source.shipType ??= "";
	source.hull ??= { value: 20, max: 20 };
	source.shields ??= { value: 10, max: 10 };
	source.fuel ??= { value: 10, max: 10 };
	source.control ??= 0;
	source.engines ??= 0;
	source.modules ??= "";
	source.cargoHold ??= "";
	source.crew ??= "";
	source.conditions ??= "";
	source.notes ??= "";

	return source;
}

export function clampMeter(meter: Meter | undefined, fallbackMax: number) {
	if (!meter) return;
	meter.max = Math.max(0, meter.max ?? fallbackMax);
	meter.value = Math.clamp(meter.value ?? 0, 0, meter.max);
}
