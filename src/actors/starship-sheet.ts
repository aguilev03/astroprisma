// @ts-nocheck
const { HandlebarsApplicationMixin } = foundry.applications.api;
const { ActorSheetV2 } = foundry.applications.sheets;

export class StarshipActorSheet extends HandlebarsApplicationMixin(ActorSheetV2) {
	#activeTab = "control";

	static PARTS = {
		body: {
			template: "systems/astroprisma/templates/actor/starship-sheet.hbs"
		}
	};

	static DEFAULT_OPTIONS = {
		id: "astroprisma-starship-sheet",
		classes: ["astroprisma", "sheet", "actor", "starship"],
		form: {
			submitOnChange: true,
			closeOnSubmit: false
		},
		window: {
			resizable: true
		}
	};

	override async _prepareContext(options: any): Promise<any> {
		const context = await super._prepareContext(options);
		const actor = context.document;

		if (actor.type !== "starship") {
			throw new Error("StarshipActorSheet rendered for non-starship actor");
		}

		return {
			...context,
			system: actor.system,
			activeTab: this.#activeTab,
			tabState: {
				control: this.#activeTab === "control",
				modules: this.#activeTab === "modules",
				cargo: this.#activeTab === "cargo",
				crew: this.#activeTab === "crew",
				conditions: this.#activeTab === "conditions",
				notes: this.#activeTab === "notes"
			},
			moduleItems: actor.items.filter(item => item.type === "starshipModule"),
			cargoItems: actor.items.filter(item => item.type === "cargo")
		};
	}

	override async _onRender(context: any, options: any): Promise<void> {
		await super._onRender(context, options);

		const root = ((this.element as any) instanceof HTMLElement
			? this.element
			: (this.element as any)?.[0]) as HTMLElement | undefined;

		if (!root) return;

		root.querySelectorAll<HTMLElement>("[data-tab]").forEach(button => {
			button.addEventListener("click", event => {
				event.preventDefault();
				this.#activeTab = button.dataset.tab ?? "control";
				void this.render();
			});
		});
	}
}
