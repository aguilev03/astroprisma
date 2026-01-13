const { TypeDataModel } = foundry.abstract;
const { HTMLField, SchemaField, NumberField, StringField, FilePathField, ArrayField } = foundry.data.fields;

export interface PcSchema extends foundry.data.fields.DataSchema {
	xp: number;
	level: number;
	health: {
		value: number;
		max: number;
	};
	proficiencies: {
		weapons: string[];
		skills: string[];
	}
	crest: string | null;
	biography: string;
	[key: string]: any;
}

export class PcDataModel extends TypeDataModel<PcSchema, Actor> {

	static defineSchema() {

		return {
			xp: new NumberField({
				required: true,
				integer: true,
				min: 0,
				initial: 0
			}),
			level: new NumberField({
				required: true,
				integer: true,
				min: 1,
				initial: 1
			}),
			health: new SchemaField({
				value: new NumberField({
					required: true,
					integer: true,
					min: 0,
					initial: 10
				}),
				max: new NumberField({
					required: true,
					integer: true,
					min: 1,
					initial: 10
				})
			}),
			proficiencies: new SchemaField({
				weapons: new ArrayField(new StringField()),
				skills: new ArrayField(new StringField()),
			}),
			crest: new FilePathField({ required: false, categories: ["IMAGE"] }),
			biography: new HTMLField(),
		};
	}

	static migrateData(source: PcSchema): PcSchema {
		const proficiencies = source.proficiencies ?? {};

		if ("weapons" in proficiencies && Array.isArray(proficiencies.weapons)) {
			proficiencies.weapons = proficiencies.weapons.map(weapon =>
				weapon === "bmr" ? "boomerang" : weapon
			);
		}

		source.biography ??= "";
		source.health ??= { value: 10, max: 10 };
		source.level ??= 1;
		source.xp ??= 0;

		return source;
	}

	declare xp: number;
	declare level: number;
	declare health: { value: number; max: number };
	declare proficiencies: { weapons: string[]; skills: string[] };
	declare crest: string | null;
	declare biography: string;

	prepareDerivedData() {

		super.prepareDerivedData();

		this.health.value = Math.clamp(this.health.value ?? 0, 0, this.health.max ?? 10);
	}
}
