import type { CharacterDataModel } from "./actors/character";
import type { NpcDataModel } from "./actors/npc";
import type { PcDataModel } from "./actors/pc";

declare global {
	namespace foundry {
		namespace Game {
			namespace Model {
				interface DataModelConfig {
					Actor: {
						character: typeof CharacterDataModel;
						pc: typeof PcDataModel
						npc: typeof NpcDataModel;
					};
				}
			}
		}
	}
}

export { };
