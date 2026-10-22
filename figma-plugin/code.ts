const PANEL_WIDTH = 280
const PAGE_WIDTH = 1440
const PAD = 110
const RELAUNCH = 'Generate Wealth Path page'

type PageType = 'home' | 'about' | 'estate' | 'retirement' | 'articles' | 'book' | 'custom'
type Sections = {
  hero: boolean; intro: boolean; services: boolean; programmes: boolean
  process: boolean; stats: boolean; testimonials: boolean; faq: boolean; cta: boolean
}
type GenerateMessage = {
  type: 'generate' | 'sitemap'
  pageType: PageType
  pageTitle: string
  ctaLabel: string
  sections: Sections
  includeNav: boolean
  includeFooter: boolean
  wirePrototype: boolean
}
type UiMessage = { type: 'resize'; height: number } | GenerateMessage
type FontRef = FontName

const C = {
  navy: '#005f93', teal: '#167a72', sage: '#a9bdaf', warm: '#e7e7e3', ice: '#dcecf2',
  gold: '#f2ba49', ink: '#1a2b33', muted: '#3d5159', page: '#f7f8f6', white: '#ffffff',
  footer: '#05436c', cta: '#49b74c',
}

const NAV: Array<{ label: string; type: PageType }> = [
  { label: 'Home', type: 'home' },
  { label: 'About', type: 'about' },
  { label: 'Estate Planning', type: 'estate' },
  { label: 'Retirement Planning', type: 'retirement' },
  { label: 'Articles', type: 'articles' },
]

const META: Record<Exclude<PageType, 'custom'>, { title: string; match: string[] }> = {
  home: { title: 'Home | Chng Guohao', match: ['home | chng', 'senior wealth'] },
  about: { title: 'About | Wealth Path', match: ['about | wealth'] },
  estate: { title: 'Estate Planning Programme | Chng Guohao', match: ['estate planning programme'] },
  retirement: { title: 'Retirement Planning Programme | Chng Guohao', match: ['retirement planning programme'] },
  articles: { title: 'Insights & Resources | Wealth Path Blog', match: ['insights & resources'] },
  book: { title: 'Book a Consultation | Wealth Path', match: ['book a consultation'] },
}

const FAQ: Record<'home' | 'estate' | 'retirement', string[]> = {
  home: [
    'What does a financial advisor do?',
    'How does Guohao develop a personalised financial plan?',
    'When should I start financial planning?',
    'How often should I review my financial plan?',
    'What financial planning services does Guohao offer?',
    'What should I prepare before my first financial consultation?',
  ],
  estate: [
    'What happens if I do not have a will?',
    'What is a Lasting Power of Attorney (LPA)?',
    'What is CPF nomination and why does it matter?',
    'When should I start estate planning?',
    'Can insurance be part of my estate plan?',
  ],
  retirement: [
    'How much money do I need to retire comfortably in Singapore?',
    'How can I generate a regular income during retirement?',
    'How does CPF support my retirement planning?',
    'Can a financial advisor help me plan for retirement if I already have CPF savings and investments?',
    'What is CPF LIFE, and how does it affect my retirement income?',
  ],
}

let fonts: { title: FontRef; body: FontRef; medium: FontRef; bold: FontRef }

function rgb(hex: string): RGB {
  const h = hex.replace('#', '')
  return { r: parseInt(h.slice(0, 2), 16) / 255, g: parseInt(h.slice(2, 4), 16) / 255, b: parseInt(h.slice(4, 6), 16) / 255 }
}
function paint(hex: string, opacity = 1): SolidPaint {
  return { type: 'SOLID', color: rgb(hex), opacity }
}
function report(text: string, level: 'info' | 'error' | 'success' = 'info'): void {
  figma.ui.postMessage({ type: 'status', text, level })
}
async function tryFont(family: string, style: string): Promise<FontRef | null> {
  try {
    const font = { family, style }
    await figma.loadFontAsync(font)
    return font
  } catch {
    return null
  }
}
async function loadFonts(): Promise<void> {
  const title = (await tryFont('Manrope', 'ExtraBold')) || (await tryFont('Manrope', 'Extra Bold')) || (await tryFont('Inter', 'Extra Bold')) || (await tryFont('Inter', 'Bold'))
  const body = (await tryFont('DM Sans', 'Regular')) || (await tryFont('Inter', 'Regular'))
  const medium = (await tryFont('DM Sans', 'Medium')) || (await tryFont('Inter', 'Medium')) || body
  const bold = (await tryFont('DM Sans', 'Bold')) || (await tryFont('Inter', 'Bold')) || medium
  if (!title || !body || !medium || !bold) throw new Error('Could not load Manrope, DM Sans, or Inter. Install those fonts and run the plugin again.')
  fonts = { title, body, medium, bold }
}

