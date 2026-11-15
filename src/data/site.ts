/** Business facts confirmed by the owner (see docs/business-info.md). Anything not here is still to be confirmed. */
export const site = {
  name: 'YONAM CCTV SURVEILLANCE',
  short: 'YONAM',
  tagline: 'Your Security, Our Priority',
  contacts: [
    { name: 'Vandan', display: '70419 99963', tel: '+917041999963' },
    { name: 'Jayraj', display: '97274 55515', tel: '+919727455515' },
  ],
  branches: [
    { city: 'Nadiad', line: 'Petiad Highway, Piplag', pin: '387355' },
    { city: 'Kheda', line: 'Tarapur Highway, Traj', pin: '387530' },
  ],
  /** `logo` is a file in public/brands. It is used only when the file exists; otherwise the name shows as text. See public/brands/README.md. */
  brands: [
    { name: 'CP PLUS', logo: 'cp-plus' },
    { name: 'Honeywell', logo: 'honeywell' },
    { name: 'Prama India', logo: 'prama' },
    { name: 'Dahua', logo: 'dahua' },
  ],
} as const;

export const nav = [
  { label: 'Home', href: '#top' },
  { label: 'About Us', href: '#about' },
  {
    label: 'Solutions',
    href: '#solutions',
    children: [
      { label: 'Building CCTV Solutions', note: 'Builders and developers' },
      { label: 'Housing Society CCTV Solutions', note: 'Apartments and communities' },
      { label: 'Residential CCTV Solutions', note: 'Houses, flats and villas' },
      { label: 'Commercial CCTV Solutions', note: 'Shops, offices and warehouses' },
    ],
  },
  {
    label: 'Services',
    href: '#services',
    children: [{ label: 'CCTV Implementation Planning' }, { label: 'CCTV Installation' }, { label: 'CCTV System Setup' }, { label: 'Long-Term Support' }],
  },
  { label: 'Contact Us', href: '#contact' },
] as const;

export const processSteps = [
  { title: 'Understand your requirements', text: 'Property type, location, what you need covered and any existing system.' },
  { title: 'Assess your property', text: 'Entrances, exits, parking, common spaces, layout and infrastructure.' },
  { title: 'Prepare a dedicated plan', text: 'An implementation plan built around your property.' },
  { title: 'Install the CCTV system', text: 'Equipment and infrastructure installed according to the plan.' },
  { title: 'Configure and test', text: 'The system is set up and tested against your requirements.' },
  { title: 'Long-term support', text: 'Support continues after implementation.' },
] as const;

/** Line illustrations for the six steps (viewBox 0 0 160 100). `ac` marks the single accent stroke. */
export const processArt = [
  '<rect class="ln" x="48" y="10" width="64" height="80" rx="6"/><path class="ln" d="M66 10V6h28v4M62 36h8M78 36h22M62 54h8M78 54h22M62 72h8M78 72h16"/><path class="ln ac" d="M62 36l2.5 2.5L69 33M62 54l2.5 2.5L69 51"/>',
  '<rect class="ln" x="22" y="16" width="88" height="62" rx="4"/><path class="ln" d="M66 16v28M22 44h88M48 44v34"/><circle class="ln ac" cx="112" cy="64" r="16"/><path class="ln ac" d="M124 76l16 16"/>',
  '<rect class="ln" x="22" y="12" width="116" height="76" rx="4"/><path class="ln" d="M22 50h116M80 12v38"/><circle class="ln ac" cx="52" cy="28" r="4"/><path class="ln" d="M52 28l-20 18h40z"/><circle class="ln ac" cx="108" cy="70" r="4"/><path class="ln" d="M108 70l24-15v30z"/>',
  '<path class="ln" d="M20 12v78M20 40h30"/><rect class="ln ac" x="50" y="29" width="48" height="22" rx="5"/><circle class="ln" cx="106" cy="40" r="8"/><path class="ln" d="M72 51v14q0 16 40 20"/>',
  '<rect class="ln" x="26" y="12" width="108" height="64" rx="5"/><path class="ln" d="M62 90h36M80 76v14"/><path class="ln ac" d="M60 44l14 14 28-30"/>',
  '<path class="ln" d="M80 8l38 13v28c0 20-15 34-38 43-23-9-38-23-38-43V21z"/><path class="ln ac" d="M62 48l14 14 28-30"/>',
] as const;

/** FAQ answers are drafts until the owner confirms the wording. */
export const faqs = [
  { q: 'How do I determine the CCTV requirements for my property?', a: 'You do not need to work this out alone. Tell us about your property and what you want to protect, and we assess it and recommend an approach. Final wording to be confirmed by YONAM.' },
  { q: 'Does YONAM prepare a dedicated implementation plan?' },
  { q: 'Do you provide installation and system setup?' },
  { q: 'Do you work with builders and housing societies?' },
  { q: 'Can you install CCTV in existing buildings?' },
  { q: 'What factors affect installation costs?' },
  { q: 'Do you provide long-term support?' },
  { q: 'Can an existing CCTV system be upgraded?' },
  { q: 'How can I request a site assessment?' },
] as { q: string; a?: string }[];
