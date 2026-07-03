// @ts-nocheck
import { SystemItem } from "../items/system-item";

const { HandlebarsApplicationMixin } = foundry.applications.api;
const { ActorSheetV2 } = foundry.applications.sheets;

function decorateItem(item: Item.Implementation) {
	return {
		...item,
		system: item.system,
		typeLabel: item.type,
		modNames: Array.isArray((item.system as any).mods)
			? (item.system as any).mods.join(", ")
			: ""
	};
}

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
			weaponItems: actor.items
				.filter(item => item.type === "weapon" && Boolean((item.system as any).equipped))
				.map(decorateItem),
			inventoryItems: actor.items
				.filter(item => item.type !== "weaponMod" && !(item.type === "weapon" && Boolean((item.system as any).equipped)))
				.map(decorateItem),
			weaponModItems: actor.items.filter(item => item.type === "weaponMod").map(decorateItem)
		};
	}

	protected override _canDragDrop(selector: string): boolean {
		return this.isEditable;
	}

	override _onClickAction(event: PointerEvent, target: HTMLElement) {
		super._onClickAction(event, target);

		switch (target.dataset.action) {
			case "setTab":
				event.preventDefault();
				this.#activeTab = target.dataset.tab ?? "stats";
				void this.render();
				break;
			case "rollAttribute":
				event.preventDefault();
				void this.#rollAttribute(target.dataset.attribute ?? "");
				break;
			case "rollItemAttack":
				event.preventDefault();
				void this.#withItem(target, item => item.rollAttack());
				break;
			case "toggleEquip":
				event.preventDefault();
				void this.#withItem(target, item => item.toggleEquipped());
				break;
			case "deleteItem":
				event.preventDefault();
				void this.#deleteItem(target.dataset.itemId ?? "");
				break;
		}
	}

	protected override async _onDropItem(event: DragEvent, item: Item.Implementation) {
		if (!SystemItem.canActorOwnItem(this.actor.type, item.type)) {
			ui.notifications?.warn(`${item.name} cannot be added to a ${this.actor.type}.`);
			return null;
		}

		const itemData = item.toObject();
		delete itemData._id;
		const created = await this.actor.createEmbeddedDocuments("Item", [itemData]);
		return created.at(0) ?? null;
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

	async #withItem(target: HTMLElement, callback: (item: SystemItem) => Promise<void>) {
		const itemId = target.dataset.itemId ?? "";
		const item = this.actor.items.get(itemId) as SystemItem | undefined;

		if (!item) return;
		await callback(item);
	}

	async #deleteItem(itemId: string) {
		if (!itemId) return;
		await this.actor.deleteEmbeddedDocuments("Item", [itemId]);
	}
}
