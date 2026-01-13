const { HandlebarsApplicationMixin, DocumentSheetV2 } = foundry.applications.api;

export class CharacterActorSheet extends HandlebarsApplicationMixin(DocumentSheetV2<Actor>) {

	static PARTS = {
		body: {
			template: "systems/astroprisma/templates/actor/character-sheet.hbs"
		}
	};

	static DEFAULT_OPTIONS = {
		id: "astroprisma-character-sheet",
		classes: ["astroprisma", "sheet", "actor", "character"],
		window: {
			resizable: true
		}
	};

	override async _prepareContext(options: any) {

		const context = await super._prepareContext(options);

		const actor = context.document;

		if (actor.type !== "character") {
			throw new Error("CharacterActorSheet rendered for non-character actor");
		}

		return {
			...context,
			system: actor.system
		};
	}
}
