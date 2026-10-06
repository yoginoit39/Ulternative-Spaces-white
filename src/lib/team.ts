export interface Member {
  name: string;
  role: string;
  base: 'Kampala' | 'Juba';
  bio: string;
  /** Portrait in public/images; the plate shows initials until one is supplied. */
  photo?: string;
  /** Sample entry — replace with a real person before launch. */
  placeholder?: boolean;
}

export const TEAM: Member[] = [
  // Roles and bios are stand-ins until the studio confirms them.
  { name: 'Amil Arokianathan', role: 'Co-founder', base: 'Kampala', bio: 'Leads the studio from the first sketch to the construction set. Designs for equatorial light and the way people actually live.' },
  { name: 'Philip Jerkis', role: 'Co-founder', base: 'Kampala', bio: 'Turns the drawings into buildings. Runs every site from excavation to handover, on time and to the millimetre.' },
];
