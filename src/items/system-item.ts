// @ts-nocheck
import {
	CHARACTER_ITEM_TYPES,
	defineItemSchema,
	getAllowedItemTypes,
	isItemTypeAllowed,
	migrateItemSource,
	WEAPON_STATS,
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
	declare damageDie: string;
	declare stat: string;
	declare mods: string[];
	declare equipped: boolean;
	declare damageBonusFormula: string;
	declare statOverride: string;
	declare effectNotes: string;

	prepareDerivedData() {
		super.prepareDerivedData();
		if (!WEAPON_STATS.includes(this.stat as any)) {
			this.stat = "vigor";
		}
		if (this.statOverride && !WEAPON_STATS.includes(this.statOverride as any)) {
			this.statOverride = "";
		}
		this.mods = Array.isArray(this.mods) ? this.mods.filter(Boolean) : [];
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
		if (this.type !== "weapon") return;
		if (!this.actor) {
			ui.notifications?.warn("Weapon must be owned by an actor to roll.");
			return;
		}

		const weapon = this.typedSystem;
		const modItems = this.#resolveWeaponMods();
		const statKey = modItems.reduce((current, mod) => mod.typedSystem.statOverride?.trim() || current, weapon.stat);
		const statValue = Number((this.actor.system as any).attributes?.[statKey] ?? 0);
		const modTerms = modItems
			.map(mod => this.#normalizeBonusFormula(mod.typedSystem.damageBonusFormula))
			.filter(Boolean);

		const formulaParts = [weapon.damageDie || "1d4", String(statValue), ...modTerms];
		const formula = formulaParts.join(" + ");
		const roll = new Roll(formula);
		const modLabel = modItems.length ? ` | Mods: ${modItems.map(mod => mod.name).join(", ")}` : "";

		await roll.evaluate();
		await roll.toMessage({
			speaker: ChatMessage.getSpeaker({ actor: this.actor ?? undefined }),
			flavor: `${this.actor.name}: ${this.name} Attack (${formula}) using ${statKey}${modLabel}`
		});
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

	#resolveWeaponMods(): SystemItem[] {
		if (!this.actor) return [];

		const refs = Array.isArray(this.typedSystem.mods) ? this.typedSystem.mods : [];
		const resolved = refs
			.map(ref => {
				const trimmed = String(ref).trim();
				if (!trimmed) return null;

				return this.actor?.items.get(trimmed)
					?? this.actor?.items.find(item => item.type === "weaponMod" && item.name === trimmed)
					?? null;
			})
			.filter((item): item is SystemItem => Boolean(item && item.type === "weaponMod"));

		return Array.from(new Map(resolved.map(item => [item.id, item])).values());
	}

	#normalizeBonusFormula(formula: string) {
		const trimmed = String(formula ?? "").trim();
		if (!trimmed) return "";
		return trimmed.startsWith("+") ? trimmed.slice(1).trim() : trimmed;
	}
}

export function registerItemDataModels() {
	for (const itemType of CHARACTER_ITEM_TYPES) {
		CONFIG.Item.dataModels[itemType] = AstroprismaItemDataModel;
	}
}
