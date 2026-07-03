// @ts-nocheck
import { CharacterDataModel } from "./actors/character";
import { CharacterActorSheet } from "./actors/character-sheet";
import { NpcDataModel } from "./actors/npc";
import { StarshipActorSheet } from "./actors/starship-sheet";
import { StarshipDataModel } from "./actors/starship";
import { AstroprismaItemSheet } from "./items/item-sheet";
import { registerItemDataModels, SystemItem } from "./items/system-item";
import { SystemActor } from "./actors/system-actor";

Hooks.on("init", () => {
	CONFIG.Actor.documentClass = SystemActor;
	CONFIG.Item.documentClass = SystemItem;

	CONFIG.Actor.dataModels.character = CharacterDataModel;
	CONFIG.Actor.dataModels.npc = NpcDataModel;
	CONFIG.Actor.dataModels.starship = StarshipDataModel;
	registerItemDataModels();

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

	foundry.applications.apps.DocumentSheetConfig.registerSheet(
		Item,
		"astroprisma",
		AstroprismaItemSheet,
		{
			types: ["weapon", "armor", "gear", "consumable", "talent", "ability", "shipWeapon", "shipModule"],
			makeDefault: true
		}
	);
});
