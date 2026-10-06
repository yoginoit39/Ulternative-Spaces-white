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
  // Equal co-owners. Bios are stand-ins until the studio confirms them.
  { name: 'Amil Arokianathan', role: 'Co-owner', base: 'Kampala', bio: 'Co-owner of Ulternative Spaces. Carries every project from the first sketch to the finished building, designing for equatorial light and the way people actually live.' },
  { name: 'Philip Jerkis', role: 'Co-owner', base: 'Kampala', bio: 'Co-owner of Ulternative Spaces. Carries every project from the first sketch to the finished building, from excavation to handover, on time and to the millimetre.' },
];
