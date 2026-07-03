// @ts-nocheck
import { SystemItem } from "../items/system-item";

const { HandlebarsApplicationMixin } = foundry.applications.api;
const { ActorSheetV2 } = foundry.applications.sheets;

function decorateItem(item: Item.Implementation) {
	return {
		...item,
		system: item.system
	};
}

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
			moduleItems: actor.items.filter(item => item.type === "shipModule").map(decorateItem),
			shipWeaponItems: actor.items.filter(item => item.type === "shipWeapon").map(decorateItem)
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
				this.#activeTab = target.dataset.tab ?? "control";
				void this.render();
				break;
			case "rollItemAttack":
				event.preventDefault();
				void this.#withItem(target, item => item.rollAttack());
				break;
			case "rollItemDamage":
				event.preventDefault();
				void this.#withItem(target, item => item.rollDamage());
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
