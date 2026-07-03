# Astroprisma

Private Foundry VTT system development fork for **ASTROPRISMA**, based on the original Malbios repository and adapted for **Foundry VTT v13**.

This fork is focused on getting a clean, functional system online first:

- Character sheet
- NPC sheet
- Starship sheet
- Foundry v13-compatible actor data models
- Simple editable UI with minimal styling

## Status

Current implemented scope:

- Actor types:
  - `character`
  - `npc`
  - `starship`
- Item types:
  - `weapon`
  - `gear`
  - `cybertech`
  - `memory`
  - `starshipModule`
  - `cargo`
- Character sheet tabs:
  - Stats
  - Weapons
  - Inventory
  - Cybertech
  - Memory
  - Notes
- Starship sheet tabs:
  - Control Panel
  - Modules
  - Cargo
  - Crew
  - Conditions
  - Notes
- Attribute roll buttons:
  - Vigor
  - Grace
  - Mind
  - Tech

## Project Goals

- Keep the data model clean and easy to extend
- Keep the UI simple and working before deeper automation
- Use the Astroprisma sheet PDFs as section/data references, not as pixel-perfect layout targets
- Stay compatible with Foundry VTT v13

## Development

Requirements:

- Node.js 20+
- npm

Install dependencies:

```bash
npm install
```

Run the type-check:

```bash
NODE_OPTIONS=--max-old-space-size=8192 npm run check
```

Build the system:

```bash
npm run build
```

Build output is written to `dist/`.

## Repository Structure

- `src/astroprisma.ts`: system initialization and sheet registration
- `src/actors/`: actor data models and sheet classes
- `templates/actor/`: Handlebars actor sheet templates
- `styles/`: system CSS
- `system.json`: Foundry system manifest

## Foundry Support

This fork targets:

- Minimum Foundry version: `13.347`
- Verified major version: `13`

## Notes

- The current build script is set up for this development environment and outputs a ready-to-load `dist/` folder.
- The current sheets are intentionally simple. Advanced automation, embedded item workflows, and refined styling can be added incrementally after base sheet loading is stable.

## Credits

- Original project base: Malbios Astroprisma
- Fork and ongoing development: `aguilev03`
