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
}

export const PROJECTS: Project[] = [
  {
    slug: 'kampala-residence',
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
];

export function getProject(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}