function frame(name: string, opts: {
  dir?: 'HORIZONTAL' | 'VERTICAL'; width?: number; height?: number
  pad?: number | [number, number] | [number, number, number, number]
  gap?: number; align?: 'MIN' | 'CENTER' | 'MAX' | 'SPACE_BETWEEN'
  counter?: 'MIN' | 'CENTER' | 'MAX'; fill?: string; radius?: number; clip?: boolean
}): FrameNode {
  const node = figma.createFrame()
  node.name = name
  node.layoutMode = opts.dir || 'VERTICAL'
  node.primaryAxisAlignItems = opts.align || 'MIN'
  node.counterAxisAlignItems = opts.counter || 'MIN'
  node.itemSpacing = opts.gap ?? 0
  node.fills = opts.fill ? [paint(opts.fill)] : []
  if (typeof opts.radius === 'number') node.cornerRadius = opts.radius
  if (opts.clip) node.clipsContent = true
  const pad = opts.pad
  if (typeof pad === 'number') node.paddingTop = node.paddingRight = node.paddingBottom = node.paddingLeft = pad
  else if (Array.isArray(pad) && pad.length === 2) {
    node.paddingTop = node.paddingBottom = pad[0]
    node.paddingRight = node.paddingLeft = pad[1]
  } else if (Array.isArray(pad) && pad.length === 4) {
    node.paddingTop = pad[0]; node.paddingRight = pad[1]; node.paddingBottom = pad[2]; node.paddingLeft = pad[3]
  }
  if (typeof opts.width === 'number') {
    node.resize(opts.width, opts.height ?? 40)
    node.layoutSizingHorizontal = 'FIXED'
  } else node.layoutSizingHorizontal = 'HUG'
  node.layoutSizingVertical = typeof opts.height === 'number' ? 'FIXED' : 'HUG'
  return node
}
function fillX(node: FrameNode): void { node.layoutSizingHorizontal = 'FILL' }
function txt(characters: string, opts: {
  font: FontRef; size: number; color?: string; opacity?: number; line?: number; letter?: number; align?: 'LEFT' | 'CENTER' | 'RIGHT'
}): TextNode {
  const node = figma.createText()
  node.fontName = opts.font
  node.fontSize = opts.size
  node.characters = characters
  node.fills = [paint(opts.color || C.ink, opts.opacity ?? 1)]
  if (opts.line) node.lineHeight = { unit: 'PIXELS', value: opts.line }
  if (typeof opts.letter === 'number') node.letterSpacing = { unit: 'PIXELS', value: opts.letter }
  if (opts.align) node.textAlignHorizontal = opts.align
  node.textAutoResize = 'HEIGHT'
  return node
}
function btn(label: string): FrameNode {
  const node = frame('Button', { dir: 'HORIZONTAL', pad: [15, 24], align: 'CENTER', counter: 'CENTER', fill: C.cta, radius: 100 })
  node.appendChild(txt(label, { font: fonts.bold, size: 15, color: C.white, line: 18 }))
  node.layoutSizingHorizontal = 'HUG'
  node.layoutSizingVertical = 'HUG'
  return node
}
function mark(label: string, color = C.navy): TextNode {
  return txt(label.toUpperCase(), { font: fonts.bold, size: 12, color, letter: 1.2, line: 18 })
}
function heading(label: string, color = C.ink, size = 40): TextNode {
  return txt(label, { font: fonts.title, size, color, line: size >= 40 ? 46 : 34, letter: size >= 40 ? -0.8 : 0 })
}
function para(label: string, color = C.muted, size = 17): TextNode {
  return txt(label, { font: fonts.body, size, color, line: size >= 18 ? 30 : 28 })
}
function linkTo(node: SceneNode, type: PageType): void { node.setPluginData('wpNavType', type) }
function isPreset(type: string): type is Exclude<PageType, 'custom'> {
  return Object.prototype.hasOwnProperty.call(META, type)
}

