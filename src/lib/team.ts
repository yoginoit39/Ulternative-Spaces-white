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
  { placeholder: true, name: 'Name Surname', role: 'Principal Architect', base: 'Kampala', bio: 'Leads design from the first sketch to the construction set. Trained in Kampala, builds for the equator.' },
  { placeholder: true, name: 'Name Surname', role: 'Construction Director', base: 'Kampala', bio: 'Runs every site. Turns the drawings into walls, on time and to the millimetre.' },
  { placeholder: true, name: 'Name Surname', role: 'Interior Designer', base: 'Kampala', bio: 'Material, light and proportion. Finishes the rooms the architecture makes.' },
  { placeholder: true, name: 'Name Surname', role: 'Project Architect', base: 'Juba', bio: 'Carries projects through approvals and documentation across South Sudan.' },
  { placeholder: true, name: 'Name Surname', role: 'Site Engineer', base: 'Juba', bio: 'Structure, services and sequencing. Keeps the build honest to the drawings.' },
  { placeholder: true, name: 'Name Surname', role: 'Studio Manager', base: 'Kampala', bio: 'First voice on every enquiry. Keeps the studio and its clients in step.' },
];
