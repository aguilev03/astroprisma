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
						armor: typeof AstroprismaItemDataModel;
						gear: typeof AstroprismaItemDataModel;
						consumable: typeof AstroprismaItemDataModel;
						talent: typeof AstroprismaItemDataModel;
						ability: typeof AstroprismaItemDataModel;
						shipWeapon: typeof AstroprismaItemDataModel;
						shipModule: typeof AstroprismaItemDataModel;
					};
				}
			}
		}
	}
}

export { };
