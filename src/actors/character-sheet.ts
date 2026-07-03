// @ts-nocheck
const { HandlebarsApplicationMixin } = foundry.applications.api;
const { ActorSheetV2 } = foundry.applications.sheets;

export class CharacterActorSheet extends HandlebarsApplicationMixin(ActorSheetV2) {
	#activeTab = "stats";

	static PARTS = {
		body: {
			template: "systems/astroprisma/templates/actor/character-sheet.hbs"
		}
	};

	static DEFAULT_OPTIONS = {
		id: "astroprisma-character-sheet",
		classes: ["astroprisma", "sheet", "actor", "character"],
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

		if (!["character", "npc"].includes(actor.type)) {
			throw new Error("CharacterActorSheet rendered for unsupported actor type");
		}

		return {
			...context,
			system: actor.system,
			activeTab: this.#activeTab,
			tabState: {
				stats: this.#activeTab === "stats",
				weapons: this.#activeTab === "weapons",
				inventory: this.#activeTab === "inventory",
				cybertech: this.#activeTab === "cybertech",
				memory: this.#activeTab === "memory",
				notes: this.#activeTab === "notes"
			},
			weaponItems: actor.items.filter(item => item.type === "weapon"),
			gearItems: actor.items.filter(item => item.type === "gear"),
			cybertechItems: actor.items.filter(item => item.type === "cybertech"),
			memoryItems: actor.items.filter(item => item.type === "memory")
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
				this.#activeTab = button.dataset.tab ?? "stats";
				void this.render();
			});
		});

		root.querySelectorAll<HTMLElement>("[data-roll-attribute]").forEach(button => {
			button.addEventListener("click", event => {
				event.preventDefault();
				void this.#rollAttribute(button.dataset.rollAttribute ?? "");
			});
		});
	}

	async #rollAttribute(attribute: string) {
		const value = Number((this.document.system as any).attributes?.[attribute] ?? 0);
		const label = attribute.charAt(0).toUpperCase() + attribute.slice(1);
		const roll = new Roll("1d20 + @value", { value });

		await roll.evaluate();
		await roll.toMessage({
			speaker: ChatMessage.getSpeaker({ actor: this.document }),
			flavor: `${this.document.name}: ${label} Check`
		});
	}
}
