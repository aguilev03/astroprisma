import type { CharacterDataModel } from "./actors/character";
import type { NpcDataModel } from "./actors/npc";
import type { StarshipDataModel } from "./actors/starship";
import type { AstroprismaItemDataModel } from "./items/system-item";

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
					Item: {
						weapon: typeof AstroprismaItemDataModel;
						weaponMod: typeof AstroprismaItemDataModel;
						armor: typeof AstroprismaItemDataModel;
						questItem: typeof AstroprismaItemDataModel;
						misc: typeof AstroprismaItemDataModel;
					};
				}
			}
		}
	}
}

export { };
