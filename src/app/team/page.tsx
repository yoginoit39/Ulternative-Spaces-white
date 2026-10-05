import type { Metadata } from 'next';
import TeamClient from './TeamClient';

export const metadata: Metadata = {
  title: 'Team — Ulternative Spaces',
  description: 'The architects, designers and builders behind Ulternative Spaces, Kampala and Juba.',
};

export default function TeamPage() {
  return <TeamClient />;
}
