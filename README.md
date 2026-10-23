# Chng Guohao / Wealth Path prototype

A working website prototype for client review, plus the Figma plugin that generates matching 1440px frames.

Visual design follows the [Figma file](https://www.figma.com/design/6OAG1NAK4POnb3m1Ynpsv8/Chng-Guo-Hao--FA--Website-Prototyping?node-id=0-1&m=dev). Navigation follows the [Figma prototype](https://www.figma.com/proto/6OAG1NAK4POnb3m1Ynpsv8/Chng-Guo-Hao--FA--Website-Prototyping?node-id=25-2090). Page structure follows the Awaiken Fintech demo.

## Shareable prototype (stays online after Cursor closes)

The working website lives in **this repo** (`site/` on [`cursor/wealth-path-pages-plugin-1952`](https://github.com/JainaLG/Chng-Guo-Hao-Prototype/tree/cursor/wealth-path-pages-plugin-1952/site), [PR #1](https://github.com/JainaLG/Chng-Guo-Hao-Prototype/pull/1)).

GitHub Pages URL for this repo:

**https://jainalg.github.io/Chng-Guo-Hao-Prototype/**

Turn it on under **Settings → Pages → Source: GitHub Actions**. GitHub Free only serves Pages from a **public** repo; this repo is currently private, so either make it public or use GitHub Pro. After that, every push of `site/` publishes the client preview.

Figma click-through: https://www.figma.com/proto/6OAG1NAK4POnb3m1Ynpsv8/Chng-Guo-Hao--FA--Website-Prototyping?node-id=25-2090&scaling=scale-down-width&content-scaling=fixed&page-id=0%3A1

## Open the website locally

From this folder:

```bash
python3 -m http.server 4173 --directory site
```

Then open http://127.0.0.1:4173/

Pages: Home, About, Estate Planning, Retirement Planning, Articles, Book an Appointment.

Photos come from the Figma file (hero portrait, mastheads, mosaics, programme and FAQ images). Hover and motion follow the prototype: nav, credential and USP cards, philosophy cards, FAQ accordion, scrolling ticker, and the reviews badge.

The **Legacy Growth Calculator** (Estate) and **Retirement Growth Calculator** (Retirement) are live time-value-of-money calculators. Default inputs (PV 100000, PMT 1000, 4%, 20 years, annual compounding, end-of-period payments) produce **$248,890.39**, matching the Figma design.

## Figma plugin

**Wealth Path Pages** · id `3826dc32-cea1-409c-9365-55965e3c932c` · version `04e0f91321152a2190d046a25ca1f1736f9edfc4`

https://www.figma.com/file/new?try-tool-resource-content-id=3826dc32-cea1-409c-9365-55965e3c932c&try-tool-resource-type=gen_tool&type=design&mode=design

See [`figma-plugin/README.md`](figma-plugin/README.md).
