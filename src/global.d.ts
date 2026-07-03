import type { CharacterDataModel } from "./actors/character";
import type { NpcDataModel } from "./actors/npc";
import type { StarshipDataModel } from "./actors/starship";

declare global {
	namespace foundry {
		namespace Game {
			namespace Model {
				interface DataModelConfig {
					Actor: {
						character: typeof CharacterDataModel;
						npc: typeof NpcDataModel;
						starship: typeof StarshipDataModel;
					};
				}
			}
		}
	}
}

export { };
