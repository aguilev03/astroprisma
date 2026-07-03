// @ts-nocheck
import { WEAPON_STATS } from "./item-data";

const { HandlebarsApplicationMixin } = foundry.applications.api;
const { ItemSheetV2 } = foundry.applications.sheets;

export class AstroprismaItemSheet extends HandlebarsApplicationMixin(ItemSheetV2) {
	static PARTS = {
		body: {
			template: "systems/astroprisma/templates/item/item-sheet.hbs"
		}
	};

	static DEFAULT_OPTIONS = {
		id: "astroprisma-item-sheet",
		classes: ["astroprisma", "sheet", "item"],
		form: {
			submitOnChange: true,
			closeOnSubmit: false
		},
		position: {
			width: 520,
			height: "auto"
		},
		window: {
			resizable: true
		}
	};

	override async _prepareContext(options: any): Promise<any> {
		const context = await super._prepareContext(options);

		return {
			...context,
			system: context.document.system,
			isWeapon: context.document.type === "weapon",
			isWeaponMod: context.document.type === "weaponMod",
			modsString: Array.isArray(context.document.system.mods)
				? context.document.system.mods.join(", ")
				: "",
			statOptions: WEAPON_STATS.map(stat => ({
				value: stat,
				label: stat.charAt(0).toUpperCase() + stat.slice(1),
				selected: context.document.system.stat === stat
			})),
			overrideOptions: [
				{ value: "", label: "None", selected: !context.document.system.statOverride },
				...WEAPON_STATS.map(stat => ({
					value: stat,
					label: stat.charAt(0).toUpperCase() + stat.slice(1),
					selected: context.document.system.statOverride === stat
				}))
			]
		};
	}

	override _processFormData(event: SubmitEvent | null, form: HTMLFormElement, formData: any): object {
		const data = super._processFormData(event, form, formData) as Record<string, unknown>;
		const modsString = String(data["system.modsText"] ?? "");

		data["system.mods"] = modsString
			.split(",")
			.map(mod => mod.trim())
			.filter(Boolean);

		delete data["system.modsText"];
		return data;
	}
}
