import { clampMeter, defineCharacterSchema, migrateCharacterSource, type CharacterSchema } from "./actor-data";

const { TypeDataModel } = foundry.abstract;

export class CharacterDataModel extends TypeDataModel<CharacterSchema, Actor> {

	static defineSchema() {
		return defineCharacterSchema();
	}

	static migrateData(source: CharacterSchema): CharacterSchema {
		return migrateCharacterSource(source) as CharacterSchema;
	}

	declare origin: string;
	declare health: CharacterSchema["health"];
	declare energy: CharacterSchema["energy"];
	declare armor: number;
	declare exp: number;
	declare hyperdrive: number;
	declare attributes: CharacterSchema["attributes"];
	declare conditions: CharacterSchema["conditions"];
	declare memorySlots: number;
	declare weapons: string;
	declare inventory: string;
	declare cybertech: string;
	declare notes: string;

	prepareDerivedData() {
		super.prepareDerivedData();
		clampMeter(this.health, 10);
		clampMeter(this.energy, 10);
	}
}