function makeNav(active: PageType): FrameNode {
  const nav = frame('Navigation Bar', { dir: 'HORIZONTAL', width: PAGE_WIDTH, height: 93, pad: [0, PAD], gap: 24, align: 'SPACE_BETWEEN', counter: 'CENTER', fill: C.white })
  const logo = frame('Logo', { dir: 'VERTICAL', gap: 2 })
  logo.appendChild(txt('CHNG GUOHAO', { font: fonts.title, size: 16, color: C.navy, letter: 1.4, line: 20 }))
  logo.appendChild(txt('YOUR TRUSTED FINANCIAL PARTNER', { font: fonts.medium, size: 7, color: C.navy, letter: 0.6, line: 10 }))
  nav.appendChild(logo)
  const links = frame('Links', { dir: 'HORIZONTAL', gap: 28, counter: 'CENTER' })
  for (const item of NAV) {
    const t = txt(item.label, { font: fonts.medium, size: 20, color: item.type === active ? C.navy : C.muted, line: 25 })
    t.name = item.label
    linkTo(t, item.type)
    links.appendChild(t)
  }
  nav.appendChild(links)
  const cta = btn('Book an Appointment')
  cta.name = 'Book an Appointment'
  linkTo(cta, 'book')
  nav.appendChild(cta)
  return nav
}

function makeFooter(): FrameNode {
  const footer = frame('Footer', { dir: 'VERTICAL', width: PAGE_WIDTH, pad: [64, PAD, 32, PAD], gap: 40, fill: C.footer })
  const top = frame('Footer columns', { dir: 'HORIZONTAL', gap: 40 })
  fillX(top)
  const brand = frame('Brand', { dir: 'VERTICAL', gap: 16, width: 360 })
  brand.appendChild(txt('CHNG GUOHAO', { font: fonts.title, size: 16, color: C.white, letter: 1.4, line: 20 }))
  brand.appendChild(para('Associate Director at Professional Investment Advisory Services Pte Ltd. Holistic financial planning to help clients achieve financial dignity.', C.white, 17))
  brand.appendChild(txt('in', { font: fonts.bold, size: 20, color: C.white, line: 24 }))
  top.appendChild(brand)
  const col = (title: string, items: Array<{ label: string; type?: PageType }>): FrameNode => {
    const node = frame(title, { dir: 'VERTICAL', gap: 12 })
    node.appendChild(txt(title, { font: fonts.title, size: 15, color: C.white, letter: 0.6, line: 17 }))
    for (const item of items) {
      const t = txt(item.label, { font: fonts.body, size: 15, color: C.white, line: 25 })
      t.name = item.label
      if (item.type) linkTo(t, item.type)
      node.appendChild(t)
    }
    return node
  }
  top.appendChild(col('Navigate', [{ label: 'Home', type: 'home' }, { label: 'About', type: 'about' }, { label: 'Blogs', type: 'articles' }, { label: 'Book Consultation', type: 'book' }]))
  top.appendChild(col('Programmes', [{ label: 'Estate Planning Programme', type: 'estate' }, { label: 'Retirement Planning Programme', type: 'retirement' }]))
  top.appendChild(col('Contact', [{ label: '[Phone placeholder]' }, { label: '[Email placeholder]' }, { label: 'Singapore' }]))
  footer.appendChild(top)
  const legal = frame('Legal', { dir: 'HORIZONTAL', gap: 24, align: 'SPACE_BETWEEN', counter: 'CENTER' })
  fillX(legal)
  legal.appendChild(txt('Copyright 2026 Chng Guo Hao. All rights reserved.', { font: fonts.body, size: 13, color: C.white, line: 21 }))
  const legalLinks = frame('Legal links', { dir: 'HORIZONTAL', gap: 24 })
  legalLinks.appendChild(txt('Privacy Policy', { font: fonts.body, size: 13, color: C.white, line: 21 }))
  legalLinks.appendChild(txt('Terms / Disclaimer', { font: fonts.body, size: 13, color: C.white, line: 21 }))
  legal.appendChild(legalLinks)
  footer.appendChild(legal)
  return footer
}

function heroCopy(pageType: PageType): { eyebrow: string; title: string; accent?: string; body: string } {
  if (pageType === 'about') return { eyebrow: 'About', title: 'A Financial Partner for Life\u2019s Milestones', body: 'Guohao is a Wealth Coach who helps individuals and families navigate life\u2019s milestones with greater financial clarity and confidence. From investment and CPF retirement planning to family wealth management and legacy planning.' }
  if (pageType === 'estate') return { eyebrow: 'Programme', title: 'Estate Planning Programme', body: 'Protect what matters and shape the legacy you leave behind. Plan for the preservation and transfer of your wealth in line with your wishes, family needs, and long-term priorities.' }
  if (pageType === 'retirement') return { eyebrow: 'Programme', title: 'Retirement Planning Programme', body: 'Plan for the retirement you envision with a strategy tailored to your desired lifestyle, financial resources, and future income needs.' }
  if (pageType === 'articles') return { eyebrow: 'Insights', title: 'Insights & Resources', body: 'Practical guidance from the Insights & Resources library.' }
  if (pageType === 'book') return { eyebrow: 'Consultation', title: 'Book a Consultation', body: 'Have a question about estate planning, retirement planning, or your overall financial picture? Reach out for a no-obligation conversation today.' }
  return { eyebrow: 'Associate Director \u00b7 PIAS', title: 'Your Financial Steward Through Life\u2019s Milestones, With A ', accent: 'Strategy Curated For You', body: 'Your life, goals, and priorities are unique. As a financial advisor in Singapore, Guohao helps individuals and families make informed financial decisions through every stage of life.' }
}

