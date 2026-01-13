import { CharacterDataModel } from "./actors/character";
import { CharacterActorSheet } from "./actors/character-sheet";
import { NpcDataModel } from "./actors/npc";
import { PcDataModel } from "./actors/pc";

Hooks.on("init", () => {

	CONFIG.Actor.dataModels.character = CharacterDataModel;
	CONFIG.Actor.dataModels.pc = PcDataModel;
	CONFIG.Actor.dataModels.npc = NpcDataModel;

	CONFIG.Actor.trackableAttributes = {
		character: {
			bar: ["health"],
			value: ["xp"]
		},
		pc: {
			bar: ["health"],
			value: ["xp"]
		},
		npc: {
			bar: ["health"],
			value: ["xp"]
		}
	};

	foundry.applications.apps.DocumentSheetConfig.registerSheet(
		Actor,
		"astroprisma",
		CharacterActorSheet,
		{
			types: ["character"],
			makeDefault: true
		}
	);
});
