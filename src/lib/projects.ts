export interface Project {
  slug: string;
  num: string;
  name: string;
  category: string;
  year: string;
  location: string;
  status: string;
  description: string;
  cover: string;
  gallery: string[];
  /** Storeys drawn on the street elevation (/work). Defaults by category. */
  storeys?: number;
  scope?: string;
  client?: string;
  /** Shown on the home Selected Work strip. */
  featured?: boolean;
  /** Sample entry — replace with a real project before launch. */
  placeholder?: boolean;
}

export const PROJECTS: Project[] = [
  {
    slug: 'kampala-residence',
    featured: true,
    num: '01',
    name: 'Kampala Residence',
    category: 'Residential',
    year: '2024',
    location: 'Kampala, Uganda',
    status: 'Delivered',
    description:
      'A private home designed to balance open-plan living with the tropical climate of East Africa. Generous volumes, controlled light, and hand-selected materials define a residence built for both comfort and longevity. Every space transitions seamlessly — from the shaded terraces to the deeply interior rooms — creating a home that breathes with its occupants.',
    cover: '/images/Image from Facebook (18).jpg',
    gallery: [
      '/images/Image from Facebook (18).jpg',
      '/images/Image from Facebook (2).jpg',
      '/images/Image from Facebook (13).jpg',
      '/images/Image from Facebook (3).jpg',
      '/images/Image from Facebook (29).jpg',
    ],
  },
  {
    slug: 'commercial-complex',
    featured: true,
    num: '02',
    name: 'Commercial Complex',
    category: 'Commercial',
    year: '2024',
    location: 'Kampala, Uganda',
    status: 'Delivered',
    description:
      'A mixed-use commercial development that redefines the street edge in central Kampala. The building integrates retail, office, and public plaza space through a bold structural facade — creating a civic presence while maximising commercial viability. Built to endure, designed to impress.',
    cover: '/images/Image from Facebook (26).jpg',
    gallery: [
      '/images/Image from Facebook (26).jpg',
      '/images/Image from Facebook (27).jpg',
      '/images/Image from Facebook (28).jpg',
      '/images/Image from Facebook (22).jpg',
      '/images/Image from Facebook (23).jpg',
    ],
  },
  {
    slug: 'interior-suite',
    featured: true,
    num: '03',
    name: 'Interior Suite',
    category: 'Interiors',
    year: '2023',
    location: 'Kampala, Uganda',
    status: 'Delivered',
    description:
      "An executive suite interior designed around restraint and material quality. Limestone, brushed brass, and curated textiles work together to create an environment of quiet luxury. Lighting was designed bespoke to shift the room's atmosphere across the day — from sharp morning focus to warm evening calm.",
    cover: '/images/Image from Facebook (29).jpg',
    gallery: [
      '/images/Image from Facebook (29).jpg',
      '/images/Image from Facebook (4).jpg',
      '/images/Image from Facebook (11).jpg',
      '/images/Image from Facebook (3).jpg',
      '/images/Image from Facebook (1).jpg',
    ],
  },
  {
    slug: 'villa-design',
    featured: true,
    num: '04',
    name: 'Villa Design',
    category: 'Residential',
    year: '2023',
    location: 'Juba, South Sudan',
    status: 'Delivered',
    description:
      "A villa conceived for elevated living in Juba's emerging residential landscape. The design draws from regional vernacular forms while asserting a distinctly contemporary identity — wide overhangs, courtyard gardens, and layered privacy create a home that belongs entirely to its place.",
    cover: '/images/Image from Facebook (13).jpg',
    gallery: [
      '/images/Image from Facebook (13).jpg',
      '/images/Image from Facebook (3).jpg',
      '/images/Image from Facebook (4).jpg',
      '/images/Image from Facebook (11).jpg',
      '/images/Image from Facebook (2).jpg',
    ],
  },
  {
    slug: 'juba-complex',
    featured: true,
    num: '05',
    name: 'Juba Complex',
    category: 'Mixed-Use',
    year: '2022',
    location: 'Juba, South Sudan',
    status: 'Delivered',
    description:
      'A major development in Juba that combines commercial, residential, and civic programming across multiple floors. The project addresses the urgent need for quality urban density in a rapidly growing city — providing not just buildings, but a new piece of city fabric for the next generation.',
    cover: '/images/Image from Facebook (24).jpg',
    gallery: [
      '/images/Image from Facebook (24).jpg',
      '/images/Image from Facebook (25).jpg',
      '/images/Image from Facebook (19).jpg',
      '/images/Image from Facebook (20).jpg',
      '/images/Image from Facebook (17).jpg',
    ],
  },
  {
    slug: 'urban-pavilion',
    featured: true,
    num: '06',
    name: 'Urban Pavilion',
    category: 'Architecture',
    year: '2022',
    location: 'Kampala, Uganda',
    status: 'Delivered',
    description:
      'A public pavilion commissioned for a cultural institution in Kampala. The structure mediates between interior exhibition space and the open landscape — a light steel canopy extending into the grounds, creating a fluid transition between inside and out. Materials were chosen for minimal maintenance and long-term performance under the equatorial sun.',
    cover: '/images/Image from Facebook (10).jpg',
    gallery: [
      '/images/Image from Facebook (10).jpg',
      '/images/Image from Facebook (9).jpg',
      '/images/Image from Facebook (21).jpg',
      '/images/Image from Facebook (15).jpg',
      '/images/Image from Facebook (16).jpg',
    ],
  },
  /* ───────────── Archive (sample rows — replace with real projects) ───────────── */
  {
    slug: 'hillside-residence',
    placeholder: true,
    num: '07',
    name: 'Hillside Residence',
    category: 'Residential',
    year: '2025',
    location: 'Kampala, Uganda',
    status: 'On site',
    storeys: 2,
    description:
      'A two-storey family home stepping down a Kampala hillside. Split levels follow the slope so every room opens onto its own terrace, while a deep concrete roof keeps the afternoon sun off the glazing.',
    cover: '/images/Image from Facebook (30).jpg',
    gallery: ['/images/Image from Facebook (30).jpg', '/images/Image from Facebook (18).jpg', '/images/Image from Facebook (2).jpg', '/images/Image from Facebook (13).jpg'],
  },
  {
    slug: 'office-fit-out',
    placeholder: true,
    num: '08',
    name: 'Office Fit-out',
    category: 'Interiors',
    year: '2025',
    location: 'Kampala, Uganda',
    status: 'Delivered',
    storeys: 1,
    description:
      'A single floor of a commercial tower reworked as an open studio for a growing team. Timber screens divide without closing, and the services are left exposed and painted as a single dark ceiling.',
    cover: '/images/Image from Facebook (31).jpg',
    gallery: ['/images/Image from Facebook (31).jpg', '/images/Image from Facebook (29).jpg', '/images/Image from Facebook (3).jpg'],
  },
  {
    slug: 'courtyard-house',
    placeholder: true,
    num: '09',
    name: 'Courtyard House',
    category: 'Residential',
    year: '2024',
    location: 'Juba, South Sudan',
    status: 'Delivered',
    storeys: 2,
    description:
      'Rooms wrap a shaded central court so the house breathes from the inside. Thick masonry walls, small openings to the street and generous ones to the court keep the interior cool through the dry season.',
    cover: '/images/Image from Facebook (32).jpg',
    gallery: ['/images/Image from Facebook (32).jpg', '/images/Image from Facebook (13).jpg', '/images/Image from Facebook (24).jpg'],
  },
  {
    slug: 'retail-arcade',
    placeholder: true,
    num: '10',
    name: 'Retail Arcade',
    category: 'Commercial',
    year: '2024',
    location: 'Kampala, Uganda',
    status: 'Concept',
    storeys: 3,
    description:
      'A covered shopping street on a tight urban plot. Three levels of small units face a top-lit arcade, with the roof structure doing double duty as signage and sun-shading.',
    cover: '/images/Image from Facebook (12).jpg',
    gallery: ['/images/Image from Facebook (12).jpg', '/images/Image from Facebook (26).jpg', '/images/Image from Facebook (10).jpg'],
  },
  {
    slug: 'twin-apartments',
    placeholder: true,
    num: '11',
    name: 'Twin Apartments',
    category: 'Residential',
    year: '2023',
    location: 'Kampala, Uganda',
    status: 'Delivered',
    storeys: 3,
    description:
      'Two mirrored apartment blocks sharing a garden and a single stair core. Balconies alternate floor by floor so no unit looks straight into another.',
    cover: '/images/Image from Facebook (14).jpg',
    gallery: ['/images/Image from Facebook (14).jpg', '/images/Image from Facebook (18).jpg', '/images/Image from Facebook (29).jpg'],
  },
  {
    slug: 'boutique-hotel-suite',
    placeholder: true,
    num: '12',
    name: 'Boutique Hotel Suite',
    category: 'Interiors',
    year: '2023',
    location: 'Juba, South Sudan',
    status: 'Delivered',
    storeys: 1,
    description:
      'A suite designed as a sequence of thresholds: entry, lounge, sleeping, bathing. Local stone, blackened steel and linen throughout, lit almost entirely from concealed sources.',
    cover: '/images/Image from Facebook (5).jpg',
    gallery: ['/images/Image from Facebook (5).jpg', '/images/Image from Facebook (3).jpg', '/images/Image from Facebook (29).jpg'],
  },
  {
    slug: 'warehouse-conversion',
    placeholder: true,
    num: '13',
    name: 'Warehouse Conversion',
    category: 'Mixed-Use',
    year: '2022',
    location: 'Kampala, Uganda',
    status: 'Delivered',
    storeys: 4,
    description:
      'An industrial shed re-cut into workshops below and lofts above. The original trusses are kept and a new steel mezzanine threads between them without touching the old walls.',
    cover: '/images/Image from Facebook (6).jpg',
    gallery: ['/images/Image from Facebook (6).jpg', '/images/Image from Facebook (24).jpg', '/images/Image from Facebook (10).jpg'],
  },
  {
    slug: 'garden-pavilion',
    placeholder: true,
    num: '14',
    name: 'Garden Pavilion',
    category: 'Architecture',
    year: '2021',
    location: 'Kampala, Uganda',
    status: 'Delivered',
    storeys: 1,
    description:
      'A single room in a garden: one roof, four slender columns, sliding screens on every side. Built in eight weeks from timber milled on site.',
    cover: '/images/Image from Facebook (7).jpg',
    gallery: ['/images/Image from Facebook (7).jpg', '/images/Image from Facebook (10).jpg', '/images/Image from Facebook (9).jpg'],
  },
  {
    slug: 'clinic-extension',
    placeholder: true,
    num: '15',
    name: 'Clinic Extension',
    category: 'Commercial',
    year: '2021',
    location: 'Juba, South Sudan',
    status: 'Delivered',
    storeys: 2,
    description:
      'A two-storey wing added to a working clinic without closing it. Wide shaded verandas double as waiting areas and keep the wards cross-ventilated.',
    cover: '/images/Image from Facebook (8).jpg',
    gallery: ['/images/Image from Facebook (8).jpg', '/images/Image from Facebook (26).jpg', '/images/Image from Facebook (24).jpg'],
  },
  {
    slug: 'family-compound',
    placeholder: true,
    num: '16',
    name: 'Family Compound',
    category: 'Residential',
    year: '2020',
    location: 'Kampala, Uganda',
    status: 'Delivered',
    storeys: 2,
    description:
      'Three houses for three generations arranged around a shared kitchen garden. Each has its own front door; all share one long veranda.',
    cover: '/images/Facebook Image.jpg',
    gallery: ['/images/Facebook Image.jpg', '/images/Image from Facebook (13).jpg', '/images/Image from Facebook (2).jpg'],
  },
  {
    slug: 'rooftop-terrace',
    placeholder: true,
    num: '17',
    name: 'Rooftop Terrace',
    category: 'Interiors',
    year: '2019',
    location: 'Kampala, Uganda',
    status: 'Delivered',
    storeys: 1,
    description:
      'A neglected roof turned into an outdoor room for a city apartment. Timber decking, a steel pergola and planting chosen to survive the dry months without irrigation.',
    cover: '/images/Image from Facebook.jpg',
    gallery: ['/images/Image from Facebook.jpg', '/images/Image from Facebook (29).jpg', '/images/Image from Facebook (3).jpg'],
  },
  {
    slug: 'street-front-studio',
    placeholder: true,
    num: '18',
    name: 'Street-front Studio',
    category: 'Commercial',
    year: '2018',
    location: 'Kampala, Uganda',
    status: 'Delivered',
    storeys: 2,
    description:
      'The studio\'s own first building: a workshop on the street with drawing rooms above. A full-height shutter opens the ground floor completely on working days.',
    cover: '/images/502625930_9733057526802662_6455519527453694868_n.jpg',
    gallery: ['/images/502625930_9733057526802662_6455519527453694868_n.jpg', '/images/Image from Facebook (10).jpg', '/images/Image from Facebook (21).jpg'],
  },
];

export function getProject(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}

export const FEATURED = PROJECTS.filter((p) => p.featured);

export const STOREYS_BY_CATEGORY: Record<string, number> = {
  Residential: 2, Interiors: 1, Commercial: 3, 'Mixed-Use': 4, Architecture: 3,
};
export function storeysOf(p: Project): number {
  return p.storeys ?? STOREYS_BY_CATEGORY[p.category] ?? 2;
}
export const YEARS = Array.from(new Set(PROJECTS.map((p) => p.year))).sort((a, b) => Number(b) - Number(a));
export const CATEGORIES = Array.from(new Set(PROJECTS.map((p) => p.category)));