function makeHero(pageType: PageType, ctaLabel: string): FrameNode {
  const copy = heroCopy(pageType)
  const section = frame('Hero', { dir: 'HORIZONTAL', width: PAGE_WIDTH, pad: [80, PAD], gap: 48, align: 'CENTER', counter: 'CENTER', fill: pageType === 'home' || pageType === 'book' ? C.teal : C.navy })
  const col = frame('Hero copy', { dir: 'VERTICAL', gap: 20, width: 628 })
  col.appendChild(txt(copy.eyebrow, { font: fonts.bold, size: 13, color: C.white, opacity: 0.88, letter: 1.3, line: 21 }))
  if (copy.accent) {
    const line = figma.createText()
    line.fontName = fonts.title
    line.fontSize = 48
    line.characters = copy.title + copy.accent
    line.lineHeight = { unit: 'PIXELS', value: 68 }
    line.letterSpacing = { unit: 'PIXELS', value: -1.27 }
    line.textAutoResize = 'HEIGHT'
    line.setRangeFills(0, copy.title.length, [paint(C.white)])
    line.setRangeFills(copy.title.length, line.characters.length, [paint(C.gold)])
    col.appendChild(line)
  } else col.appendChild(heading(copy.title, C.white, 48))
  col.appendChild(para(copy.body, C.white, 20))
  if (pageType === 'home') {
    const row = frame('Recognised for', { dir: 'HORIZONTAL', gap: 16, counter: 'CENTER' })
    row.appendChild(txt('Recognised for', { font: fonts.bold, size: 15, color: C.white, opacity: 0.9, line: 25 }))
    for (const badge of ['AEPP\u00ae', 'MDRT', 'PIAS', 'AEPA']) row.appendChild(txt(badge, { font: fonts.title, size: 18, color: C.white, opacity: 0.45, letter: 0.74, line: 30 }))
    col.appendChild(row)
  }
  const cta = btn(ctaLabel)
  linkTo(cta, 'book')
  col.appendChild(cta)
  section.appendChild(col)
  const portrait = frame('Portrait placeholder', { dir: 'VERTICAL', width: 480, height: 520, fill: C.sage, radius: 24, align: 'CENTER', counter: 'CENTER' })
  portrait.appendChild(txt('Portrait', { font: fonts.medium, size: 16, color: C.white, opacity: 0.8 }))
  section.appendChild(portrait)
  return section
}

function makeTicker(): FrameNode {
  const section = frame('Trust ticker', { dir: 'HORIZONTAL', width: PAGE_WIDTH, pad: [38, PAD], gap: 32, align: 'CENTER', counter: 'CENTER', fill: C.white })
  for (const item of ['Holistic Financial Planning', 'Estate Planning', 'Retirement Planning', 'AEPP\u00ae', 'MDRT', 'PIAS', 'Financial Dignity']) {
    section.appendChild(txt(item, { font: fonts.title, size: 15, color: C.ink, letter: 1.2, line: 25 }))
  }
  return section
}

