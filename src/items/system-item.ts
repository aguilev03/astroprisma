// @ts-nocheck
import {
	CHARACTER_ITEM_TYPES,
	defineItemSchema,
	getAllowedItemTypes,
	isItemTypeAllowed,
	migrateItemSource,
	type ItemSchema
} from "./item-data";

const { TypeDataModel } = foundry.abstract;

export class AstroprismaItemDataModel extends TypeDataModel<ItemSchema, Item> {

	static defineSchema() {
		return defineItemSchema();
	}

	static migrateData(source: ItemSchema): ItemSchema {
		return migrateItemSource(source) as ItemSchema;
	}

	declare description: string;
	declare quantity: number;
	declare equipped: boolean;
	declare damage: string;
	declare range: string;
	declare attackBonus: number;
	declare defenseBonus: number;
	declare cost: number;
	declare weight: number;
	declare tags: string[];

	prepareDerivedData() {
		super.prepareDerivedData();
		this.quantity = Math.max(0, Math.floor(this.quantity ?? 0));
	}
}

export class SystemItem extends Item {

	get typedSystem(): ItemSchema {
		return this.system as ItemSchema;
	}

	static canActorOwnItem(actorType: string, itemType: string) {
		return isItemTypeAllowed(actorType, itemType);
	}

	static getAllowedItemTypes(actorType: string) {
		return getAllowedItemTypes(actorType);
	}

	async rollAttack() {
		const bonus = Number(this.typedSystem.attackBonus ?? 0);
		const roll = new Roll("1d20 + @bonus", { bonus });

		await roll.evaluate();
		await roll.toMessage({
			speaker: ChatMessage.getSpeaker({ actor: this.actor ?? undefined }),
			flavor: `${this.name}: Attack`
		});
	}

	async rollDamage() {
		const formula = this.typedSystem.damage?.trim();

		if (!formula) {
			ui.notifications?.warn(`${this.name} has no damage formula.`);
			return;
		}

		const roll = new Roll(formula);
		await roll.evaluate();
		await roll.toMessage({
			speaker: ChatMessage.getSpeaker({ actor: this.actor ?? undefined }),
			flavor: `${this.name}: Damage`
		});
	}

	async useConsumable() {
		if (this.type !== "consumable") return;

		const quantity = Number(this.typedSystem.quantity ?? 0);

		if (quantity <= 0) {
			ui.notifications?.warn(`${this.name} has no remaining quantity.`);
			return;
		}

		await this.update({ "system.quantity": quantity - 1 });
	}

	async toggleEquipped() {
		await this.update({ "system.equipped": !this.typedSystem.equipped });
	}

	prepareDerivedData() {
		super.prepareDerivedData();

		if (this.actor && !SystemItem.canActorOwnItem(this.actor.type, this.type)) {
			this.typedSystem.equipped = false;
		}
	}
}

export function registerItemDataModels() {
	for (const itemType of [...CHARACTER_ITEM_TYPES, "shipWeapon", "shipModule"]) {
		CONFIG.Item.dataModels[itemType] = AstroprismaItemDataModel;
	}
}
