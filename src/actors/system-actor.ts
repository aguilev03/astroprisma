import { CharacterDataModel } from "./character";
import { NpcDataModel } from "./npc";
import { PcDataModel } from "./pc";

export class SystemActor extends Actor<"character" | "pc" | "npc"> {

	prepareDerivedData() {

		super.prepareDerivedData();

		if ((this.type as string) === "character") {

			const model = this.system as CharacterDataModel;

			model.health.value = Math.clamp(model.health.value ?? 0, 0, model.health.max ?? 10);
			model.level = Math.max(1, Math.floor(model.xp / 1000) + 1);

		} else if ((this.type as string) === "pc") {

			const model = this.system as PcDataModel;

			model.health.value = Math.clamp(model.health.value ?? 0, 0, model.health.max ?? 10);
			model.level = Math.max(1, Math.floor(model.xp / 1000) + 1);

		} else if ((this.type as string) === "npc") {

			const model = this.system as NpcDataModel;

			model.health.value = Math.clamp(model.health.value ?? 0, 0, model.health.max ?? 10);
			model.level = Math.max(1, Math.floor(model.xp / 1000) + 1);
		}
	}
}
