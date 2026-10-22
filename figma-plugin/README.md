# Wealth Path Pages

Figma plugin that generates 1440px website frames for the Chng Guohao / Wealth Path prototype.

Plugin id: `3826dc32-cea1-409c-9365-55965e3c932c`  
Published version: `04e0f91321152a2190d046a25ca1f1736f9edfc4`

Open a new file with the plugin ready to run:

https://www.figma.com/file/new?try-tool-resource-content-id=3826dc32-cea1-409c-9365-55965e3c932c&try-tool-resource-type=gen_tool&type=design&mode=design

## What it does

The panel’s primary action is **Generate page**. It drops one desktop page at the current viewport. **Generate full sitemap** creates the six prototype routes in a row.

Each page uses:

- **Visual tokens** from the Figma style guide (navy `#005F93`, teal `#167A72`, gold `#F2BA49`, CTA green `#49B74C`, Manrope ExtraBold titles, DM Sans body/CTA)
- **Navigation and destinations** from the Figma prototype (`Home`, `About`, `Estate Planning`, `Retirement Planning`, `Articles`, `Book an Appointment`)
- **Section structure** from the Awaiken Fintech WordPress theme (hero, intro, services, programmes, process, stats, testimonials, FAQ, CTA, footer), filled with copy taken from the Figma file

If **Wire prototype links** is on, nav, footer, programme, and CTA layers get click reactions to matching frames on the current page — including the existing frames in the source prototype file.

## Page types

| Page type | Default sections |
| --- | --- |
| Home | Hero, intro, services, programmes, testimonials, FAQ, CTA |
| About | Hero, intro, process, stats, testimonials, CTA |
| Estate Planning | Hero, intro, process, FAQ, CTA |
| Retirement Planning | Hero, intro, process, FAQ, CTA |
| Articles | Hero, programmes, CTA |
| Book an Appointment | Hero, intro (form layout), CTA |
| Custom | All sections |

Portrait and photo slots are sage/ice placeholders. Replace them with the production assets from the Figma file.

## Source of truth

These files in the repo are a snapshot of the published plugin (`code.ts`, `ui.html`). The live plugin lives in the Figma account library; updating it requires the Figma generative plugin tools, not a git push alone.
