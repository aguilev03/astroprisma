// @ts-nocheck
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
			tagsString: Array.isArray(context.document.system.tags)
				? context.document.system.tags.join(", ")
				: ""
		};
	}

	override _processFormData(event: SubmitEvent | null, form: HTMLFormElement, formData: any): object {
		const data = super._processFormData(event, form, formData) as Record<string, unknown>;
		const tagsString = String(data["system.tagsText"] ?? "");

		data["system.tags"] = tagsString
			.split(",")
			.map(tag => tag.trim())
			.filter(Boolean);

		delete data["system.tagsText"];
		return data;
	}
}