function makeIntro(pageType: PageType): FrameNode {
  const section = frame('Intro', { dir: 'HORIZONTAL', width: PAGE_WIDTH, pad: [96, PAD], gap: 64, fill: C.page, align: 'CENTER' })
  const images = frame('Intro images', { dir: 'VERTICAL', gap: 16, width: 520 })
  images.appendChild(frame('Image', { width: 520, height: 280, fill: C.ice, radius: 16 }))
  const row = frame('Image row', { dir: 'HORIZONTAL', gap: 16 })
  row.appendChild(frame('Image', { width: 252, height: 180, fill: C.sage, radius: 16 }))
  row.appendChild(frame('Image', { width: 252, height: 180, fill: C.warm, radius: 16 }))
  images.appendChild(row)
  section.appendChild(images)
  const copy = frame('Intro copy', { dir: 'VERTICAL', gap: 20, width: 560 })
  if (pageType === 'book') {
    copy.appendChild(mark('Get in touch'))
    copy.appendChild(heading('Start a conversation'))
    copy.appendChild(para('Share a little about what you would like to discuss. This form is a layout placeholder for a consultation request.'))
    const form = frame('Consultation form', { dir: 'VERTICAL', gap: 12 })
    for (const field of ['Name', 'Email', 'What would you like to discuss?']) {
      const box = frame(field, { dir: 'VERTICAL', width: 560, pad: 16, fill: C.white, radius: 12 })
      box.appendChild(txt(field, { font: fonts.body, size: 15, color: C.muted, line: 22 }))
      form.appendChild(box)
    }
    copy.appendChild(form)
  } else if (pageType === 'estate' || pageType === 'retirement') {
    const estate = pageType === 'estate'
    copy.appendChild(mark(estate ? 'Estate planning' : 'Retirement planning'))
    copy.appendChild(heading(estate ? 'Protect what matters and shape the legacy you leave behind' : 'Plan for the retirement you envision'))
    copy.appendChild(para(estate
      ? 'Plan for the preservation and transfer of your wealth in line with your wishes, family needs, and long-term priorities, giving you greater peace of mind about the future.'
      : 'From CPF retirement planning to building sustainable income streams, prepare for the years ahead with a strategy tailored to your desired lifestyle, financial resources, and future income needs.'))
  } else {
    copy.appendChild(mark('About me'))
    copy.appendChild(heading('A Financial Partner for Life\u2019s Milestones'))
    copy.appendChild(para('Guohao is a Wealth Coach who helps individuals and families navigate life\u2019s milestones with greater financial clarity and confidence. From investment and CPF retirement planning to family wealth management and legacy planning.', C.muted, 20))
  }
  section.appendChild(copy)
  return section
}

function makeServices(): FrameNode {
  const section = frame('Services', { dir: 'VERTICAL', width: PAGE_WIDTH, pad: [128, PAD], gap: 48, fill: C.navy })
  section.appendChild(heading('Advice That Puts You First', C.white, 48))
  const grid = frame('USP grid', { dir: 'VERTICAL', gap: 20 })
  fillX(grid)
  const cards = [
    ['01', 'Holistic, Bespoke Financial Planning', 'See the bigger picture with financial strategies tailored to your circumstances, goals, and life stage.'],
    ['02', 'Clear, Transparent Advice', 'Understand your options through clear explanations that empower you to make informed financial decisions.'],
    ['03', 'A Partner for the Long Term', 'Receive ongoing guidance as your priorities, family needs, and financial circumstances evolve.'],
    ['04', 'Recognised Wealth Management Expertise', 'Benefit from industry-recognised achievements and in-depth knowledge of financial products and investment strategies.'],
  ]
  const rows = [frame('Row', { dir: 'HORIZONTAL', gap: 20 }), frame('Row', { dir: 'HORIZONTAL', gap: 20 })]
  rows.forEach(fillX)
  cards.forEach((card, i) => {
    const item = frame('Article', { dir: 'VERTICAL', width: 590, pad: 32, gap: 12, radius: 20 })
    item.fills = [{ type: 'SOLID', color: rgb(C.white), opacity: 0.12 }]
    const top = frame('Card header', { dir: 'HORIZONTAL', gap: 16, align: 'SPACE_BETWEEN' })
    fillX(top)
    top.appendChild(txt(card[1], { font: fonts.title, size: 20, color: C.white, line: 28 }))
    top.appendChild(txt(card[0], { font: fonts.body, size: 48, color: C.white, opacity: 0.35, line: 48 }))
    item.appendChild(top)
    item.appendChild(para(card[2], C.white, 18))
    rows[i < 2 ? 0 : 1].appendChild(item)
  })
  rows.forEach((row) => grid.appendChild(row))
  section.appendChild(grid)
  return section
}

