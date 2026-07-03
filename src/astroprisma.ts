import { CharacterDataModel } from "./actors/character";
import { CharacterActorSheet } from "./actors/character-sheet";
import { NpcDataModel } from "./actors/npc";
import { StarshipActorSheet } from "./actors/starship-sheet";
import { StarshipDataModel } from "./actors/starship";

Hooks.on("init", () => {

	CONFIG.Actor.dataModels.character = CharacterDataModel;
	CONFIG.Actor.dataModels.npc = NpcDataModel;
	CONFIG.Actor.dataModels.starship = StarshipDataModel;

	CONFIG.Actor.trackableAttributes = {
		character: {
			bar: ["health", "energy"],
			value: ["armor", "exp", "hyperdrive"]
		},
		npc: {
			bar: ["health", "energy"],
			value: ["armor", "exp", "hyperdrive"]
		},
		starship: {
			bar: ["hull", "shields", "fuel"],
			value: ["control", "engines"]
		}
	};

	foundry.applications.apps.DocumentSheetConfig.registerSheet(
		Actor,
		"astroprisma",
		CharacterActorSheet,
		{
			types: ["character", "npc"],
			makeDefault: true
		}
	);

	foundry.applications.apps.DocumentSheetConfig.registerSheet(
		Actor,
		"astroprisma",
		StarshipActorSheet,
		{
			types: ["starship"],
			makeDefault: true
		}
	);
});
