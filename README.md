# Chng Guohao / Wealth Path prototype

A working website prototype for client review, plus the Figma plugin that generates matching 1440px frames.

Visual design follows the [Figma file](https://www.figma.com/design/6OAG1NAK4POnb3m1Ynpsv8/Chng-Guo-Hao--FA--Website-Prototyping?node-id=0-1&m=dev). Navigation follows the [Figma prototype](https://www.figma.com/proto/6OAG1NAK4POnb3m1Ynpsv8/Chng-Guo-Hao--FA--Website-Prototyping?node-id=25-2090). Page structure follows the Awaiken Fintech demo.

## Open the website

From this folder:

```bash
python3 -m http.server 4173 --directory site
```

Then open http://127.0.0.1:4173/

Pages: Home, About, Estate Planning, Retirement Planning, Articles, Book an Appointment.

The **Legacy Growth Calculator** (Estate) and **Retirement Growth Calculator** (Retirement) are live time-value-of-money calculators. Default inputs (PV 100000, PMT 1000, 4%, 20 years, annual compounding, end-of-period payments) produce **$248,890.39**, matching the Figma design.

## Figma plugin

**Wealth Path Pages** · id `3826dc32-cea1-409c-9365-55965e3c932c` · version `04e0f91321152a2190d046a25ca1f1736f9edfc4`

https://www.figma.com/file/new?try-tool-resource-content-id=3826dc32-cea1-409c-9365-55965e3c932c&try-tool-resource-type=gen_tool&type=design&mode=design

See [`figma-plugin/README.md`](figma-plugin/README.md).