function makeProgrammes(pageType: PageType): FrameNode {
  const blog = pageType === 'articles'
  const section = frame(blog ? 'Articles' : 'Programmes', { dir: 'VERTICAL', width: PAGE_WIDTH, pad: [128, PAD], gap: 40, fill: C.white })
  section.appendChild(mark(blog ? 'Insights' : 'Services'))
  section.appendChild(heading(blog ? 'Insights & Resources' : 'Explore Your Next Steps'))
  section.appendChild(para(blog
    ? 'Practical guidance from the Insights & Resources library.'
    : 'Discover planning programmes designed to help you understand your financial options, make informed decisions, and prepare for the milestones ahead.'))
  const row = frame('Cards', { dir: 'HORIZONTAL', gap: 24 })
  fillX(row)
  const cards = blog
    ? [
      ['Insights & Resources', 'Wealth Path Blog', 'Read article', 'articles'],
      ['Estate Planning Programme', 'Protect what matters and shape the legacy you leave behind.', 'Explore Estate Planning', 'estate'],
      ['Retirement Planning Programme', 'Plan for the retirement you envision with a strategy tailored to your desired lifestyle.', 'Explore Retirement Planning', 'retirement'],
    ]
    : [
      ['Estate Planning Programme', 'Protect what matters and shape the legacy you leave behind. Plan for the preservation and transfer of your wealth in line with your wishes, family needs, and long-term priorities.', 'Explore Estate Planning', 'estate'],
      ['Retirement Planning Programme', 'Plan for the retirement you envision with a strategy tailored to your desired lifestyle, financial resources, and future income needs. From CPF retirement planning to building sustainable income streams.', 'Explore Retirement Planning', 'retirement'],
    ]
  for (const card of cards) {
    const item = frame('Programme card', { dir: 'VERTICAL', width: blog ? 386 : 590, pad: 32, gap: 16, fill: C.page, radius: 20 })
    item.appendChild(txt(card[0], { font: fonts.title, size: 20, color: C.ink, line: 28 }))
    item.appendChild(para(card[1], C.muted, 18))
    const link = txt(card[2], { font: fonts.bold, size: 14, color: C.navy, line: 20 })
    link.name = card[2]
    linkTo(link, card[3] as PageType)
    item.appendChild(link)
    row.appendChild(item)
  }
  section.appendChild(row)
  return section
}

function makeProcess(): FrameNode {
  const section = frame('Process', { dir: 'VERTICAL', width: PAGE_WIDTH, pad: [96, PAD], gap: 40, fill: C.white })
  section.appendChild(mark('Process'))
  section.appendChild(heading('Our process for financial success'))
  const row = frame('Steps', { dir: 'HORIZONTAL', gap: 20 })
  fillX(row)
  for (const step of [['01', 'Initial Consultation'], ['02', 'Personal Plan'], ['03', 'Growth Strategy'], ['04', 'Ongoing Review']]) {
    const card = frame(step[1], { dir: 'VERTICAL', width: 292, pad: 28, gap: 12, fill: C.page, radius: 16 })
    card.appendChild(txt(step[0], { font: fonts.title, size: 24, color: C.navy, line: 30 }))
    card.appendChild(txt(step[1], { font: fonts.title, size: 18, color: C.ink, line: 26 }))
    row.appendChild(card)
  }
  section.appendChild(row)
  return section
}

function makeStats(): FrameNode {
  const section = frame('Stats', { dir: 'HORIZONTAL', width: PAGE_WIDTH, pad: [72, PAD], gap: 24, align: 'CENTER', fill: C.ice })
  for (const stat of [['500+', 'clients'], ['5.0', 'rating'], ['250', 'verified reviews']]) {
    const card = frame(stat[1], { dir: 'VERTICAL', width: 386, pad: 24, gap: 8, align: 'CENTER', counter: 'CENTER' })
    card.appendChild(txt(stat[0], { font: fonts.title, size: 48, color: C.navy, line: 56 }))
    card.appendChild(txt(stat[1], { font: fonts.body, size: 16, color: C.muted, line: 24 }))
    section.appendChild(card)
  }
  return section
}

function makeTestimonials(): FrameNode {
  const section = frame('Testimonials', { dir: 'VERTICAL', width: PAGE_WIDTH, pad: [124, PAD, 64, PAD], gap: 32, fill: C.navy, counter: 'CENTER' })
  section.appendChild(txt('Testimonials', { font: fonts.bold, size: 13, color: C.white, opacity: 0.8, letter: 1.2, line: 18 }))
  section.appendChild(heading('Trusted By Clients Like You', C.white, 40))
  const quote = frame('Quote', { dir: 'VERTICAL', width: 920, pad: 40, gap: 24, fill: C.white, radius: 24, counter: 'CENTER' })
  quote.appendChild(txt('Your ability to explain complex financial concepts in a clear manner makes me well-informed of my financial decision. I appreciate your responsiveness, attention to details and customized financial strategies you developed.', { font: fonts.body, size: 20, color: C.ink, line: 32, align: 'CENTER' }))
  quote.appendChild(txt('Chua Rui Fen', { font: fonts.bold, size: 15, color: C.navy, line: 22, align: 'CENTER' }))
  quote.appendChild(txt('Management Trainee, MSD Singapore', { font: fonts.body, size: 15, color: C.muted, line: 22, align: 'CENTER' }))
  section.appendChild(quote)
  return section
}

