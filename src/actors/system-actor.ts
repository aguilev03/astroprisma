import { CharacterDataModel } from "./character";
import { NpcDataModel } from "./npc";
import { StarshipDataModel } from "./starship";

export class SystemActor extends Actor<"character" | "npc" | "starship"> {

	prepareDerivedData() {

		super.prepareDerivedData();

		if ((this.type as string) === "character") {

			const model = this.system as CharacterDataModel;

			model.health.value = Math.clamp(model.health.value ?? 0, 0, model.health.max ?? 10);
			model.energy.value = Math.clamp(model.energy.value ?? 0, 0, model.energy.max ?? 10);

		} else if ((this.type as string) === "npc") {

			const model = this.system as NpcDataModel;

			model.health.value = Math.clamp(model.health.value ?? 0, 0, model.health.max ?? 10);
			model.energy.value = Math.clamp(model.energy.value ?? 0, 0, model.energy.max ?? 10);

		} else if ((this.type as string) === "starship") {

			const model = this.system as StarshipDataModel;

			model.hull.value = Math.clamp(model.hull.value ?? 0, 0, model.hull.max ?? 20);
			model.shields.value = Math.clamp(model.shields.value ?? 0, 0, model.shields.max ?? 10);
			model.fuel.value = Math.clamp(model.fuel.value ?? 0, 0, model.fuel.max ?? 10);
		}
	}
}
