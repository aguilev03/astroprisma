import { clampMeter, defineStarshipSchema, migrateStarshipSource, type StarshipSchema } from "./actor-data";

const { TypeDataModel } = foundry.abstract;

export class StarshipDataModel extends TypeDataModel<StarshipSchema, Actor> {

	static defineSchema() {
		return defineStarshipSchema();
	}

	static migrateData(source: StarshipSchema): StarshipSchema {
		return migrateStarshipSource(source) as StarshipSchema;
	}

	declare shipType: string;
	declare hull: StarshipSchema["hull"];
	declare shields: StarshipSchema["shields"];
	declare fuel: StarshipSchema["fuel"];
	declare control: number;
	declare engines: number;
	declare modules: string;
	declare cargoHold: string;
	declare crew: string;
	declare conditions: string;
	declare notes: string;

	prepareDerivedData() {
		super.prepareDerivedData();
		clampMeter(this.hull, 20);
		clampMeter(this.shields, 10);
		clampMeter(this.fuel, 10);
	}
}