function makeFaq(pageType: PageType): FrameNode {
  const section = frame('FAQ', { dir: 'HORIZONTAL', width: PAGE_WIDTH, pad: [128, PAD], gap: 64, fill: C.white })
  const left = frame('FAQ intro', { dir: 'VERTICAL', gap: 20, width: 420 })
  left.appendChild(heading('FAQs', C.ink, 48))
  left.appendChild(para('500+ clients'))
  left.appendChild(txt('5.0', { font: fonts.title, size: 20, color: C.gold, line: 28 }))
  left.appendChild(para('250 verified reviews'))
  section.appendChild(left)
  const list = frame('Questions', { dir: 'VERTICAL', gap: 0, width: 720 })
  const questions = pageType === 'estate' ? FAQ.estate : pageType === 'retirement' ? FAQ.retirement : FAQ.home
  for (const question of questions) {
    const row = frame('Question', { dir: 'HORIZONTAL', width: 720, pad: [20, 0], gap: 16, align: 'SPACE_BETWEEN', counter: 'CENTER' })
    row.appendChild(txt(question, { font: fonts.medium, size: 18, color: C.ink, line: 26 }))
    row.appendChild(txt('+', { font: fonts.bold, size: 24, color: C.navy, line: 24 }))
    const rule = figma.createRectangle()
    rule.name = 'Divider'
    rule.resize(720, 1)
    rule.fills = [paint(C.warm)]
    list.appendChild(row)
    list.appendChild(rule)
  }
  section.appendChild(list)
  return section
}

function makeCta(ctaLabel: string): FrameNode {
  const section = frame('CTA', { dir: 'HORIZONTAL', width: PAGE_WIDTH, pad: [64, PAD], gap: 48, align: 'SPACE_BETWEEN', counter: 'CENTER', fill: C.teal })
  const copy = frame('CTA copy', { dir: 'VERTICAL', gap: 16, width: 760 })
  copy.appendChild(heading('Start Your Financial Wellness Journey', C.white, 40))
  copy.appendChild(para('Have a question about estate planning, retirement planning, or your overall financial picture? Reach out for a no-obligation conversation today.', C.white, 17))
  section.appendChild(copy)
  const cta = btn(ctaLabel)
  linkTo(cta, 'book')
  section.appendChild(cta)
  return section
}

async function findDestination(pageType: PageType, excludeId?: string): Promise<string | null> {
  const matches = isPreset(pageType) ? META[pageType].match : []
  const nodes = figma.currentPage.children
  const byData = nodes.find((node) => node.type === 'FRAME' && node.id !== excludeId && node.getPluginData('wpPageType') === pageType)
  if (byData) return byData.id
  const byName = nodes.find((node) => node.type === 'FRAME' && node.id !== excludeId && matches.some((hint) => node.name.toLowerCase().includes(hint)))
  return byName ? byName.id : null
}

async function wireNode(node: SceneNode, excludeId: string): Promise<number> {
  let count = 0
  const type = node.getPluginData('wpNavType')
  if (isPreset(type)) {
    const dest = await findDestination(type, excludeId)
    if (dest && 'setReactionsAsync' in node) {
      try {
        const reaction = {
          trigger: { type: 'ON_CLICK' as const },
          actions: [{
            type: 'NODE' as const,
            destinationId: dest,
            navigation: 'NAVIGATE' as unknown as Navigation,
            transition: { type: 'DISSOLVE' as const, duration: 0.3, easing: { type: 'EASE_OUT' as const } },
          }],
        }
        await (node as SceneNode & { setReactionsAsync: (reactions: Reaction[]) => Promise<void> }).setReactionsAsync([reaction as Reaction])
        count += 1
      } catch {
        // skip layers that cannot take prototype reactions
      }
    }
  }
  if ('children' in node) {
    for (const child of node.children) count += await wireNode(child, excludeId)
  }
  return count
}

function add(parent: FrameNode, child: FrameNode): void {
  fillX(child)
  parent.appendChild(child)
}

