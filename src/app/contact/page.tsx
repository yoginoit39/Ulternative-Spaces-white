import type { Metadata } from 'next';
import ContactClient from './ContactClient';

export const metadata: Metadata = {
  title: 'Contact — Ulternative Spaces',
  description: 'Start a project with Ulternative Spaces. Architecture, interiors, and design-build across East Africa.',
};

export default function ContactPage() {
  return <ContactClient />;
}