function buildPage(config: GenerateMessage): FrameNode {
  const allowed: PageType[] = ['home', 'about', 'estate', 'retirement', 'articles', 'book', 'custom']
  const pageType = allowed.includes(config.pageType) ? config.pageType : 'custom'
  const title = (config.pageTitle || (isPreset(pageType) ? META[pageType].title : 'Custom | Wealth Path')).slice(0, 120)
  const ctaLabel = (config.ctaLabel || 'Book a consultation').slice(0, 48)
  const page = frame(title, { dir: 'VERTICAL', width: PAGE_WIDTH, fill: C.page, clip: true })
  page.setPluginData('wpGenerated', '1')
  page.setPluginData('wpPageType', pageType)
  page.setRelaunchData({ [figma.command || 'open']: RELAUNCH })
  const s = config.sections
  if (config.includeNav) add(page, makeNav(pageType))
  if (s.hero) add(page, makeHero(pageType, ctaLabel))
  if (pageType === 'home' && s.hero) add(page, makeTicker())
  if (s.intro) add(page, makeIntro(pageType))
  if (s.services) add(page, makeServices())
  if (s.programmes) add(page, makeProgrammes(pageType))
  if (s.process) add(page, makeProcess())
  if (s.stats) add(page, makeStats())
  if (s.testimonials) add(page, makeTestimonials())
  if (s.faq) add(page, makeFaq(pageType))
  if (s.cta) add(page, makeCta(ctaLabel))
  if (config.includeFooter) add(page, makeFooter())
  return page
}

function placePage(page: FrameNode, index: number, total: number): void {
  const center = figma.viewport.center
  const gap = 80
  page.x = center.x - ((total * PAGE_WIDTH) + (total - 1) * gap) / 2 + index * (PAGE_WIDTH + gap)
  page.y = center.y - 200
}

const SITEMAP: Array<{ pageType: Exclude<PageType, 'custom'>; sections: Sections }> = [
  { pageType: 'home', sections: { hero: true, intro: true, services: true, programmes: true, process: false, stats: false, testimonials: true, faq: true, cta: true } },
  { pageType: 'about', sections: { hero: true, intro: true, services: false, programmes: false, process: true, stats: true, testimonials: true, faq: false, cta: true } },
  { pageType: 'estate', sections: { hero: true, intro: true, services: false, programmes: false, process: true, stats: false, testimonials: false, faq: true, cta: true } },
  { pageType: 'retirement', sections: { hero: true, intro: true, services: false, programmes: false, process: true, stats: false, testimonials: false, faq: true, cta: true } },
  { pageType: 'articles', sections: { hero: true, intro: false, services: false, programmes: true, process: false, stats: false, testimonials: false, faq: false, cta: true } },
  { pageType: 'book', sections: { hero: true, intro: true, services: false, programmes: false, process: false, stats: false, testimonials: false, faq: false, cta: true } },
]

async function generate(config: GenerateMessage): Promise<void> {
  await loadFonts()
  const created: FrameNode[] = []
  if (config.type === 'sitemap') {
    SITEMAP.forEach((item, index) => {
      const page = buildPage({ ...config, type: 'generate', pageType: item.pageType, pageTitle: META[item.pageType].title, sections: item.sections })
      figma.currentPage.appendChild(page)
      placePage(page, index, SITEMAP.length)
      created.push(page)
    })
  } else {
    if (!Object.values(config.sections).some(Boolean) && !config.includeNav && !config.includeFooter) {
      report('Turn on at least one section, navigation, or footer.', 'error')
      return
    }
    const page = buildPage(config)
    figma.currentPage.appendChild(page)
    placePage(page, 0, 1)
    created.push(page)
  }
  let wired = 0
  if (config.wirePrototype) {
    for (const page of created) wired += await wireNode(page, page.id)
  }
  figma.currentPage.selection = created
  figma.viewport.scrollAndZoomIntoView(created)
  const extra = config.wirePrototype ? ' Wired ' + String(wired) + ' prototype link' + (wired === 1 ? '' : 's') + ' to matching frames on this page.' : ''
  report(created.length === 1 ? 'Created "' + created[0].name + '".' + extra : 'Created ' + String(created.length) + ' pages for the Wealth Path sitemap.' + extra, 'success')
}

figma.showUI(__html__, { width: PANEL_WIDTH, height: 640 })
figma.root.setRelaunchData({ [figma.command || 'open']: RELAUNCH })
figma.ui.onmessage = async (message: UiMessage) => {
  if (message.type === 'resize') {
    figma.ui.resize(PANEL_WIDTH, Math.max(120, Math.min(900, Math.round(message.height))))
    return
  }
  if (message.type === 'generate' || message.type === 'sitemap') {
    try { await generate(message) }
    catch (error) { report(error instanceof Error ? error.message : 'Could not generate the page.', 'error') }
  }
}
